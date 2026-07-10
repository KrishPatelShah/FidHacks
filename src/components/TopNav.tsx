import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Logo } from "@/components/Logo";
import { colors, shadow } from "@/theme/colors";

type Props = {
  showProfile?: boolean;
};

// Shared header row: the logo on the left (with a back arrow beside it when there
// is somewhere to go back to) and a profile avatar on the right.
export function TopNav({ showProfile = true }: Props) {
  usePathname(); // re-render on route change so canGoBack stays current
  const canBack = router.canGoBack();

  return (
    <View style={styles.nav}>
      <View style={styles.left}>
        <Logo height={40} />
        {canBack ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Ionicons color={colors.darkText} name="chevron-back" size={22} />
          </Pressable>
        ) : null}
      </View>

      {showProfile ? (
        <Pressable
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => router.push("/(tabs)/profile")}
          style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
        >
          <Ionicons color={colors.white} name="person" size={22} />
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  left: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
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
  },
  placeholder: {
    height: 40,
    width: 40
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }]
  }
});
