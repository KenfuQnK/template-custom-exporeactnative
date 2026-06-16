import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderButton } from '@/src/components/HeaderButton';

export default function Home() {
  const { t } = useTranslation('common');
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      {/* Icon: Absolute positioned so it doesn't shift the content below */}
      <View style={{ paddingTop: insets.top + 10 }} className="absolute right-0 top-0 z-10 px-6">
        <Link href="/modal" asChild>
          <HeaderButton />
        </Link>
      </View>

      {/* Main Content: Perfectly centered on the whole screen */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-primary">{t('example.home.greeting')}</Text>
        <Text className="text-lg text-foreground">{t('example.home.subtitle')}</Text>
      </View>
    </View>
  );
}
