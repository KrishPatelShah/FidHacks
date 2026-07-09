import { ReactNode } from "react";
import { View } from "react-native";

export function GardenThemeProvider({ children }: { children: ReactNode }) {
  return <View style={{ flex: 1, backgroundColor: "#fffaf0" }}>{children}</View>;
}
