# Prompt: Implementar base de datos Supabase

Implementa el acceso a datos con Supabase siguiendo:

`.ai/features/supabase-database/supabase-database-spec.md`

## Requisitos

1. Lee toda la especificación antes de empezar.
2. Cliente **split por plataforma** (`supabase.native.ts` / `supabase.web.ts`),
   sin barrel `supabase.ts`. Añade `moduleSuffixes` al `tsconfig.json`.
3. Solo la **anon key** en el cliente (`EXPO_PUBLIC_*`). La service-role key nunca.
4. Toda consulta pasa por una **capa de servicios** en `src/services/` (la UI no
   llama a `supabase.from(...)` directamente).
5. Activa **RLS** en toda tabla y define políticas por operación con `auth.uid()`.
6. Migraciones idempotentes en `supabase/migrations/`. Logs por `src/utils/logger.ts`.

## Instrucciones

- Sé autónomo; no esperes confirmación.
- Si la auth aún no existe, implementa antes `authentification-system` (comparten cliente).
- Genera el SQL de migraciones y los pasos `supabase` CLI que el usuario debe ejecutar.
- Ejecuta `npm run check` y `npm run lint` al terminar.
