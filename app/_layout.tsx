import { Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "react-native";
import { AuthProvider } from "@/context/AuthProvider";

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <StatusBar hidden={false} />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="movie/[id]"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>
    </>
  );
}
