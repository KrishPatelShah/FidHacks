import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/AppText";
import { BackButton } from "@/components/BackButton";
import { ProfileButton } from "@/components/ProfileButton";
import { FlowerIcon } from "@/components/FlowerIcon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { VideoEmbed } from "@/components/VideoEmbed";
import { findLesson } from "@/data/lessons";
import { completeLesson } from "@/services/api";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";

// Flower, accent and readable label shown per module category.
const categoryMeta: Record<string, { flower: string; accent: string; label: string }> = {
  budgeting: { flower: "Daisy", accent: colors.sunflowerYellow, label: "Budgeting" },
  savings: { flower: "Marigold", accent: colors.softOrange, label: "Savings" },
  credit_debt: { flower: "Rose", accent: colors.roseRed, label: "Credit & Debt" },
  retirement: { flower: "Orchid", accent: colors.orchidPurple, label: "Retirement" },
  funds: { flower: "Purple Tulip", accent: colors.orchidPurple, label: "Investing" }
};

function prettyHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshAccount } = useGarden();
  const lesson = findLesson(id);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleTakeQuiz() {
    if (!lesson || busy) return;
    setBusy(true);
    try {
      // Best-effort: record lesson completion on the server. Offline, this is a
      // no-op and progress is tracked client-side after the quiz instead.
      await completeLesson(lesson.id);
      await refreshAccount();
    } catch {
      // Never block the learner from taking the quiz if the sync fails.
    } finally {
      setBusy(false);
    }
    router.push(`/quiz/${lesson.id}`);
  }

  if (!lesson) {
    return (
      <View style={styles.root}>
        <BackButton />
        <View style={styles.screen}>
          <Text style={styles.title}>Lesson not found</Text>
        </View>
      </View>
    );
  }

  const meta = categoryMeta[lesson.category] ?? categoryMeta.budgeting;

  return (
    <View style={styles.root}>
      <BackButton />
      <ProfileButton />
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.hero}>
          <View style={[styles.iconWrap, { backgroundColor: `${meta.accent}33` }]}>
            <FlowerIcon name={meta.flower} size={58} />
          </View>
          <View style={styles.kickerRow}>
            <Text style={styles.kicker}>{meta.label}</Text>
            <Text style={styles.difficulty}>{lesson.difficulty}</Text>
          </View>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.summary}>{lesson.summary}</Text>
        </View>

        {lesson.videoUrl ? (
          <View style={styles.videoCard}>
            <View style={styles.videoHeader}>
              <View style={styles.videoIcon}>
                <Ionicons color={colors.roseRed} name="play" size={18} />
              </View>
              <View style={styles.videoHeaderText}>
                <Text style={styles.videoTitle}>Watch & learn</Text>
                <Text style={styles.videoSubtitle}>A quick video to bring this lesson to life</Text>
              </View>
            </View>
            <VideoEmbed url={lesson.videoUrl} />
          </View>
        ) : null}

        {lesson.sourceUrl ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Linking.openURL(lesson.sourceUrl!)}
            style={styles.sourceCard}
          >
            <View style={styles.sourceIcon}>
              <Ionicons color={colors.deepGreen} name="book" size={20} />
            </View>
            <View style={styles.sourceText}>
              <Text style={styles.sourceTitle}>Read the full lesson</Text>
              <Text style={styles.sourceUrl} numberOfLines={1}>{prettyHost(lesson.sourceUrl)}</Text>
            </View>
            <Ionicons color={colors.mutedText} name="open-outline" size={20} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>Pass the quiz to grow your {meta.flower}</Text>
          <Text style={styles.rewardCopy}>
            Complete the knowledge check to bloom a new flower in your garden.
          </Text>
          <View style={styles.rewardRow}>
            <View style={styles.rewardPill}>
              <FlowerIcon name={meta.flower} size={16} />
              <Text style={styles.rewardPillText}>+1 {meta.flower}</Text>
            </View>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton label={busy ? "Loading quiz..." : "Take Quiz"} onPress={handleTakeQuiz} />
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
    gap: 14,
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
    borderRadius: 24,
    height: 78,
    justifyContent: "center",
    marginBottom: 2,
    width: 78
  },
  kickerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  kicker: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  difficulty: {
    backgroundColor: "#E8F7F0",
    borderRadius: 999,
    color: colors.deepGreen,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 3,
    textTransform: "uppercase"
  },
  title: {
    color: colors.darkText,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 36
  },
  summary: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 25
  },
  videoCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    gap: 14,
    padding: 16,
    ...shadow
  },
  videoHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  videoIcon: {
    alignItems: "center",
    backgroundColor: "#FBE3E6",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  videoHeaderText: {
    flex: 1,
    gap: 3
  },
  videoTitle: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  videoSubtitle: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18
  },
  sourceCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 22,
    flexDirection: "row",
    gap: 14,
    padding: 16,
    ...shadow
  },
  sourceIcon: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  sourceText: {
    flex: 1,
    gap: 3
  },
  sourceTitle: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  sourceUrl: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700"
  },
  rewardCard: {
    backgroundColor: "#FFF4CB",
    borderRadius: 24,
    gap: 8,
    padding: 18
  },
  rewardTitle: {
    color: colors.darkText,
    fontSize: 17,
    fontWeight: "900"
  },
  rewardCopy: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20
  },
  rewardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2
  },
  rewardPill: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 999,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  rewardPillText: {
    color: colors.darkText,
    fontSize: 12,
    fontWeight: "900"
  },
  error: {
    color: "#B42318",
    fontSize: 14,
    lineHeight: 20
  }
});
