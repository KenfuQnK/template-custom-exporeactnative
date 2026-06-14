# Especificación: Sistema de Autenticación y Gestión de Usuarios

**Última actualización:** 2026-01-05  

**Versión:** 1.1  

---

## 📋 Resumen Ejecutivo

Implementar un sistema completo de autenticación de usuarios con Supabase que incluya:

- Registro y login con email/contraseña
- Verificación de email obligatoria
- Gestión de perfil de usuario (nombre, foto, idioma, contraseña)
- Protección de rutas (app no utilizable sin autenticación)
- Persistencia de sesión

---

## 🎯 Objetivos del Sistema

### Funcionales

- ✅ Usuarios pueden registrarse con email y contraseña
- ✅ Verificación de email antes de usar la app
- ✅ Login seguro con validación de credenciales
- ✅ Persistencia de sesión entre cierres de app
- ✅ Gestión completa de perfil de usuario
- ✅ Cambio de contraseña con validación segura
- ✅ Recuperación de contraseña vía email
- ✅ Logout y limpieza de sesión

### No Funcionales

- ✅ Respuesta de API < 2 segundos
- ✅ Validación de formularios en tiempo real
- ✅ Mensajes de error claros y traducibles
- ✅ Accesibilidad WCAG 2.1 Level AA
- ✅ Encriptación de contraseñas (Supabase)
- ✅ Cumplimiento GDPR para datos de usuario

---

## 🗺️ Flujos de Usuario

### 1. Registro de Nuevo Usuario

```
Usuario abre app
  ↓
¿Tiene sesión activa?
  → SÍ → Ir a HomeScreen
  → NO → Mostrar WelcomeScreen
  ↓
Usuario presiona "Crear Cuenta"
  ↓
RegisterScreen
  ↓
Rellenar formulario:
  - Email (validación formato)
  - Contraseña (min 8 chars, 1 mayúscula, 1 número)
  - Confirmar contraseña (deben coincidir)
  - Nombre completo (opcional ahora, obligatorio después)
  - Aceptar términos y condiciones (checkbox obligatorio)
  ↓
Presionar "Registrarse"
  ↓
Validaciones frontend:
  - Email válido
  - Contraseña segura
  - Contraseñas coinciden
  - Términos aceptados
  ↓
Llamada a Supabase:
  supabase.auth.signUp({ email, password, data: { full_name } })
  ↓
¿Registro exitoso?
  → SÍ → Mostrar EmailVerificationScreen
       "Te hemos enviado un email a [email]"
       "Revisa tu bandeja de entrada y spam"
       [Botón: Reenviar email]
       [Link: ¿Ya verificaste? Iniciar sesión]
  → NO → Mostrar error específico:
       - Email ya registrado
       - Contraseña muy débil
       - Error de conexión
```

### 2. Verificación de Email

```
Usuario recibe email de Supabase
  ↓
Presiona link de verificación
  ↓
Supabase verifica token
  ↓
Redirección a app (deep link)
  ↓
EmailVerifiedScreen
  "✅ Email verificado correctamente"
  [Botón: Ir a Login]
  ↓
Usuario puede ahora iniciar sesión
```

### 3. Login de Usuario

```
LoginScreen
  ↓
Rellenar formulario:
  - Email
  - Contraseña
  [Checkbox: Recordarme]
  [Link: ¿Olvidaste tu contraseña?]
  ↓
Presionar "Iniciar Sesión"
  ↓
Llamada a Supabase:
  supabase.auth.signInWithPassword({ email, password })
  ↓
¿Email verificado?
  → NO → Mostrar EmailVerificationScreen
        "Debes verificar tu email antes de continuar"
        [Botón: Reenviar email de verificación]
  → SÍ → Continuar
  ↓
¿Perfil completo? (tiene nombre, foto opcional)
  → NO → Redirigir a CompleteProfileScreen
        "Completa tu perfil para continuar"
  → SÍ → Redirigir a HomeScreen (app principal)
```

### 4. Recuperación de Contraseña

```
LoginScreen → "¿Olvidaste tu contraseña?"
  ↓
ForgotPasswordScreen
  ↓
Ingresar email
  ↓
Presionar "Enviar instrucciones"
  ↓
Llamada a Supabase:
  supabase.auth.resetPasswordForEmail(email)
  ↓
Mostrar confirmación:
  "Te hemos enviado un email con instrucciones"
  [Botón: Volver a Login]
  ↓
Usuario recibe email con link
  ↓
Presiona link → Abre app
  ↓
ResetPasswordScreen
  ↓
Ingresar nueva contraseña (2 veces)
  ↓
Validar y actualizar:
  supabase.auth.updateUser({ password: newPassword })
  ↓
Mostrar confirmación:
  "✅ Contraseña actualizada"
  [Botón: Ir a Login]
```

### 5. Gestión de Perfil

```
HomeScreen → Menú → ProfileScreen
  ↓
Mostrar datos actuales:
  - Foto de perfil (avatar)
  - Nombre completo
  - Email (no editable, mostrar como read-only)
  - Idioma (selector)
  - [Botón: Cambiar contraseña]
  - [Botón: Cerrar sesión]
  - [Botón: Eliminar cuenta]
  ↓
Usuario edita campos
  ↓
Presionar "Guardar cambios"
  ↓
Validaciones:
  - Nombre no vacío
  - Foto < 2MB (si se cambió)
  ↓
Actualizar en Supabase:
  1. Subir foto a Storage (si cambió)
  2. Actualizar user metadata:
     supabase.auth.updateUser({
       data: { full_name, avatar_url, language }
     })
  3. Actualizar tabla profiles
  ↓
Mostrar confirmación:
  "✅ Perfil actualizado"
```

### 6. Cambio de Contraseña (Dentro de App)

```
ProfileScreen → "Cambiar contraseña"
  ↓
ChangePasswordScreen
  ↓
Formulario:
  - Contraseña actual
  - Nueva contraseña
  - Confirmar nueva contraseña
  ↓
Validaciones:
  - Contraseña actual correcta
  - Nueva contraseña segura
  - Contraseñas nuevas coinciden
  - Nueva ≠ actual
  ↓
Actualizar:
  supabase.auth.updateUser({ password: newPassword })
  ↓
Mostrar confirmación:
  "✅ Contraseña actualizada"
  [Botón: Volver al perfil]
```

---

## 🎨 Pantallas y Componentes

### Pantallas Requeridas

#### 1. **WelcomeScreen** (`app/(auth)/welcome.tsx`)

```typescript
interface WelcomeScreenProps {}

// Layout
- Logo de la app (centrado, tamaño grande)
- Título: t('auth:welcome.title')
- Descripción breve (2-3 líneas)
- Botón primario: t('auth:welcome.createAccount')
- Botón secundario (outline): t('auth:welcome.alreadyHaveAccount')
```

#### 2. **RegisterScreen** (`app/(auth)/register.tsx`)

```typescript
interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  fullName?: string
  acceptedTerms: boolean
}

// Componentes
- EmailInput (con validación en tiempo real)
- PasswordInput (con indicador de fuerza)
- ConfirmPasswordInput (validación de coincidencia)
- TextInput para nombre (opcional)
- Checkbox para términos
- Link a términos y condiciones
- Botón t('auth:register.submit') (disabled hasta validar)
- Link t('auth:register.alreadyHaveAccount')
```

#### 3. **EmailVerificationScreen** (`app/(auth)/verify-email.tsx`)

```typescript
interface EmailVerificationProps {
  email: string // Email al que se envió verificación
}

// Layout
- Icono de email (grande)
- Título: t('auth:verifyEmail.title')
- Mensaje: t('auth:verifyEmail.message', { email })
- Instrucciones: t('auth:verifyEmail.instructions')
- Botón t('auth:verifyEmail.resendButton') (con cooldown 60s)
- Link t('auth:verifyEmail.alreadyVerified')
- Timer de reenvío visible
```

#### 4. **LoginScreen** (`app/(auth)/login.tsx`)

```typescript
interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

// Componentes
- EmailInput
- PasswordInput (con botón ver/ocultar)
- Checkbox "Recordarme"
- Botón t('auth:login.submit')
- Link t('auth:login.forgotPassword')
- Link t('auth:login.createAccount')
- Opción futura: "Continuar con Google" (placeholder)
```

#### 5. **CompleteProfileScreen** (`app/(auth)/complete-profile.tsx`)

```typescript
interface CompleteProfileData {
  fullName: string // Obligatorio
  avatarUrl?: string // Opcional
  language: 'en' | 'es' | 'fr' | 'de' // Por defecto: en
}

// Componentes
- AvatarPicker (tomar foto o elegir de galería)
- TextInput nombre completo (obligatorio)
- LanguageSelector
- Botón t('common:buttons.next') (disabled sin nombre)
- Mensaje: t('profile:completeProfile.subtitle')
```

#### 6. **ProfileScreen** (`app/(tabs)/profile.tsx`)

```typescript
interface ProfileScreenData {
  avatar_url: string | null
  full_name: string
  email: string // Read-only
  language: string
  created_at: string
}

// Layout
- Header con avatar grande (centrado)
- Lista de opciones editables:
  * Foto de perfil (tap para cambiar)
  * Nombre completo (editable)
  * Email (mostrar, no editable, badge "Verificado")
  * Idioma (selector)
- Sección de seguridad:
  * "Cambiar contraseña" (navega a nueva screen)
- Sección peligrosa:
  * "Cerrar sesión" (confirmación)
  * "Eliminar cuenta" (confirmación + password)
- Botón t('profile:actions.save') (sticky bottom)
```

#### 7. **ChangePasswordScreen** (`app/(auth)/change-password.tsx`)

```typescript
interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

// Componentes
- PasswordInput "Contraseña actual"
- PasswordInput "Nueva contraseña" (con indicador fuerza)
- PasswordInput "Confirmar nueva"
- Validaciones visuales en tiempo real
- Botón t('auth:resetPassword.submit')
```

#### 8. **ForgotPasswordScreen** (`app/(auth)/forgot-password.tsx`)

```typescript
interface ForgotPasswordData {
  email: string
}

// Layout
- Icono de candado
- Título: t('auth:forgotPassword.title')
- Descripción
- EmailInput
- Botón t('auth:forgotPassword.submit')
- Link t('auth:forgotPassword.backToLogin')
```

#### 9. **ResetPasswordScreen** (`app/(auth)/reset-password.tsx`)

```typescript
interface ResetPasswordData {
  password: string
  confirmPassword: string
  token: string // Del query param
}

// Componentes similares a ChangePasswordScreen
// pero sin pedir contraseña actual
```

---

## 🔧 Componentes Reutilizables

### UI Components (`components/ui/`)

```typescript
// EmailInput.tsx
interface EmailInputProps {
  value: string
  onChangeText: (text: string) => void
  error?: string
  autoFocus?: boolean
}

// PasswordInput.tsx
interface PasswordInputProps {
  value: string
  onChangeText: (text: string) => void
  error?: string
  showStrengthIndicator?: boolean
  placeholder?: string
}

// AvatarPicker.tsx
interface AvatarPickerProps {
  currentAvatar?: string
  onAvatarSelected: (uri: string) => void
  size?: 'small' | 'medium' | 'large'
}

// LanguageSelector.tsx
interface LanguageSelectorProps {
  value: 'en' | 'es' | 'fr' | 'de'
  onChange: (lang: string) => void
}

// LoadingButton.tsx
interface LoadingButtonProps {
  title: string
  onPress: () => Promise<void>
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}
```

---

## 🗄️ Estructura de Base de Datos (Supabase)

### Tabla: `profiles` (complementa auth.users)

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es' , 'fr', 'de')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Usuarios pueden leer su propio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Crear perfil al registrarse
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger: Crear perfil automáticamente al registrarse
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Actualizar updated_at
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Storage Bucket: `avatars`

```sql
-- Crear bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Policy: Usuarios pueden subir su propio avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Usuarios pueden actualizar su avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Todos pueden ver avatares (público)
CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

---

## 🔐 Lógica de Autenticación

### Servicios (`services/auth.service.ts`)

```typescript
import { supabase } from '@/utils/supabase'
import { AppState } from 'react-native'

export const authService = {
  /**
   * Registrar nuevo usuario
   */
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || 'Usuario' },
        emailRedirectTo: 'yourapp://auth/callback', // Deep link
      },
    })

    if (error) throw error
    return data
  },

  /**
   * Iniciar sesión
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Verificar si email está confirmado
    if (!data.user?.email_confirmed_at) {
      throw new Error('EMAIL_NOT_VERIFIED')
    }

    return data
  },

  /**
   * Cerrar sesión
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Reenviar email de verificación
   */
  async resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    if (error) throw error
  },

  /**
   * Recuperar contraseña
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'yourapp://auth/reset-password',
    })

    if (error) throw error
  },

  /**
   * Actualizar contraseña
   */
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  },

  /**
   * Obtener sesión actual
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  /**
   * Refrescar sesión
   */
  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) throw error
    return data.session
  },

  /**
   * Setup listener para cambios de sesión
   */
  setupAuthListener(callback: (session: any) => void) {
    // Listener de cambios en auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(session)
      }
    )

    // Listener cuando app vuelve a foreground
    const appStateSubscription = AppState.addEventListener(
      'change',
      async (state) => {
        if (state === 'active') {
          await this.refreshSession()
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
      appStateSubscription?.remove()
    }
  },
}
```

### Servicios de Perfil (`services/profile.service.ts`)

```typescript
import { supabase } from '@/utils/supabase'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'

export const profileService = {
  /**
   * Obtener perfil del usuario actual
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Actualizar perfil
   */
  async updateProfile(userId: string, updates: {
    full_name?: string
    language?: string
    avatar_url?: string
  }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    // También actualizar user metadata
    await supabase.auth.updateUser({
      data: updates,
    })

    return data
  },

  /**
   * Subir avatar
   */
  async uploadAvatar(userId: string, imageUri: string) {
    try {
      // Leer archivo como base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Generar nombre único
      const fileName = `${userId}/${Date.now()}.jpg`

      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, decode(base64), {
          contentType: 'image/jpeg',
          upsert: true,
        })

      if (error) throw error

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  },

  /**
   * Seleccionar imagen para avatar
   */
  async pickAvatar() {
    // Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      throw new Error('PERMISSION_DENIED')
    }

    // Abrir picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Comprimir para no exceder 2MB
    })

    if (result.canceled) return null

    return result.assets[0].uri
  },

  /**
   * Eliminar cuenta
   */
  async deleteAccount(userId: string) {
    // Eliminar avatar
    await supabase.storage
      .from('avatars')
      .remove([`${userId}/`])

    // Eliminar perfil
    await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    // Eliminar usuario (requiere admin, hacer via Edge Function)
    // Por ahora, solo cerrar sesión
    await authService.signOut()
  },
}
```

---

## 🔄 Context API para Estado Global

### Auth Context (`contexts/AuthContext.tsx`)

```typescript
import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/services/auth.service'
import { profileService } from '@/services/profile.service'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: any | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: any) => Promise<void>
  uploadAvatar: (imageUri: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener sesión inicial
    authService.getSession().then((session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        loadProfile(session.user.id)
      }

      setLoading(false)
    })

    // Setup listener
    const unsubscribe = authService.setupAuthListener((session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return unsubscribe
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const profile = await profileService.getProfile(userId)
      setProfile(profile)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password)
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    await authService.signUp(email, password, fullName)
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const updateProfile = async (updates: any) => {
    if (!user) return
    const updated = await profileService.updateProfile(user.id, updates)
    setProfile(updated)
  }

  const uploadAvatar = async (imageUri: string) => {
    if (!user) return
    const avatarUrl = await profileService.uploadAvatar(user.id, imageUri)
    await updateProfile({ avatar_url: avatarUrl })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

---

## 🛡️ Protección de Rutas

### Layout Raíz (`app/_layout.tsx`)

```typescript
import { useEffect } from 'react'
import { useRouter, useSegments } from 'expo-router'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

function RootLayoutNav() {
  const { user, loading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!user && !inAuthGroup) {
      // Usuario no autenticado, redirigir a auth
      router.replace('/(auth)/welcome')
    } else if (user && inAuthGroup) {
      // Usuario autenticado en pantallas de auth, ir a home
      router.replace('/(tabs)')
    }
  }, [user, loading, segments])

  return <Slot />
}

export function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}
```

---

## ✅ Validaciones

### Funciones de Validación (`utils/validators.ts`)

```typescript
// Email
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const getEmailError = (email: string): string | null => {
  if (!email) return 'El email es obligatorio'
  if (!validateEmail(email)) return 'Email inválido'
  return null
}

// Password
export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una mayúscula')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Recomendado: incluir un carácter especial')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const getPasswordStrength = (
  password: string
): 'weak' | 'medium' | 'strong' => {
  const { isValid, errors } = validatePassword(password)

  if (errors.length > 2) return 'weak'
  if (errors.length > 0) return 'medium'
  return 'strong'
}

// Confirm Password
export const validatePasswordMatch = (
  password: string,
  confirm: string
): string | null => {
  if (!confirm) return 'Confirma tu contraseña'
  if (password !== confirm) return 'Las contraseñas no coinciden'
  return null
}

// Full Name
export const validateFullName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'El nombre es obligatorio'
  }
  if (name.trim().length < 2) {
    return 'El nombre debe tener al menos 2 caracteres'
  }
  return null
}
```

---

## 🌐 Internacionalización (i18n)

### Archivo de traducciones (`locales/es.json`)

```json
{
  "auth": {
    "welcome": {
      "title": "Bienvenido",
      "subtitle": "Tu app favorita",
      "createAccount": "Crear cuenta",
      "alreadyHaveAccount": "Ya tengo cuenta"
    },
    "register": {
      "title": "Crear cuenta",
      "email": "Email",
      "password": "Contraseña",
      "confirmPassword": "Confirmar contraseña",
      "fullName": "Nombre completo (opcional)",
      "terms": "Acepto los términos y condiciones",
      "submit": "Registrarse",
      "alreadyHaveAccount": "¿Ya tienes cuenta? Inicia sesión",
      "errors": {
        "emailRequired": "El email es obligatorio",
        "emailInvalid": "Email inválido",
        "passwordRequired": "La contraseña es obligatoria",
        "passwordWeak": "La contraseña es muy débil",
        "passwordMismatch": "Las contraseñas no coinciden",
        "termsRequired": "Debes aceptar los términos y condiciones",
        "emailAlreadyExists": "Este email ya está registrado"
      }
    },
    "login": {
      "title": "Iniciar sesión",
      "email": "Email",
      "password": "Contraseña",
      "rememberMe": "Recordarme",
      "submit": "Iniciar sesión",
      "forgotPassword": "¿Olvidaste tu contraseña?",
      "createAccount": "Crear cuenta nueva",
      "errors": {
        "invalidCredentials": "Email o contraseña incorrectos",
        "emailNotVerified": "Debes verificar tu email antes de continuar"
      }
    },
    "verify": {
      "title": "Verifica tu email",
      "message": "Te hemos enviado un email a",
      "instructions": "Revisa tu bandeja de entrada y spam",
      "resend": "Reenviar email",
      "resendCooldown": "Reenviar en {seconds}s",
      "alreadyVerified": "¿Ya verificaste? Iniciar sesión"
    },
    "forgotPassword": {
      "title": "¿Olvidaste tu contraseña?",
      "subtitle": "Te enviaremos instrucciones a tu email",
      "email": "Email",
      "submit": "Enviar instrucciones",
      "backToLogin": "Volver a inicio de sesión",
      "success": "Te hemos enviado un email con instrucciones"
    },
    "resetPassword": {
      "title": "Restablecer contraseña",
      "newPassword": "Nueva contraseña",
      "confirmPassword": "Confirmar nueva contraseña",
      "submit": "Actualizar contraseña",
      "success": "Contraseña actualizada correctamente"
    }
  },
  "profile": {
    "title": "Perfil",
    "editProfile": "Editar perfil",
    "fullName": "Nombre completo",
    "email": "Email",
    "language": "Idioma",
    "changePassword": "Cambiar contraseña",
    "signOut": "Cerrar sesión",
    "deleteAccount": "Eliminar cuenta",
    "saveChanges": "Guardar cambios",
    "success": "Perfil actualizado correctamente",
    "languages": {
      "es": "Español",
      "en": "English",
      "ca": "Català"
    }
  }
}
```

---

## 🚨 Manejo de Errores

### Error Handler (`utils/errorHandler.ts`)

```typescript
export class AuthError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = 'AuthError'
  }
}

export const getErrorMessage = (error: any): string => {
  // Errores de Supabase
  if (error?.message) {
    if (error.message.includes('Invalid login credentials')) {
      return 'Email o contraseña incorrectos'
    }
    if (error.message.includes('Email not confirmed')) {
      return 'Debes verificar tu email antes de continuar'
    }
    if (error.message.includes('User already registered')) {
      return 'Este email ya está registrado'
    }
    if (error.message.includes('Password should be at least')) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }
  }

  // Errores custom
  if (error.code === 'EMAIL_NOT_VERIFIED') {
    return 'Debes verificar tu email antes de continuar'
  }
  if (error.code === 'PERMISSION_DENIED') {
    return 'Se requiere permiso para acceder a la galería'
  }

  // Error genérico
  return 'Ha ocurrido un error. Inténtalo de nuevo'
}

export const showErrorToast = (error: any) => {
  const message = getErrorMessage(error)
  // Implementar con tu librería de toast favorita
  // Toast.show({ type: 'error', text1: message })
  console.error(message, error)
}
```

---

## 📱 Deep Linking

### Configuración (`app.json`)

```json
{
  "expo": {
    "scheme": "yourapp",
    "ios": {
      "associatedDomains": ["applinks:yourapp.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "yourapp",
              "host": "auth"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Handler de Deep Links (`app/_layout.tsx`)

```typescript
import * as Linking from 'expo-linking'

useEffect(() => {
  // Manejar deep link inicial
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink(url)
  })

  // Listener para nuevos deep links
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url)
  })

  return () => subscription.remove()
}, [])

const handleDeepLink = (url: string) => {
  const { path, queryParams } = Linking.parse(url)

  if (path === 'auth/callback') {
    // Email verification callback
    router.replace('/(auth)/email-verified')
  } else if (path === 'auth/reset-password') {
    // Password reset callback
    router.replace(`/(auth)/reset-password?token=${queryParams.token}`)
  }
}
```

---

## 🧪 Casos de Prueba (Testing)

### Tests Críticos

#### 1. **Registro de Usuario**

```typescript
describe('RegisterScreen', () => {
  it('debe validar email inválido', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />)

    const emailInput = getByPlaceholderText('Email')
    fireEvent.changeText(emailInput, 'invalid-email')

    await waitFor(() => {
      expect(getByText('Email inválido')).toBeTruthy()
    })
  })

  it('debe validar contraseña débil', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />)

    const passwordInput = getByPlaceholderText('Contraseña')
    fireEvent.changeText(passwordInput, '123')

    await waitFor(() => {
      expect(getByText('Mínimo 8 caracteres')).toBeTruthy()
    })
  })

  it('debe validar contraseñas no coinciden', async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />)

    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'Password123!')
    fireEvent.changeText(getByPlaceholderText('Confirmar contraseña'), 'Different123!')

    await waitFor(() => {
      expect(getByText('Las contraseñas no coinciden')).toBeTruthy()
    })
  })

  it('debe registrar usuario correctamente', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({ user: { id: '123' } })

    // Mock del servicio
    jest.mock('@/services/auth.service', () => ({
      authService: { signUp: mockSignUp }
    }))

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />)

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com')
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'Password123!')
    fireEvent.changeText(getByPlaceholderText('Confirmar contraseña'), 'Password123!')
    fireEvent.press(getByText('Acepto los términos'))
    fireEvent.press(getByText('Registrarse'))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!',
        undefined
      )
    })
  })
})
```

#### 2. **Login**

```typescript
describe('LoginScreen', () => {
  it('debe mostrar error con credenciales incorrectas', async () => {
    const mockSignIn = jest.fn().mockRejectedValue(
      new Error('Invalid login credentials')
    )

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com')
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'wrong')
    fireEvent.press(getByText('Iniciar sesión'))

    await waitFor(() => {
      expect(getByText('Email o contraseña incorrectos')).toBeTruthy()
    })
  })

  it('debe redirigir a verificación si email no confirmado', async () => {
    const mockSignIn = jest.fn().mockRejectedValue(
      new Error('EMAIL_NOT_VERIFIED')
    )

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com')
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'Password123!')
    fireEvent.press(getByText('Iniciar sesión'))

    await waitFor(() => {
      expect(getByText('Debes verificar tu email')).toBeTruthy()
    })
  })
})
```

#### 3. **Protección de Rutas**

```typescript
describe('Route Protection', () => {
  it('debe redirigir a welcome si usuario no autenticado', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.user).toBeNull()
    })

    // Verificar redirección a /(auth)/welcome
    expect(mockRouter.replace).toHaveBeenCalledWith('/(auth)/welcome')
  })

  it('debe permitir acceso a tabs si usuario autenticado', async () => {
    const mockUser = { id: '123', email: 'test@example.com' }

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthProvider initialUser={mockUser}>
          {children}
        </AuthProvider>
      ),
    })

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })

    // Verificar acceso permitido
    expect(mockRouter.replace).not.toHaveBeenCalled()
  })
})
```

---

## 🎯 Casos Edge a Considerar

### Escenarios Especiales

1. **Usuario cierra app durante verificación de email**
   
   - Al reabrir, mostrar botón "Reenviar email"
   - Permitir navegar a login para verificar manualmente

2. **Token de reset password expirado**
   
   - Mostrar mensaje: "El link ha expirado"
   - Botón para solicitar nuevo link

3. **Usuario intenta registrarse con email ya existente**
   
   - Mostrar: "Este email ya está registrado"
   - Link directo a "¿Olvidaste tu contraseña?"

4. **Sin conexión a internet**
   
   - Detectar offline con NetInfo
   - Mostrar mensaje: "Sin conexión. Verifica tu internet"
   - Deshabilitar botones de submit

5. **Subida de imagen muy grande (>2MB)**
   
   - Comprimir automáticamente con expo-image-manipulator
   - Mostrar feedback: "Optimizando imagen..."

6. **Usuario elimina cuenta**
   
   - Confirmación con password
   - Modal de advertencia: "Esta acción es irreversible"
   - Eliminar todos los datos (avatar, profile, auth)

7. **Sesión expirada en segundo plano**
   
   - Refrescar token automáticamente cuando app vuelve a foreground
   - Si falla refresh, redirigir a login

---

## 📊 Métricas y Analytics (Opcional)

```typescript
// Trackear eventos importantes
analytics.track('user_registered', { method: 'email' })
analytics.track('user_logged_in', { method: 'email' })
analytics.track('email_verified')
analytics.track('password_changed')
analytics.track('profile_updated', { fields: ['avatar', 'name'] })
analytics.track('user_logged_out')
```

---

## ✅ Checklist de Implementación

### Fase 1: Setup

- [ ] Configurar Supabase project
- [ ] Crear tabla `profiles` con RLS policies
- [ ] Crear bucket `avatars` con policies
- [ ] Configurar deep linking en `app.json`
- [ ] Instalar dependencias necesarias
- [ ] Setup AuthContext y Provider

### Fase 2: Pantallas de Auth

- [ ] WelcomeScreen
- [ ] RegisterScreen con validaciones
- [ ] LoginScreen
- [ ] EmailVerificationScreen con reenvío
- [ ] ForgotPasswordScreen
- [ ] ResetPasswordScreen

### Fase 3: Protección y Perfil

- [ ] Implementar protección de rutas en _layout
- [ ] CompleteProfileScreen
- [ ] ProfileScreen con edición
- [ ] ChangePasswordScreen
- [ ] AvatarPicker con subida a Storage

### Fase 4: Testing y Polish

- [ ] Tests unitarios para validaciones
- [ ] Tests de integración para flows completos
- [ ] Manejo de errores y casos edge
- [ ] Traducciones (i18n)
- [ ] Accesibilidad (labels, hints, roles)
- [ ] Loading states y feedback visual
- [ ] Documentación de código

---

## **Dependencias a instalar:**

```bash
npm install @supabase/supabase-js
npx expo install expo-image-picker expo-file-system
npx expo install @react-native-async-storage/async-storage
npm install react-hook-form zod @hookform/resolvers
```
