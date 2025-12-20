import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderButton } from "../../components/HeaderButton";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      {/* Icon: Absolute positioned so it doesn't shift the content below */}
      <View
        style={{ paddingTop: insets.top + 10 }}
        className="absolute top-0 right-0 z-10 px-6"
      >
        <Link href='/modal' asChild>
          <HeaderButton />
        </Link>
      </View>

      {/* Main Content: Perfectly centered on the whole screen */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-blue-600">
          Hello World
        </Text>
        <Text className="text-lg">
          This is Tab1
        </Text>
      </View>
    </View>
  );
}



