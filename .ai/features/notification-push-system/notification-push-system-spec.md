# Especificación: Sistema de Notificaciones Push (Motor)

**Versión:** 1.0 (Agnóstico de Backend)

---

## 📋 Resumen Ejecutivo

Este sistema constituye la infraestructura base para que la aplicación React Native (Expo) sea capaz de solicitar permisos, obtener tokens de envío y reaccionar a la llegada de notificaciones, tanto si la app está abierta como cerrada.

---

## 🎯 Objetivos

- ✅ Configurar el handler global de notificaciones.
- ✅ Gestionar permisos nativos (iOS/Android).
- ✅ Obtener el `Expo Push Token` del dispositivo.
- ✅ Implementar Listeners para Foreground (cuando el usuario usa la app).
- ✅ Implementar Listeners para Interacción (cuando el usuario toca la notificación).
- ✅ Soporte para Deep Linking basado en el payload `data`.

---

## 🗺️ Flujo de Implementación

1. **Configuración Nativa**: Actualizar `app.json` con los permisos necesarios y configuración de iconos/colores para notificaciones.
2. **Hook de Inicialización**: `hooks/useNotifications.ts`.
   - Lógica de `registerForPushNotificationsAsync`.
   - Manejo de permisos con `Notifications.requestPermissionsAsync()`.
   - Almacenamiento del token en el estado del hook.
3. **Manejo de Eventos**:
   - `addNotificationReceivedListener`: Para mostrar UI personalizada (toasts) si la app ya está abierta.
   - `addNotificationResponseReceivedListener`: Para redirigir al usuario a una pantalla específica usando `expo-router`.

---

## 🔐 Lógica Sugerida

### Hook: `hooks/useNotifications.ts`

```typescript
export function useNotifications() {
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    // 1. Pedir permisos y obtener token
    // 2. Configurar listeners
    // 3. Devolver función de limpieza
  }, []);

  return { token };
}
```

## 🧪 Casos de Prueba
1. El usuario abre la app por primera vez -> Se pide permiso.
2. El usuario deniega permiso -> La app sigue funcionando pero guarda el estado de "denegado".
3. Llega notificación con `{ data: { url: "/settings" } }` -> Al tocarla, la app navega a Ajustes.
