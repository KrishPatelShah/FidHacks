import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, shadow } from "@/theme/colors";

type Props = {
  onPress?: () => void;
};

export function BackButton({ onPress }: Props) {
  const insets = useSafeAreaInsets();

  function handlePress() {
    if (onPress) {
      onPress();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  return (
    <Pressable
      accessibilityLabel="Go back"
      accessibilityRole="button"
      hitSlop={10}
      onPress={handlePress}
      style={({ pressed }) => [styles.button, { top: insets.top + 8 }, pressed && styles.pressed]}
    >
      <Ionicons color={colors.darkText} name="chevron-back" size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    left: 16,
    position: "absolute",
    width: 40,
    zIndex: 20,
    ...shadow
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }]
  }
});
