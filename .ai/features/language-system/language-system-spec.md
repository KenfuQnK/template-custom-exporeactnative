# Especificación: Sistema de Internacionalización (i18n)

**Última actualización:** 2026-01-05

**Versión:** 2.1

---

## 📋 Resumen Ejecutivo

Implementar un sistema completo de internacionalización (i18n) que permita traducir toda la aplicación a múltiples idiomas. El usuario podrá seleccionar su idioma preferido y todos los textos, formatos de fecha, números y moneda se adaptarán automáticamente.

### Idiomas soportados

- Inglés (en)
- Español (es)
- Francés (fr)
- Alemán (de)

---

## 🎯 Objetivos del Sistema

### Funcionales

- ✅ Soporte para múltiples idiomas 
- ✅ Cambio de idioma en tiempo real sin reiniciar la app
- ✅ Persistencia de la preferencia de idioma del usuario
- ✅ Detección automática del idioma del dispositivo
- ✅ Traducción de todos los textos de la UI
- ✅ Formateo de fechas según idioma/región
- ✅ Formateo de números y moneda según región
- ✅ Pluralización correcta según reglas del idioma
- ✅ Interpolación de variables en traducciones

### No Funcionales

- ✅ Cambio de idioma < 100ms (sin lag perceptible)
- ✅ Fallback automático a español si falta traducción
- ✅ Type-safe: TypeScript debe detectar traducciones faltantes
- ✅ Fácil agregar nuevos idiomas (solo crear archivo JSON)
- ✅ Compatible con React Native y Expo
- ✅ Soporte para traducciones RTL (árabe, hebreo) en el futuro

---

## 📁 Estructura de Archivos

```
project-root/
├── locales/                          # Traducciones
│   ├── es/                          # Español
│   │   ├── common.json              # Traducciones comunes (botones, mensajes)
│   │   ├── auth.json                # Pantallas de autenticación
│   │   ├── profile.json             # Perfil de usuario
│   │   ├── errors.json              # Mensajes de error
│   │   └── validation.json          # Validaciones de formularios
│   ├── en/                          # Inglés
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── profile.json
│   │   ├── errors.json
│   │   └── validation.json
│   └── index.ts                     # Exporta todas las traducciones
│
├── utils/
│   └── i18n.ts                      # Configuración de i18next
│
├── contexts/
│   └── LanguageContext.tsx          # Context para cambio de idioma
│
├── components/
│   └── ui/
│       └── LanguageSelector.tsx     # Selector de idioma
│
└── types/
    └── i18next.d.ts                 # Type definitions para traducciones
```

---

## 🗂️ Código de referencia

Estudiar todo el código de referencia que se encuentra en:

`.ai/features/language-system/language-system-codesample.md`

Este código es de ejemplo. Debe adaptarse al repo real. No hay que copiarlo a ciegas si hay rutas, imports o estructura distinta.

---

## ✅ Checklist de Implementación

### Fase 1: Setup Inicial

- [ ] Instalar dependencias (i18next, react-i18next, expo-localization, async-storage)
- [ ] Crear estructura de carpetas `/locales`
- [ ] Configurar `utils/i18n.ts`
- [ ] Crear archivo TypeScript `types/i18next.d.ts`
- [ ] Añadir scripts de validación a `package.json`:
    - `"validate:translations": "node scripts/validate-translations.js"`
    - `"validate:i18n-ui": "node scripts/validate-no-hardcoded-ui.js"`
    - `"validate:i18n": "npm run validate:translations && npm run validate:i18n-ui"`
- [ ] Integrar providers en `app/_layout.tsx`

### Fase 2: Traducciones Base

- [ ] Crear `locales/[lang]/common.json` (completo)
- [ ] Crear `locales/[lang]/auth.json` (completo)
- [ ] Crear `locales/[lang]/profile.json` (completo)
- [ ] Crear `locales/[lang]/errors.json` (completo)
- [ ] Crear `locales/[lang]/validation.json` (completo)
- [ ] Duplicar estructura para todos los idiomas y traducir posteriormente

### Fase 3: Context y Componentes

- [ ] Crear `contexts/LanguageContext.tsx`
- [ ] Crear `components/ui/LanguageSelector.tsx`
- [ ] Crear pantalla de ajustes de idioma
- [ ] Crear hooks personalizados (`useFormattedDate`, `useFormattedNumber`)

### Fase 4: Migración de Textos

- [ ] Identificar todos los textos hardcodeados en la app
- [ ] Reemplazar textos por llamadas a `t('namespace:key')`
- [ ] Agregar accessibilityLabel traducidos
- [ ] Traducir placeholders de inputs
- [ ] Traducir mensajes de error

### Fase 5: Testing

- [ ] Probar cambio de idioma en todas las pantallas
- [ ] Verificar que no quedan textos hardcodeados
- [ ] Probar detección automática del idioma del dispositivo
- [ ] Verificar persistencia del idioma seleccionado
- [ ] Probar formateo de fechas en todos los idiomas
- [ ] Probar formateo de números y moneda

---

## 🎯 Casos Edge a Considerar

1. **Idioma no soportado del dispositivo**
   
   - Fallback a inglés automáticamente
   - Mostrar selector de idioma en onboarding

2. **Traducción faltante**
   
   - Mostrar clave en inglés (fallback language)
   - Log warning en desarrollo

3. **Cambio de idioma mientras se cargan datos**
   
   - Esperar a que termine la carga
   - Mostrar loading state durante cambio

4. **Variables con formato especial**
   
   - Fechas: usar Intl.DateTimeFormat
   - Números: usar Intl.NumberFormat
   - Moneda: usar Intl.NumberFormat con currency

5. **Textos muy largos en algunos idiomas**
   
   - Diseñar UI flexible (no anchos fijos)
   - Probar con idioma alemán (palabras largas)

6. **Dirección RTL (futuro)**
   
   - Preparar estructura para RTL
   - Usar i18n.dir() para detectar dirección

---

## 📚 Recursos Adicionales

- **i18next Docs:** https://www.i18next.com/
- **react-i18next Docs:** https://react.i18next.com/
- **Expo Localization:** https://docs.expo.dev/versions/latest/sdk/localization/
- **Intl API MDN:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl

---

## 📊 Métricas de Éxito

- [ ] 0 textos hardcodeados en la app
- [ ] 100% de pantallas traducidas
- [ ] Varios idiomas soportados
- [ ] Cambio de idioma < 100ms
- [ ] Type safety: TypeScript detecta claves faltantes
- [ ] Script de validación pasa sin errores
- [ ] Tests de i18n con 80%+ coverage

---

## **Dependencias:**

```bash
npm install i18next react-i18next
npm install @react-native-async-storage/async-storage
npx expo install expo-localization
```

**Archivos clave:**

- `utils/i18n.ts` - Configuración principal
- `contexts/LanguageContext.tsx` - Context para cambio de idioma
- `locales/[lang]/[namespace].json` - Traducciones
- `types/i18next.d.ts` - Type safety
