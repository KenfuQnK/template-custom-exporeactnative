import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-blue-600">
          Hello World
        </Text>
        <Text className="text-lg">
          This is Tab2
        </Text>
      </View>
    </View>
  );
}


