import { signIn, signUp } from "@/services/authService";
import { FormData } from "@/types/auth";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const AuthForm = ({ isLogin }: any) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Invalid email format");
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return false;
    }

    if (!isLogin) {
    
      if (formData.password !== formData.confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return false;
      }
    }
    return true;
  };

  const handleAuth = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        router.replace("/(tabs)");
      } else {
        await signUp(formData.email, formData.password);
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  return (
    <View className="w-full px-4 gap-4">
      <View className="">
        <Text className="mb-2 text-white uppercase text-lg font-semibold">
          Email
        </Text>
        <TextInput
          placeholder={"Introduce your email"}
          placeholderTextColor="#ccc"
          className="p-4 rounded-lg border-1 text-left text-white border-red-500"
          style={{ borderWidth: 1, borderColor: "#6b7280" }}
          value={formData.email}
          onChangeText={(text: string) =>
            setFormData((prev) => ({ ...prev, email: text }))
          }
        />
      </View>
      <View>
        <Text className="mb-2 text-white uppercase text-lg font-semibold">
          Password
        </Text>
        <TextInput
          placeholder="Introduce your password"
          placeholderTextColor="#ccc"
          className="p-4 rounded-lg border-1 text-left text-white border-red-500"
          style={{ borderWidth: 1, borderColor: "#6b7280" }}
          value={formData.password}
          onChangeText={(text: string) =>
            setFormData((prev) => ({ ...prev, password: text }))
          }
          secureTextEntry
          textContentType="oneTimeCode"
        />
      </View>
      {!isLogin && (
        <View>
          <Text className="mb-2 text-white uppercase text-lg font-semibold">
            Confirm password
          </Text>
          <TextInput
            placeholder={"Introduce your password"}
            placeholderTextColor="#ccc"
            className="p-4 rounded-lg border-1 text-left text-white border-red-500"
            style={{ borderWidth: 1, borderColor: "#6b7280" }}
            value={formData.confirmPassword}
            onChangeText={(text: string) =>
              setFormData((prev) => ({ ...prev, confirmPassword: text }))
            }
            secureTextEntry
          />
        </View>
      )}
      {isLogin ? (
        <TouchableOpacity
          className="bg-light-100 p-4 rounded-lg"
          onPress={handleAuth}
        >
          <Text className="text-center">Log in</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-light-100 p-4 rounded-lg"
          onPress={handleAuth}
        >
          <Text className="text-center">Register</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default AuthForm;
