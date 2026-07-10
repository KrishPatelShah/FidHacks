import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/AppText";
import { FlowerIcon } from "@/components/FlowerIcon";
import { ProgressBar } from "@/components/ProgressBar";
import { TopNav } from "@/components/TopNav";
import { achievementDefs } from "@/data/achievements";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { AchievementMetric } from "@/types/domain";

export default function ProfileScreen() {
  const {
    plants,
    streak,
    totalFlowers,
    lessonsCompleted,
    quizzesPassed,
    budgetsLogged,
    flowersGrown,
    investmentsPlanted,
    receiptsScanned,
    riskProfile,
    confidenceLevel,
    unlockedAchievements,
    dyslexiaMode,
    setDyslexiaMode,
    resetLocalDemoData
  } = useGarden();

  const metrics: Record<AchievementMetric, number> = {
    flowersGrown,
    streak,
    totalFlowers,
    budgetsLogged,
    quizzesPassed,
    lessonsCompleted,
    investmentsPlanted,
    receiptsScanned
  };

  const unlockedCount = unlockedAchievements.length;

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <TopNav showProfile={false} />
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DG</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Demo Gardener</Text>
          <Text style={styles.subtitle}>
            {confidenceLevel ? `${confidenceLevel} path` : "Path pending"} · {riskProfile} investor
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalFlowers}</Text>
          <Text style={styles.statLabel}>Flowers grown</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{lessonsCompleted + quizzesPassed}</Text>
          <Text style={styles.statLabel}>Actions done</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Flower Collection</Text>
        <View style={styles.flowerGrid}>
          {plants.map((plant) => (
            <View key={plant.id} style={styles.flowerBadge}>
              <FlowerIcon name={plant.flowerName} size={42} />
              <Text style={styles.flowerText}>{plant.quantity} {plant.flowerName}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Completed Modules</Text>
        {["Budgeting Basics", "Savings Starter", "APR Basics"].map((module) => (
          <View key={module} style={styles.row}>
            <Text style={styles.rowText}>{module}</Text>
            <Text style={styles.rowMeta}>Complete</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.achievementsHeader}>
          <Text style={styles.cardTitle}>Achievements</Text>
          <Text style={styles.achievementsCount}>{unlockedCount} / {achievementDefs.length}</Text>
        </View>
        {achievementDefs.map((achievement) => {
          const value = metrics[achievement.metric];
          const unlocked = unlockedAchievements.includes(achievement.id);
          const progress = Math.min(1, value / achievement.goal);
          return (
            <View key={achievement.id} style={styles.achievement}>
              <View style={[styles.achievementIcon, unlocked ? styles.achievementIconOn : styles.achievementIconOff]}>
                <Ionicons color={unlocked ? colors.white : colors.mutedText} name={achievement.icon as keyof typeof Ionicons.glyphMap} size={20} />
              </View>
              <View style={styles.achievementBody}>
                <View style={styles.achievementTop}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  {unlocked ? <Ionicons color={colors.deepGreen} name="checkmark-circle" size={16} /> : <Text style={styles.achievementProgressText}>{Math.min(value, achievement.goal)}/{achievement.goal}</Text>}
                </View>
                <Text style={styles.achievementDesc}>{achievement.description}</Text>
                {!unlocked ? <ProgressBar progress={progress} height={7} /> : null}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Accessibility</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingIcon}>
            <Ionicons color={colors.deepGreen} name="text" size={20} />
          </View>
          <View style={styles.settingBody}>
            <Text style={styles.settingTitle}>Dyslexia-friendly font</Text>
            <Text style={styles.settingDesc}>Switch the whole app to the OpenDyslexic typeface for easier reading.</Text>
          </View>
          <Switch
            value={dyslexiaMode}
            onValueChange={setDyslexiaMode}
            thumbColor={colors.white}
            trackColor={{ false: "#D7C7A6", true: colors.deepGreen }}
          />
        </View>
      </View>

      <View style={styles.note}>
        <Text style={styles.cardTitle}>Streaks without punishment</Text>
        <Text style={styles.copy}>Missing a day pauses growth. It never kills the garden or resets learning progress.</Text>
      </View>

      <TouchableOpacity onPress={resetLocalDemoData} style={styles.reset}>
        <Text style={styles.resetText}>Reset local demo data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    gap: 16,
    padding: 20,
    paddingBottom: 120,
    paddingTop: 64
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900"
  },
  headerText: {
    flex: 1,
    gap: 4
  },
  title: {
    color: colors.darkText,
    fontSize: 30,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: "700"
  },
  stats: {
    flexDirection: "row",
    gap: 10
  },
  statCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 22,
    flex: 1,
    padding: 14,
    ...shadow
  },
  statValue: {
    color: colors.deepGreen,
    fontSize: 24,
    fontWeight: "900"
  },
  statLabel: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase"
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 26,
    gap: 12,
    padding: 18,
    ...shadow
  },
  cardTitle: {
    color: colors.darkText,
    fontSize: 19,
    fontWeight: "900"
  },
  flowerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  flowerBadge: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    width: "30%"
  },
  flowerText: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center"
  },
  row: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12
  },
  rowText: {
    color: colors.darkText,
    fontWeight: "900"
  },
  rowMeta: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900"
  },
  achievementsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  achievementsCount: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "900"
  },
  achievement: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    padding: 12
  },
  achievementIcon: {
    alignItems: "center",
    borderRadius: 16,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  achievementIconOn: {
    backgroundColor: colors.deepGreen
  },
  achievementIconOff: {
    backgroundColor: "#EFE3C8"
  },
  achievementBody: {
    flex: 1,
    gap: 5
  },
  achievementTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  achievementTitle: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  achievementProgressText: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "900"
  },
  achievementDesc: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17
  },
  settingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  settingIcon: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 14,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  settingBody: {
    flex: 1,
    gap: 3
  },
  settingTitle: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  settingDesc: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17
  },
  note: {
    backgroundColor: "#FFF4CB",
    borderRadius: 24,
    gap: 8,
    padding: 18
  },
  copy: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22
  },
  reset: {
    alignItems: "center",
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14
  },
  resetText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "800"
  }
});
