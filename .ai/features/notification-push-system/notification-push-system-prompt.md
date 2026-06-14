# Prompt: Sistema de Notificaciones Push (Motor)

Implementa el motor de notificaciones para la aplicación siguiendo la especificación en:

`.ai/features/notification-push-system/notification-push-system-spec.md`

## Requisitos:

1. Implementa la configuración de `expo-notifications` y `expo-device`.
2. Crea un hook `useNotifications` que gestione permisos y detecte el `Expo Push Token`.
3. Configura los listeners globales para notificaciones en foreground y background.
4. Implementa el manejo de Deep Linking (navegación al tocar la notificación).

## Instrucciones:

- Se autónomo. Instala `expo-notifications` y `expo-device`.
- No asumas ninguna base de datos por defecto. Si obtienes un token, simplemente devuélvelo a través del hook o regístralo en un log.
- Asegura que el handler de notificaciones esté configurado correctamente para mostrar alertas.

## Notas:
- Este sistema es agnóstico del backend. Su objetivo es que el móvil sea capaz de recibir mensajes y reaccionar a ellos.
