# Especificación: Sistema de Temas y Diseño

**Última actualización:** 2026-01-08
**Versión:** 1.0

---

## 📋 Resumen Ejecutivo

Implementar un sistema de gestión de temas dinámico que permita cambiar entre modo Claro, Oscuro y Automático (Sistema). El sistema debe estar integrado con `NativeWind` para aplicar estilos condicionales y persistir la preferencia del usuario entre sesiones.

---

## 🎯 Objetivos del Sistema

### Funcionales

- ✅ Cambiar manualmente entre temas: `light`, `dark`, `system`.
- ✅ Detectar y responder automáticamente cambios en el sistema operativo (si está en modo `system`).
- ✅ Persistir la elección del usuario (AsyncStorage/MMKV).
- ✅ Aplicar colores, fondos y textos consistentes globalmente.
- ✅ Evitar "flashback" (parpadeo de tema incorrecto) al abrir la app.

### No Funcionales

- ✅ Arquitectura escalable para futuros temas "custom" (ej: Azul, Naranja, etc.).
- ✅ Centralización de tokens de diseño (Design Tokens).

---

## 🗺️ Paleta y Tokens (Design System)

El sistema se basa en tokens definidos en `tailwind.config.js`.

### Colores Semánticos (Ejemplo Genérico)

| Token Tailwind | Modo Light (Hex) | Modo Dark (Hex) | Uso |
| :--- | :--- | :--- | :--- |
| `bg-background` | `#FFFFFF` | `#0A0A0A` | Fondo principal de pantallas |
| `bg-card` | `#F5F5F5` | `#171717` | Fondo de tarjetas, modales |
| `text-foreground` | `#0F172A` | `#F8FAFC` | Texto principal (títulos) |
| `text-muted` | `#64748B` | `#94A3B8` | Texto secundario (subtítulos) |
| `primary` | `#4F46E5` | `#6366F1` | Botones de acción, enlaces activos |
| `destructive` | `#EF4444` | `#EF4444` | Errores, eliminar |

---

## 🎨 Pantallas y Componentes

### Pantallas Requeridas

#### 1. **AppearanceScreen** (`app/settings/appearance.tsx`)

```typescript
// Layout
- Título: "Apariencia"
- Sección: "Tema"
  - Opción: "Automático (Sistema)" (Radio Button / Check)
  - Opción: "Claro" (Radio Button / Check)
  - Opción: "Oscuro" (Radio Button / Check)
- Preview: Una pequeña "tarjeta" de ejemplo que cambia en tiempo real para mostrar cómo se ve el tema seleccionado.
```

### Componentes Lógicos

#### 1. **ThemeProvider** (`components/theme/ThemeProvider.tsx`)

Debe envolver la raíz de la aplicación (`app/_layout.tsx`).

```typescript
// Responsabilidades:
// 1. Cargar tema guardado al iniciar.
// 2. Escuchar cambios de sistema (useColorScheme).
// 3. Proveer contexto `useTheme()`.
// 4. Inyectar clases/contexto a NativeWind.
```

---

## 🔐 Lógica e Implementación

### Contexto: `context/ThemeContext.tsx`

```typescript
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode; // La preferencia del usuario
  actualTheme: 'light' | 'dark'; // El tema visual actual (resuelto)
  setTheme: (theme: ThemeMode) => void;
}
```

### Integración con NativeWind

En `tailwind.config.js`:

```javascript
module.exports = {
  darkMode: 'class', // Importante para control manual
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Definir variables CSS o usar clases condicionales
      }
    }
  }
}
```

Para simplificar con NativeWind v2/v4, a menudo se usa la estrategia de colores directos o variables CSS si se soporta web. Para React Native puro con NativeWind, la mejor estrategia es confiar en las clases `dark:` y controlar la clase raíz o el `ColorScheme` de NativeWind.

```typescript
import { useColorScheme } from 'nativewind';

// En el componente Switch
const { colorScheme, setColorScheme } = useColorScheme();

const toggleTheme = () => {
  setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
};
```

Sin embargo, para soportar la opción 'system' explícitamente y persistencia, necesitamos un wrapper.

### Algoritmo de Resolución de Tema

1. **Al inicio**: Leer almacenamiento local (`THEME_PREFERENCE`).
2. **Si es null/undefined**: Asumir 'system'.
3. **Si es 'system'**: Usar `Appearance.getColorScheme()` de React Native.
4. **Si es 'light'/'dark'**: Forzar ese modo.
5. **Al cambiar**: Guardar en almacenamiento y actualizar estado.

---

## 🧪 Casos de Prueba

1. **Persistencia**:
   - Seleccionar "Oscuro".
   - Cerrar app (kill process).
   - Abrir app -> Debe iniciar en "Oscuro" sin parpadeo blanco.

2. **Modo Sistema**:
   - Seleccionar "Sistema".
   - Cambiar configuración de iOS/Android a Dark Mode.
   - App debe cambiar a Dark automáticamente.

3. **Reset**:
   - El usuario debe poder ver claramente qué opción está activa.
