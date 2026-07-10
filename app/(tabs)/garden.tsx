import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GardenPreview } from "@/components/GardenPreview";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ResourcePill } from "@/components/ResourcePill";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";

const actionCards = [
  {
    title: "Recommended Next Action",
    copy: "Complete the APR quiz to grow your Rose.",
    accent: colors.roseRed
  },
  {
    title: "Weekly Challenge",
    copy: "Create your first weekly budget.",
    accent: colors.sunflowerYellow
  },
  {
    title: "Review Your Budget",
    copy: "Review expected vs. actual spending to earn fertilizer.",
    accent: colors.softOrange
  }
];

export default function GardenDashboardScreen() {
  const { plants, totals, streak, totalFlowers } = useGarden();

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.streak}>
          <Ionicons color={colors.softOrange} name="leaf" size={18} />
          <Text style={styles.streakText}>{streak} Day Streak</Text>
        </View>
        <Link href="/(tabs)/profile" style={styles.avatar}>
          <Text style={styles.avatarText}>DG</Text>
        </Link>
      </View>

      <View style={styles.header}>
        <Text style={styles.eyebrow}>Financial Garden</Text>
        <Text style={styles.title}>Your money habits are blooming.</Text>
      </View>

      <View style={styles.resources}>
        <ResourcePill label="Sunlight" value={totals.sunlight} />
        <ResourcePill label="Water" value={totals.water} />
        <ResourcePill label="Fertilizer" value={totals.fertilizer} />
      </View>

      <GardenPreview plants={plants} />

      <View style={styles.growthBanner}>
        <Ionicons color={colors.deepGreen} name="sparkles" size={18} />
        <Text style={styles.growthText}>
          You've grown {totalFlowers} flowers. Complete lessons and quizzes to grow more.
        </Text>
      </View>

      <View style={styles.actionStack}>
        {actionCards.map((card) => (
          <View key={card.title} style={styles.actionCard}>
            <View style={[styles.actionDot, { backgroundColor: card.accent }]} />
            <View style={styles.actionText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardCopy}>{card.copy}</Text>
            </View>
          </View>
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
