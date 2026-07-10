import { Link } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet } from "react-native";
import { SunflowerCompanion } from "@/components/SunflowerCompanion";
import { colors, shadow } from "@/theme/colors";

export function FloatingSunflower() {
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
  const rotate = bob.interpolate({ inputRange: [0, 1], outputRange: ["-4deg", "4deg"] });
  const scale = bob.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });

  return (
    <Animated.View pointerEvents="box-none" style={[styles.container, { transform: [{ translateY }, { scale }] }]}>
      <Link href="/sunflower" asChild>
        <Pressable style={styles.button} accessibilityRole="button" accessibilityLabel="Ask the Sunflower financial tutor">
          <Animated.View style={{ transform: [{ rotate }] }}>
            <SunflowerCompanion size={58} />
          </Animated.View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: 98,
    position: "absolute",
    right: 16,
    zIndex: 50
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.sunflowerYellow,
    borderRadius: 40,
    borderWidth: 2,
    height: 72,
    justifyContent: "center",
    width: 72,
    ...shadow
  }
});
