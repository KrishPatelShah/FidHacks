import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FlowerIcon } from "@/components/FlowerIcon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Term } from "@/components/Term";
import { completeLesson, getLesson } from "@/services/api";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { Lesson } from "@/types/domain";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshAccount } = useGarden();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getLesson(id)
      .then(setLesson)
      .catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load this lesson."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleTakeQuiz() {
    if (lesson) {
      try {
        await completeLesson(lesson.id);
        await refreshAccount();
        setError(null);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not record your lesson progress.");
        return;
      }
      router.push(`/quiz/${lesson.id}`);
    }
  }

  if (loading) {
    return <View style={styles.screen}><Text style={styles.title}>Loading lesson...</Text></View>;
  }

  if (!lesson) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Lesson not found</Text>
        {error ? <Text style={styles.copy}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <FlowerIcon name={lesson.category === "credit_debt" ? "Rose" : "Daisy"} size={64} />
        </View>
        <Text style={styles.kicker}>{lesson.category.replace("_", " ")}</Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.copy}>{lesson.summary}</Text>
      </View>

      <View style={styles.lessonBox}>
        <Text style={styles.sectionTitle}>Tiny lesson</Text>
        <Text style={styles.copy}>Money concepts become easier when you compare the plan with what happened.</Text>
        <View style={styles.inlineRow}>
          <Text style={styles.copy}>If your </Text>
          <Term label="actual spending" definition="The amount you really spent during a period." />
          <Text style={styles.copy}> is higher than expected, the gap is a signal to review habits.</Text>
        </View>
        <View style={styles.inlineRow}>
          <Text style={styles.copy}>Terms like </Text>
          <Term label="APR" definition="The yearly cost of borrowing money, shown as a percentage." />
          <Text style={styles.copy}>, </Text>
          <Term label="Roth IRA" definition="A retirement account type with specific tax rules." />
          <Text style={styles.copy}>, </Text>
          <Term label="401(k)" definition="An employer-sponsored retirement account." />
          <Text style={styles.copy}>, </Text>
          <Term label="index fund" definition="A fund designed to track a market index." />
          <Text style={styles.copy}>, and </Text>
          <Term label="employer match" definition="Money an employer contributes to your retirement account when you contribute." />
          <Text style={styles.copy}> can be tapped for help.</Text>
        </View>
      </View>

      <View style={styles.rewardCard}>
        <Ionicons color={colors.sunflowerYellow} name="sparkles" size={22} />
        <View style={styles.rewardText}>
          <Text style={styles.rewardTitle}>Pass the knowledge check to grow your garden</Text>
          <Text style={styles.rewardCopy}>Your FastAPI garden records rewards only after a passed quiz.</Text>
        </View>
      </View>

      <PrimaryButton label="Take Quiz" onPress={handleTakeQuiz} />
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
  hero: {
    alignItems: "flex-start",
    backgroundColor: colors.card,
    borderRadius: 32,
    gap: 10,
    padding: 22,
    ...shadow
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 24,
    height: 78,
    justifyContent: "center",
    width: 78
  },
  kicker: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.darkText,
    fontSize: 33,
    fontWeight: "900",
    letterSpacing: -0.6,
    lineHeight: 39
  },
  copy: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 25
  },
  lessonBox: {
    backgroundColor: colors.card,
    borderRadius: 28,
    gap: 14,
    padding: 20,
    ...shadow
  },
  sectionTitle: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "900"
  },
  inlineRow: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  rewardCard: {
    alignItems: "center",
    backgroundColor: "#FFF4CB",
    borderRadius: 24,
    flexDirection: "row",
    gap: 12,
    padding: 16
  },
  rewardText: {
    flex: 1,
    gap: 2
  },
  rewardTitle: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  rewardCopy: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20
  }
});
