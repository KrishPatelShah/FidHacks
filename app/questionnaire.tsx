import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import {
  assessmentQuestions,
  assessmentSubtitle,
  assessmentTitle,
  levelCopy,
  likertLabels
} from "@/data/assessment";
import { isAssessmentComplete, riskProfileFromAssessment, scoreAssessment, toQuestionnairePayload } from "@/lib/assessment";
import { submitQuestionnaireRemote } from "@/services/api";
import { saveAssessment } from "@/services/assessmentStorage";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { ConfidenceAssessment, ExperienceLevel } from "@/types/domain";

const LIKERT = [1, 2, 3, 4, 5] as const;

export default function QuestionnaireScreen() {
  const { saveConfidenceAssessment, setExperienceLevel, startFreshGarden } = useGarden();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ConfidenceAssessment | null>(null);
  const [saving, setSaving] = useState(false);

  const answeredCount = useMemo(
    () => assessmentQuestions.filter((question) => typeof responses[question.id] === "number").length,
    [responses]
  );
  const progress = answeredCount / assessmentQuestions.length;
  const complete = isAssessmentComplete(responses);

  function setAnswer(questionId: string, value: number) {
    setResponses((current) => ({ ...current, [questionId]: value }));
  }

  async function handleSubmit() {
    if (!complete || saving) return;
    setSaving(true);
    try {
      const scored = scoreAssessment(responses);
      const assessment: ConfidenceAssessment = {
        ...scored,
        completedAt: new Date().toISOString()
      };
      await saveAssessment(assessment);
      saveConfidenceAssessment(assessment, riskProfileFromAssessment(assessment));
      setExperienceLevel(assessment.level.toLowerCase() as ExperienceLevel);
      // Best-effort: persist to the FastAPI backend (also updates the profile path).
      submitQuestionnaireRemote(toQuestionnairePayload(responses));
      setResult(assessment);
    } finally {
      setSaving(false);
    }
  }

  function handleStartGrowing() {
    // Every user begins with an empty clearing — no flowers until they earn them.
    startFreshGarden();
    router.replace("/(tabs)/garden");
  }

  if (result) {
    const copy = levelCopy[result.level];
    return (
      <View style={styles.root}>
        <BackButton onPress={() => setResult(null)} />
        <ScrollView contentContainerStyle={styles.screen}>
          <Text style={styles.eyebrow}>Your results</Text>
          <Text style={styles.title}>You're a {copy.title} grower</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultEmoji}>{copy.emoji}</Text>
            <Text style={styles.resultLevel}>{copy.title}</Text>
            <Text style={styles.resultMeta}>
              Average {result.averageScore.toFixed(1)} · Total {result.totalScore} / {assessmentQuestions.length * 5}
            </Text>
            <Text style={styles.resultCopy}>{copy.description}</Text>
          </View>
          <PrimaryButton label="Start Growing My Garden" onPress={handleStartGrowing} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{assessmentTitle}</Text>
        <Text style={styles.copy}>{assessmentSubtitle}</Text>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressCount}>
              {answeredCount} / {assessmentQuestions.length}
            </Text>
          </View>
          <ProgressBar progress={progress} height={10} />
        </View>

        <View style={styles.legend}>
          {LIKERT.map((value) => (
            <Text key={value} style={styles.legendItem}>
              {value} = {likertLabels[value]}
            </Text>
          ))}
        </View>

        {assessmentQuestions.map((question, index) => {
          const selected = responses[question.id];
          return (
            <View key={question.id} style={styles.card}>
              <Text style={styles.questionNumber}>Question {index + 1} of {assessmentQuestions.length}</Text>
              <Text style={styles.question}>{question.prompt}</Text>
              <View style={styles.row}>
                {LIKERT.map((value) => {
                  const isSelected = selected === value;
                  return (
                    <TouchableOpacity
                      key={value}
                      accessibilityLabel={`${value}: ${likertLabels[value]}`}
                      onPress={() => setAnswer(question.id, value)}
                      style={[styles.rating, isSelected && styles.ratingSelected]}
                    >
                      <Text style={[styles.ratingText, isSelected && styles.ratingTextSelected]}>{value}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {selected ? <Text style={styles.selectedLabel}>{likertLabels[selected as 1 | 2 | 3 | 4 | 5]}</Text> : null}
            </View>
          );
        })}

        <PrimaryButton
          label={saving ? "Saving…" : complete ? "See My Results" : `Answer all ${assessmentQuestions.length} questions`}
          onPress={handleSubmit}
          disabled={!complete || saving}
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
    paddingBottom: 48,
    paddingTop: 72
  },
  eyebrow: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.darkText,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.4,
    lineHeight: 36
  },
  copy: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    gap: 10,
    padding: 16,
    ...shadow
  },
  progressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  progressLabel: {
    color: colors.darkText,
    fontSize: 14,
    fontWeight: "900"
  },
  progressCount: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "900"
  },
  legend: {
    backgroundColor: "#E8F7F0",
    borderRadius: 18,
    gap: 4,
    padding: 14
  },
  legendItem: {
    color: colors.darkText,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 26,
    gap: 12,
    padding: 18,
    ...shadow
  },
  questionNumber: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900",
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
    gap: 10,
    justifyContent: "space-between"
  },
  rating: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: "center"
  },
  ratingSelected: {
    backgroundColor: colors.deepGreen,
    borderColor: colors.deepGreen
  },
  ratingText: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  ratingTextSelected: {
    color: colors.white
  },
  selectedLabel: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "800"
  },
  resultCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 30,
    gap: 10,
    padding: 28,
    ...shadow
  },
  resultEmoji: {
    fontSize: 48
  },
  resultLevel: {
    color: colors.deepGreen,
    fontSize: 28,
    fontWeight: "900"
  },
  resultMeta: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "800"
  },
  resultCopy: {
    color: colors.darkText,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center"
  }
});
