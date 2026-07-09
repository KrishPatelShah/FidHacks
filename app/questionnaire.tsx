import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { questionnaireCategories } from "@/data/questionnaire";
import { recommendPath } from "@/lib/recommendPath";

export default function QuestionnaireScreen() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const path = recommendPath(ratings);

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
      <PrimaryButton label="Start My Garden" onPress={() => router.replace("/(tabs)/garden")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#fffaf0",
    gap: 16,
    padding: 24,
    paddingTop: 72
  },
  title: {
    color: "#234330",
    fontSize: 30,
    fontWeight: "900"
  },
  copy: {
    color: "#65735f",
    fontSize: 16,
    lineHeight: 23
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    gap: 12,
    padding: 18
  },
  flower: {
    color: "#a56620",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  question: {
    color: "#234330",
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
    backgroundColor: "#f4ead0",
    borderRadius: 14,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  ratingSelected: {
    backgroundColor: "#234330"
  },
  ratingText: {
    color: "#234330",
    fontWeight: "900"
  },
  ratingTextSelected: {
    color: "#ffffff"
  },
  recommendation: {
    backgroundColor: "#e4f0dc",
    borderRadius: 22,
    padding: 18
  },
  recommendationLabel: {
    color: "#65735f",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  recommendationValue: {
    color: "#234330",
    fontSize: 24,
    fontWeight: "900",
    textTransform: "capitalize"
  }
});
