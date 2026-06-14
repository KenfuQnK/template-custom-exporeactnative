# Prompt para implementar Sistema de Temas (Theming System)

Implementa el sistema de tematización (Dark/Light/System + Custom Themes) siguiendo la especificación en:

`.ai/features/themes-system/themes-system-spec.md`

## Requisitos:

1. Lee toda la especificación antes de empezar
2. Integra el sistema con `NativeWind` (TailwindCSS)
3. Persiste la preferencia del usuario (AsyncStorage o MementoPattern)
4. Sigue el checklist de implementación
5. Asegura que no haya "flash of wrong theme" al iniciar la app

## Instrucciones:

- Se autonomo.
- Define la estructura de tokens de diseño (colores, fuentes) en `tailwind.config.js`.
- Crea un `ThemeContext` o Store para gestionar el estado global.
- Implementa componentes que reaccionen al cambio de tema.
- Implementa la pantalla de selección de tema.

## Notas:

- EL objetivo es permitir cambiar entre Claro, Oscuro y "Sistema".
- (Opcional) Si la arquitectura lo permite, dejar preparado para paletas de colores personalizadas.
