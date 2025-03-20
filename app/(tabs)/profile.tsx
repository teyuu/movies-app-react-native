import { icons } from "@/constants/icons";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/authService";
import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth");
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <SafeAreaView className="bg-primary flex-1 items-center justify-center px-6">
      <View className="items-center gap-4">
        <Image source={icons.person} className="size-10 rounded-full" tintColor="#fff" />
        <Text className="text-white text-lg font-bold">Profile</Text>
        {user?.email && (
          <Text className="text-gray-400 text-sm">{user.email}</Text>
        )}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600 px-6 py-2 rounded-full mt-4"
        >
          <Text className="text-white text-base font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
