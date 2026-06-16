import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function TabTwo() {
  const { t } = useTranslation('common');

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-primary">{t('example.tabTwo.greeting')}</Text>
        <Text className="text-lg text-foreground">{t('example.tabTwo.subtitle')}</Text>
      </View>
    </View>
  );
}
