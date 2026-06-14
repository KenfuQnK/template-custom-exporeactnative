# AGENTS.md

**Última actualización:** 2026-01-08

---

nota personal: revisar esto:
https://github.com/anthropics/skills
https://github.com/github/awesome-copilot/tree/main/skills


## 📝 Descripción General

Este proyecto es una aplicación construida con **Expo React Native** usando **NativeWind** (Tailwind CSS).

La aplicación está diseñada para ser compatible en entornos mobiles (android y ios) y de escritorio (web).

La descripción de la aplicación se encuentra aquí:
`.ai/description.md`

## 🎯 Stack Tecnológico

- **Framework:** Expo SDK 54 / React Native 0.76+
- **Lenguaje:** TypeScript con modo estricto
- **Estilos:** NativeWind 4.x (Tailwind CSS para React Native)
- **Navegación:** Expo Router (file-based routing)
- **Estado:** Context API + useReducer / Zustand (si aplica) --REVISAR!!!!!!!!!!!!!
- **Runtime:** Node.js v22.x
- **Package Manager:** npm

---

## 📁 Estructura del Proyecto

```
project-root/
├── app/                  # Expo Router - App directory (file-based routing)
│   ├── (tabs)/            # Tab navigation screens
│   ├── (auth)/            # Authentication flow
│   ├── (modals)/            # Modals
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── src/                  # Código fuente
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Componentes UI base
│   │   └── layout/           # Layouts y wrappers
│   ├── hooks/                # Lógica de React reutilizable
│   ├── context/              # Estado global de la aplicación 
│   ├── constants/            # Valores fijos que nunca cambian (claves API, URLs, configuraciones)
│   ├── utils/                # Funciones genéricas que se pueden utilizar en varios proyectos 
│   ├── lib/                  # Instancias de clientes externos (inicialización de los servicios)
│   ├── services/             # API calls y servicios externos 
│   ├── types/                # Definiciones de tipos TypeScript
├── assets/               # Recursos
│   ├── icons/             # Iconos (generalmente .svg)
│   ├── images/            # Imágenes (generalmente .png, .jpg)
│   ├── videos/            # Vídeos (generalmente .mp4)
│   ├── fonts/             # Fuentes (generalmente .ttf o .oft)
├── tailwind.config.js    # Configuración de Tailwind/NativeWind (colores, tamaños)
├── app.json              # Configuración de Expo
└── package.json          # Dependencias del proyecto
```

### Ubicación de Archivos Clave

- **Screens/Pages:** `app/` (usa Expo Router file-based routing)
- **Componentes UI:** `components/ui/` Componentes UI base (Button, Input, Card, etc.)
- **Estilos globales:** NativeWind en `tailwind.config.js` + clases inline
- **Assets estáticos:** `assets/` (imágenes en `assets/images/`, fuentes en `assets/fonts/`)
- **Tipos TypeScript:** `types/` o colocados con el archivo `.types.ts`
- **Funciones genéricas:** `utils/` Funciones genéricas que se pueden utilizar en varios proyectos 
- **Instancias de clientes externos:** `lib/`
- **API calls y servicios externos:** `services/` importar objetos iniciados en lib\ y usar sus funciones
- **Contexto global:** `context/` Estado global de la aplicación (Usuario logueado, Tema claro/oscuro) para no pasar datos manualmente entre componentes
- **Hooks:** `hooks/` funciones que empiezan por use...
- **Constantes:** `constants/` Valores fijos que nunca cambian (claves API, URLs, configuraciones)

## 📁 Estructura auxiliar del desarrollo del Proyecto

Estructura de carpetas auxiliares para el desarrollo y la integración de IA como copiloto de programación

```
project-root/
├── AGENTS.md           # Guía general del proyecto
├── .ai/                # Definiciones e instrucciones para IA
│   ├── features/          # Especificaciones de funcionalidades
│   ├── skills/            # Definición de funciones (cómo crear una Screen, cómo crear un Modal)
│   ├── context/           # Contexto adicional (estructura base de datos, documentación APIs)
│   └── description.md     # Descripción de la aplicación
├── .send/              # Ignorar, No usar (la uso yo para crear ficheros y enviarlos fuera)
├── .bkp/               # Ignorar, No usar (la uso yo para crear backups manuales)
├── _START.bat          # Ignorar, No usar (lo uso yo para rápidamente iniciar la aplicación)
```

---

## 🚀 Comandos de Desarrollo

### Instalación y Configuración

```bash
# Instalar dependencias
npm install

# Limpiar caché y reinstalar (si hay problemas)
npm run clean
npm install
```

### Desarrollo

```bash
# Iniciar desarrollo (abre Expo Dev Tools)
npm start

# Iniciar en iOS simulator
npm run ios

# Iniciar en Android emulator
npm run android

# Iniciar en web
npm run web

# Iniciar desarrollo remoto
npm start --tunnel

# Limpiar caché de Metro bundler
npm start -- --clear

# Limpiar caché e iniciar desarrollo remoto
npm start --tunnel --clear
```

### Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar un test específico
npm test -- <nombre-del-archivo>.test.tsx

# Generar coverage
npm test -- --coverage
```

### Linting y Formateo

```bash
# Ejecutar ESLint
npm run lint

# Corregir problemas de ESLint automáticamente
npm run lint:fix

# Formatear código con Prettier
npm run format

# Verificar formato sin modificar
npm run format:check
```

### Build y Production

```bash
# Build para producción (Android)
eas build --platform android

# Build para producción (iOS)
eas build --platform ios

# Build local
npx expo run:android
npx expo run:ios
```

### Type Checking

```bash
# Verificar tipos TypeScript
npm run type-check

# Verificar tipos en modo watch
npm run type-check:watch
```

---

## ⚠️ REGLAS MAESTRAS DE ARQUITECTURA

Actúa como un desarrollador experto en React Native (Expo Router), TypeScript e i18next. A partir de ahora, aplica estrictamente las siguientes reglas de arquitectura y estilo en todo el código que generes o corrijas:

### 1. Sistema de Módulos (Exports & Imports)

- **Carpeta `app/` y archivos de sistema:** OBLIGATORIO usar `export default` en cualquier archivo dentro de `app/` (páginas, layouts) y en archivos especiales como `+html.tsx`, `babel.config.js`, etc. Expo Router lo requiere.
- **Resto del proyecto (`components/`, `utils/`, `hooks/`, etc.):** OBLIGATORIO usar **Named Exports**.
  - *Correcto:* `export function MiComponente() {}`
  - *Correcto:* `export const miUtilidad = () => {}`
  - *Incorrecto:* `export default function...`
- **Imports:** Usa siempre llaves `{}` para los componentes propios (consecuencia de los Named Exports).
  - *Ejemplo:* `import { MiComponente } from '@/components/MiComponente';`

### 2. Internacionalización (i18n)

- **Textos de UI:** Si existe una carpeta de idiomas (`locales` o `locale`), todos los textos fijos de la interfaz deben implementarse mediante el sistema `i18next` usando la función `t`. Los textos deben registrarse en los archivos `.json` correspondientes.
- **Formato de claves:** Usa siempre el namespace explícito en cada llamada a `t`.
  - *Formato:* `t('namespace:clave')` o `t('namespace:objeto.clave')`.
- **Hook:** Declara siempre el namespace en el array de carga.
  - *Ejemplo:* `const { t } = useTranslation(['auth']);`
- **Instancia:** La configuración de i18n debe exportarse como `export { i18n };` al final del archivo, nunca como default.

### 3. Extensiones y Plataforma

- **Archivos específicos:** Usa `.native.tsx` para código móvil (iOS/Android) y `.web.tsx` (o `.tsx` estándar) para web.
- **Imports limpios:** Nunca importes la extensión en el código. Deja que el bundler decida.
  - *Correcto:* `import Boton from './Boton';` (El bundler elegirá `Boton.native` o `Boton.web`).
- **Configuración TS:** Asegura que `tsconfig.json` tiene `"moduleSuffixes": [".native", ".web", ""]`.

### 4. Rutas y Alias

- **Alias `@`:** Usa siempre el alias `@/` para importar archivos desde la raíz del proyecto para mantener uniformidad, en lugar de rutas relativas largas (`../../`).


### 5. React Hooks (Estricto)
- **Reglas de los Hooks:** NUNCA llames a un Hook (`useEffect`, `useCallback`, etc.) de forma condicional ni después de un retorno (`if (x) return`). Los Hooks deben estar siempre en el nivel superior del componente.
    * *Correcto:* `useEffect` antes de cualquier `if (loading) return null;`.
    * *Incorrecto:* `if (!data) return; useEffect(...)`.
- **Exhaustive Desp (Dependencias Exhaustivas):**
    * NUNCA desactives la regla de exhaustividad (`// eslint-disable-next-line react-hooks/exhaustive-deps`).
    * Analiza si falta alguna dependencia en `useEffect`, `useMemo` o `useCallback`.
    * Si una función es dependencia de un efecto, envuélvela en `useCallback` o muévela dentro del efecto.
    * Si un objeto es dependencia, asegura su estabilidad con `useMemo` o extrayendo propiedades primitivas.
- **Verificación:** Antes de dar por finalizada una tarea, ejecuta el linter para asegurar que no hay warnings de hooks (`npx eslint`).

### 6. JSX y Literales de Texto
- **Variables entre comillas:** Cuando sea necesario mostrar una variable envuelta en comillas dobles dentro de un componente JSX (como `<Text>`), utiliza siempre expresiones de llaves con literales de plantilla (backticks). Esto evita errores de lint y ambigüedades.
    * *Ejemplo:* `{`"${recommendation.message}"`}`
    * *Evitar:* `"${recommendation.message}"` o `"{recommendation.message}"` (si se busca consistencia con literales de plantilla).

Recuerda siempre estas restricciones al generar código.

---

## 💻 Estilo de Código

### TypeScript

- **Modo estricto:** `"strict": true` en `tsconfig.json`
- **Convenciones de nombres:**
  - Componentes: PascalCase (`LoginScreen`, `UserCard`)
  - Funciones/variables: camelCase (`getUserData`, `isLoading`)
  - Constantes: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
  - Tipos/Interfaces: PascalCase con prefijo `I` para interfaces (`IUser`, `IApiResponse`)
- **Preferir:**
  - `const` sobre `let`
  - Arrow functions en componentes funcionales
  - Tipos explícitos sobre inferencia cuando mejore la legibilidad
  - Interfaces sobre Types para objetos complejos
- **Evitar:**
  - `any` - Siempre tipificar correctamente
  - `var` - Usar `const` o `let`
  - Componentes de clase - Usar componentes funcionales con hooks

### NativeWind / Tailwind

- **Clases de utilidad:** Usar clases de Tailwind vía `className` prop
- **Diseño responsive:** Utilizar breakpoints (`sm:`, `md:`, `lg:`)
- **Temas:** Definir colores custom en `tailwind.config.js` bajo `theme.extend.colors`
- **Convenciones:**
  - Agrupar clases lógicamente (layout → spacing → typography → colors)
  - Ejemplo: `className="flex flex-row items-center justify-between px-4 py-2 bg-blue-500"`
  - Extraer componentes cuando las clases excedan 5-7 palabras
  - Usar `@apply` en casos extremos (preferir componentes)

### Componentes

**Estructura de archivo:**

```typescript
// 1. Imports
import { View, Text } from 'react-native'
import { useNavigation } from 'expo-router'

// 2. Types/Interfaces
interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
}

// 3. Component
export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable 
      onPress={onPress}
      className={`px-6 py-3 rounded-lg ${
        variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'
      }`}
    >
      <Text className="text-white font-semibold">{title}</Text>
    </Pressable>
  )
}
```

**Reglas:**

- Un componente por archivo (excepto componentes helper pequeños)
- Exportar como named export (ver Reglas Maestras)
- Props interface siempre antes del componente
- Comentar lógica compleja, no código obvio

### Hooks Personalizados

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Authentication logic
  }, [])

  return { user, loading, login, logout }
}
```

- Prefijo `use` obligatorio
- Retornar objetos para múltiples valores
- Documentar efectos secundarios

---

## 🚀IMPLEMENTACIÓN

### Objetivo

Tu prioridad es entregar cambios que funcionen a la primera.
Evita cambios grandes y evita refactors innecesarios. Solo hazlo si el usuario lo pide.

### Reglas no negociables

- No cambies el esquema de base de datos ni la estructura de datos si no se pide explícitamente.
- No añadas dependencias nuevas sin pedirlo primero y justificarlo.
- Nunca devuelvas una respuesta final vacía en el chat.
- Si hay un bug, arregla la causa raíz y haz el cambio mínimo.

### Flujo obligatorio cuando el usuario reporta un bug

1. Reproduce el problema con el caso exacto que aporta el usuario.
2. Encuentra dónde ocurre la transformación que provoca el bug.
3. Aplica un fix mínimo y local.
4. Añade logs que demuestren el orden real de ejecución.
5. Valida con casos de prueba manuales y con los scripts existentes del proyecto.

Si falta información para reproducir, pide solo lo mínimo necesario.

### Logs obligatorios para tareas de chat y tools

Usa prefijos constantes para que el usuario pueda verificar el orden.

### Entrega esperada en cada cambio

- Lista de archivos modificados.
- Breve explicación del cambio.
- Si aplica, propuesta de cómo tiene que probarlo el usuario.

- **Asesoramiento Técnico:** Si el usuario propone algo poco convencional, una mala práctica, o una solución poco escalable, insegura o difícil de mantener, debes advertirlo y proponer una alternativa robusta y profesional.
- **Calidad de Código:** Evita soluciones de baja calidad o "provisionales". No utilices técnicas obsoletas o discontinuadas; propón siempre cambios seguros y alineados con las mejores prácticas actuales.
- **Gestión de Feedback Crítico:** Si el usuario se comunica en mayúsculas, indica una insatisfacción importante con el trabajo previo. En estos casos, realiza un análisis profundo de lo ocurrido y asegura una corrección impecable.
- **Integridad Técnica (Zero Errors):** Verifica meticulosamente que no exista ni un solo error de código. El IDE no debe marcar ninguna línea como error; la corrección técnica es incondicional.

### Instrucciones específicas

- **Consulta de Estándares:** Ante cualquier petición de una nueva funcionalidad, consulta obligatoriamente la carpeta `.ai/` (o `%UserProfile%/.ai` si no existe en el proyecto) para revisar ejemplos de implementación y seguir los patrones establecidos.
- **Contexto Adicional:** Lee siempre los ficheros de la carpeta `.ai/` para validar si la petición encaja en alguna de las especificaciones existentes:

```
project-root/
├── .ai/                   # Carpeta con ficheros de lectura obligatoria para agentes de IA
│   ├── features/          # Especificaciones completas de implementaciones de gran escala
│   └── skills/            # Instrucciones detalladas para funciones específicas
```

---

## 🧪 Testing ------- REVISAR!!!!!!!!!!

### Herramientas

- **Jest:** Test runner y assertion library
- **React Native Testing Library:** Para testing de componentes
- **Jest Native:** Matchers específicos para React Native

### Convenciones

```typescript
// ComponentName.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from './Button'

describe('Button', () => {
  it('debería renderizar correctamente', () => {
    const { getByText } = render(<Button title="Click me" onPress={() => {}} />)
    expect(getByText('Click me')).toBeTruthy()
  })

  it('debería ejecutar onPress cuando se presiona', () => {
    const onPress = jest.fn()
    const { getByText } = render(<Button title="Click me" onPress={onPress} />)

    fireEvent.press(getByText('Click me'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
```

**Reglas:**

- Cada componente debe tener un archivo `.test.tsx` correspondiente
- Usar `describe` para agrupar tests relacionados
- Nombres de tests en español descriptivos: "debería [comportamiento esperado]"
- Probar casos edge: props undefined, arrays vacíos, strings largos
- Mock de servicios externos y API calls
- Coverage mínimo: 80% para componentes críticos

---

## 🎨 Diseño y UI

### Sistema de Diseño

- **Colores:** Definidos en `tailwind.config.js` bajo `theme.colors`
- **Tipografía:** Usar clases de Tailwind (`text-sm`, `text-lg`, `font-bold`)
- **Espaciado:** Sistema de 4px (usar `p-1`, `p-2`, `m-4`, etc.)
- **Componentes base:** Mantener en `components/ui/` (Button, Input, Card, Modal)

### Accesibilidad (a11y)

- **Siempre incluir:**
  - `accessibilityLabel` en elementos interactivos
  - `accessibilityHint` cuando la acción no sea obvia
  - `accessibilityRole` apropiado (button, header, link, etc.)
- **Tamaños mínimos:** 44x44px para elementos táctiles (iOS HIG)
- **Contraste:** WCAG AA mínimo (4.5:1 para texto normal)

### Responsive Design

```typescript
// Usar breakpoints de Tailwind
<View className="flex-col md:flex-row lg:grid lg:grid-cols-3">
  {/* Content */}
</View>
```

---

## 🔐 Seguridad y Mejores Prácticas

### API y Datos Sensibles

- **NUNCA** commitear API keys o secretos
- Usar variables de entorno: `.env` + `expo-constants`
- Validar inputs del usuario (usar Zod o Yup)
- Sanitizar datos antes de mostrarlos

### Gestión de Estado

- **Simple:** Context API + useReducer
- **Medio:** Zustand (si se usa)
- **Complejo:** Redux Toolkit (solo si es necesario)
- **Evitar:** State en componentes padre cuando puede ser local

### Performance

- **Optimizar listas:** Usar `FlatList` con `keyExtractor` y `getItemLayout`
- **Memoización:** `useMemo`, `useCallback`, `React.memo` para prevenir re-renders
- **Imágenes:** Optimizar tamaños, usar formatos modernos (WebP)
- **Bundle size:** Lazy load screens con Expo Router

### Gestión de errores

- **Try-catch:** Implementar en funciones críticas
- **Error boundaries:** Usar `ErrorBoundary` para componentes complejos
- **Logging:** Añade console.log() para depuración de errores

### Commits

- Si git status muestra cambios inesperados, asume que un humano puede estar editando. Pregunta antes de usar comandos de reset.

---

## 🐛 Debugging

### Herramientas

```bash
# Abrir React DevTools
npm run react-devtools

# Logs en desarrollo
console.log() # Eliminar antes de commit

# Debugging remoto
# Shake device → Debug Remote JS → Chrome DevTools
```

### Common Issues

**Error: "Metro bundler failed to start"**

```bash
npm start -- --clear
rm -rf node_modules
npm install
```

**Error de tipos TypeScript:**

```bash
npm run type-check
```

**NativeWind no aplica estilos:**

- Verificar `tailwind.config.js` está correctamente configurado
- Reiniciar Metro bundler
- Verificar import de `nativewind/babel` en `babel.config.js`

---

## 🔄 Workflow de Git

### Commits

- **Formato:** Conventional Commits
  
  ```
  feat: agregar pantalla de login
  fix: corregir crash en lista de usuarios
  docs: actualizar README con nuevos comandos
  style: formatear código con prettier
  refactor: extraer lógica de autenticación a custom hook
  test: agregar tests para componente Button
  chore: actualizar dependencias
  ```

### Branches

```bash
main              # Producción estable
develop           # Desarrollo activo
feature/login     # Nueva funcionalidad
bugfix/crash-fix  # Corrección de bugs
hotfix/critical   # Fixes urgentes de producción
```

### Pull Requests

**Antes de abrir un PR:**

1. Ejecutar linting: `npm run lint`
2. Ejecutar tests: `npm test`
3. Verificar tipos: `npm run type-check`
4. Probar en iOS y Android (si aplica cambios UI)

**Checklist del PR:**

- [ ] Tests agregados/actualizados
- [ ] Linting pasa sin errores
- [ ] Types correctos sin `any`
- [ ] Documentación actualizada si aplica
- [ ] Screenshots/video si hay cambios UI
- [ ] Probado en ambas plataformas (iOS + Android)

---

## 📦 Dependencias y Versiones

### Mantener Actualizado

```bash
# Ver outdated packages
npm outdated

# Actualizar minor/patch versions
npm update

# Actualizar major versions (con cuidado)
npm install <package>@latest
```

### Agregar Nueva Dependencia

```bash
# Para Expo managed workflow
npx expo install <package>

# Para dependencias nativas
npx expo install <native-package>
```

**IMPORTANTE:** Siempre verificar compatibilidad con Expo SDK actual en [Expo docs](https://docs.expo.dev/)

---

## 📝 Notas para AI/Agentes

### Al Generar Código

1. **SIEMPRE usar TypeScript** con tipos explícitos
2. **SIEMPRE usar NativeWind** (clases de Tailwind) para estilos - NO `StyleSheet.create()`
3. **SIEMPRE incluir** props interface antes del componente
4. **SIEMPRE agregar** accessibilityLabel en elementos interactivos
5. **PREFERIR** componentes funcionales con hooks sobre clases
6. **PREFERIR** named exports + default export
7. **EVITAR** `any` - tipar correctamente o usar `unknown`
8. **EVITAR** código duplicado - extraer a funciones/componentes reutilizables

### Al Hacer Cambios

- **LEER** primero los archivos relacionados para entender el contexto
- **MANTENER** convenciones existentes del proyecto
- **AGREGAR** tests cuando se crea nueva funcionalidad
- **ACTUALIZAR** tipos cuando se modifican interfaces
- **DOCUMENTAR** lógica compleja con comentarios claros
- **PROBAR** cambios antes de marcar como completos

### Al Crear Tests

- Cubrir casos happy path y edge cases
- Mock de servicios externos (API, storage)
- Verificar accesibilidad (labels, roles)
- Probar interacciones de usuario (press, scroll, input)

### Estructura de Respuesta Esperada

Cuando se te pida hacer cambios:

```markdown
## Cambios Realizados

1. [Descripción del cambio]
   - Archivo modificado: `path/to/file.tsx`
   - Razón: [Por qué se hizo este cambio]

## Archivos Afectados

- `app/screens/Login.tsx` - Agregado validación de email
- `components/ui/Button.tsx` - Nuevo variant "outline"
- `types/user.types.ts` - Agregado campo `phoneNumber`

## Tests Agregados

- `Login.test.tsx` - Validación de formulario
- `Button.test.tsx` - Nuevo variant

## Siguiente Paso Sugerido

[Qué hacer después o qué falta por hacer]
```

---

## 🎯 Objetivos de Calidad

- ✅ **100% TypeScript** - Sin archivos `.js` o `.jsx`
- ✅ **0 errores de linting** - Ejecutar antes de commit
- ✅ **80%+ test coverage** - Para componentes críticos
- ✅ **Accesibilidad WCAG 2.1 Level AA** - Mínimo
- ✅ **Performance:** 60 FPS en dispositivos mid-range
- ✅ **Bundle size:** < 5MB para app base

---

## 🚨 Reglas Críticas

### NUNCA:

- ❌ Commitear código sin tipar (`any` sin justificación)
- ❌ Usar `StyleSheet.create()` - SOLO NativeWind/Tailwind
- ❌ Omitir accessibilityLabel en elementos interactivos
- ❌ Ignorar warnings de TypeScript o ESLint
- ❌ Hacer commits directos a `main`
- ❌ Pushear código sin ejecutar `npm test`

### SIEMPRE:

- ✅ Ejecutar `npm run lint` antes de commit
- ✅ Agregar tests para nueva funcionalidad
- ✅ Usar tipos TypeScript explícitos
- ✅ Seguir convenciones de nombres del proyecto
- ✅ Documentar funciones/componentes complejos
- ✅ Probar en ambas plataformas (iOS + Android)

---

## 📚 Recursos Útiles

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- **NativeWind Docs:** https://www.nativewind.dev/
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **React Navigation:** https://reactnavigation.org/ (si se usa) REVISAAAAAAAAAAAAAAAAAR
- **Expo Router:** https://expo.github.io/router/docs/

---

## 🆘 Obtener Ayuda

1. **Revisar documentación** del framework/librería específica
2. **Buscar en issues** del proyecto si ya fue reportado
3. **Stack Overflow** con tags: `expo`, `react-native`, `nativewind`
4. **Expo Forums:** https://forums.expo.dev/
5. **Discord:** Expo, React Native, Tailwind communities

---

**Versión Node.js:** v22.x  
**Versión Expo SDK:** 52+  
**Versión React Native:** 0.76+  
**Versión NativeWind:** 4.x
