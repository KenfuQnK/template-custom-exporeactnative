import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/Button';

export default function Modal() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-transparent">
      {/* Dimmed Background Overlay */}
      <Pressable
        className="absolute inset-0 bg-black/40"
        onPress={() => router.back()}
      />

      {/* Modal Container */}
      <View className="flex-1 items-center justify-center p-6">
        <View className="bg-white p-8 rounded-[40px] shadow-2xl items-center w-full max-w-sm border border-gray-100 overflow-hidden">
          <View className="w-12 h-1.5 bg-gray-200 rounded-full mb-8" />

          <Text className="text-3xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">
            Hello world
          </Text>
          <Text className="text-lg text-gray-500 text-center mb-8 font-medium">
            I'm a functional modal
          </Text>

          <View className="h-[1px] w-full bg-gray-100 mb-8" />

          <Button
            title="Dismiss"
            onPress={() => router.back()}
            className="w-full bg-black"
          />

          <Text className="text-xs text-gray-400 mt-6 uppercase tracking-widest font-bold">
            Template Custom
          </Text>
        </View>
      </View>

      <StatusBar style="light" />
    </View>
  );
}



