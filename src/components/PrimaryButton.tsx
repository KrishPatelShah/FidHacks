import { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary";
};

export function PrimaryButton({ label, onPress, variant = "primary" }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, variant === "secondary" && styles.secondary, pressed && styles.pressed]}>
      <Text style={[styles.label, variant === "secondary" && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

export type ButtonChildProps = Props & { children?: ReactNode };

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#234330",
    borderRadius: 18,
    padding: 16
  },
  secondary: {
    backgroundColor: "#e4f0dc"
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900"
  },
  secondaryLabel: {
    color: "#234330"
  }
});
