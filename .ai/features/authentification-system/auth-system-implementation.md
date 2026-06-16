# Implementación real: Autenticación Supabase (cliente split + AuthContext + guard)

> Documentación generada a partir de **cómo está realmente implementado** en la
> app avanzada de referencia. Esta es la **fuente de verdad de la arquitectura
> técnica**. El archivo `auth-system-spec.md` describe el alcance de UX/pantallas
> deseado, pero algunos patrones suyos (cliente único `@/utils/supabase`,
> `auth.service.ts`) NO coinciden con la implementación real; sigue ESTE documento
> para la arquitectura. **No implementada en la plantilla.**

## 1. Arquitectura

1. **Cliente Supabase split por plataforma** (`src/lib/supabase.native.ts` /
   `supabase.web.ts`), sin barrel `supabase.ts`. Metro resuelve el sufijo
   `.native`/`.web`; `tsc` lo resuelve con `moduleSuffixes`.
2. **AuthProvider** (`src/context/AuthContext.tsx`): expone `session`, `user`
   (perfil derivado), `isLoading`, `refreshProfile()`. Carga sesión inicial con
   `getSession()` y se suscribe a `onAuthStateChange`.
3. **Guard de rutas** (`app/_layout.tsx`): según `session`/`isLoading` redirige con
   `useSegments()` + `router.replace()`.
4. **Pantallas auth + servicios de perfil**: llaman `supabase.auth.*` y leen/escriben
   una tabla `profiles` + un bucket de storage.

Flujo: **acción UI → `supabase.auth.*` → dispara `onAuthStateChange` → AuthContext
actualiza `session`/`user` → el guard reevalúa y redirige.** Las pantallas no
navegan a mano tras auth; dejan que el guard reaccione.

## 2. Dependencias

| Paquete | Versión | Para |
| --- | --- | --- |
| `@supabase/supabase-js` | `^2.89.0` | auth, queries, storage |
| `@react-native-async-storage/async-storage` | `^2.2.0` | storage de sesión en native |
| `react-native-url-polyfill` | `^3.0.0` | polyfill `URL` que supabase-js necesita (native) |
| `expo-constants` | `~18.0.13` | leer `extra` como fallback de env |

## 3. Configuración / env

Resolución de URL y anon key con fallback de 3 niveles:

```ts
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.SUPABASE_ANON_KEY ?? '';
```

El prefijo `EXPO_PUBLIC_` es obligatorio para inyectar el valor en el bundle. La
anon key es segura de exponer (RLS protege los datos). `.env.example`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Cliente split

```ts
// src/lib/supabase.native.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // OBLIGATORIO, antes de createClient
import { AppState } from 'react-native';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});
AppState.addEventListener('change', (s) =>
  s === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh()
);
```

```ts
// src/lib/supabase.web.ts — localStorage + singleton para HMR
const g = global as unknown as { supabase: any };
export const supabase =
  g.supabase ||
  createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // true solo para OAuth/magic-link en web
    },
  });
if (process.env.NODE_ENV !== 'production') g.supabase = supabase;
```

En `tsconfig.json`: `"moduleSuffixes": [".native", ".web", ""]`.

## 5. AuthContext

```ts
type AuthContextType = {
  session: Session | null;
  user: User | null; // perfil de app hidratado desde la DB
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
};
```

```tsx
useEffect(() => {
  // 1) sesión persistida al arrancar
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    refreshProfile(session).then(() => setIsLoading(false));
  });
  // 2) transiciones posteriores
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    setSession(session); // propaga la sesión rápido
    if (event === 'SIGNED_OUT') {
      setUser(null);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      // NO await dentro del callback (deadlock del lock interno de supabase-js):
      refreshProfile(session).finally(() => setIsLoading(false));
    }
  });
  return () => subscription.unsubscribe();
}, []);
```

**Gotcha load-bearing:** nunca hagas `await` de trabajo pesado dentro del callback
de `onAuthStateChange` (puede hacer deadlock con el lock interno); ejecútalo
desacoplado (`.finally`) y cubre la UI con `isLoading`.

## 6. Guard de rutas (`app/_layout.tsx`)

```tsx
function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  useEffect(() => {
    if (isLoading) return; // CRÍTICO: no redirigir antes de resolver la sesión
    const root = segments[0] as string;
    const inAuthGroup = root === '(auth)' || root === 'login' || root === 'signup' || root === 'welcome';
    if (!session && !inAuthGroup) router.replace('/welcome');
    else if (session) {
      const hasOnboarded = session.user.user_metadata?.onboarded === true;
      const inOnboarding = root === 'onboarding';
      if (inAuthGroup) router.replace(hasOnboarded ? '/(tabs)' : '/onboarding');
      else if (!hasOnboarded && !inOnboarding) router.replace('/onboarding');
    }
  }, [session, segments, isLoading]);
  if (isLoading) return <ActivityIndicator size="large" />;
  return <Stack screenOptions={{ headerShown: false }}>{/* ...screens */}</Stack>;
}
```

- "Deny by default": todo lo que no esté en el grupo auth es protegido; añade
  excepciones públicas (deep links/invite) extendiendo las condiciones.
- El flag de onboarding vive en `user_metadata` (set con
  `supabase.auth.updateUser({ data: { onboarded: true } })`), que dispara
  `USER_UPDATED` → el guard re-evalúa solo (sin navegar a mano).

## 7. Perfil / metadata

- **Tabla `profiles`** (PK = `auth.users.id`) con servicio `userService.ts`
  (`getProfile`, `updateProfile` con `upsert`, `uploadAvatar` a un bucket).
- **"Crear perfil si falta"** dentro de `refreshProfile`: `maybeSingle()` y si no
  existe, insert con default desde `user_metadata` (con `Promise.race` + timeout
  para que un insert colgado no bloquee `isLoading`). Alternativa robusta: trigger
  Postgres `on auth.users insert → insert into profiles`.
- Flags que el guard necesita → en `user_metadata` (no en la tabla), para leerlos
  síncronamente desde la sesión.

## 8. Pasos de integración

1. `npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill expo-constants`.
2. `.env` con `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
3. `tsconfig.json`: `moduleSuffixes`.
4. Crea `supabase.native.ts` / `supabase.web.ts` (§4). Importa `@/src/lib/supabase`.
5. `AuthContext.tsx` (§5) con `getSession()` + `onAuthStateChange` + cleanup.
6. Envuelve la app: `SafeAreaProvider > GestureHandlerRootView > AuthProvider > RootLayoutNav`.
7. Guard (§6). Pantallas auth (welcome/login/signup) con `signInWithPassword` /
   `signUp` / `signOut`. Deja navegar al guard.
8. (Opcional) tabla `profiles` + `userService` + "crear si falta" (§7). Ver
   `.ai/features/supabase-database` para el SQL/RLS.
9. Verifica iOS/Android (AsyncStorage) **y** web (localStorage) persisten sesión.

## 9. Gotchas / compatibilidad

- `react-native-url-polyfill/auto` obligatorio en native (no en web).
- Sin barrel `supabase.ts` (sombrearía las variantes). `moduleSuffixes` o `tsc` marca
  el import como no resuelto (Metro sí bundlea).
- Web: singleton en `global` evita "Multiple GoTrueClient instances" con HMR.
- Nunca `await` dentro de `onAuthStateChange`.
- `detectSessionInUrl: false` aquí (solo email/password). Para OAuth/magic-link web → `true`.
- `signUp` devuelve `session: null` si hay confirmación de email activada: maneja esa rama.
- Baseline testeado: Expo 54, RN 0.81.5, React 19.1.0, supabase-js ^2.89, New Arch ON.
