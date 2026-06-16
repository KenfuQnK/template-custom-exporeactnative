/**
 * Validates that every language has the same translation keys as the reference
 * language (Spanish). Reports missing keys (error) and extra keys (warning).
 *
 * Run: npm run validate:translations
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../../src/locales');
const LANGUAGES = ['en', 'es', 'fr', 'de'];
const NAMESPACES = ['common', 'errors', 'validation'];
const REFERENCE_LANG = 'es';

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

function validateTranslations() {
  console.log('🔍 Validating translations...\n');

  let hasErrors = false;
  const referenceKeys = {};

  NAMESPACES.forEach((namespace) => {
    const filePath = path.join(LOCALES_DIR, REFERENCE_LANG, `${namespace}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing reference file: ${filePath}`);
      hasErrors = true;
      return;
    }
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    referenceKeys[namespace] = flattenObject(content);
  });

  LANGUAGES.forEach((lang) => {
    if (lang === REFERENCE_LANG) return;

    console.log(`📝 Checking ${lang}...`);

    NAMESPACES.forEach((namespace) => {
      const filePath = path.join(LOCALES_DIR, lang, `${namespace}.json`);

      if (!fs.existsSync(filePath)) {
        console.error(`❌ Missing file: ${filePath}`);
        hasErrors = true;
        return;
      }

      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const langKeys = flattenObject(content);

      const referenceSet = new Set(Object.keys(referenceKeys[namespace] || {}));
      const langSet = new Set(Object.keys(langKeys));

      const missing = [...referenceSet].filter((key) => !langSet.has(key));
      if (missing.length > 0) {
        console.error(`❌ ${namespace} - Missing keys in ${lang}:`);
        missing.forEach((key) => console.error(`   - ${key}`));
        hasErrors = true;
      }

      const extra = [...langSet].filter((key) => !referenceSet.has(key));
      if (extra.length > 0) {
        console.warn(`⚠️  ${namespace} - Extra keys in ${lang}:`);
        extra.forEach((key) => console.warn(`   - ${key}`));
      }
    });
  });

  console.log();
  if (hasErrors) {
    console.error('❌ Validation failed. Fix the errors above.');
    process.exit(1);
  } else {
    console.log('✅ All translations are complete!');
  }
}

validateTranslations();
