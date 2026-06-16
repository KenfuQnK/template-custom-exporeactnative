import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/src/constants/Colors';
import { useLanguage } from '@/src/context/LanguageContext';
import { SupportedLanguage } from '@/src/utils/i18n';

/**
 * Generic language picker. Lists every supported language and highlights the
 * active one; tapping persists the choice via the LanguageProvider. Drop it
 * into a settings screen or a modal. Styled with the semantic theme tokens.
 */
export function LanguageSelector() {
  const { currentLanguage, changeLanguage, supportedLanguages, isChanging } = useLanguage();

  return (
    <View className="w-full">
      {(Object.keys(supportedLanguages) as SupportedLanguage[]).map((lang) => {
        const isActive = lang === currentLanguage;
        return (
          <Pressable
            key={lang}
            disabled={isChanging}
            onPress={() => changeLanguage(lang)}
            className={`mb-2 flex-row items-center justify-between rounded-2xl border p-4 ${
              isActive ? 'border-primary bg-surface' : 'border-border bg-background'
            }`}>
            <Text className="text-base font-medium text-foreground">
              {supportedLanguages[lang]}
            </Text>
            {isActive && <FontAwesome name="check" size={18} color={Colors.primary} />}
          </Pressable>
        );
      })}
    </View>
  );
}
