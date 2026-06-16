# Plantilla Expo React Native (SDK 54) + NativeWind + i18n

Base limpia, reutilizable y mantenible para apps **Expo SDK 54** con **NativeWind
(Tailwind)**, **Expo Router**, **TypeScript estricto** e **i18n** listo para usar.
Pensada como punto de partida para nuevos proyectos.

## 🚀 Características

- **Expo SDK 54** + **React Native 0.81** + **React 19**.
- **NativeWind v4** (Tailwind CSS para RN) con **tokens de tema semánticos**.
- **Expo Router** (file-based routing) para iOS, Android y Web.
- **TypeScript** estricto, con `className` tipado vía `jsxImportSource: nativewind`.
- **i18n (i18next)** con 4 idiomas (en/es/fr/de), persistencia y detección de idioma.
- **Logger** con niveles y redacción de datos sensibles en producción.
- **ESLint + Prettier** (con orden automático de clases Tailwind) y reglas de hooks.
- **Scripts de validación**: traducciones completas y detección de texto hardcodeado.
- **Carpeta `.ai/`**: specs para que una IA implemente features avanzadas a demanda.

## 📁 Estructura

```
.
├── app/                  # Rutas (Expo Router). Pantallas y layouts.
├── src/
│   ├── components/       # Componentes reutilizables (Button, LanguageSelector…)
│   ├── constants/        # Colors (tokens de tema), icons, images
│   ├── context/          # Estado global (LanguageContext…)
│   ├── locales/          # Traducciones {en,es,fr,de}/{common,errors,validation}.json
│   ├── types/            # Tipos TS (i18next.d.ts…)
│   ├── utils/            # Genéricos (i18n.ts, logger.ts)
│   ├── hooks/            # (vacío) Hooks reutilizables — empiezan por use…
│   ├── lib/              # (vacío) Inicialización de clientes externos
│   └── services/         # (vacío) Llamadas a APIs / servicios externos
├── scripts/validate/     # Scripts de calidad (traducciones, UI hardcodeada)
├── .ai/                  # Instrucciones para IA (features, skills, description)
├── assets/               # Imágenes, iconos, splash
├── tailwind.config.js    # Tokens de color (desde src/constants/Colors.ts)
├── app.json / eas.json   # Configuración de Expo / perfiles de build EAS
└── .env.example          # Plantilla de variables de entorno
```

> Las carpetas `hooks/`, `lib/` y `services/` se crean cuando las necesites
> (varias features en `.ai/` las usan). El alias `@/*` apunta a la raíz, así que
> importa con `@/src/...`.

## ⚙️ Primeros pasos

```bash
npm install
npm run start          # Expo dev server (o start:tunnel si hay problemas de red)
npm run android | ios | web
```

Para renombrar la plantilla a tu proyecto:

1. En `app.json`: cambia `name`, `slug` y `scheme`.
2. Busca y reemplaza (Ctrl+Shift+F) `template-custom-exporeactnative` por tu slug.
3. Copia `.env.example` a `.env` y rellena lo que necesites.

## 📜 Scripts

| Script | Qué hace |
| --- | --- |
| `npm run start` / `android` / `ios` / `web` | Arrancar Expo |
| `npm run lint` | ESLint + comprobación de formato Prettier |
| `npm run format` | Arreglar lint + formato automáticamente |
| `npm run check` | TypeScript (`tsc --noEmit`) |
| `npm run validate:translations` | Verifica que todos los idiomas tienen las mismas claves |
| `npm run validate:ui` | Detecta texto de UI hardcodeado (debe ir por i18n) |
| `npm run validate` | Ejecuta ambas validaciones |
| `npm run build:android:preview` / `production` | Builds con EAS |

## 🎨 Tema (tokens semánticos)

Edita la paleta en `src/constants/Colors.ts` (única fuente de verdad). Se mapea a
utilidades Tailwind: `bg-primary`, `text-foreground`, `text-muted`, `bg-surface`,
`border-border`, `bg-success`, etc. Los valores por defecto son claros; para
light/dark/system, ver `.ai/features/themes-system`.

## 🌍 i18n

```tsx
import { useTranslation } from 'react-i18next';
const { t } = useTranslation('common');
<Text>{t('buttons.save')}</Text>;
```

- Idiomas: `en`, `es`, `fr`, `de`. Namespaces: `common`, `errors`, `validation`.
- Cambiar idioma en runtime: `useLanguage()` (`src/context/LanguageContext.tsx`) o
  el componente `<LanguageSelector />`.
- Añade claves en `src/locales/<lang>/<ns>.json` (las mismas en los 4 idiomas) y
  ejecuta `npm run validate:translations`.

## 🤖 Carpeta `.ai/`

Instrucciones para que una IA de programación trabaje sobre el proyecto. En
`.ai/features/` hay specs (generados a partir de una app avanzada real) para
implementar a demanda funcionalidades que **no** vienen en la plantilla: Supabase
(auth, base de datos, edge functions), integración de IA (OpenAI) y pagos
(RevenueCat). Empieza por `.ai/features/README.md`.

---

_Plantilla para acelerar el inicio de proyectos Expo + NativeWind con buenas
prácticas actuales._
