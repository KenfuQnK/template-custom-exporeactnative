# Especificación: Supabase Edge Functions (estructura, deploy, invocación)

> Documentación generada a partir de **cómo está realmente implementado** en la
> app avanzada de referencia. Guía reutilizable y genérica. **No implementada en
> la plantilla.**

## 1. Para qué sirven

Functions Deno desplegadas en Supabase, en `supabase/functions/<nombre>/index.ts`.
Existen por tres razones:

1. **Mantener secretos en el servidor.** Las API keys de terceros (LLM, APIs
   externas, billing) nunca deben ir en el bundle RN (todo `EXPO_PUBLIC_*` es
   público). La function guarda el secreto con `Deno.env.get(...)` y hace de proxy.
2. **Trabajo privilegiado en DB** con la service-role key (bypassa RLS) tras
   verificar al usuario.
3. **Lógica de servidor / orquestación** (handshakes OAuth, llamar a un LLM y
   validar su salida, escribir resultados).

## 2. Anatomía (plantilla genérica)

```ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const requireEnv = (n: string) => {
  const v = Deno.env.get(n);
  if (!v) throw new Error(`${n} not configured`);
  return v;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders }); // CORS preflight
  try {
    // (A) Cliente "como el usuario": reenvía su JWT, respeta RLS, identifica al caller
    const userClient = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'), {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });
    const { data: { user }, error } = await userClient.auth.getUser();
    if (error || !user) return json({ error: 'Unauthorized' }, 401);

    const { action, payload } = await req.json().catch(() => ({}) as any);

    // (B) Cliente admin (service role): BYPASSA RLS. Nunca exponer esta key al cliente.
    const admin = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // ... lógica: llamar API externa con secreto, escribir en DB, etc.
    return json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return json({ error: err?.message ?? 'Internal Server Error' }, 500);
  }
});
```

Las dos identidades de cliente (usuario vs admin) son el concepto central.
Patrón habitual: aceptar `{ action: 'start' | 'reset' | ... }` y ramificar (una
function multiplexa varias operaciones relacionadas). Helpers en un módulo
hermano importado con extensión `.ts` (Deno la exige): `import { x } from './prompts.ts'`.

## 3. `config.toml`

Configura el stack y settings por function:

```toml
project_id = "your-app"
[api]
schemas = ["public", "graphql_public"]
max_rows = 1000
[db]
major_version = 17        # debe igualar el Postgres remoto
[edge_runtime]
enabled = true
policy = "per_worker"     # hot-reload en dev local
```

Por defecto toda function desplegada **exige JWT válido** (el gateway rechaza
antes de tu código). Para una pública (webhook) o un worker llamado solo con la
service-role key:

```toml
[functions.public-webhook]
verify_jwt = false        # o deploy con --no-verify-jwt; valida la auth en código
```

## 4. Invocación desde la app

Siempre `supabase.functions.invoke(name, { body })`. El SDK adjunta
automáticamente el JWT del usuario actual (lo lee `auth.getUser()` dentro).

```ts
const invokeFn = async <T>(name: string, body: Record<string, unknown>): Promise<T> => {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) throw new Error(error.message || `${name} failed`); // transporte / non-2xx
  if (data?.error) throw new Error(data.error); // error lógico en body 200 (patrón return-200)
  return data as T;
};
```

Las edge functions pueden ser lentas (cold start): envuelve en una _race_ con
timeout (~15 s) y muestra un mensaje amable. Para leer el body de un error real
non-2xx: `await (error as any).context.json()`.

## 5. Deploy y dev local

El CLI `supabase` es **devDependency** → `npx supabase ...`.

```bash
npx supabase start                         # stack local (Docker)
npx supabase functions serve <name> --env-file ./supabase/.env.local
npx supabase login && npx supabase link --project-ref <ref>
npx supabase functions deploy <name>       # o sin nombre = todas
npx supabase functions deploy webhook --no-verify-jwt
npx supabase secrets set THIRD_PARTY_API_KEY=xxxx   # secretos de servidor
```

> `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` se **inyectan
> automáticamente** en functions desplegadas; tú solo añades tus secretos de terceros.

`supabase/.gitignore` ignora `.branches`, `.temp`, `.env*.local`; se commitean
`config.toml`, migraciones y el código de las functions.

## 6. Pasos de integración

1. `npm i -D supabase`; `npx supabase init`.
2. Crea `supabase/functions/<name>/index.ts` con el esqueleto del §2.
3. Decide gating en `config.toml` (`verify_jwt`).
4. `npx supabase secrets set ...` (y un `supabase/.env.local` para `functions serve`).
5. Prueba local: `npx supabase functions serve <name> --env-file ./supabase/.env.local`.
6. Llama desde la app con el wrapper `invokeFn` (§4) + race de timeout.
7. Deploy: `npx supabase functions deploy <name>`.

## 7. Gotchas

- **Deno, no Node**: imports por URL (`deno.land`, `esm.sh/@supabase/supabase-js@2`),
  secretos con `Deno.env.get`, imports relativos **con extensión `.ts`**.
- `functions.invoke` con non-2xx pone `error` y deja `data` en null; para leer el
  mensaje upstream parsea `error.context.json()`. Patrón de la referencia: devolver
  errores como **HTTP 200 con `{ error }`** y comprobar `data.error` en cliente.
- `verify_jwt` por defecto activado: webhooks/workers necesitan `verify_jwt = false`
  + validar en código (service-role key o claim `role` del JWT).
- **CORS en toda function**: maneja `OPTIONS` y añade `corsHeaders` a TODA respuesta
  (incluidas las de error) o el web falla el preflight.
- Cold starts reales: usa timeout en cliente.
