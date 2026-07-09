import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { quizQuestions } from "@/data/quizzes";

export default function QuizScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const questions = quizQuestions[lessonId] ?? quizQuestions.default;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const passed = questions.every((question) => answers[question.id] === question.correctIndex);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Knowledge Check</Text>
      {questions.map((question) => (
        <View key={question.id} style={styles.card}>
          <Text style={styles.question}>{question.prompt}</Text>
          {question.options.map((option, index) => {
            const selected = answers[question.id] === index;
            return (
              <TouchableOpacity key={option} onPress={() => setAnswers((current) => ({ ...current, [question.id]: index }))} style={[styles.option, selected && styles.optionSelected]}>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
          {answers[question.id] !== undefined && answers[question.id] !== question.correctIndex ? (
            <Text style={styles.feedback}>{question.explanation}</Text>
          ) : null}
        </View>
      ))}
      <View style={styles.reward}>
        <Text style={styles.rewardTitle}>{passed ? "Passed: +Water earned" : "Answer all questions correctly to earn water"}</Text>
        <Text style={styles.feedback}>Passing this quiz grows the related flower count instead of rewarding dollar amounts.</Text>
      </View>
      <PrimaryButton label={passed ? "Return to Garden" : "Retry Quiz"} onPress={() => (passed ? router.replace("/(tabs)/garden") : setAnswers({}))} />
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
    fontSize: 32,
    fontWeight: "900"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    gap: 10,
    padding: 18
  },
  question: {
    color: "#234330",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 25
  },
  option: {
    backgroundColor: "#f7efd9",
    borderRadius: 15,
    padding: 14
  },
  optionSelected: {
    backgroundColor: "#234330"
  },
  optionText: {
    color: "#234330",
    fontWeight: "800"
  },
  optionTextSelected: {
    color: "#ffffff"
  },
  feedback: {
    color: "#65735f",
    fontSize: 14,
    lineHeight: 20
  },
  reward: {
    backgroundColor: "#e4f0dc",
    borderRadius: 20,
    padding: 16
  },
  rewardTitle: {
    color: "#234330",
    fontSize: 18,
    fontWeight: "900"
  }
});
