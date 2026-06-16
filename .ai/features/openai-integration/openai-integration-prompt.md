# Prompt: Implementar integración de IA (OpenAI)

Implementa un asistente de chat con IA siguiendo la especificación en:

`.ai/features/openai-integration/openai-integration-spec.md`

## Requisitos

1. Lee toda la especificación antes de empezar.
2. **La API key de OpenAI vive SOLO en el servidor** (secret de una Supabase Edge
   Function). El cliente nunca llama a OpenAI directamente.
3. Usa TypeScript estricto y NativeWind. Respeta la estructura `src/` de la plantilla.
4. Usa la capa cliente → edge function → OpenAI REST descrita (sin SDK de OpenAI).
5. Implementa primero la **versión mínima viable** (un agente, sin router/web
   search/desambiguación) y deja el resto como mejoras.
6. Enruta los logs por `src/utils/logger.ts` (no `console.log` sueltos).
7. Todo texto de UI debe pasar por i18n (`t('...')`).

## Instrucciones

- Sé autónomo; no esperes confirmación.
- Requiere Supabase: si aún no está, implementa antes
  `.ai/features/supabase-edge-functions` y la auth (`authentification-system`).
- Añade un guard de auth/rate-limit en la edge function antes de llamar a OpenAI.
- Indica qué pasos manuales debe hacer el usuario (crear proyecto, secrets, deploy).
- Ejecuta `npm run check` y `npm run lint` al terminar.
