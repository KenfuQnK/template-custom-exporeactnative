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
    // Si no existe el archivo de referencia (en español), no podemos validar nada todavía.
    // Esto evita crash si la carpeta locales no existe aún.
    if (!fs.existsSync(filePath)) { 
        // Si es el primer setup, puede que no existan. Solo avisamos.
        // Pero para uso normal debería existir.
        return; 
    }
    
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
        // Si no existe la carpeta locales o el archivo, esto fallará. 
        // Es un script de validación, así que reportar error es correcto si esperamos que existan.
        // Pero si el usuario aún no ha creado nada, fallará ruidosamente.
        // Asumiremos que si se corre este script, se espera que existan.
        console.error(`❌ Falta archivo: ${filePath}`)
        hasErrors = true
        return
      }

      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      const langKeys = flattenObject(content)

      const referenceSet = new Set(Object.keys(referenceKeys[namespace] || {}))
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
