# Prompt: Implementar Supabase Edge Functions

Implementa Edge Functions de Supabase siguiendo:

`.ai/features/supabase-edge-functions/supabase-edge-functions-spec.md`

## Requisitos

1. Lee toda la especificación antes de empezar.
2. Usa el esqueleto Deno: CORS + manejo de `OPTIONS`, `Deno.env.get` para
   secretos, cliente "usuario" (`auth.getUser()`) para identidad y cliente
   service-role solo para trabajo privilegiado. Respuestas JSON con `corsHeaders`.
3. Los secretos de terceros **nunca** en el cliente: `supabase secrets set ...`.
4. Decide `verify_jwt` por function en `config.toml`.
5. Invoca desde la app con un wrapper tipo `invokeFn` (doble check `error` /
   `data.error`) y una _race_ de timeout.

## Instrucciones

- Sé autónomo; no esperes confirmación.
- Requiere el cliente Supabase (`supabase-database` / `authentification-system`).
- Indica los comandos `supabase` CLI (deploy, secrets) que el usuario debe correr.
- Ejecuta `npm run check` y `npm run lint` al terminar.
