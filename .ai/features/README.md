# Features — índice

Esta carpeta documenta funcionalidades para que una IA de programación pueda
implementarlas leyendo las instrucciones. Cada feature tiene un `*-spec.md`
(el _cómo_) y a veces un `*-prompt.md` (el _encargo_ listo para pegar).

## ✅ Ya implementado en la plantilla

| Feature                                 | Dónde vive en el código                                                                                                |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **language-system** (i18n, en/es/fr/de) | `src/utils/i18n.ts`, `src/locales/`, `src/context/LanguageContext.tsx`, `src/components/LanguageSelector.tsx`          |
| **themes-system** (tokens semánticos)   | `src/constants/Colors.ts` + `tailwind.config.js` (base; el `*-spec.md` describe la versión completa light/dark/system) |

> El logger reutilizable vive en `src/utils/logger.ts`.

## 📋 Documentado, NO implementado (léelo para implementarlo)

Estas funcionalidades están disponibles para ser implementadas en la plantilla en los casos que sea necesario. Para añadir una, lee su `*-spec.md` (y
`*-prompt.md`).

| Feature                                              | Doc principal                      | Dependencias                                  |
| ---------------------------------------------------- | ---------------------------------- | --------------------------------------------- |
| **authentification-system** (Supabase Auth)          | `auth-system-implementation.md`    | — (base)                                      |
| **supabase-database** (queries, migraciones, RLS)    | `supabase-database-spec.md`        | comparte cliente con auth                     |
| **supabase-edge-functions** (Deno, deploy, invoke)   | `supabase-edge-functions-spec.md`  | supabase-database                             |
| **openai-integration** (asistente IA + tool-calling) | `openai-integration-spec.md`       | supabase-edge-functions, auth                 |
| **payment-system** (RevenueCat)                      | `payment-system-spec.md`           | auth (para `logIn`); trial usa edge-functions |
| **notification-db-system**                           | `notification-db-system-spec.md`   | supabase-database                             |
| **notification-push-system**                         | `notification-push-system-spec.md` | —                                             |

### Orden recomendado de implementación

```
authentification-system ─┬─> supabase-database ─┬─> supabase-edge-functions ─┬─> openai-integration
                         │                      │                            └─> payment-system (trial)
                         └─> payment-system (gating básico, sin trial)
```

## Convenciones al implementar

- Respeta la estructura `src/` y los alias `@/src/*`.
- Todo texto de UI pasa por i18n (`t('...')`); usa `npm run validate:ui`.
- Enruta logs por `src/utils/logger.ts`, no `console.log` sueltos.
- Las API keys de terceros viven **solo en el servidor** (secrets de Edge
  Function), nunca en `EXPO_PUBLIC_*`.
- Al terminar: `npm run check` y `npm run lint`.
