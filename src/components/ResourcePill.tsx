import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

export function ResourcePill({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    padding: 12
  },
  value: {
    color: colors.deepGreen,
    fontSize: 20,
    fontWeight: "900"
  },
  label: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase"
  }
});
