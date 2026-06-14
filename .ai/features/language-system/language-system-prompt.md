# Prompt para implementar Internacionalización para habilitar múltiples idiomas en la aplicación

Implementa el sistema completo de internacionalización (i18n) de la aplicación siguiendo la especificación en:

`.ai/features/language-system/language-system-spec.md`

## Alcance:

Debes migrar a i18n el 100% de textos fijos visibles al usuario en TODO el repo:

- `app/**`, `components/**`, `screens/**`, `navigation/**`, `modals/**`, hooks que devuelvan textos UI
- Text, Button titles, placeholders, labels, empty states, errores visibles, confirmaciones, Alert.alert, toasts/snackbars
- accessibilityLabel / accessibilityHint visibles al usuario
- No traduzcas: console.log/warn/error ni logs técnicos internos.

## Requisitos:

1. Lee la especificación completa antes de empezar
2. Sigue el orden del checklist de implementación
3. Usa TypeScript estricto con type safety para traducciones
4. Todos los textos deben estar en archivos JSON, NO hardcodeados
5. Implementa los 4 idiomas iniciales: inglés, español, francés, alemán

## Instrucciones:

- Se autónomo con la implementación, no esperes confirmación del usuario
- Actualiza package.json y deja comandos sugeridos
- Instala dependencias necesarias (si trabajas en local)
- Crea estructura de carpetas `/locales`
- Configura `utils/i18n.ts`
- Crear archivos de validación en `scripts/` usando el código de `language-system-codesample.md`
- Crea `types/i18next.d.ts` para type safety
- Escanea el repo e identifica los archivos con textos hardcodeados de UI
- Migra archivo por archivo reemplazando literales por t().
- Rellena traducciones para .json para cada idioma manteniendo la misma estructura.
- Ejecuta el script de verificación de .json: `scripts/validate-translations.js`
- Ejecuta el script de verificación de .json: `scripts/validate-no-hardcoded-ui.js`
- Si quedan textos hardcodeados en UI, seguir migrando.

## Criterio de aceptación:

La tarea NO está terminada hasta que:

- El cambio de idioma afecta a todas las pantallas y componentes.
- La preferencia persiste tras reiniciar.
- No quedan textos hardcodeados visibles al usuario (excepto logs de consola).

## Respuesta para el usuario:

- Indica si te has leído la especificación completa
- Indica si el usuario debe completar algún paso
- Explica muy brevemente qué cambios has hecho
