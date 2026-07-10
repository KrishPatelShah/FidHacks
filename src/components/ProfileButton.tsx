import { Link } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, shadow } from "@/theme/colors";

// Floating profile avatar for full-screen pages that already show a floating
// BackButton (lesson, quiz). Mirrors BackButton's placement on the right.
export function ProfileButton() {
  const insets = useSafeAreaInsets();

  return (
    <Link
      accessibilityLabel="Open profile"
      accessibilityRole="button"
      href="/(tabs)/profile"
      style={[styles.button, { top: insets.top + 8 }]}
    >
      <Text style={styles.text}>DG</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.deepGreen,
    borderRadius: 999,
    height: 40,
    overflow: "hidden",
    position: "absolute",
    right: 16,
    textAlign: "center",
    width: 40,
    zIndex: 20,
    ...shadow
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 40,
    textAlign: "center"
  }
});
