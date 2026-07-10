import { ComponentRef, forwardRef, ReactNode } from "react";
import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "@/theme/colors";

type Props = PressableProps & {
  label: string;
  variant?: "primary" | "secondary";
};

export const PrimaryButton = forwardRef<ComponentRef<typeof View>, Props>(
  ({ label, variant = "primary", style, disabled, ...rest }, ref) => {
    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        {...rest}
        style={({ pressed }) => [
          styles.button,
          variant === "secondary" && styles.secondary,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed
        ]}
      >
        <Text style={[styles.label, variant === "secondary" && styles.secondaryLabel, disabled && styles.disabledLabel]}>{label}</Text>
      </Pressable>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export type ButtonChildProps = Props & { children?: ReactNode };

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 22,
    padding: 16,
    ...shadow
  },
  secondary: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    shadowOpacity: 0.06,
    elevation: 2
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  },
  disabled: {
    backgroundColor: "#C9D8D1",
    opacity: 0.9,
    shadowOpacity: 0
  },
  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  },
  secondaryLabel: {
    color: colors.deepGreen
  },
  disabledLabel: {
    color: "#F7FBF9"
  }
});
