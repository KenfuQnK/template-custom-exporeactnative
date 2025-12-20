import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Oops!" }} />

      <View className="flex-1 items-center justify-center p-6">
        <View className="bg-gray-50 p-8 rounded-[40px] items-center w-full max-w-sm border border-gray-100">
          <Text className="text-6xl mb-4">🔍</Text>

          <Text className="text-2xl font-extrabold text-gray-900 mb-2 text-center">
            Page Not Found
          </Text>

          <Text className="text-lg text-gray-500 text-center mb-8">
            {"This screen doesn't exist or has been moved."}
          </Text>

          <Link href="/" className="w-full">
            <View className="bg-indigo-500 rounded-[28px] p-4 shadow-md items-center">
              <Text className="text-white text-lg font-semibold">
                Go to home screen
              </Text>
            </View>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}


