import { ReactNode } from "react";
import { View } from "react-native";
import { colors } from "@/theme/colors";

export function GardenThemeProvider({ children }: { children: ReactNode }) {
  return <View style={{ flex: 1, backgroundColor: colors.cream }}>{children}</View>;
}
