import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { questionnaireCategories } from "@/data/questionnaire";
import { recommendPath } from "@/lib/recommendPath";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { RiskProfile } from "@/types/domain";
import { submitQuestionnaire } from "@/services/api";

export default function QuestionnaireScreen() {
  const { setRiskProfile, refreshAccount } = useGarden();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const path = recommendPath(ratings);

  async function handleStart() {
    setSubmitting(true);
    setError(null);
    const investing = ratings.investingConfidence ?? 0;
    const profile: RiskProfile = investing >= 4 ? "Aggressive" : investing >= 3 ? "Moderate" : "Conservative";
    try {
      await submitQuestionnaire(ratings);
      setRiskProfile(profile);
      await refreshAccount();
      router.replace("/(tabs)/garden");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Personalize your path</Text>
      <Text style={styles.copy}>Rate your confidence from 1 to 5. Lower scores help us recommend starter flowers first.</Text>
      {questionnaireCategories.map((category) => (
        <View key={category.key} style={styles.card}>
          <Text style={styles.flower}>{category.flower}</Text>
          <Text style={styles.question}>{category.question}</Text>
          <View style={styles.row}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setRatings((current) => ({ ...current, [category.key]: value }))}
                style={[styles.rating, ratings[category.key] === value && styles.ratingSelected]}
              >
                <Text style={[styles.ratingText, ratings[category.key] === value && styles.ratingTextSelected]}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      <View style={styles.recommendation}>
        <Text style={styles.recommendationLabel}>Recommended path</Text>
        <Text style={styles.recommendationValue}>{path}</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton label={submitting ? "Saving..." : "Start My Garden"} onPress={handleStart} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    gap: 16,
    padding: 24,
    paddingTop: 72
  },
  title: {
    color: colors.darkText,
    fontSize: 30,
    fontWeight: "900"
  },
  copy: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 26,
    gap: 12,
    padding: 18,
    ...shadow
  },
  flower: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  question: {
    color: colors.darkText,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24
  },
  row: {
    flexDirection: "row",
    gap: 10
  },
  rating: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  ratingSelected: {
    backgroundColor: colors.deepGreen
  },
  ratingText: {
    color: colors.darkText,
    fontWeight: "900"
  },
  ratingTextSelected: {
    color: "#ffffff"
  },
  recommendation: {
    backgroundColor: "#E8F7F0",
    borderRadius: 24,
    padding: 18
  },
  recommendationLabel: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  recommendationValue: {
    color: colors.deepGreen,
    fontSize: 24,
    fontWeight: "900",
    textTransform: "capitalize"
  },
  error: {
    color: "#B42318",
    fontSize: 14,
    lineHeight: 20
  }
});
