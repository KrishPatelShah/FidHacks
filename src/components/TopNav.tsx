import { Ionicons } from "@expo/vector-icons";
import { Link, router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "@/theme/colors";

type Props = {
  showProfile?: boolean;
};

// Shared header row for the tab screens: a back arrow on the left (only when
// there is somewhere to go back to) and a profile avatar on the right.
export function TopNav({ showProfile = true }: Props) {
  usePathname(); // re-render on route change so canGoBack stays current
  const canBack = router.canGoBack();

  return (
    <View style={styles.nav}>
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
      ) : (
        <View style={styles.placeholder} />
      )}

      {showProfile ? (
        <Link accessibilityLabel="Open profile" accessibilityRole="button" href="/(tabs)/profile" style={styles.avatar}>
          <Text style={styles.avatarText}>DG</Text>
        </Link>
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
    backgroundColor: colors.deepGreen,
    borderRadius: 999,
    height: 40,
    overflow: "hidden",
    textAlign: "center",
    width: 40
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 40,
    textAlign: "center"
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
