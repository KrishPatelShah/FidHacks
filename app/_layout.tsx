import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GardenThemeProvider } from "@/components/GardenThemeProvider";

export default function RootLayout() {
  return (
    <GardenThemeProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="questionnaire" />
        <Stack.Screen name="lesson/[id]" />
        <Stack.Screen name="quiz/[lessonId]" />
        <Stack.Screen name="sunflower" options={{ presentation: "modal" }} />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GardenThemeProvider>
  );
}
