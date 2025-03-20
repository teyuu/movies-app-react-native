import AuthForm from "@/components/AuthForm";
import { images } from "@/constants/images";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Auth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const {user, loading} = useAuth();

  if (!loading && user) {
    return <Redirect href="/(tabs)" />;
  }
  
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <View className="flex justify-center items-center h-full">
        <Text className="text-white text-3xl font-bold tracking-tight text-center">
          {isLogin ? "Welcome " : "Join Us"}
        </Text>
        <Text className="text-gray-400 text-lg text-center mt-2">
          {isLogin ? "Sign in to continue" : "Create an account to get started"}
        </Text>
        <AuthForm isLogin={isLogin}/>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} className="mt-4">
          <Text className="text-gray-400 text-center mt-2">
            {isLogin
              ? "Need an account? Sign up here"
              : "Already registered? Sign in here"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default Auth;
