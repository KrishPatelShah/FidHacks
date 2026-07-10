import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlowerIcon } from "@/components/FlowerIcon";
import { learningModules } from "@/data/lessons";
import { difficultyUnlocked } from "@/lib/levels";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { ExperienceLevel } from "@/types/domain";

// Presentation details keyed by module category. These mirror the modules
// defined in src/data/Modules so the cards match the real lesson content.
const moduleDetails: Record<string, { topics: string; reward: string; difficulty: string; flower: string; accent: string }> = {
  budgeting: {
    topics: "Expected vs. actual spending, needs vs. wants, tracking expenses, and building your first budget",
    reward: "Grow your Daisy",
    difficulty: "Beginner",
    flower: "Daisy",
    accent: colors.sunflowerYellow
  },
  savings: {
    topics: "Emergency funds, savings goals, automating savings, and choosing the right account",
    reward: "Grow your Marigold",
    difficulty: "Beginner",
    flower: "Marigold",
    accent: colors.softOrange
  },
  credit_debt: {
    topics: "Credit scores, credit reports, APR, and strategies to pay off debt",
    reward: "Grow your Rose",
    difficulty: "Beginner",
    flower: "Rose",
    accent: colors.roseRed
  },
  retirement: {
    topics: "401(k)s, IRAs, employer match, Roth vs. Traditional, and compound growth",
    reward: "Grow your Orchid",
    difficulty: "Intermediate",
    flower: "Orchid",
    accent: colors.orchidPurple
  },
  funds: {
    topics: "Risk vs. return, diversification, index funds, ETFs, and building a portfolio",
    reward: "Grow your investment flowers",
    difficulty: "Advanced",
    flower: "Purple Tulip",
    accent: colors.orchidPurple
  }
};

export default function LearningPathScreen() {
  const { experienceLevel } = useGarden();
  const modules = learningModules;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Grow Your Money Knowledge</Text>
        <Text style={styles.subtitle}>Pick a module to see its lessons and grow new flowers.</Text>
      </View>

      {modules.map((module) => {
        const detail = moduleDetails[module.category] ?? moduleDetails.budgeting;
        const difficulty = detail.difficulty.toLowerCase() as ExperienceLevel;
        const unlocked = difficultyUnlocked(experienceLevel, difficulty);
        const totalLessons = module.lessons.length;
        const lessonLabel = `${totalLessons} ${totalLessons === 1 ? "lesson" : "lessons"}`;

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
                <Text style={styles.moduleTitle}>{module.flowerName}: {module.title}</Text>
                <Text style={[styles.badge, { color: detail.accent }]}>{detail.difficulty}</Text>
              </View>
              <Text style={styles.topics}>{detail.topics}</Text>
              {unlocked ? (
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>{lessonLabel}</Text>
                  <Text style={styles.reward}>{detail.reward}</Text>
                </View>
              ) : (
                <View style={styles.lockedRow}>
                  <Ionicons color={colors.mutedText} name="lock-closed" size={13} />
                  <Text style={styles.lockedNote}>Unlocks at the {detail.difficulty} level</Text>
                </View>
              )}
            </View>
            {unlocked ? <Ionicons color={colors.mutedText} name="chevron-forward" size={20} /> : null}
          </>
        );

        if (!unlocked) {
          return (
            <View key={module.id} style={[styles.module, styles.moduleLocked]}>
              {body}
            </View>
          );
        }

        if (totalLessons === 0) return null;

        return (
          <Link key={module.id} href={`/module/${module.id}`} asChild>
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
    alignItems: "center",
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
