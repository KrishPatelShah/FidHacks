import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/AppText";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";

export function AchievementCelebration() {
  const { celebration, dismissCelebration } = useGarden();
  const scale = useRef(new Animated.Value(0.8)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!celebration) return;
    scale.setValue(0.8);
    spin.setValue(0);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 120 }).start();
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, [celebration, scale, spin]);

  if (!celebration) return null;

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Modal transparent animationType="fade" visible onRequestClose={dismissCelebration}>
      <Pressable style={styles.backdrop} onPress={dismissCelebration}>
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <Text style={styles.eyebrow}>Achievement unlocked</Text>
          <View style={styles.badgeWrap}>
            <Animated.View style={[styles.rays, { transform: [{ rotate }] }]}>
              <Ionicons color={colors.sunflowerYellow} name="sunny" size={110} />
            </Animated.View>
            <View style={styles.badge}>
              <Ionicons color={colors.white} name={celebration.icon as keyof typeof Ionicons.glyphMap} size={40} />
            </View>
          </View>
          <Text style={styles.title}>{celebration.title}</Text>
          <Text style={styles.description}>{celebration.description}</Text>
          <Pressable onPress={dismissCelebration} style={styles.button}>
            <Text style={styles.buttonText}>Keep growing</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(15, 61, 48, 0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 28
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 30,
    gap: 10,
    padding: 28,
    width: "100%",
    ...shadow
  },
  eyebrow: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  badgeWrap: {
    alignItems: "center",
    height: 130,
    justifyContent: "center",
    marginVertical: 4,
    width: 130
  },
  rays: {
    position: "absolute"
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 34,
    height: 68,
    justifyContent: "center",
    width: 68,
    ...shadow
  },
  title: {
    color: colors.darkText,
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center"
  },
  description: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center"
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 20,
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    width: "100%"
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  }
});
