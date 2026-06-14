# Prompt para implementar Sistema de Autentificación de Usuarios

Implementa el sistema completo de autenticación de usuarios siguiendo la especificación en:

`.ai/features/authentification-system/auth-system-spec.md`

## Requisitos:

1. Lee toda la especificación antes de empezar
2. Sigue el orden de implementación del checklist
3. Usa TypeScript estricto y NativeWind para estilos
4. Agrega comentarios en español para lógica compleja
5. Implementa TODOS los casos edge mencionados
6. Agrega tests para funcionalidad crítica
7. Asegura accesibilidad (accessibilityLabel en todos los elementos interactivos)

## Instrucciones:

- Se autonomo con la implementación, no esperes confirmación del usuario
- Instala las dependencias necesarias
- Si es necesario, genera le SQL para que el usuario pueda ejecutar en Supabase
- Indica si el usuario debe completar algún paso
- Explica muy brevemente qué cambios has hecho

## Notas:

- Todos los casos edge están considerados
- Sigue las mejores prácticas de seguridad (RLS, encriptación, validaciones)
- Es accesible (WCAG 2.1 AA)
- Es internacionalizable (i18n ready)
- Tiene tests unitarios y de integración
- Maneja errores gracefully
