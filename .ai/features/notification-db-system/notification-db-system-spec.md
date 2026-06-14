# Especificación: Sistema de Historial y DB de Notificaciones (Supabase)

**Versión:** 1.0 (Dependiente de Backend)

---

## 📋 Resumen Ejecutivo

Este sistema añade una capa de datos al sistema de notificaciones. Permite que el usuario tenga un historial persistente de mensajes (Centro de Notificaciones) y que el servidor sepa a qué dispositivos enviar los mensajes (Gestión de Tokens).

---

## 🎯 Objetivos

- ✅ Persistir el historial de notificaciones enviadas al usuario.
- ✅ Gestionar múltiples tokens por usuario (soporte multidispositivo).
- ✅ Pantalla de Centro de Notificaciones con estados de "leído/no leído".
- ✅ Acciones masivas (marcar todo como leído, eliminar).
- ✅ Badge dinámico de notificaciones pendientes.

---

## 🗄️ Estructura de Datos (SQL)

### Tabla `user_push_tokens`:
Guarda la relación entre `user_id` y su `expo_push_token`.

### Tabla `notifications`:
Guarda el contenido de cada notificación enviada: `title`, `body`, `data`, `is_read`, `created_at`.

---

## 🎨 Componentes de Interfaz

1. **NotificationsScreen**: Lista de mensajes con scroll infinito (paginación).
2. **NotificationBadge**: Indicador visual (punto rojo) en el icono de la campana.
3. **EmptyState**: Ilustración y texto cuando no hay mensajes.

---

## 🔐 Lógica de Integración

Cuando el sistema Push obtiene un token:
1. Llamar a `notificationsService.saveToken(token)`.
2. El servicio inserta el token en la tabla usando `upsert` para evitar duplicados.

Cuando llega una notificación (vía Row Level Security o Trigger):
1. El usuario puede verla en su pantalla de notificaciones al recargar o mediante suscripción Realtime de Supabase.

---

## 🧪 Casos de Prueba
1. El usuario tiene dos móviles -> Ambos reciben el push y ambos muestran el mismo historial.
2. El usuario marca como leída una notificación en el móvil A -> El móvil B debe reflejar el cambio (Realtime).
