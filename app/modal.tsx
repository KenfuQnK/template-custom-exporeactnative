import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/src/components/Button';

export default function Modal() {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <View className="flex-1 bg-transparent">
      {/* Dimmed Background Overlay */}
      <Pressable className="absolute inset-0 bg-black/40" onPress={() => router.back()} />

      {/* Modal Container */}
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-sm items-center overflow-hidden rounded-[40px] border border-border bg-background p-8 shadow-2xl">
          <View className="mb-8 h-1.5 w-12 rounded-full bg-surface-alt" />

          <Text className="mb-2 text-center text-3xl font-extrabold tracking-tight text-foreground">
            {t('example.modal.title')}
          </Text>
          <Text className="mb-8 text-center text-lg font-medium text-muted">
            {t('example.modal.subtitle')}
          </Text>

          <View className="mb-8 h-[1px] w-full bg-border" />

          <Button title={t('buttons.close')} onPress={() => router.back()} className="w-full" />

          <Text className="mt-6 text-xs font-bold uppercase tracking-widest text-muted">
            {t('example.modal.footer')}
          </Text>
        </View>
      </View>

      <StatusBar style="light" />
    </View>
  );
}
