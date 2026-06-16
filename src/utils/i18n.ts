import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { createInstance } from 'i18next';
import { Platform } from 'react-native';
import { initReactI18next } from 'react-i18next';

// Translations (one object per language/namespace).
import deCommon from '../locales/de/common.json';
import deErrors from '../locales/de/errors.json';
import deValidation from '../locales/de/validation.json';
import enCommon from '../locales/en/common.json';
import enErrors from '../locales/en/errors.json';
import enValidation from '../locales/en/validation.json';
import esCommon from '../locales/es/common.json';
import esErrors from '../locales/es/errors.json';
import esValidation from '../locales/es/validation.json';
import frCommon from '../locales/fr/common.json';
import frErrors from '../locales/fr/errors.json';
import frValidation from '../locales/fr/validation.json';

// Key used to persist the user's language choice.
const LANGUAGE_KEY = '@app_language';

// Supported languages. Add a new one by creating its locale files and adding
// an entry here (and importing its namespaces above).
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Translation namespaces. Add a namespace by creating `<lang>/<ns>.json` for
// every language and adding it here (the validate:translations script checks
// that every language has the same keys).
export const NAMESPACES = ['common', 'errors', 'validation'] as const;

const resources = {
  en: { common: enCommon, errors: enErrors, validation: enValidation },
  es: { common: esCommon, errors: esErrors, validation: esValidation },
  fr: { common: frCommon, errors: frErrors, validation: frValidation },
  de: { common: deCommon, errors: deErrors, validation: deValidation },
};

// Custom detector: persisted choice -> device locale -> fallback ('en').
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const platformOS = Platform?.OS;
      const canUseStorage = platformOS !== 'web' || typeof window !== 'undefined';

      const savedLanguage = canUseStorage ? await AsyncStorage.getItem(LANGUAGE_KEY) : null;
      if (savedLanguage) {
        callback(savedLanguage);
        return;
      }

      const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'en';
      const supportedLanguage = Object.keys(SUPPORTED_LANGUAGES).includes(deviceLanguage)
        ? deviceLanguage
        : 'en';
      callback(supportedLanguage);
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      if (Platform?.OS === 'web' && typeof window === 'undefined') return;
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  },
};

const i18n = createInstance();

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [...NAMESPACES],
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    pluralSeparator: '_',
    debug: false,
    react: {
      useSuspense: false, // Suspense has rough edges in React Native
    },
    detection: {
      order: ['languageDetector'],
      caches: ['languageDetector'],
    },
  });

export { i18n };
