# Prompt: Sistema de Historial y DB de Notificaciones (Supabase)

Implementa la capa de persistencia y el Centro de Notificaciones siguiendo la especificación en:

`.ai/features/notification-db-system/notification-db-system-spec.md`

## Requisitos:

1. Integra este sistema con el sistema de notificaciones push ya existente.
2. Crea las tablas necesarias en Supabase para tokens y mensajes.
3. Implementa un `NotificationCenter` (pantalla de historial).
4. Crea servicios para marcar notificaciones como leídas.

## Instrucciones:

- Genera el SQL para Supabase.
- Implementa el servicio `notifications.service.ts` para interactuar con la DB.
- El sistema debe guardar el Push Token en la DB cada vez que el usuario inicia sesión o el token cambia.
- Implementa una lógica de "Badge" (contador de no leídos).

## Notas:
- **Dependencia**: Requiere que la aplicación ya tenga configurada la recepción de notificaciones (Push System).
