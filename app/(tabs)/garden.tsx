import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GardenPreview } from "@/components/GardenPreview";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ResourcePill } from "@/components/ResourcePill";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { ExperienceLevel } from "@/types/domain";

type ActionCard = { title: string; copy: string; accent: string; href: string };

// The "Recommended Next Action" adapts to the user's level; the other two are
// consistent habit-builders. Every card links to a real screen.
const recommendedByLevel: Record<ExperienceLevel, ActionCard> = {
  beginner: {
    title: "Recommended Next Action",
    copy: "Start Budgeting Basics: track expected vs. actual spending.",
    accent: colors.roseRed,
    href: "/lesson/budgeting-expected-actual"
  },
  intermediate: {
    title: "Recommended Next Action",
    copy: "Explore low-risk bonds to grow your Bluebell.",
    accent: colors.skyBlue,
    href: "/(tabs)/stocks"
  },
  advanced: {
    title: "Recommended Next Action",
    copy: "Research mutual funds & stocks, then plant an investment flower.",
    accent: colors.orchidPurple,
    href: "/(tabs)/stocks"
  }
};

const sharedCards: ActionCard[] = [
  {
    title: "Weekly Challenge",
    copy: "Create your first weekly budget.",
    accent: colors.sunflowerYellow,
    href: "/(tabs)/budget"
  },
  {
    title: "Review Your Budget",
    copy: "Review expected vs. actual spending to earn fertilizer.",
    accent: colors.softOrange,
    href: "/(tabs)/budget"
  }
];

export default function GardenDashboardScreen() {
  const { plants, totals, streak, totalFlowers, experienceLevel } = useGarden();
  const levelLabel = experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.streak}>
          <Ionicons color={colors.softOrange} name="leaf" size={18} />
          <Text style={styles.streakText}>{streak} Day Streak</Text>
        </View>
        <View style={styles.profileRow}>
          <View style={styles.levelBadge}>
            <Ionicons color={colors.deepGreen} name="ribbon" size={14} />
            <Text style={styles.levelText}>{levelLabel}</Text>
          </View>
          <Link href="/(tabs)/profile" style={styles.avatar}>
            <Text style={styles.avatarText}>DG</Text>
          </Link>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>Flourish</Text>
        <Text style={styles.title}>Your money habits are flourishing.</Text>
      </View>

      <GardenPreview plants={plants} />

      <View style={styles.growthBanner}>
        <Ionicons color={colors.deepGreen} name="sparkles" size={18} />
        <Text style={styles.growthText}>
          You've grown {totalFlowers} flowers. Complete lessons and quizzes to grow more.
        </Text>
      </View>

      <View style={styles.actionStack}>
        {[recommendedByLevel[experienceLevel], ...sharedCards].map((card) => (
          <Link key={card.title} href={card.href} asChild>
            <TouchableOpacity activeOpacity={0.7} style={styles.actionCard}>
              <View style={[styles.actionDot, { backgroundColor: card.accent }]} />
              <View style={styles.actionText}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardCopy}>{card.copy}</Text>
              </View>
              <Ionicons color={colors.mutedText} name="chevron-forward" size={20} />
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      <View style={styles.ctaRow}>
        <Link href="/lesson/budgeting-expected-actual" asChild>
          <PrimaryButton label="Continue Budgeting Basics" />
        </Link>
        <Link href="/sunflower" asChild>
          <PrimaryButton label="Ask Sunflower" variant="secondary" />
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    gap: 18,
    padding: 20,
    paddingBottom: 110,
    paddingTop: 60
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  streak: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...shadow
  },
  streakText: {
    color: colors.darkText,
    fontSize: 14,
    fontWeight: "900"
  },
  profileRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  levelBadge: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...shadow
  },
  levelText: {
    color: colors.darkText,
    fontSize: 13,
    fontWeight: "900"
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    overflow: "hidden",
    textAlign: "center",
    width: 44
  },
  avatarText: {
    color: colors.white,
    fontWeight: "900",
    lineHeight: 44,
    textAlign: "center"
  },
  header: {
    gap: 6
  },
  eyebrow: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.darkText,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -0.7,
    lineHeight: 41
  },
  resources: {
    flexDirection: "row",
    gap: 8
  },
  growthBanner: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 20,
    flexDirection: "row",
    gap: 10,
    padding: 14
  },
  growthText: {
    color: colors.darkText,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  actionStack: {
    gap: 12
  },
  actionCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 24,
    flexDirection: "row",
    gap: 14,
    padding: 16,
    ...shadow
  },
  actionDot: {
    borderRadius: 16,
    height: 32,
    width: 32
  },
  actionText: {
    flex: 1,
    gap: 3
  },
  cardTitle: {
    color: colors.darkText,
    fontSize: 17,
    fontWeight: "900"
  },
  cardCopy: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20
  },
  ctaRow: {
    gap: 12
  }
});
