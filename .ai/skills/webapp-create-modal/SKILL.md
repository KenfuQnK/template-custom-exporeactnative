---
name: webapp-create-modal
description: Crear una pantalla modal (overlay con fondo oscurecido) usando Expo Router. Úsalo cuando el usuario pida un modal, popup, diálogo o overlay de confirmación.
---

# SKILL: Crear un Modal con Expo Router

## Cuándo usar esta skill

Cuando se pida una pantalla que se superpone a la actual con un fondo
oscurecido, sin reemplazar la navegación de abajo: confirmaciones,
formularios cortos, detalles rápidos, selectores.

## Cómo funciona en este proyecto

Un modal aquí es una ruta normal de Expo Router presentada con
`presentation: 'transparentModal'` desde el `<Stack>` raíz, no un componente
`<Modal>` de React Native. Ya existe un ejemplo de referencia en
`app/modal.tsx`.

## Pasos

1. Registra la ruta en `app/_layout.tsx`, dentro del `<Stack>`:

   ```tsx
   <Stack.Screen
     name="nombre-del-modal"
     options={{
       presentation: 'transparentModal',
       headerShown: false,
       animation: 'fade',
     }}
   />
   ```

2. Crea `app/nombre-del-modal.tsx` (fondo oscurecido que cierra al tocar
   fuera + tarjeta centrada):

   ```tsx
   import { useRouter } from 'expo-router';
   import { useTranslation } from 'react-i18next';
   import { Pressable, Text, View } from 'react-native';

   import { Button } from '@/src/components/Button';

   export default function NombreDelModal() {
     const { t } = useTranslation('common');
     const router = useRouter();

     return (
       <View className="flex-1 bg-transparent">
         <Pressable className="absolute inset-0 bg-black/40" onPress={() => router.back()} />

         <View className="flex-1 items-center justify-center p-6">
           <View className="w-full max-w-sm items-center overflow-hidden rounded-[40px] border border-border bg-background p-8 shadow-2xl">
             <Text className="mb-2 text-center text-3xl font-extrabold tracking-tight text-foreground">
               {t('namespace:clave.titulo')}
             </Text>
             <Button title={t('buttons.close')} onPress={() => router.back()} className="w-full" />
           </View>
         </View>
       </View>
     );
   }
   ```

3. Navega con `<Link href="/nombre-del-modal" asChild>` o
   `router.push('/nombre-del-modal')`. Para cerrarlo, `router.back()`.
4. Añade las claves de texto usadas (`t('...')`) a los 4 idiomas en
   `src/locales/<idioma>/common.json` (o el namespace que toque).

## Variantes

- **Sheet nativo (no transparente):** usa `presentation: 'modal'` en vez de
  `'transparentModal'` — Expo Router monta el sheet nativo del sistema (con
  su propio fondo opaco) en vez del overlay manual con `Pressable`.
- **Modal de formulario:** sustituye el contenido de la tarjeta por un
  formulario; mantén `router.back()` tanto en cancelar como en guardar
  (tras completar la acción).

## Checklist

- [ ] Ruta registrada en `_layout.tsx` con el `presentation` correcto
- [ ] Cierra al tocar fuera (Pressable de fondo) Y con un botón explícito
- [ ] Todos los textos vía `t('...')`, claves añadidas a los 4 idiomas
- [ ] `accessibilityRole`/`accessibilityLabel` en los elementos interactivos
- [ ] `npm run lint` y `npm run check` sin errores
