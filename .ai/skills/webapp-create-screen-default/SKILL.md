---
name: webapp-create-screen-default
description: Crear una pantalla simple (no CRUD) dentro de app/ — contenido estático o con un solo fetch, sin lista+detalle. Úsalo para pantallas de tipo "información", "ajustes", "bienvenida".
---

# SKILL: Crear una Pantalla Simple

## Cuándo usar esta skill

Para una pantalla que muestra contenido (estático o de una sola fuente de
datos) sin ser una lista CRUD — usa `webapp-create-screen-products` en su
lugar si la pantalla necesita listar/crear/editar/eliminar varios items.

## Estructura

```
app/
  <nombre>.tsx              # pantalla suelta, o
  (grupo)/<nombre>.tsx      # dentro de un grupo de rutas existente
```

## Template de código

```tsx
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NombrePantalla() {
  const { t } = useTranslation('common');
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-primary">{t('namespace:clave.titulo')}</Text>
        <Text className="mt-2 text-center text-lg text-foreground">
          {t('namespace:clave.subtitulo')}
        </Text>
      </View>
    </View>
  );
}
```

Si la pantalla necesita datos remotos, añade el fetch así (con guarda de
`cancelled` para no actualizar estado tras desmontar):

```tsx
const [data, setData] = useState<TipoDeDato | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let cancelled = false;
  fetchAlgo()
    .then((result) => {
      if (!cancelled) setData(result);
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });
  return () => {
    cancelled = true;
  };
}, []);
```

## Reglas

- `export default` (obligatorio en `app/`, lo exige Expo Router).
- Estilos solo con NativeWind (`className`), nunca `StyleSheet.create()`.
- Colores semánticos (`bg-background`, `text-foreground`, `text-primary`...)
  en vez de valores hardcodeados — se adaptan solos si el proyecto añade
  modo oscuro más adelante.
- Todo texto visible vía `t('...')`; añade las claves nuevas a los 4
  locales en `src/locales/`.
- Si la pantalla es la raíz de un stack sin header, gestiona tú
  `insets.top` (`useSafeAreaInsets`); si vive dentro de un `Stack`/`Tabs`
  con header visible, no lo necesitas.

## Checklist

- [ ] `export default`, sin `export const`/`export function` suelta
- [ ] Ningún texto hardcodeado — todo pasa por `t('...')`
- [ ] `npm run validate:ui` no marca nada nuevo
- [ ] `npm run lint` y `npm run check` sin errores
