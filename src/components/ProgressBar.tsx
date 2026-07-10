import { StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";

type Props = {
  progress: number;
  color?: string;
  track?: string;
  height?: number;
};

export function ProgressBar({ progress, color = colors.deepGreen, track = "#E9D8B9", height = 12 }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { backgroundColor: track, height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { backgroundColor: color, width: `${clamped * 100}%`, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: "hidden",
    width: "100%"
  },
  fill: {
    height: "100%"
  }
});
