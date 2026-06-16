# Especificación: Sistema de pagos (RevenueCat) — suscripciones y paywall

> Documentación generada a partir de **cómo está realmente implementado** en la
> app avanzada de referencia. Guía reutilizable y genérica. **No implementada en
> la plantilla.** (El archivo `payment-system.md` de esta carpeta es el _prompt_
> de alto nivel; este documento es la implementación real, tu fuente de verdad.)

## 1. Arquitectura

Suscripciones in-app ("Pro") con **RevenueCat**. Cuatro capas:

1. **SDK RevenueCat** (`react-native-purchases`): se configura una vez al
   arrancar; ofrece offerings, compra/restore y un listener de customerInfo.
2. **Provider de contexto** (`SubscriptionProvider`): envuelve la app, deriva un
   único `isPro` del **entitlement** activo y expone `purchase` / `restore` /
   `refreshCustomerInfo` + `offerings` y `customerInfo`.
3. **Capa de gating**: hook `useRequirePro()` + checks de `isPro` que, si el
   usuario no es Pro, muestran un paywall. Conviven dos paywalls: el **nativo de
   RevenueCat** (`react-native-purchases-ui` → `RevenueCatUI.presentPaywall`) y
   uno **custom** (componente NativeWind) como ruta modal de Expo Router.
4. **(Opcional) Trial promocional server-side**: una Edge Function (`manage-trial`)
   concede/revoca un **entitlement promocional** vía la REST API de RevenueCat.

La identidad se enlaza con `Purchases.logIn(userId)` (mismo Pro entre dispositivos).
**Un solo entitlement** (string `'Pro'`) es la fuente de verdad del acceso premium.
Web es no-op (`isPro = false`); en `__DEV__` el gating se omite (devs tratados como Pro).

## 2. Dependencias y build

| Paquete | Versión | Para |
| --- | --- | --- |
| `react-native-purchases` | `^9.10.4` | SDK core (configure, offerings, purchase, restore, listener) |
| `react-native-purchases-ui` | `^9.10.4` | Paywall nativo (`RevenueCatUI.presentPaywall`) |

- **Requiere dev client / build nativo — Expo Go NO sirve** (módulos nativos).
  Añade `expo-dev-client` y usa el perfil EAS `development` (`developmentClient: true`).
- **No hace falta config plugin** para RC 9.x con Expo 54 (autolinking). Lo único
  manual en Android es el permiso de billing en `app.json`:
  ```json
  "android": { "permissions": ["com.android.vending.BILLING"] }
  ```
- Plataformas: Android cableado; **iOS scaffolded pero comentado** (descomenta la
  rama `Purchases.configure` de iOS + pon la Apple key); Web degrada (`isPro=false`).

## 3. Variables de entorno (keys del dashboard de RevenueCat)

| Variable | Ámbito | Uso |
| --- | --- | --- |
| `EXPO_PUBLIC_RC_GOOGLE_KEY` | Cliente | Configure de Android |
| `EXPO_PUBLIC_RC_APPLE_KEY` | Cliente | Configure de iOS |
| `EXPO_PRIVATE_RC_SECRET_KEY` | **Solo servidor** | REST v1 key para el trial promocional (edge function). Nunca en el bundle. |

## 4. El provider (`src/context/SubscriptionContext.tsx`)

```ts
const ENTITLEMENT_ID = 'Pro'; // única puerta de acceso

interface SubscriptionContextType {
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering | null;
  isLoading: boolean;
  purchase: (pkg: any) => Promise<void>;
  restore: () => Promise<void>;
  refreshCustomerInfo: () => Promise<CustomerInfo | null>;
}

const handleCustomerInfo = useCallback((info: CustomerInfo) => {
  setIsPro(typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined');
  setCustomerInfo(info);
}, []);
```

Flujo de init (una vez, protegido por un flag `isConfigured` **y** un ref
`isConfiguring` para evitar doble-configure bajo StrictMode/React 19):

1. Si `Platform.OS === 'web'` → `isLoading=false`, marcar configurado, return.
2. `await Purchases.configure({ apiKey: GOOGLE_KEY, appUserID: session?.user?.id })`.
3. `Purchases.addCustomerInfoUpdateListener(handleCustomerInfo)` → mantiene `isPro`
   vivo tras compras/renovaciones/expiraciones sin reiniciar.
4. `getCustomerInfo()` → handler; `getOfferings()` → `offerings.current`.
5. Efecto aparte (en `session.user.id`): si hay usuario, `Purchases.logIn(userId)`.

`purchase(pkg)`: web → warn+return; si no `Purchases.purchasePackage(pkg)`, traga
cancelación (`e.userCancelled`), relanza errores reales. `restore()`:
`Purchases.restorePurchases()`.

## 5. Wiring del provider

En `app/_layout.tsx`, `SubscriptionProvider` va **dentro de `AuthProvider`** (para
leer `session.user.id`) y alrededor de la navegación:

```
SafeAreaProvider > GestureHandlerRootView > LanguageProvider > AuthProvider >
  SubscriptionProvider > RootLayoutNav (Stack)
```

Regla: **Auth por encima de Subscription**. La ruta del paywall custom se registra
como modal: `<Stack.Screen name="(modals)/paywall" options={{ presentation: 'modal' }} />`
y se abre con `router.push('/(modals)/paywall')`.

## 6. Patrón de gating

```ts
// Hook imperativo (paywall nativo):
export function useRequirePro() {
  const { isPro, isLoading } = useSubscription();
  return () => {
    if (isLoading) return false;
    if (!isPro && !__DEV__) {
      RevenueCatUI.presentPaywall({ displayCloseButton: true });
      return false;
    }
    return true;
  };
}
// Uso: if (!requirePro()) return; doPremiumThing();
```

`isPro` se actualiza solo (listener) tras compra/restore → la UI gated se
re-renderiza sin refresh manual. En Settings: mostrar estado, botón "Upgrade"
(present paywall), "Restore" (`restore()`) y "Manage" (`customerInfo.managementURL`).

## 7. Trial promocional server-side (opcional)

`supabase/functions/manage-trial/index.ts` (Deno) concede un **entitlement
promocional** vía REST de RevenueCat — permite trial sin transacción de tienda.
Flujo `action: 'start'`: verifica usuario (header Authorization) → cliente admin
service-role para escribir → comprueba `trial_claimed` (idempotente, un trial por
usuario) → `POST https://api.revenuecat.com/v1/subscribers/{userId}/entitlements/Pro/promotional`
con `Authorization: Bearer {RC_SECRET}` y `{ start_time_ms, end_time_ms }` →
marca `trial_claimed=true`. La key secreta vive solo en la function; el entitlement
promocional aparece en `customerInfo` igual que una compra real (mismo `isPro`).
(Ver `.ai/features/supabase-edge-functions`.)

## 8. Pasos de integración

1. `npx expo install react-native-purchases react-native-purchases-ui expo-dev-client`.
2. `app.json`: permiso `com.android.vending.BILLING`. Añade perfil EAS `development`.
3. `.env`: `EXPO_PUBLIC_RC_GOOGLE_KEY` / `EXPO_PUBLIC_RC_APPLE_KEY` (la REST secret
   solo en el servidor).
4. Dashboard RevenueCat: app, productos, un **Offering** con packages y un
   **Entitlement** cuyo identificador coincida con tu constante (`'Pro'`).
5. Crea `SubscriptionContext.tsx` (§4) y colócalo **bajo el AuthProvider** (§5).
6. Paywall: nativo (`RevenueCatUI.presentPaywall`, configúralo en el dashboard) o
   custom (mapea `offerings.availablePackages`, `purchase(pkg)`/`restore()`) como
   ruta modal.
7. `useRequirePro()` (§6) en cada entrada premium. Controles en Settings.
8. (Opcional) Edge function `manage-trial` + hook `useTrialManager` (§7).
9. Build en dev client real: prebuild + run, compra sandbox, confirma que `isPro`
   cambia en vivo, prueba restore y trial.

## 9. Gotchas / compatibilidad

- **Dev client obligatorio** (Expo Go no carga módulos nativos).
- Stack testeado: RC SDK + UI `9.10.4`, Expo `54`, RN `0.81.5`, React `19.1.0`,
  **New Architecture ON**.
- **Doble guard de configure** (`isConfigured` state + `isConfiguring` ref): React
  19/StrictMode y cambios de sesión re-ejecutan el efecto; configurar dos veces lanza.
- **Web sin compras**: protege toda llamada RC con `Platform.OS === 'web'`.
- **iOS opt-in**: la rama de configure de iOS está comentada en la referencia.
- **`__DEV__` bypassa el paywall**: para QA del paywall usa build release/preview.
- **El identificador del entitlement debe coincidir EXACTO** en cliente, servidor y
  dashboard (string `'Pro'`).
- La REST secret key (`EXPO_PRIVATE_RC_SECRET_KEY`) solo en la edge function.
