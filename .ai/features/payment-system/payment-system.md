Objetivo. Quiero un paywall que permita al usuario comprar y restaurar una suscripción, y que la app desbloquee “modo Pro” cuando el entitlement esté activo.

Contexto técnico. La app es Expo React Native. Asume que usaré development builds; no uses Expo Go. Usa el SDK oficial de RevenueCat para React Native.

Requisitos funcionales.

Configuración.

Añade e integra RevenueCat en el proyecto.

Lee la API key de RevenueCat desde variables de entorno.

Configura correctamente iOS y Android para IAP y RevenueCat, incluyendo los identificadores necesarios.

Inicializa RevenueCat al arrancar la app.

Modelo de acceso.

Define un único “entitlement” llamado “Pro”.

La app debe poder consultar en cualquier momento si el usuario tiene “pro” activo.

Estado global.

Crea un “SubscriptionProvider” o equivalente (context/store) que exponga:

isPro (boolean)

loading (boolean)

refresh/restore (función)

purchase (función)

Debe escuchar cambios de customerInfo y actualizar el estado sin reiniciar la app.

Paywall.

Crea una pantalla/modal de Paywall reutilizable.

Debe:

Cargar offerings actuales.

Mostrar paquetes disponibles (t('paywall:plans.monthly')/t('paywall:plans.annual') si existen).

Permitir comprar un paquete. (t('paywall:buttons.buy'))

Permitir restaurar compras. (t('common:buttons.restore'))

Mostrar errores de compra de forma clara y no romper la navegación.

Tras una compra exitosa, debe cerrar el paywall y reflejar “Pro” activo.

Guardas de acceso.

Implementa un mecanismo simple para proteger funcionalidades Pro:

Si el usuario intenta usar una función Pro sin suscripción, abrir el Paywall.

Si es Pro, permitir acceso.

Evita duplicar lógica; usa un helper/hook tipo requirePro().

Identidad de usuario.

Ya existe autenticación Supabase, asocia el userId a RevenueCat (logIn/logOut según corresponda).

No rompas el flujo actual de login.

Persistencia y UX.

El estado Pro debe estar disponible rápidamente al abrir la app (con caching razonable).

Añade un botón en Settings: t('profile:subscription.manage') y t('profile:subscription.restore').

No cambies el diseño general de la app; integra el paywall con el estilo existente.

Entregable.

Haz los cambios directamente en el código del proyecto. Aplicalos ya.

Incluye los nuevos archivos/componentes necesarios y modifica los existentes de forma mínima y segura.

Deja comentarios breves donde haya decisiones importantes.

Asegura que compila en iOS y Android (development build) y que no introduce errores de tipos o imports.

Ejecuta pruebas de validación de que el sistema de paywall y registro como usuario "Pro" funciona.
