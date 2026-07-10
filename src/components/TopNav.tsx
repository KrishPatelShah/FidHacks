import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Logo } from "@/components/Logo";
import { colors, shadow } from "@/theme/colors";

type Props = {
  showProfile?: boolean;
};

// Shared header row: the logo on the left (with a back arrow beside it when there
// is somewhere to go back to) and a profile button on the right.
export function TopNav({ showProfile = true }: Props) {
  usePathname(); // re-render on route change so canGoBack stays current
  const canBack = router.canGoBack();

  return (
    <View style={styles.nav}>
      <Logo height={38} />
      {canBack ? (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons color={colors.darkText} name="chevron-back" size={22} />
        </Pressable>
      ) : null}

      <View style={styles.spacer} />

      {showProfile ? (
        <Pressable
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.push("/(tabs)/profile")}
          style={styles.avatar}
        >
          <Ionicons color={colors.white} name="person" size={22} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  spacer: {
    flex: 1
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
    ...shadow
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 999,
    height: 40,
    justifyContent: "center",
    width: 40
  }
});
