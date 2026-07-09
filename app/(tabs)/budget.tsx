import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { PrimaryButton } from "@/components/PrimaryButton";
import { budgetCategories, sampleBudgetEntries } from "@/data/budget";

type Mode = "expected" | "actual" | "difference";

export default function BudgetScreen() {
  const [mode, setMode] = useState<Mode>("expected");
  const [entries, setEntries] = useState(sampleBudgetEntries);
  const chartData = entries.map((entry, index) => {
    const value = mode === "expected" ? entry.expectedAmount : mode === "actual" ? entry.actualAmount : Math.abs(entry.actualAmount - entry.expectedAmount);
    return {
      value,
      color: ["#6f9e6e", "#d7a84f", "#5a92b8", "#d96f4a", "#b95f6d", "#8c78b5"][index]
    };
  });

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Expected vs. Actual</Text>
      <View style={styles.toggle}>
        {(["expected", "actual", "difference"] as const).map((item) => (
          <TouchableOpacity key={item} onPress={() => setMode(item)} style={[styles.toggleItem, mode === item && styles.toggleActive]}>
            <Text style={[styles.toggleText, mode === item && styles.toggleTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.chartCard}>
        <PieChart data={chartData} donut radius={104} innerRadius={64} centerLabelComponent={() => <Text style={styles.centerLabel}>{mode}</Text>} />
      </View>
      <PrimaryButton label="Use Sample Budget" onPress={() => setEntries(sampleBudgetEntries)} />
      {entries.map((entry) => {
        const category = budgetCategories[entry.category];
        return (
          <View key={entry.category} style={styles.entry}>
            <Text style={styles.entryTitle}>{category}</Text>
            <View style={styles.inputRow}>
              <TextInput keyboardType="numeric" value={String(entry.expectedAmount)} style={styles.input} />
              <TextInput keyboardType="numeric" value={String(entry.actualAmount)} style={styles.input} />
            </View>
            <Text style={styles.insight}>Difference: ${Math.abs(entry.actualAmount - entry.expectedAmount)}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#fffaf0",
    gap: 16,
    padding: 20,
    paddingTop: 64
  },
  title: {
    color: "#234330",
    fontSize: 32,
    fontWeight: "900"
  },
  toggle: {
    backgroundColor: "#eadcb9",
    borderRadius: 18,
    flexDirection: "row",
    padding: 5
  },
  toggleItem: {
    alignItems: "center",
    borderRadius: 14,
    flex: 1,
    padding: 10
  },
  toggleActive: {
    backgroundColor: "#234330"
  },
  toggleText: {
    color: "#65735f",
    fontWeight: "900",
    textTransform: "capitalize"
  },
  toggleTextActive: {
    color: "#ffffff"
  },
  chartCard: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24
  },
  centerLabel: {
    color: "#234330",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  entry: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    gap: 10,
    padding: 16
  },
  entryTitle: {
    color: "#234330",
    fontSize: 17,
    fontWeight: "900"
  },
  inputRow: {
    flexDirection: "row",
    gap: 10
  },
  input: {
    backgroundColor: "#f7efd9",
    borderRadius: 12,
    flex: 1,
    padding: 12
  },
  insight: {
    color: "#65735f",
    fontWeight: "700"
  }
});
