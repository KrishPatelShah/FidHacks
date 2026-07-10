import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlowerIcon } from "@/components/FlowerIcon";
import { learningModules } from "@/data/lessons";
import { difficultyUnlocked } from "@/lib/levels";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { ExperienceLevel } from "@/types/domain";

const moduleDetails: Record<string, { topics: string; progress: number; completed: string; reward: string; difficulty: string; flower: string; accent: string }> = {
  budgeting: {
    topics: "Budgeting, expected vs. actual spending, spending habits",
    progress: 0.6,
    completed: "3 of 5 lessons",
    reward: "Unlock 1 Daisy",
    difficulty: "Beginner",
    flower: "Daisy",
    accent: colors.sunflowerYellow
  },
  savings: {
    topics: "Saving money, emergency funds, savings goals",
    progress: 0.25,
    completed: "1 of 4 lessons",
    reward: "Earn water",
    difficulty: "Beginner",
    flower: "Marigold",
    accent: colors.softOrange
  },
  credit_debt: {
    topics: "Credit cards, credit scores, APR, interest, debt repayment",
    progress: 0.4,
    completed: "2 of 5 lessons",
    reward: "Grow your Rose",
    difficulty: "Beginner",
    flower: "Rose",
    accent: colors.roseRed
  },
  retirement: {
    topics: "Roth IRA, 401(k), employer match, long-term saving",
    progress: 0.15,
    completed: "1 of 5 lessons",
    reward: "Earn sunlight",
    difficulty: "Intermediate",
    flower: "Orchid",
    accent: colors.orchidPurple
  },
  career_taxes: {
    topics: "Paychecks, taxes, benefits, take-home pay",
    progress: 0.2,
    completed: "1 of 5 lessons",
    reward: "Unlock Blue Iris",
    difficulty: "Intermediate",
    flower: "Blue Iris",
    accent: colors.skyBlue
  },
  funds: {
    topics: "Savings accounts, bonds, index funds, mutual funds, stocks",
    progress: 0.1,
    completed: "1 of 6 lessons",
    reward: "Unlock investment flowers",
    difficulty: "Advanced",
    flower: "Purple Tulip",
    accent: colors.orchidPurple
  }
};

export default function LearningPathScreen() {
  const { experienceLevel } = useGarden();

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Grow Your Money Knowledge</Text>
        <Text style={styles.subtitle}>Complete lessons to unlock new flowers.</Text>
      </View>

      {learningModules.map((module) => {
        const detail = moduleDetails[module.category] ?? moduleDetails.budgeting;
        const firstLesson = module.lessons[0];
        const difficulty = detail.difficulty.toLowerCase() as ExperienceLevel;
        const unlocked = difficultyUnlocked(experienceLevel, difficulty);

        const body = (
          <>
            <View style={[styles.iconWrap, { backgroundColor: `${detail.accent}33` }]}>
              <FlowerIcon name={detail.flower} size={54} />
              {unlocked ? null : (
                <View style={styles.lockOverlay}>
                  <Ionicons color={colors.white} name="lock-closed" size={20} />
                </View>
              )}
            </View>
            <View style={styles.moduleBody}>
              <View style={styles.moduleHeader}>
                <Text style={styles.moduleTitle}>{module.flowerName} — {module.title}</Text>
                <Text style={[styles.badge, { color: detail.accent }]}>{detail.difficulty}</Text>
              </View>
              <Text style={styles.topics}>{detail.topics}</Text>
              {unlocked ? (
                <>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${detail.progress * 100}%`, backgroundColor: detail.accent }]} />
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.meta}>{detail.completed}</Text>
                    <Text style={styles.reward}>{detail.reward}</Text>
                  </View>
                </>
              ) : (
                <View style={styles.lockedRow}>
                  <Ionicons color={colors.mutedText} name="lock-closed" size={13} />
                  <Text style={styles.lockedNote}>Unlocks at the {detail.difficulty} level</Text>
                </View>
              )}
            </View>
          </>
        );

        if (!unlocked) {
          return (
            <View key={module.id} style={[styles.module, styles.moduleLocked]}>
              {body}
            </View>
          );
        }

        return (
          <Link key={module.id} href={`/lesson/${firstLesson.id}`} asChild>
            <TouchableOpacity style={styles.module}>{body}</TouchableOpacity>
          </Link>
        );
      })}
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
    gap: 8,
    marginBottom: 4
  },
  title: {
    color: colors.darkText,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.6,
    lineHeight: 39
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23
  },
  module: {
    backgroundColor: colors.card,
    borderRadius: 28,
    flexDirection: "row",
    gap: 14,
    padding: 16,
    ...shadow
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 24,
    height: 70,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: 70
  },
  lockOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(23, 59, 50, 0.55)",
    borderRadius: 24,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  moduleLocked: {
    opacity: 0.72
  },
  lockedRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6
  },
  lockedNote: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "800"
  },
  moduleBody: {
    flex: 1,
    gap: 9
  },
  moduleHeader: {
    gap: 6
  },
  moduleTitle: {
    color: colors.darkText,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 4,
    textTransform: "uppercase"
  },
  topics: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 19
  },
  progressTrack: {
    backgroundColor: "#EADCC0",
    borderRadius: 999,
    height: 9,
    overflow: "hidden"
  },
  progressFill: {
    borderRadius: 999,
    height: "100%"
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between"
  },
  meta: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "800"
  },
  reward: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900"
  }
});
