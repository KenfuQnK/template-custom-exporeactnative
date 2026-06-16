# Especificación: Base de datos Supabase (cliente, consultas, migraciones, RLS)

> Documentación generada a partir de **cómo está realmente implementado** en la
> app avanzada de referencia. Guía reutilizable y genérica. **No implementada en
> la plantilla.** Comparte el cliente Supabase con `authentification-system` y
> `supabase-edge-functions`.

## 1. Resumen

Todo el acceso a datos pasa por un único cliente `supabase` (anon key) envuelto
por una **capa de servicios** (`src/services/*.ts`). La UI/hooks **nunca** llaman
`supabase.from(...)` directamente: llaman funciones de servicio
(`fetchItems()`, `addItem()`…). La capa de servicios mapea filas snake_case → modelos
camelCase de la app, maneja errores y obtiene el usuario actual.

**Cliente split por plataforma** (`src/lib/supabase.native.ts` / `supabase.web.ts`,
resuelto por Metro vía sufijos `.native`/`.web`):

```ts
// src/lib/supabase.native.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // OBLIGATORIO en native
import { AppState } from 'react-native';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } }
);
AppState.addEventListener('change', (s) =>
  s === 'active' ? supabase.auth.startAutoRefresh() : supabase.auth.stopAutoRefresh()
);
```

```ts
// src/lib/supabase.web.ts — igual pero localStorage + singleton para HMR
const g = global as unknown as { supabase: any };
export const supabase =
  g.supabase ||
  createClient(URL, ANON_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
if (process.env.NODE_ENV !== 'production') g.supabase = supabase;
```

Requiere en `tsconfig.json`: `"moduleSuffixes": [".native", ".web", ""]` para que
`tsc` resuelva el import `@/src/lib/supabase` sin barrel.

## 2. Patrones de consulta (genéricos)

```ts
// Listar con orden
const { data, error } = await supabase
  .from('items')
  .select('*')
  .order('created_at', { ascending: false });

// Uno (nullable) vs exactamente uno
await supabase.from('profiles').select('id').eq('id', userId).maybeSingle(); // null si 0
await supabase.from('items').insert({ ... }).select().single();              // tras insert

// Filtros
await supabase.from('items').select('*').eq('owner_id', userId).neq('status', 'archived');
await supabase.from('records').select('id').in('id', idArray);
await supabase.from('links').delete().or(`sender_id.eq.${uid},receiver_id.eq.${uid}`);

// Insert / update / upsert / delete
await supabase.from('items').insert({ owner_id: userId, name });
await supabase.from('items').update({ name }).eq('id', id);
await supabase.from('state').upsert({ item_id, user_id, status }, { onConflict: 'item_id,user_id' });
await supabase.from('items').delete().in('id', ids);

// Joins embebidos (PostgREST). !inner fuerza inner join.
await supabase.from('items').select(`*, parent:parents!inner(*), children:child(*)`).eq('group_id', g);

// RPC (lógica transaccional / segura en Postgres)
await supabase.rpc('accept_invite', { invite_token: token });
```

> Embeber un FK a un padre devuelve **objeto**; embeber una tabla hija devuelve
> **array**. Si un embed relacional puede dar 400 (FK no introspectable), usa el
> fallback: fetch base → recoger IDs → `.in()` → merge con `Map` en cliente.

## 3. Migraciones

Viven en `supabase/migrations/` como `.sql` con nombre
`<timestamp UTC>_<descripcion_snake>.sql` (el prefijo define el orden). Genéralas
con `npx supabase migration new <nombre>`. Hazlas **idempotentes**
(`create table if not exists`, `create or replace function`,
`drop policy if exists ... create policy ...`). Orden típico:

```sql
-- (a) Tablas: UUID PK, FKs con on delete, checks, unique compuesto, timestamptz
create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','done','failed')),
  created_at timestamptz not null default now()
);
-- (b) Índices (incluye parciales para colas)
create index if not exists records_pending_idx on public.records (status, created_at) where status = 'pending';
-- (c) Alters aditivos: add column if not exists ... luego backfill ... luego not null
-- (d) Funciones + triggers (plpgsql, security definer, set search_path = public)
-- (e) RLS + policies + grants (ver §4)
```

`supabase/config.toml` controla el stack local (`[db.migrations] enabled = true`,
`[db] major_version` debe coincidir con el Postgres remoto).

## 4. RLS / seguridad

Cada tabla que toca el cliente tiene **RLS activado** y políticas por operación
scoped con `auth.uid()`:

```sql
alter table public.records enable row level security;

create policy "read records" on public.records for select to authenticated using (true);

create policy "insert own" on public.records for insert to authenticated
  with check (owner_id = auth.uid());

create policy "update own" on public.records for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
```

- `using (...)` filtra **qué filas** ve la operación; `with check (...)` valida **la
  fila resultante** (insert/update).
- Funciones privilegiadas se bloquean por **grants**, no RLS:
  `revoke all on function f from public, anon, authenticated; grant execute on function f to service_role;`
  (solo llamables desde una edge function con service-role key).
- Códigos Postgres a los que ramifica la app: `23505` (unique → "ya existe", trae
  el existente) y `42501` (RLS/permiso → remediar o mostrar error claro).

## 5. Patrón de capa de servicios

Un `src/services/<dominio>.ts` por entidad:

- **Modelos tipados + mapeo snake↔camel** (`mapFromDb`, `mapToDb`).
- **Reads**: log de error + devolver default seguro (`return []`), no lanzan.
- **Mutations**: lanzan en error para que el caller reaccione.
- **Obtener el usuario dentro del servicio** (`supabase.auth.getUser()`), no pasarlo.
- **Pre-flight de FK** ("asegurar que el padre existe") tragando `23505`.
- **Logging** por `src/utils/logger.ts` con prefijo de scope.

```ts
export const fetchItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) {
    log.error('fetch items', error);
    return [];
  }
  return (data ?? []).map(mapFromDb);
};
```

## 6. Pasos de integración

1. `npm i @supabase/supabase-js` y `npm i -D supabase`. Native:
   `@react-native-async-storage/async-storage`, `react-native-url-polyfill`.
2. Crea `src/lib/supabase.native.ts` y `supabase.web.ts` (§1). Importa como
   `@/src/lib/supabase`. Añade `moduleSuffixes` al `tsconfig.json`.
3. Añade `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` al `.env`.
4. `npx supabase init`; configura `config.toml` (`project_id`, `major_version`).
5. `npx supabase migration new initial_schema`: tablas + índices + RLS + policies (§3–§4).
6. `npx supabase start` y `npx supabase db reset` para aplicar local; itera.
7. Capa de servicios `src/services/<dominio>.ts` (§5). `.rpc()` para lógica privilegiada.
8. `npx supabase link --project-ref ...` y `npx supabase db push` para subir el esquema.

## 7. Gotchas

- `EXPO_PUBLIC_*` va en el bundle → **solo la anon key** en cliente. La service-role
  key vive solo en edge functions (bypassa RLS).
- `react-native-url-polyfill/auto` obligatorio en native; en web no.
- Web: singleton en `global` para evitar "Multiple GoTrueClient instances" con HMR.
- `maybeSingle()` (0 filas → null) vs `single()` (lanza). Tras insert/update, `.select().single()`.
- `onConflict: 'colA,colB'` para upsert con unique compuesto (la constraint debe existir).
- Embeds de PostgREST son sensibles a array-vs-objeto y pueden dar 400 → fallback `.in()` + Map.
- `[db].major_version` debe igualar el Postgres remoto.
