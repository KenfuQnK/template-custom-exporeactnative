# Especificación: Integración de IA (OpenAI) — Asistente de chat con tool-calling

> Documentación generada a partir de **cómo está realmente implementado** en la
> app avanzada de referencia. Es una guía de implementación reutilizable y
> genérica. **No está implementada en la plantilla**: sigue estos pasos para
> añadirla.

## 1. Resumen / Arquitectura

Asistente de chat multi-agente con _tool-calling_ donde **el cliente nunca llama
directamente a OpenAI**. Toda llamada al modelo pasa por una **Supabase Edge
Function** (Deno) para que la API key viva solo en el servidor.

```
UI de chat
  │  useChatController (estado, persistencia, status tags)
  ▼
AIOrchestrator.processMessage()         ← punto de entrada único
  ├─ routeRequest()        → clasifica el mensaje en un agente (+ ¿web search?)
  ├─ getAgent(type)        → AgentProfile (system prompt + tools permitidas + settings)
  ├─ construye messages (system + history + user)
  ├─ AgentRunner.run()     → bucle de tool-calling multi-turno
  │     ├─ getToolDeclarations(names)   → schemas JSON de tools para el modelo
  │     ├─ OpenAIClient.createChatCompletion()
  │     │       └─ supabase.functions.invoke('agents-openai', { body })
  │     │             └─ Edge Function (Deno) ── fetch ──▶ OpenAI /v1/chat/completions
  │     ├─ si hay tool_calls → ejecuta handlers locales → añade resultados → repite
  │     └─ si no → texto final del asistente
  ├─ post-proceso (parseo de salida estructurada, "cards" de UI)
  └─ devuelve { aiMessage, cards, conversationState, uiAction, debug }
```

Conceptos clave:

- **Router → Orchestrator → Agent → Tools.** Un "router" LLM ligero clasifica la
  intención (qué agente, si requiere datos web frescos). El orquestador ejecuta
  el agente elegido en un bucle de tool-calling acotado.
- **Las tools se ejecutan en el cliente**, no en el servidor. El modelo solo
  _decide_ qué tool llamar y con qué argumentos; la edge function devuelve esas
  decisiones y el cliente ejecuta los handlers (pueden mutar estado local,
  llamar servicios, navegar…).
- **Estado de conversación** explícito y versionado (`ConversationStateV1`):
  historial visible + memoria de ejecución (p. ej. desambiguación pendiente).
- **Dos caminos de llamada:** `/v1/chat/completions` (tool-calling, JSON mode) y
  `/v1/responses` con la tool `web_search` integrada (cuando se requieren datos
  frescos).

## 2. Dependencias y entorno

- **Sin SDK de OpenAI en el cliente.** El cliente solo usa
  `supabase.functions.invoke(...)`. La edge function (Deno) llama a OpenAI con
  `fetch` contra `https://api.openai.com/v1/...`. No hay `openai`, `langchain`
  ni `ai` SDK; es REST puro.
- Runtime relevante: `@supabase/supabase-js` (cliente + tests).
- **Variables de entorno:**

  ```bash
  # Cliente (van en el bundle): solo Supabase
  EXPO_PUBLIC_SUPABASE_URL=
  EXPO_PUBLIC_SUPABASE_ANON_KEY=
  # SOLO SERVIDOR — secret de la Edge Function, NUNCA EXPO_PUBLIC_*
  OPENAI_API_KEY=
  ```

  Dentro de la function: `Deno.env.get('OPENAI_API_KEY')`. **Por qué server-side:**
  todo lo `EXPO_PUBLIC_*` o empaquetado es extraíble de la app; una key expuesta
  permitiría vaciar tu cuota/billing. La edge function también es el punto donde
  añadir auth, rate-limiting y control de abuso.

- **Model IDs centralizados** en `src/services/ai/models.ts` para que cliente y
  edge function compartan las mismas constantes:

  ```ts
  export const AI_CHAT_MODEL = '<chat-model-id>';
  export const AI_WEB_SEARCH_MODEL = '<web-search-model-id>';
  ```

## 3. Capa cliente (`src/lib/ai/client.ts`)

Clase que abstrae "llamar a OpenAI" → "invocar una function Supabase y
normalizar la respuesta".

```ts
export interface ChatCompletionOptions {
  model: string;
  messages: Content[]; // {role, content, tool_calls?, tool_call_id?, name?}
  tools?: any[]; // [{ type:'function', function: <declaration> }]
  temperature?: number;
  tool_choice?: 'auto' | 'none' | 'required' | { type: 'function'; function: { name: string } };
  parallel_tool_calls?: boolean;
  response_format?: { type: 'json_object' }; // JSON mode
}

export interface OpenAIResponse {
  content: string | null;
  tool_calls?: { id: string; name: string; args: Record<string, any> }[];
  sources?: { title?: string; url?: string }[]; // solo en el camino web-search
}

export class OpenAIClient {
  constructor(private functionName: string = 'agents-openai') {}

  async createChatCompletion(options: ChatCompletionOptions): Promise<OpenAIResponse> {
    const { data, error } = await supabase.functions.invoke(this.functionName, { body: options });
    if (error) throw new Error(`Supabase Function Error: ${error.message}`);
    if (data.error) throw new Error(`OpenAI API Error: ${data.error}`);
    return {
      content: data.text,
      tool_calls: data.functionCalls?.length ? data.functionCalls : undefined,
    };
  }
}

export const getOpenAIClient = () => new OpenAIClient('agents-openai');
```

Errores en dos niveles: transporte (`error` de `functions.invoke`) y aplicación
(`data.error`, que la function pone incluso en fallos de OpenAI devolviendo HTTP
200 — ver §10).

## 4. Registro de tools (function-calling)

Vocabulario de schema agnóstico de proveedor (`src/services/ai/types.ts`):

```ts
export enum SchemaType {
  STRING = 'string',
  NUMBER = 'number',
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
}
export interface FunctionDeclaration {
  name: string;
  description?: string;
  parameters?: {
    type: SchemaType | 'object';
    properties?: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean;
  };
}
```

Registro (`src/services/ai/registry.ts`): mapa a nivel de módulo. Cada tool =
`definition` (schema enviado al modelo) + `handler` (se ejecuta localmente).

```ts
export interface ToolContext {
  /* datos y callbacks que las tools pueden leer/mutar */
  onAdd: (...a: any[]) => void;
  onUpdate: (...a: any[]) => void;
  search: (q: string) => Promise<any[] | null>;
  conversationState?: ConversationStateV1;
}
export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  uiText?: string; // texto mostrado al usuario
  uiCards?: any[]; // payloads de UI estructurados (cards)
  uiAction?: { type: string; payload: any }; // p.ej. navegar
}
export type ToolHandler = (args: any, ctx: ToolContext) => Promise<string | ToolResult>;
export interface ToolManifest {
  definition: FunctionDeclaration;
  handler: ToolHandler;
}

const tools: Record<string, ToolManifest> = {};
export const registerTool = (name: string, m: ToolManifest) => {
  tools[name] = m;
};
export const getToolDeclarations = (enabled?: string[]) =>
  (enabled ? Object.keys(tools).filter((k) => enabled.includes(k)) : Object.keys(tools)).map(
    (k) => tools[k].definition
  );
export const getToolHandlers = (enabled?: string[]) => {
  const out: Record<string, ToolHandler> = {};
  (enabled ? Object.keys(tools).filter((k) => enabled.includes(k)) : Object.keys(tools)).forEach(
    (k) => (out[k] = tools[k].handler)
  );
  return out;
};
```

Ejemplo genérico de tool (resolver referencia → no encontrado / ambiguo / acción):

```ts
const handler: ToolHandler = async (args, ctx) => {
  const matches = findEntities(ctx /* state */, args.entityName);
  if (matches.length === 0) return { success: false, error: `No match for "${args.entityName}".` };
  if (matches.length > 1) {
    return {
      success: true,
      uiText: 'Which one did you mean?',
      uiCards: [{ type: 'selection', data: { items: matches.map((m) => ({ id: m.id, label: m.title })) } }],
      data: { status: 'ambiguous', candidates: matches },
    };
  }
  ctx.onUpdate(matches[0].id, {
    /* changes */
  });
  return { success: true, uiText: `Done.`, data: { status: 'success', id: matches[0].id } };
};
export const doActionOnEntity: ToolManifest = {
  definition: {
    name: 'doActionOnEntity',
    description: 'Perform <action> on an entity by name.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: { entityName: { type: SchemaType.STRING } },
      required: ['entityName'],
      additionalProperties: false,
    },
  },
  handler,
};
```

Las tools se registran una vez en el constructor del orquestador
(`registerAllTools()` en `tools/index.ts`).

## 5. Agentes, router y orquestador

- **Agentes** (`src/services/ai/agents.ts`): un `AgentProfile` enlaza system
  prompt + lista blanca de tools + `modelSettings` (temperature, reasoning…). Se
  buscan por tipo (`actionAgent`, `infoAgent`, `default`).
- **Router** (`src/services/ai/router.ts`): es _otra_ llamada LLM (modelo barato,
  `temperature: 0`, JSON mode) que clasifica el mensaje en un agente y decide si
  hace falta web search. Override determinista: si hay desambiguación pendiente,
  fuerza el `actionAgent` sin llamar al LLM. Ante error de parseo/transporte,
  **fallback a `default`** (nunca lanza). Guardarraíl anti prompt-injection:
  instruye al modelo a tratar el mensaje del usuario como _datos_ a clasificar.
- **Bucle de tools** (`AgentRunner.run` en `orchestrator.ts`): protocolo estándar
  de OpenAI — mensaje `assistant` con `tool_calls` → un mensaje `tool` por cada
  call (clave `tool_call_id`) → repite. **Acotado a `maxLoops = 3`.**
  `parallel_tool_calls` desactivado (las tools tienen efectos de UI). Los
  agentes de acción terminan en el primer resultado terminal (success/ambiguous).

```ts
let loop = 0;
const tools = getToolDeclarations(agent.tools).map((d) => ({ type: 'function', function: d }));
while (loop++ < 3) {
  const res = await client.createChatCompletion({
    model: AI_CHAT_MODEL,
    messages,
    tools,
    tool_choice: tools.length ? 'auto' : undefined,
  });
  const calls = res.tool_calls ?? [];
  messages.push({
    role: 'assistant',
    content: res.content ?? '',
    tool_calls: calls.map((c) => ({
      id: c.id,
      type: 'function',
      function: { name: c.name, arguments: JSON.stringify(c.args) },
    })),
  });
  if (!calls.length) break; // respuesta final
  const handlers = getToolHandlers(agent.tools);
  const results = await Promise.all(
    calls.map(async (c) => {
      const r = handlers[c.name] ? await handlers[c.name](c.args, toolContext) : { error: 'not found' };
      return { role: 'tool', tool_call_id: c.id, name: c.name, content: JSON.stringify(r) };
    })
  );
  messages.push(...results);
}
```

## 6. Estado de conversación (`conversationState.ts`)

Objeto explícito, versionado, controlado por la UI y pasado en cada turno.

```ts
export interface ConversationStateV1 {
  version: 1;
  visibleHistory: Content[]; // solo turnos user/assistant saneados (sin system/tool)
  executionMemory: {
    pendingDisambiguation: { active: boolean; candidates: { id: string; title: string }[] };
    turnCounter: number;
  };
}
```

Idea reutilizable: **no reenviar el transcript crudo del modelo**; mantener un
estado limpio controlado por la app y reconstruir los `messages` cada turno. El
`visibleHistory` se capa (p. ej. últimos ~12) para acotar contexto.
`pendingDisambiguation` permite que "me refería al de 2009" funcione: tras un
resultado `ambiguous`, el router fuerza el mismo agente en el siguiente turno.

## 7. Hook de UI (`src/hooks/useChatController.ts`)

Único punto con el que habla la pantalla. Construye el `ToolContext` desde
callbacks de la app, llama a `orchestrator.processMessage`, y persiste mensajes.

- **Sin streaming.** Es request/response (`await processMessage`). El único
  feedback "vivo" es un `assistantStatusTag` (`thinking → searching/typing`) por
  callback `onStatusTagChange`.
- **Cards**: payloads estructurados (`result.cards`) renderizados por el
  componente de mensaje según su `type`.
- **`uiAction`**: canal para efectos disparados por tools (navegar, abrir algo).
- El `ToolContext` es la costura de inyección de dependencias: el orquestador y
  las tools nunca importan estado de la app; todo llega por aquí.

## 8. Edge functions (Deno)

Dos functions, una por superficie de API. Esqueleto común (ver
`.ai/features/supabase-edge-functions` para el patrón general):

```ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY');
    const options = await req.json(); // ES el body de OpenAI, reenviado por el cliente
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    const data = await r.json();
    if (!r.ok)
      return new Response(JSON.stringify({ error: data?.error?.message || 'OpenAI error' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    const msg = data.choices?.[0]?.message;
    const result = {
      text: msg?.content || '',
      functionCalls: (msg?.tool_calls || []).map((t: any) => ({
        id: t.id,
        name: t.function?.name,
        args: JSON.parse(t.function?.arguments || '{}'),
      })),
    };
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

- **`agents-openai`**: ramifica en `options.apiMode`. `'responses_web_search'` →
  `/v1/responses` con `tools:[{type:'web_search'}]` y extrae `sources`; por
  defecto → `/v1/chat/completions` y devuelve `{ text, functionCalls }`.
- **`chat-openai`**: completions simples (tareas one-shot con JSON mode), acepta
  `messages[]` o `{ systemInstruction, history, message }`.
- Añade un guard de sesión/rate-limit al principio antes de llamar a OpenAI.

## 9. Tests headless (`scripts/ai/`)

- `tsx scripts/ai/run.ts` — tests **offline** de la lógica de tools. `run.ts`
  parchea `Module._load` para mockear RN/Expo (`i18n`, async-storage,
  expo-localization) y poder importar las tools en Node; `tools.spec.ts` llama a
  los handlers con un `ToolContext` mock y asserta sobre el `ToolResult`.
- Runner separado que inyecta un cliente Supabase real para e2e contra el modelo.
- Scripts: `"test:ai": "tsx scripts/ai/run.ts"`.

## 10. Pasos de integración (plantilla limpia)

1. **Backend:** crea proyecto Supabase. `supabase secrets set OPENAI_API_KEY=sk-...`.
   Añade `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` al `.env`.
2. **Edge function** `supabase/functions/agents-openai/index.ts` con el esqueleto
   del §8. `supabase functions deploy agents-openai`. Añade guard de auth/rate-limit.
3. **`src/services/ai/models.ts`** con los model IDs.
4. **`src/lib/ai/client.ts`**: `OpenAIClient` envolviendo `functions.invoke`.
5. **`src/services/ai/types.ts`**: `SchemaType`, `FunctionDeclaration`, `Content`.
6. **`src/services/ai/registry.ts`**: `ToolContext`, `ToolResult`, `registerTool`,
   `getToolDeclarations`, `getToolHandlers`.
7. **Tools** en `src/services/ai/tools/*` (una por archivo) + `registerAllTools()`.
8. **Prompts + agentes** (`prompts.ts`, `agents.ts`).
9. **Estado** (`conversationState.ts`).
10. **Router** (`router.ts`) y **orquestador** (`orchestrator.ts` con el bucle).
11. **UI**: `src/hooks/useChatController.ts` + componente de chat que renderiza
    texto + cards y maneja `uiAction`.
12. **Tests** (`scripts/ai/`).

> **Versión mínima viable:** pasos 1–4, 6–7 y 10 con un solo agente, sin router,
> sin web search, sin desambiguación. El resto son mejoras independientes.

## 11. Gotchas / compatibilidad

- **La key SOLO en servidor.** `EXPO_PUBLIC_*` va en el bundle (público). La key
  vive como secret de la edge function (`Deno.env.get`). No repliques claves
  `EXPO_PRIVATE_*` en el cliente.
- **Las functions devuelven HTTP 200 incluso en error**, con el mensaje en
  `{ error }` (porque `functions.invoke` oscurece los bodies non-2xx). Si cambias
  esto, actualiza el manejo de errores del cliente.
- **Sin streaming**: respuesta única JSON; el "progreso" se finge con un status tag.
- **Dos APIs distintas**: tool-calling usa `/v1/chat/completions`; web search usa
  `/v1/responses` con forma de respuesta diferente.
- **Bucle acotado** (`maxLoops = 3`) para evitar loops infinitos de tools.
- **JSON mode es frágil**: aunque uses `response_format`, parsea defensivamente
  (quita fences ```` ```json ````, extrae el primer `{...}`).
- **El modelo solo decide; el cliente ejecuta.** Los handlers cazan sus errores y
  devuelven `{ error }`; valida/resuelve los argumentos, no confíes ciegamente.
- **`models.ts` compartido** entre RN y Deno: verifica que el bundling de la
  function pueda resolverlo, o duplica la constante.
