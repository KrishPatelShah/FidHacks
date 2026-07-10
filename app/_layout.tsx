import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GardenThemeProvider } from "@/components/GardenThemeProvider";
import { GardenProvider } from "@/state/garden";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../assets/OpenDyslexic.otf"),
    "OpenDyslexic-Bold": require("../assets/OpenDyslexic-Bold.otf")
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GardenProvider>
      <GardenThemeProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="questionnaire" />
          <Stack.Screen name="module/[id]" />
          <Stack.Screen name="lesson/[id]" />
          <Stack.Screen name="quiz/[lessonId]" />
          <Stack.Screen name="sunflower" options={{ presentation: "modal" }} />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GardenThemeProvider>
    </GardenProvider>
  );
}
