import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, shadow } from "@/theme/colors";

// Floating profile avatar for full-screen pages that already show a floating
// BackButton (lesson, quiz). Mirrors BackButton's placement on the right.
export function ProfileButton() {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityLabel="Open profile"
      accessibilityRole="button"
      hitSlop={10}
      onPress={() => router.push("/(tabs)/profile")}
      style={({ pressed }) => [styles.button, { top: insets.top + 8 }, pressed && styles.pressed]}
    >
      <Ionicons color={colors.white} name="person" size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 999,
    height: 40,
    justifyContent: "center",
    position: "absolute",
    right: 16,
    width: 40,
    zIndex: 20,
    ...shadow
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }]
  }
});
