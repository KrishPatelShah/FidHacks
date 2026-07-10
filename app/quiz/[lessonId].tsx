import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { FlowerIcon } from "@/components/FlowerIcon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { getQuizQuestions, QuizAttemptResult, QuizQuestion, submitQuizAttempt } from "@/services/api";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";

export default function QuizScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { applyQuizResult } = useGarden();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const complete = questions.length > 0 && questions.every((question) => answers[question.id] !== undefined);
  const passed = result?.passed ?? false;

  useEffect(() => {
    if (!lessonId) return;
    getQuizQuestions(lessonId)
      .then(setQuestions)
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load this quiz."))
      .finally(() => setLoading(false));
  }, [lessonId]);

  async function submit() {
    if (!complete || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const attempt = await submitQuizAttempt(lessonId, answers);
      setResult(attempt);
      applyQuizResult(attempt);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit your quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setResult(null);
    setAnswers({});
  }

  return (
    <View style={styles.root}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Low-pressure quiz</Text>
        <Text style={styles.title}>Knowledge Check</Text>
        <Text style={styles.subtitle}>Answer, learn from feedback, and retry anytime.</Text>
      </View>

      {loading ? <Text style={styles.status}>Loading quiz...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {questions.map((question, questionIndex) => {
        const selectedAnswer = answers[question.id];
        const answered = selectedAnswer !== undefined;
        const questionResult = result?.questionResults.find((item) => item.id === question.id);
        const correct = questionResult?.correct === true;

        return (
          <View key={question.id} style={styles.card}>
            <Text style={styles.questionCount}>Question {questionIndex + 1} of {questions.length}</Text>
            <Text style={styles.question}>{question.prompt}</Text>
            {question.options.map((option, index) => {
              const selected = selectedAnswer === index;
              return (
                <TouchableOpacity
                  disabled={Boolean(result)}
                  key={option}
                  onPress={() => setAnswers((current) => ({ ...current, [question.id]: index }))}
                  style={[
                    styles.option,
                    selected && styles.optionSelected,
                    questionResult && index === questionResult.correctIndex && styles.optionCorrect,
                    questionResult && selected && !correct && styles.optionIncorrect
                  ]}
                >
                  <Text style={[styles.optionText, selected && !questionResult && styles.optionTextSelected]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
            {answered && result ? (
              <View style={[styles.feedback, correct ? styles.goodFeedback : styles.tryFeedback]}>
                <Ionicons color={correct ? colors.deepGreen : colors.softOrange} name={correct ? "checkmark-circle" : "bulb"} size={18} />
                <Text style={styles.feedbackText}>
                  {correct ? "Correct. " : "Not quite. "}{questionResult?.explanation ?? question.explanation ?? "Review this answer and try again."}
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}

      <View style={styles.reward}>
          <FlowerIcon name={passed ? result?.plant?.flowerName ?? "Daisy" : "Sunflower"} size={54} />
        <View style={styles.rewardText}>
          <Text style={styles.rewardTitle}>
            {result?.plant && result.plant.quantity > 0
              ? `${result.plant.flowerName} progress saved!`
              : passed
                ? "Passed: +Water earned"
                : "Pass to earn water"}
          </Text>
          <Text style={styles.rewardCopy}>
            {result?.plant
              ? `Your updated garden progress has been saved to the server.`
              : "Pass to earn a server-verified garden reward."}
          </Text>
        </View>
      </View>

      <PrimaryButton
        label={passed ? "Return to Garden" : result ? "Retry Quiz" : submitting ? "Submitting..." : "Submit Quiz"}
        onPress={() => (passed ? router.replace("/(tabs)/garden") : result ? retry() : submit())}
      />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.cream,
    flex: 1
  },
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
  status: {
    color: colors.mutedText,
    fontSize: 15
  },
  error: {
    color: "#B42318",
    fontSize: 14,
    lineHeight: 20
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
  optionCorrect: {
    backgroundColor: "#E8F7F0",
    borderColor: colors.deepGreen
  },
  optionIncorrect: {
    backgroundColor: "#FFF4CB",
    borderColor: colors.softOrange
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
