import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlowerIcon } from "@/components/FlowerIcon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { findLesson } from "@/data/lessons";
import { quizQuestions } from "@/data/quizzes";
import { GrowthResult, useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";

export default function QuizScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { passQuiz } = useGarden();
  const questions = quizQuestions[lessonId] ?? quizQuestions.default;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<GrowthResult | null>(null);
  const awarded = useRef(false);
  const passed = questions.every((question) => answers[question.id] === question.correctIndex);
  const category = findLesson(lessonId)?.category ?? "budgeting";
  const rewardFlower = findLesson(lessonId)?.category === "credit_debt" ? "Rose" : "Daisy";

  useEffect(() => {
    if (passed && !awarded.current) {
      awarded.current = true;
      setResult(passQuiz(category));
    }
  }, [passed, passQuiz, category]);

  function retry() {
    awarded.current = false;
    setResult(null);
    setAnswers({});
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Low-pressure quiz</Text>
        <Text style={styles.title}>Knowledge Check</Text>
        <Text style={styles.subtitle}>Answer, learn from feedback, and retry anytime.</Text>
      </View>

      {questions.map((question, questionIndex) => {
        const selectedAnswer = answers[question.id];
        const answered = selectedAnswer !== undefined;
        const correct = selectedAnswer === question.correctIndex;

        return (
          <View key={question.id} style={styles.card}>
            <Text style={styles.questionCount}>Question {questionIndex + 1} of {questions.length}</Text>
            <Text style={styles.question}>{question.prompt}</Text>
            {question.options.map((option, index) => {
              const selected = selectedAnswer === index;
              return (
                <TouchableOpacity key={option} onPress={() => setAnswers((current) => ({ ...current, [question.id]: index }))} style={[styles.option, selected && styles.optionSelected]}>
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
            {answered ? (
              <View style={[styles.feedback, correct ? styles.goodFeedback : styles.tryFeedback]}>
                <Ionicons color={correct ? colors.deepGreen : colors.softOrange} name={correct ? "checkmark-circle" : "bulb"} size={18} />
                <Text style={styles.feedbackText}>{correct ? "Nice. That answer grows your understanding." : question.explanation}</Text>
              </View>
            ) : null}
          </View>
        );
      })}

      <View style={styles.reward}>
        <FlowerIcon name={passed ? rewardFlower : "Sunflower"} size={54} />
        <View style={styles.rewardText}>
          <Text style={styles.rewardTitle}>
            {result?.earnedFlower
              ? `New ${result.flowerName} grown!`
              : passed
                ? "Passed: +Water earned"
                : "Pass to earn water"}
          </Text>
          <Text style={styles.rewardCopy}>
            {result?.earnedFlower
              ? `You now have ${result.quantity} ${result.flowerName}s in your garden.`
              : "Passing this quiz grows flower count instead of rewarding dollar amounts."}
          </Text>
        </View>
      </View>

      <PrimaryButton label={passed ? "Return to Garden" : "Retry Quiz"} onPress={() => (passed ? router.replace("/(tabs)/garden") : retry())} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    gap: 16,
    padding: 24,
    paddingBottom: 42,
    paddingTop: 72
  },
  header: {
    gap: 7
  },
  eyebrow: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.darkText,
    fontSize: 34,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    gap: 12,
    padding: 18,
    ...shadow
  },
  questionCount: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  question: {
    color: colors.darkText,
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 26
  },
  option: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15
  },
  optionSelected: {
    backgroundColor: colors.deepGreen,
    borderColor: colors.deepGreen
  },
  optionText: {
    color: colors.darkText,
    fontWeight: "800"
  },
  optionTextSelected: {
    color: colors.white
  },
  feedback: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    padding: 12
  },
  goodFeedback: {
    backgroundColor: "#E8F7F0"
  },
  tryFeedback: {
    backgroundColor: "#FFF4CB"
  },
  feedbackText: {
    color: colors.darkText,
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  },
  reward: {
    alignItems: "center",
    backgroundColor: "#FFF4CB",
    borderRadius: 26,
    flexDirection: "row",
    gap: 12,
    padding: 16
  },
  rewardText: {
    flex: 1,
    gap: 3
  },
  rewardTitle: {
    color: colors.darkText,
    fontSize: 18,
    fontWeight: "900"
  },
  rewardCopy: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20
  }
});
