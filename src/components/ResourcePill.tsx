import { StyleSheet, Text, View } from "react-native";

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
    backgroundColor: "#e4f0dc",
    borderRadius: 18,
    flex: 1,
    padding: 12
  },
  value: {
    color: "#234330",
    fontSize: 20,
    fontWeight: "900"
  },
  label: {
    color: "#65735f",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase"
  }
});
