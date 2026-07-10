import { forwardRef } from "react";
import { StyleSheet, Text as RNText, TextProps } from "react-native";
import { useGarden } from "@/state/garden";

// Custom fonts don't respond to fontWeight, so pick the matching face manually.
const BOLD_WEIGHTS = new Set<string | number>(["bold", "600", "700", "800", "900", 600, 700, 800, 900]);

// Drop-in replacement for react-native's Text. When dyslexia mode is on it applies
// the OpenDyslexic font family (bold weights get the bold face); otherwise it's a
// plain Text. Because only real text uses this component — icons render via
// @expo/vector-icons and pictures via Image/SVG — the dyslexia font never touches
// icons or images.
export const Text = forwardRef<RNText, TextProps>(function AppText({ style, ...props }, ref) {
  const { dyslexiaMode } = useGarden();
  if (!dyslexiaMode) {
    return <RNText ref={ref} style={style} {...props} />;
  }
  const flat = (StyleSheet.flatten(style) ?? {}) as { fontWeight?: string | number };
  const fontFamily = BOLD_WEIGHTS.has(flat.fontWeight as never) ? "OpenDyslexic-Bold" : "OpenDyslexic";
  return <RNText ref={ref} style={[style, { fontFamily }]} {...props} />;
});
