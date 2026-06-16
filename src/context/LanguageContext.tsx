import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/src/utils/i18n';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  isChanging: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    (i18nInstance.language as SupportedLanguage) || 'en'
  );
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (Object.keys(SUPPORTED_LANGUAGES).includes(lng)) {
        setCurrentLanguage(lng as SupportedLanguage);
      }
    };

    i18nInstance.on('languageChanged', handleLanguageChange);
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange);
    };
  }, [i18nInstance]);

  const changeLanguage = async (language: SupportedLanguage) => {
    if (language === currentLanguage) return;

    setIsChanging(true);
    try {
      // The custom languageDetector persists the choice to AsyncStorage.
      await i18nInstance.changeLanguage(language);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isChanging,
      }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
