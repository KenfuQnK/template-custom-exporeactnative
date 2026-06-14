# Especificación: Sistema de Internacionalización (i18n)

**Última actualización:** 2025-12-29

**Versión:** 2.0

---

## 🗂️ Archivos de Traducción

### Estructura de Namespaces

Organizar traducciones por funcionalidad en archivos separados:

#### 1. common.json (Elementos comunes de UI)

```json
{
  "buttons": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "create": "Crear",
    "confirm": "Confirmar",
    "back": "Volver",
    "next": "Siguiente",
    "finish": "Finalizar",
    "close": "Cerrar",
    "ok": "Aceptar",
    "yes": "Sí",
    "no": "No",
    "loading": "Cargando...",
    "retry": "Reintentar"
  },
  "navigation": {
    "home": "Inicio",
    "profile": "Perfil",
    "settings": "Ajustes",
    "notifications": "Notificaciones",
    "search": "Buscar"
  },
  "time": {
    "now": "Ahora",
    "today": "Hoy",
    "yesterday": "Ayer",
    "tomorrow": "Mañana",
    "daysAgo_one": "Hace {{count}} día",
    "daysAgo_other": "Hace {{count}} días",
    "hoursAgo_one": "Hace {{count}} hora",
    "hoursAgo_other": "Hace {{count}} horas",
    "minutesAgo_one": "Hace {{count}} minuto",
    "minutesAgo_other": "Hace {{count}} minutos"
  },
  "messages": {
    "success": "Operación exitosa",
    "error": "Ha ocurrido un error",
    "noData": "No hay datos disponibles",
    "noResults": "No se encontraron resultados",
    "loading": "Cargando...",
    "refreshing": "Actualizando...",
    "emptyList": "La lista está vacía",
    "connectionError": "Error de conexión. Verifica tu internet",
    "tryAgain": "Intenta de nuevo"
  },
  "confirmation": {
    "deleteTitle": "¿Eliminar?",
    "deleteMessage": "Esta acción no se puede deshacer",
    "unsavedChangesTitle": "Cambios sin guardar",
    "unsavedChangesMessage": "Tienes cambios sin guardar. ¿Deseas salir?",
    "logoutTitle": "Cerrar sesión",
    "logoutMessage": "¿Estás seguro que deseas cerrar sesión?"
  }
}
```

#### 2. auth.json (Autenticación)

```json
{
  "welcome": {
    "title": "Bienvenido",
    "subtitle": "Tu app favorita",
    "createAccount": "Crear cuenta",
    "alreadyHaveAccount": "Ya tengo cuenta"
  },
  "login": {
    "title": "Iniciar sesión",
    "email": "Correo electrónico",
    "emailPlaceholder": "tu@email.com",
    "password": "Contraseña",
    "passwordPlaceholder": "Introduce tu contraseña",
    "rememberMe": "Recordarme",
    "forgotPassword": "¿Olvidaste tu contraseña?",
    "submit": "Iniciar sesión",
    "createAccount": "Crear cuenta nueva",
    "orContinueWith": "O continuar con"
  },
  "register": {
    "title": "Crear cuenta",
    "fullName": "Nombre completo",
    "fullNamePlaceholder": "Juan Pérez",
    "email": "Correo electrónico",
    "emailPlaceholder": "tu@email.com",
    "password": "Contraseña",
    "passwordPlaceholder": "Mínimo 8 caracteres",
    "confirmPassword": "Confirmar contraseña",
    "confirmPasswordPlaceholder": "Repite tu contraseña",
    "terms": "Acepto los {{termsLink}} y {{privacyLink}}",
    "termsLink": "términos y condiciones",
    "privacyLink": "política de privacidad",
    "submit": "Registrarse",
    "alreadyHaveAccount": "¿Ya tienes cuenta? {{loginLink}}",
    "loginLink": "Inicia sesión"
  },
  "forgotPassword": {
    "title": "¿Olvidaste tu contraseña?",
    "subtitle": "Te enviaremos instrucciones a tu correo",
    "email": "Correo electrónico",
    "emailPlaceholder": "tu@email.com",
    "submit": "Enviar instrucciones",
    "backToLogin": "Volver a inicio de sesión",
    "successMessage": "Te hemos enviado un correo con instrucciones"
  },
  "verifyEmail": {
    "title": "Verifica tu correo",
    "message": "Te hemos enviado un correo a {{email}}",
    "instructions": "Revisa tu bandeja de entrada y spam",
    "resendButton": "Reenviar correo",
    "resendCooldown": "Reenviar en {{seconds}}s",
    "alreadyVerified": "¿Ya verificaste? {{loginLink}}",
    "loginLink": "Inicia sesión",
    "resendSuccess": "Correo reenviado correctamente"
  },
  "resetPassword": {
    "title": "Restablecer contraseña",
    "newPassword": "Nueva contraseña",
    "newPasswordPlaceholder": "Mínimo 8 caracteres",
    "confirmPassword": "Confirmar contraseña",
    "confirmPasswordPlaceholder": "Repite tu nueva contraseña",
    "submit": "Actualizar contraseña",
    "successMessage": "Contraseña actualizada correctamente",
    "successDescription": "Ya puedes iniciar sesión con tu nueva contraseña"
  }
}
```

#### 3. profile.json (Perfil de usuario)

```json
{
  "title": "Perfil",
  "editProfile": "Editar perfil",
  "sections": {
    "personal": "Información personal",
    "preferences": "Preferencias",
    "security": "Seguridad",
    "danger": "Zona peligrosa"
  },
  "fields": {
    "avatar": "Foto de perfil",
    "changeAvatar": "Cambiar foto",
    "removeAvatar": "Eliminar foto",
    "fullName": "Nombre completo",
    "fullNamePlaceholder": "Juan Pérez",
    "email": "Correo electrónico",
    "emailVerified": "Verificado",
    "emailNotVerified": "No verificado",
    "phone": "Teléfono",
    "phonePlaceholder": "+34 600 000 000",
    "language": "Idioma",
    "theme": "Tema",
    "notifications": "Notificaciones"
  },
  "languages": {
    "es": "Español",
    "en": "English",
    "ca": "Català"
  },
  "themes": {
    "light": "Claro",
    "dark": "Oscuro",
    "auto": "Automático"
  },
  "actions": {
    "save": "Guardar cambios",
    "changePassword": "Cambiar contraseña",
    "logout": "Cerrar sesión",
    "deleteAccount": "Eliminar cuenta"
  },
  "messages": {
    "saveSuccess": "Perfil actualizado correctamente",
    "saveError": "Error al guardar cambios",
    "avatarTooBig": "La imagen es muy grande (máx. 2MB)",
    "avatarUploadError": "Error al subir la imagen"
  },
  "confirmations": {
    "logout": "¿Estás seguro que deseas cerrar sesión?",
    "deleteAccount": "¿Estás seguro? Esta acción es irreversible",
    "deleteAccountWarning": "Se eliminarán todos tus datos permanentemente"
  }
}
```

#### 4. errors.json (Mensajes de error)

```json
{
  "auth": {
    "invalidCredentials": "Correo o contraseña incorrectos",
    "emailAlreadyExists": "Este correo ya está registrado",
    "emailNotVerified": "Debes verificar tu correo antes de continuar",
    "weakPassword": "La contraseña es muy débil",
    "userNotFound": "Usuario no encontrado",
    "tooManyRequests": "Demasiados intentos. Intenta más tarde",
    "networkError": "Error de conexión. Verifica tu internet",
    "sessionExpired": "Tu sesión ha expirado. Inicia sesión nuevamente"
  },
  "validation": {
    "required": "Este campo es obligatorio",
    "invalidEmail": "Correo electrónico inválido",
    "invalidPhone": "Número de teléfono inválido",
    "passwordTooShort": "La contraseña debe tener al menos {{min}} caracteres",
    "passwordMismatch": "Las contraseñas no coinciden",
    "invalidFormat": "Formato inválido",
    "minLength": "Mínimo {{min}} caracteres",
    "maxLength": "Máximo {{max}} caracteres",
    "mustBeNumber": "Debe ser un número",
    "mustBePositive": "Debe ser un número positivo",
    "invalidUrl": "URL inválida",
    "invalidDate": "Fecha inválida",
    "dateTooOld": "La fecha es muy antigua",
    "dateTooRecent": "La fecha es muy reciente"
  },
  "network": {
    "offline": "Sin conexión a internet",
    "timeout": "La solicitud ha tardado demasiado",
    "serverError": "Error del servidor. Intenta más tarde",
    "notFound": "Recurso no encontrado",
    "unauthorized": "No autorizado. Inicia sesión nuevamente",
    "forbidden": "No tienes permiso para realizar esta acción"
  },
  "general": {
    "unknown": "Ha ocurrido un error desconocido",
    "tryAgain": "Intenta de nuevo",
    "contactSupport": "Si el problema persiste, contacta con soporte"
  }
}
```

#### 5. validation.json (Validaciones de formularios)

```json
{
  "email": {
    "required": "El correo es obligatorio",
    "invalid": "Correo inválido",
    "alreadyExists": "Este correo ya está registrado"
  },
  "password": {
    "required": "La contraseña es obligatoria",
    "tooShort": "Mínimo 8 caracteres",
    "noUppercase": "Debe contener al menos una mayúscula",
    "noNumber": "Debe contener al menos un número",
    "noSpecialChar": "Recomendado: incluir un carácter especial (!@#$%)",
    "mismatch": "Las contraseñas no coinciden",
    "strength": {
      "weak": "Débil",
      "medium": "Media",
      "strong": "Fuerte"
    }
  },
  "name": {
    "required": "El nombre es obligatorio",
    "tooShort": "El nombre debe tener al menos 2 caracteres",
    "tooLong": "El nombre es muy largo (máx. 50 caracteres)",
    "invalidChars": "El nombre contiene caracteres inválidos"
  },
  "phone": {
    "required": "El teléfono es obligatorio",
    "invalid": "Número de teléfono inválido",
    "tooShort": "Número muy corto",
    "tooLong": "Número muy largo"
  },
  "terms": {
    "required": "Debes aceptar los términos y condiciones"
  }
}
```

---

## 🔧 Configuración de i18next

### Archivo: `utils/i18n.ts`

```typescript
import { i18n } from '@/utils/i18n';
import { initReactI18next } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'

// Importar traducciones
import enCommon from '@/locales/en/common.json'
import enAuth from '@/locales/en/auth.json'
import enProfile from '@/locales/en/profile.json'
import enErrors from '@/locales/en/errors.json'
import enValidation from '@/locales/en/validation.json'

import esCommon from '@/locales/es/common.json'
import esAuth from '@/locales/es/auth.json'
import esProfile from '@/locales/es/profile.json'
import esErrors from '@/locales/es/errors.json'
import esValidation from '@/locales/es/validation.json'

import frCommon from '@/locales/fr/common.json'
import frAuth from '@/locales/fr/auth.json'
import frProfile from '@/locales/fr/profile.json'
import frErrors from '@/locales/fr/errors.json'
import frValidation from '@/locales/fr/validation.json'

import deCommon from '@/locales/de/common.json'
import deAuth from '@/locales/de/auth.json'
import deProfile from '@/locales/de/profile.json'
import deErrors from '@/locales/de/errors.json'
import deValidation from '@/locales/de/validation.json'

// Clave para AsyncStorage
const LANGUAGE_KEY = '@app_language'

// Idiomas soportados
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'French',
  de: 'German',
} as const

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES

// Recursos de traducción
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    profile: enProfile,
    errors: enErrors,
    validation: enValidation,
  },
  es: {
    common: esCommon,
    auth: esAuth,
    profile: esProfile,
    errors: esErrors,
    validation: esValidation,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    profile: frProfile,
    errors: frErrors,
    validation: frValidation,
  },
  de: {
    common: deCommon,
    auth: deAuth,
    profile: deProfile,
    errors: deErrors,
    validation: deValidation,
  },
}

// Plugin personalizado para persistencia
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // 1. Intentar obtener idioma guardado
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY)

      if (savedLanguage) {
        callback(savedLanguage)
        return
      }

      // 2. Usar idioma del dispositivo
      const deviceLanguage = Localization.locale.split('-')[0]
      const supportedLanguage = Object.keys(SUPPORTED_LANGUAGES).includes(deviceLanguage)
        ? deviceLanguage
        : 'en' // Fallback a inglés

      callback(supportedLanguage)
    } catch (error) {
      console.error('Error detecting language:', error)
      callback('en') // Fallback en caso de error
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language)
    } catch (error) {
      console.error('Error saving language:', error)
    }
  },
}

// Inicializar i18next
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Idioma por defecto si falta traducción
    defaultNS: 'common', // Namespace por defecto
    ns: ['common', 'auth', 'profile', 'errors', 'validation'],

    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },

    // Configuración de pluralización
    pluralSeparator: '_',

    // Configuración para desarrollo
    debug: __DEV__, // Solo mostrar logs en desarrollo

    // Configuración de reacción
    react: {
      useSuspense: false, // No usar Suspense (problemas en RN)
    },

    // Configuración de detección
    detection: {
      order: ['languageDetector'],
      caches: ['languageDetector'],
    },
  })

export i18n
```

---

## 🎨 Context para Cambio de Idioma

### Archivo: `contexts/LanguageContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import i18n, { SupportedLanguage, SUPPORTED_LANGUAGES } from '@/utils/i18n'

interface LanguageContextType {
  currentLanguage: SupportedLanguage
  changeLanguage: (language: SupportedLanguage) => Promise<void>
  supportedLanguages: typeof SUPPORTED_LANGUAGES
  isChanging: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n: i18nInstance } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    i18nInstance.language as SupportedLanguage
  )
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    // Listener para cambios de idioma
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng as SupportedLanguage)
    }

    i18nInstance.on('languageChanged', handleLanguageChange)

    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange)
    }
  }, [i18nInstance])

  const changeLanguage = async (language: SupportedLanguage) => {
    if (language === currentLanguage) return

    setIsChanging(true)

    try {
      await i18nInstance.changeLanguage(language)
      // El languageDetector guardará automáticamente en AsyncStorage
    } catch (error) {
      console.error('Error changing language:', error)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isChanging,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
```

---

## 🧩 Componente Selector de Idioma

### Archivo: `components/ui/LanguageSelector.tsx`

```typescript
import { View, Text, Pressable } from 'react-native'
import { useLanguage } from '@/contexts/LanguageContext'
import type { SupportedLanguage } from '@/utils/i18n'

interface LanguageSelectorProps {
  variant?: 'list' | 'buttons'
}

export function LanguageSelector({ variant = 'list' }: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage, supportedLanguages, isChanging } = useLanguage()

  if (variant === 'buttons') {
    return (
      <View className="flex-row gap-2">
        {(Object.keys(supportedLanguages) as SupportedLanguage[]).map((lang) => (
          <Pressable
            key={lang}
            onPress={() => changeLanguage(lang)}
            disabled={isChanging}
            className={`px-4 py-2 rounded-lg ${
              currentLanguage === lang
                ? 'bg-blue-500'
                : 'bg-gray-200'
            } ${isChanging ? 'opacity-50' : ''}`}
            accessibilityRole="button"
            accessibilityLabel={`Cambiar idioma a ${supportedLanguages[lang]}`}
            accessibilityState={{ selected: currentLanguage === lang }}
          >
            <Text
              className={`font-semibold ${
                currentLanguage === lang ? 'text-white' : 'text-gray-700'
              }`}
            >
              {supportedLanguages[lang]}
            </Text>
          </Pressable>
        ))}
      </View>
    )
  }

  return (
    <View className="gap-2">
      {(Object.keys(supportedLanguages) as SupportedLanguage[]).map((lang) => (
        <Pressable
          key={lang}
          onPress={() => changeLanguage(lang)}
          disabled={isChanging}
          className={`p-4 rounded-lg border ${
            currentLanguage === lang
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white'
          } ${isChanging ? 'opacity-50' : ''}`}
          accessibilityRole="radio"
          accessibilityLabel={supportedLanguages[lang]}
          accessibilityState={{ 
            checked: currentLanguage === lang,
            disabled: isChanging,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className={`text-base ${
                currentLanguage === lang ? 'font-bold text-blue-600' : 'text-gray-700'
              }`}
            >
              {supportedLanguages[lang]}
            </Text>
            {currentLanguage === lang && (
              <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
                <Text className="text-white text-xs">✓</Text>
              </View>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  )
}
```

---

## 🔤 Uso en Componentes

### Ejemplo 1: Texto Simple

```typescript
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'

function WelcomeScreen() {
  const { t } = useTranslation('auth')

  return (
    <>
      <Text className="text-2xl font-bold">
        {t('welcome.title')}
      </Text>
      <Text className="text-gray-600">
        {t('welcome.subtitle')}
      </Text>
    </>
  )
}
```

### Ejemplo 2: Interpolación de Variables

```typescript
import { useTranslation } from 'react-i18next'

function VerifyEmailScreen({ email }: { email: string }) {
  const { t } = useTranslation('auth')

  return (
    <Text>
      {t('verifyEmail.message', { email })}
    </Text>
  )
  // Resultado: "Te hemos enviado un correo a juan@example.com"
}
```

### Ejemplo 3: Pluralización

```typescript
import { useTranslation } from 'react-i18next'

function TimeAgo({ days }: { days: number }) {
  const { t } = useTranslation('common')

  return (
    <Text>
      {t('time.daysAgo', { count: days })}
    </Text>
  )
  // count: 1 → "Hace 1 día"
  // count: 5 → "Hace 5 días"
}
```

### Ejemplo 4: Múltiples Namespaces

```typescript
import { useTranslation } from 'react-i18next'

function LoginScreen() {
  const { t } = useTranslation(['auth', 'common', 'errors'])

  return (
    <>
      <Text>{t('auth:login.title')}</Text>
      <Button title={t('common:buttons.save')} />
      <Text className="text-red-500">
        {t('errors:auth.invalidCredentials')}
      </Text>
    </>
  )
}
```

### Ejemplo 5: Inputs con Placeholder Traducido

```typescript
import { useTranslation } from 'react-i18next'
import { TextInput } from 'react-native'

function EmailInput() {
  const { t } = useTranslation('auth')

  return (
    <TextInput
      placeholder={t('login.emailPlaceholder')}
      accessibilityLabel={t('login.email')}
    />
  )
}
```

---

## 📅 Formateo de Fechas

### Usando Expo Localization

```typescript
import { useTranslation } from 'react-i18next'
import { getCalendars } from 'expo-localization'

function useFormattedDate() {
  const { i18n } = useTranslation()
  const locale = i18n.language

  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date

    return new Intl.DateTimeFormat(locale, options).format(dateObj)
  }

  return { formatDate }
}

// Uso
function EventCard({ date }: { date: string }) {
  const { formatDate } = useFormattedDate()

  return (
    <>
      {/* Formato corto: 27/12/2024 */}
      <Text>{formatDate(date, { dateStyle: 'short' })}</Text>

      {/* Formato largo: 27 de diciembre de 2024 */}
      <Text>{formatDate(date, { dateStyle: 'long' })}</Text>

      {/* Con hora: 27/12/2024, 14:30 */}
      <Text>
        {formatDate(date, { 
          dateStyle: 'short',
          timeStyle: 'short',
        })}
      </Text>
    </>
  )
}
```

---

## 💰 Formateo de Números y Moneda

```typescript
import { useTranslation } from 'react-i18next'

function useFormattedNumber() {
  const { i18n } = useTranslation()
  const locale = i18n.language

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(locale).format(value)
  }

  const formatCurrency = (value: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return { formatNumber, formatCurrency, formatPercent }
}

// Uso
function PriceCard({ price }: { price: number }) {
  const { formatCurrency } = useFormattedNumber()

  return (
    <Text>{formatCurrency(price)}</Text>
    // ES: 123,45 €
    // EN: $123.45
  )
}
```

---

## 🧪 Type Safety con TypeScript

### Archivo: `types/i18next.d.ts`

```typescript
import 'i18next'

// Importar tipos de recursos
import common from '@/locales/es/common.json'
import auth from '@/locales/es/auth.json'
import profile from '@/locales/es/profile.json'
import errors from '@/locales/es/errors.json'
import validation from '@/locales/es/validation.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      auth: typeof auth
      profile: typeof profile
      errors: typeof errors
      validation: typeof validation
    }
  }
}
```

**Beneficio:** TypeScript detectará errores si usas una clave inexistente:

```typescript
// ✅ Correcto
t('auth:login.title')

// ❌ Error de TypeScript
t('auth:login.titleee') // "titleee" no existe
```

---

## 🔄 Integración con App

### Archivo: `app/_layout.tsx`

```typescript
import { useEffect } from 'react'
import { Slot } from 'expo-router'
import { I18nextProvider } from 'react-i18next'
import { i18n } from '@/utils/i18n';
import { LanguageProvider } from '@/contexts/LanguageContext'

export function RootLayout() {
  useEffect(() => {
    // Inicializar i18n (ya se hace en i18n.ts)
    // Aquí puedes agregar lógica adicional si es necesario
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <Slot />
      </LanguageProvider>
    </I18nextProvider>
  )
}
```

### Pantalla de Ajustes de Idioma

```typescript
// app/(tabs)/settings/language.tsx
import { View, Text, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

export function LanguageSettingsScreen() {
  const { t } = useTranslation('profile')

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-2">
          {t('fields.language')}
        </Text>
        <Text className="text-gray-600 mb-6">
          {t('fields.languageDescription')}
        </Text>

        <LanguageSelector variant="list" />
      </View>
    </ScrollView>
  )
}
```

---

## 🧪 Testing

### Test de Componente con i18n

```typescript
import { render } from '@testing-library/react-native'
import { I18nextProvider } from 'react-i18next'
import { i18n } from '@/utils/i18n';
import { LoginScreen } from './LoginScreen'

// Helper para renderizar con i18n
const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  )
}

describe('LoginScreen', () => {
  it('debe mostrar textos en inglés por defecto', async () => {
    await i18n.changeLanguage('en')

    const { getByText } = renderWithI18n(<LoginScreen />)

    expect(getByText('Iniciar sesión')).toBeTruthy()
    expect(getByText('Correo electrónico')).toBeTruthy()
  })

  it('debe cambiar textos al cambiar idioma', async () => {
    const { getByText, rerender } = renderWithI18n(<LoginScreen />)

    await i18n.changeLanguage('en')
    rerender(<LoginScreen />)

    expect(getByText('Log in')).toBeTruthy()
    expect(getByText('Email')).toBeTruthy()
  })
})
```

### Test de Hook useFormattedDate

```typescript
import { renderHook } from '@testing-library/react-hooks'
import { I18nextProvider } from 'react-i18next'
import { i18n } from '@/utils/i18n';
import { useFormattedDate } from '@/hooks/useFormattedDate'

const wrapper = ({ children }: any) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)

describe('useFormattedDate', () => {
  it('debe formatear fecha en español', async () => {
    await i18n.changeLanguage('es')

    const { result } = renderHook(() => useFormattedDate(), { wrapper })
    const formatted = result.current.formatDate(new Date('2024-12-27'), {
      dateStyle: 'long',
    })

    expect(formatted).toContain('diciembre')
  })

  it('debe formatear fecha en inglés', async () => {
    await i18n.changeLanguage('en')

    const { result } = renderHook(() => useFormattedDate(), { wrapper })
    const formatted = result.current.formatDate(new Date('2024-12-27'), {
      dateStyle: 'long',
    })

    expect(formatted).toContain('December')
  })
})
```

---

## 📊 Script de Validación de Traducciones

## Validar ficheros .json

### Archivo: `scripts/validate-translations.js`

```javascript
const fs = require('fs')
const path = require('path')

const LOCALES_DIR = path.join(__dirname, '../locales')
const LANGUAGES = ['en', 'es', 'fr', 'de']
const NAMESPACES = ['common', 'auth', 'profile', 'errors', 'validation']

function flattenObject(obj, prefix = '') {
  const result = {}

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey))
    } else {
      result[newKey] = value
    }
  }

  return result
}

function validateTranslations() {
  console.log('🔍 Validando traducciones...\n')

  let hasErrors = false

  // Cargar español como referencia
  const referenceKeys = {}

  NAMESPACES.forEach((namespace) => {
    const filePath = path.join(LOCALES_DIR, 'es', `${namespace}.json`)
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    referenceKeys[namespace] = flattenObject(content)
  })

  // Validar otros idiomas
  LANGUAGES.forEach((lang) => {
    if (lang === 'es') return // Skip reference language

    console.log(`📝 Validando ${lang}...\n`)

    NAMESPACES.forEach((namespace) => {
      const filePath = path.join(LOCALES_DIR, lang, `${namespace}.json`)

      if (!fs.existsSync(filePath)) {
        console.error(`❌ Falta archivo: ${filePath}`)
        hasErrors = true
        return
      }

      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      const langKeys = flattenObject(content)

      const referenceSet = new Set(Object.keys(referenceKeys[namespace]))
      const langSet = new Set(Object.keys(langKeys))

      // Claves faltantes
      const missing = [...referenceSet].filter((key) => !langSet.has(key))
      if (missing.length > 0) {
        console.error(`❌ ${namespace} - Claves faltantes en ${lang}:`)
        missing.forEach((key) => console.error(`   - ${key}`))
        hasErrors = true
      }

      // Claves extra (posible error)
      const extra = [...langSet].filter((key) => !referenceSet.has(key))
      if (extra.length > 0) {
        console.warn(`⚠️  ${namespace} - Claves extra en ${lang}:`)
        extra.forEach((key) => console.warn(`   - ${key}`))
      }
    })

    console.log()
  })

  if (hasErrors) {
    console.error('❌ Validación fallida. Corrige los errores anteriores.')
    process.exit(1)
  } else {
    console.log('✅ Todas las traducciones están completas!')
  }
}

validateTranslations()
```

**Ejecutar:**

```bash
node scripts/validate-translations.js
```

## Validar que no quedan textos sin traducir

Detecta textos hardcodeados visibles al usuario en UI

- Detecta textos hardcodeados visibles al usuario en UI (React Native / Expo).
- Revisa JSXText:
- Revisa atributos típicos: placeholder="...", title="...", accessibilityLabel="..."
- Revisa Alert.alert("Título", "Mensaje")
- Revisa constantes string usadas directamente en JSX: const title="Hola";
  
  

### Archivo: `scripts/validate--no-hardcoded-ui.js`

```javascript
const fs = require('fs')
const path = require('path')

let parser, traverse
try {
  parser = require('@babel/parser')
  traverse = require('@babel/traverse').default
} catch (e) {
  console.error('❌ Faltan dependencias para parsear AST.')
  console.error('Instala: npm i -D @babel/parser @babel/traverse')
  process.exit(1)
}

const ROOT_DIR = path.join(__dirname, '..')

// Carpetas a revisar (ajusta según tu repo)
const SCAN_DIRS = [
  'app',
  'components',
  'screens',
  'navigation',
  'modals',
]

// Extensiones a revisar
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx'])

// Carpetas a ignorar
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.expo',
  'ios',
  'android',
  'locales', // traducciones
])

// Props típicos de UI donde suele haber texto visible
const UI_TEXT_ATTRS = new Set([
  'title',
  'placeholder',
  'label',
  'headerTitle',
  'accessibilityLabel',
  'accessibilityHint',
  'aria-label',
  'ariaLabel',
])

// Atributos que suelen ser IDs o cosas técnicas; no los tratamos como UI visible
const IGNORE_ATTRS = new Set([
  'testID',
  'key',
  'className',
  'style',
  'name',
  'id',
  'source',
])

function isWhitespaceOnly(str) {
  return !str || str.trim().length === 0
}

function isSimpleTemplateLiteral(node) {
  return node && node.type === 'TemplateLiteral' && node.expressions && node.expressions.length === 0
}

function getStringValue(node) {
  if (!node) return null
  if (node.type === 'StringLiteral') return node.value
  if (isSimpleTemplateLiteral(node)) return node.quasis.map(q => q.value.cooked).join('')
  return null
}

function toPos(loc) {
  if (!loc) return { line: 0, column: 0 }
  return { line: loc.start.line, column: loc.start.column + 1 }
}

function excerptAt(code, loc, maxLen = 140) {
  if (!loc) return ''
  const lines = code.split(/\r?\n/)
  const line = lines[loc.start.line - 1] || ''
  const trimmed = line.trim()
  if (trimmed.length <= maxLen) return trimmed
  return trimmed.slice(0, maxLen) + '…'
}

function walkDir(dirPath, results) {
  if (!fs.existsSync(dirPath)) return

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue
      walkDir(full, results)
      continue
    }

    const ext = path.extname(entry.name)
    if (!EXTENSIONS.has(ext)) continue
    results.push(full)
  }
}

function isInsideTCall(pathNode) {
  // Evita marcar strings como: t('auth:login.title')
  // Soporta: t(...), i18n.t(...)
  let p = pathNode
  while (p) {
    if (p.isCallExpression && p.isCallExpression()) {
      const callee = p.node.callee
      if (callee && callee.type === 'Identifier' && callee.name === 't') return true
      if (
        callee &&
        callee.type === 'MemberExpression' &&
        callee.property &&
        callee.property.type === 'Identifier' &&
        callee.property.name === 't'
      ) return true
    }
    p = p.parentPath
  }
  return false
}

function isConsoleCall(pathNode) {
  if (!pathNode || !pathNode.isCallExpression || !pathNode.isCallExpression()) return false
  const callee = pathNode.node.callee
  if (!callee || callee.type !== 'MemberExpression') return false
  const obj = callee.object
  if (!obj || obj.type !== 'Identifier' || obj.name !== 'console') return false
  return true
}

function calleeToString(callee) {
  // Convierte Alert.alert => "Alert.alert"
  if (!callee) return ''
  if (callee.type === 'Identifier') return callee.name
  if (callee.type === 'MemberExpression') {
    const left = calleeToString(callee.object)
    const right =
      callee.property && callee.property.type === 'Identifier'
        ? callee.property.name
        : ''
    return left && right ? `${left}.${right}` : left || right
  }
  return ''
}

function validateFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8')

  let ast
  try {
    ast = parser.parse(code, {
      sourceType: 'module',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'objectRestSpread',
        'optionalChaining',
        'nullishCoalescingOperator',
        'dynamicImport',
        'decorators-legacy',
      ],
      errorRecovery: true,
    })
  } catch (e) {
    return [{
      file: filePath,
      line: 0,
      column: 0,
      kind: 'parse_error',
      message: `No se pudo parsear el archivo: ${e.message}`,
      excerpt: '',
    }]
  }

  const issues = []

  // Heurística: constantes string (const x = "Hola") para detectar uso en JSX: <Text>{x}</Text>
  // Guardamos bindings de variables inicializadas con string literal / template simple.
  const stringConstBindings = new Set()

  function addIssue(node, kind, message) {
    const pos = toPos(node && node.loc)
    issues.push({
      file: filePath,
      line: pos.line,
      column: pos.column,
      kind,
      message,
      excerpt: excerptAt(code, node && node.loc),
    })
  }

  traverse(ast, {
    VariableDeclarator(p) {
      const { id, init } = p.node
      if (!id || id.type !== 'Identifier') return
      const val = getStringValue(init)
      if (val === null) return
      if (isInsideTCall(p)) return // no aplica, pero por coherencia
      const binding = p.scope.getBinding(id.name)
      if (binding) stringConstBindings.add(binding)
    },

    JSXText(p) {
      const raw = p.node.value
      if (isWhitespaceOnly(raw)) return

      // JSXText real (ej: <Text>Hola</Text>)
      addIssue(
        p.node,
        'jsx_text',
        'Texto hardcodeado en JSX. Sustitúyelo por {t("...")}.'
      )
    },

    JSXExpressionContainer(p) {
      const expr = p.node.expression
      if (!expr) return

      // <Text>{"Hola"}</Text> o <Text>{`Hola`}</Text>
      const direct = getStringValue(expr)
      if (direct !== null && !isWhitespaceOnly(direct)) {
        addIssue(
          p.node,
          'jsx_expr_string',
          'String hardcodeado en expresión JSX. Sustitúyelo por t("...").'
        )
        return
      }

      // <Text>{title}</Text> donde title = "Hola"
      if (expr.type === 'Identifier') {
        const binding = p.scope.getBinding(expr.name)
        if (binding && stringConstBindings.has(binding)) {
          addIssue(
            p.node,
            'jsx_identifier_string',
            `Constante string "${expr.name}" usada en JSX. Debe venir de i18n.`
          )
        }
      }
    },

    JSXAttribute(p) {
      const nameNode = p.node.name
      if (!nameNode || nameNode.type !== 'JSXIdentifier') return
      const attrName = nameNode.name

      if (IGNORE_ATTRS.has(attrName)) return
      if (!UI_TEXT_ATTRS.has(attrName)) return

      const valNode = p.node.value
      if (!valNode) return

      // placeholder="Hola"
      if (valNode.type === 'StringLiteral') {
        if (!isWhitespaceOnly(valNode.value)) {
          addIssue(
            valNode,
            'jsx_attr_string',
            `Prop "${attrName}" con string hardcodeado. Sustitúyelo por {t("...")}.`
          )
        }
        return
      }

      // placeholder={"Hola"} o placeholder={`Hola`} o placeholder={title}
      if (valNode.type === 'JSXExpressionContainer') {
        const expr = valNode.expression

        // placeholder={t('...')} => OK
        if (expr && expr.type === 'CallExpression') {
          const callee = expr.callee
          if (callee && callee.type === 'Identifier' && callee.name === 't') return
          if (
            callee &&
            callee.type === 'MemberExpression' &&
            callee.property &&
            callee.property.type === 'Identifier' &&
            callee.property.name === 't'
          ) return
        }

        const direct = getStringValue(expr)
        if (direct !== null && !isWhitespaceOnly(direct)) {
          addIssue(
            valNode,
            'jsx_attr_expr_string',
            `Prop "${attrName}" con string hardcodeado. Sustitúyelo por t("...").`
          )
          return
        }

        if (expr && expr.type === 'Identifier') {
          const binding = p.scope.getBinding(expr.name)
          if (binding && stringConstBindings.has(binding)) {
            addIssue(
              valNode,
              'jsx_attr_identifier_string',
              `Prop "${attrName}" usa constante string "${expr.name}". Debe venir de i18n.`
            )
          }
        }
      }
    },

    CallExpression(p) {
      // No traducimos consola
      if (isConsoleCall(p)) return
      // No marcamos strings dentro de t('...')
      if (isInsideTCall(p)) return

      const calleeStr = calleeToString(p.node.callee)

      // Alert.alert("Título", "Mensaje")
      if (calleeStr === 'Alert.alert') {
        const args = p.node.arguments || []
        for (let i = 0; i < Math.min(args.length, 2); i++) {
          const s = getStringValue(args[i])
          if (s !== null && !isWhitespaceOnly(s)) {
            addIssue(
              args[i],
              'alert_string',
              'Alert.alert con string hardcodeado. Sustitúyelo por t("...").'
            )
          }
        }
      }
    },
  })

  return issues
}

function formatIssue(i) {
  const rel = path.relative(ROOT_DIR, i.file)
  const where = i.line ? `${rel}:${i.line}:${i.column}` : rel
  return [
    `❌ ${where}`,
    `   Tipo: ${i.kind}`,
    `   Motivo: ${i.message}`,
    i.excerpt ? `   → ${i.excerpt}` : '',
  ].filter(Boolean).join('\n')
}

function main() {
  console.log('🔎 Validando que no haya textos hardcodeados en UI...\n')

  const files = []
  for (const d of SCAN_DIRS) {
    const full = path.join(ROOT_DIR, d)
    walkDir(full, files)
  }

  if (files.length === 0) {
    console.log('⚠️  No se encontraron archivos para analizar. Revisa SCAN_DIRS.')
    process.exit(0)
  }

  let allIssues = []
  for (const f of files) {
    const issues = validateFile(f)
    if (issues.length) allIssues = allIssues.concat(issues)
  }

  if (allIssues.length) {
    // Ordena para lectura
    allIssues.sort((a, b) => {
      if (a.file !== b.file) return a.file.localeCompare(b.file)
      if (a.line !== b.line) return a.line - b.line
      return a.column - b.column
    })

    console.error(`❌ Encontrados ${allIssues.length} posibles textos hardcodeados:\n`)
    for (const i of allIssues) {
      console.error(formatIssue(i))
      console.error('')
    }

    console.error('❌ Validación fallida. Migra esos textos a i18n y vuelve a ejecutar.')
    process.exit(1)
  }

  console.log('✅ OK: No se detectaron textos hardcodeados en UI.')
}

main()


```

**Ejecutar:**

```bash
node scripts/validate-no-hardcoded-ui.js
```



---

## 📝 Mejores Prácticas

### ✅ DO (Hacer)

1. **Organizar por namespaces lógicos**
   
   ```typescript
   // ✅ Bueno
   t('auth:login.email')
   t('profile:settings.language')
   ```

2. **Usar interpolación para variables**
   
   ```typescript
   // ✅ Bueno
   t('welcome.message', { name: user.name })
   
   // ❌ Malo
   `Welcome, ${user.name}!` // Hardcoded
   ```

3. **Usar pluralización**
   
   ```json
   {
    "items_one": "{{count}} item",
    "items_other": "{{count}} items"
   }
   ```

4. **Keys descriptivas**
   
   ```typescript
   // ✅ Bueno
   t('errors.auth.invalidCredentials')
   
   // ❌ Malo
   t('error1')
   ```

### ❌ DON'T (No hacer)

1. **No hardcodear textos**
   
   ```typescript
   // ❌ Malo
   <Text>Welcome</Text>
   
   // ✅ Bueno
   <Text>{t('common:welcome')}</Text>
   ```

2. **No concatenar traducciones**
   
   ```typescript
   // ❌ Malo
   t('hello') + ' ' + t('world')
   
   // ✅ Bueno
   t('helloWorld')
   ```

3. **No traducir variables dinámicas**
   
   ```typescript
   // ❌ Malo
   t(dynamicKey) // Imposible validar con TypeScript
   
   // ✅ Bueno
   t('errors.auth.invalidCredentials')
   ```
