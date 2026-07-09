import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { FloatingSunflower } from "@/components/FloatingSunflower";
import { PrimaryButton } from "@/components/PrimaryButton";
import { budgetCategories, sampleBudgetEntries } from "@/data/budget";
import { colors, shadow } from "@/theme/colors";
import { BudgetCategory } from "@/types/domain";

type Mode = "expected" | "current" | "difference";

const chartColors = [colors.deepGreen, colors.softOrange, colors.skyBlue, colors.roseRed, colors.orchidPurple, colors.sunflowerYellow];
const icons: Record<BudgetCategory, keyof typeof Ionicons.glyphMap> = {
  savings_investments: "sparkles",
  living_expenses: "home",
  education_career: "school",
  lifestyle: "cafe",
  debt: "card",
  taxes: "receipt"
};

export default function BudgetScreen() {
  const [mode, setMode] = useState<Mode>("expected");
  const [entries, setEntries] = useState(sampleBudgetEntries);
  const total = entries.reduce((sum, entry) => sum + entry.expectedAmount, 0);
  const chartData = entries.map((entry, index) => {
    const value = mode === "expected" ? entry.expectedAmount : mode === "current" ? entry.actualAmount : Math.abs(entry.actualAmount - entry.expectedAmount);
    return {
      value: Math.max(value, 1),
      color: chartColors[index]
    };
  });

  function updateAmount(category: BudgetCategory, field: "expectedAmount" | "actualAmount", value: string) {
    const amount = Number(value.replace(/[^0-9.]/g, ""));
    setEntries((current) => current.map((entry) => (entry.category === category ? { ...entry, [field]: Number.isFinite(amount) ? amount : 0 } : entry)));
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget Garden</Text>
        <Text style={styles.subtitle}>Compare what you planned with what happened.</Text>
      </View>

      <View style={styles.toggle}>
        {(["expected", "current", "difference"] as const).map((item) => (
          <TouchableOpacity key={item} onPress={() => setMode(item)} style={[styles.toggleItem, mode === item && styles.toggleActive]}>
            <Text style={[styles.toggleText, mode === item && styles.toggleTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chartCard}>
        <PieChart
          data={chartData}
          donut
          radius={112}
          innerRadius={70}
          centerLabelComponent={() => (
            <View style={styles.center}>
              <Text style={styles.centerLabel}>{mode}</Text>
              <Text style={styles.centerValue}>${total}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Gentle insight</Text>
        <Text style={styles.insightCopy}>Looks like Lifestyle spending was higher than expected. Want to review what changed?</Text>
        <Link href="/sunflower" asChild>
          <PrimaryButton label="Ask Sunflower to Explain" variant="secondary" />
        </Link>
      </View>

      <View style={styles.comparisons}>
        <Text style={styles.sectionTitle}>Comparison cards</Text>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonText}>Lifestyle: +10% over expected</Text>
        </View>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonText}>Savings: 5% under expected</Text>
        </View>
        <View style={styles.comparisonRow}>
          <Text style={styles.comparisonText}>Living Expenses: on track</Text>
        </View>
      </View>

      <View style={styles.formHeader}>
        <Text style={styles.sectionTitle}>Budget Input</Text>
        <Text style={styles.helper}>Your garden grows when you reflect, not when you spend perfectly.</Text>
      </View>

      <PrimaryButton label="Use Sample Budget" onPress={() => setEntries(sampleBudgetEntries)} />

      {entries.map((entry) => {
        const category = budgetCategories[entry.category];
        return (
          <View key={entry.category} style={styles.entry}>
            <View style={styles.entryHeader}>
              <View style={styles.categoryIcon}>
                <Ionicons color={colors.deepGreen} name={icons[entry.category]} size={18} />
              </View>
              <Text style={styles.entryTitle}>{category}</Text>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Expected</Text>
                <TextInput keyboardType="numeric" value={String(entry.expectedAmount)} onChangeText={(value) => updateAmount(entry.category, "expectedAmount", value)} style={styles.input} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Actual</Text>
                <TextInput keyboardType="numeric" value={String(entry.actualAmount)} onChangeText={(value) => updateAmount(entry.category, "actualAmount", value)} style={styles.input} />
              </View>
            </View>
            <Text style={styles.difference}>Difference: ${Math.abs(entry.actualAmount - entry.expectedAmount)}</Text>
          </View>
        );
      })}

      <PrimaryButton label="Save Budget" />
      <FloatingSunflower message="Your budget changed this week." />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    gap: 16,
    padding: 20,
    paddingBottom: 110,
    paddingTop: 64
  },
  header: {
    gap: 8
  },
  title: {
    color: colors.darkText,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.5
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23
  },
  toggle: {
    backgroundColor: "#E9D8B9",
    borderRadius: 22,
    flexDirection: "row",
    padding: 5
  },
  toggleItem: {
    alignItems: "center",
    borderRadius: 17,
    flex: 1,
    padding: 11
  },
  toggleActive: {
    backgroundColor: colors.deepGreen
  },
  toggleText: {
    color: colors.mutedText,
    fontWeight: "900",
    textTransform: "capitalize"
  },
  toggleTextActive: {
    color: colors.white
  },
  chartCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 30,
    padding: 24,
    ...shadow
  },
  center: {
    alignItems: "center"
  },
  centerLabel: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  centerValue: {
    color: colors.darkText,
    fontSize: 22,
    fontWeight: "900"
  },
  insightCard: {
    backgroundColor: "#FFF4CB",
    borderRadius: 26,
    gap: 10,
    padding: 18
  },
  insightTitle: {
    color: colors.darkText,
    fontSize: 19,
    fontWeight: "900"
  },
  insightCopy: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22
  },
  comparisons: {
    gap: 10
  },
  sectionTitle: {
    color: colors.darkText,
    fontSize: 21,
    fontWeight: "900"
  },
  comparisonRow: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14
  },
  comparisonText: {
    color: colors.darkText,
    fontWeight: "800"
  },
  formHeader: {
    gap: 4,
    marginTop: 6
  },
  helper: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20
  },
  entry: {
    backgroundColor: colors.card,
    borderRadius: 24,
    gap: 12,
    padding: 16,
    ...shadow
  },
  entryHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  categoryIcon: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 14,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  entryTitle: {
    color: colors.darkText,
    flex: 1,
    fontSize: 17,
    fontWeight: "900"
  },
  inputRow: {
    flexDirection: "row",
    gap: 10
  },
  inputGroup: {
    flex: 1,
    gap: 6
  },
  inputLabel: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "800",
    padding: 12
  },
  difference: {
    color: colors.deepGreen,
    fontWeight: "900"
  }
});
