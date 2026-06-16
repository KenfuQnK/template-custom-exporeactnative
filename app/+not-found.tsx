import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  const { t } = useTranslation('common');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ title: t('example.notFound.headerTitle') }} />

      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-sm items-center rounded-[40px] border border-border bg-surface p-8">
          <Text className="mb-4 text-6xl">🔍</Text>

          <Text className="mb-2 text-center text-2xl font-extrabold text-foreground">
            {t('example.notFound.title')}
          </Text>

          <Text className="mb-8 text-center text-lg text-muted">
            {t('example.notFound.subtitle')}
          </Text>

          <Link href="/" className="w-full">
            <View className="items-center rounded-[28px] bg-primary p-4 shadow-md">
              <Text className="text-lg font-semibold text-white">
                {t('example.notFound.goHome')}
              </Text>
            </View>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
