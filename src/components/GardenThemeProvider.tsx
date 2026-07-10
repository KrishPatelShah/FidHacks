import { ReactNode } from "react";
import { View } from "react-native";
import { useGarden } from "@/state/garden";
import { colors } from "@/theme/colors";
import { setDyslexiaEnabled } from "@/theme/dyslexia";

export function GardenThemeProvider({ children }: { children: ReactNode }) {
  const { dyslexiaMode } = useGarden();

  // Update the module flag during render (ancestors render before descendants,
  // so it's current before any screen's Text renders). Screens all consume the
  // garden context, so toggling re-renders them and the patched Text picks up
  // the new font — no navigator remount (which would blank the router).
  setDyslexiaEnabled(dyslexiaMode);

  return <View style={{ flex: 1, backgroundColor: colors.cream }}>{children}</View>;
}
