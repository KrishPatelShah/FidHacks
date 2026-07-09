import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FlowerIcon } from "@/components/FlowerIcon";
import { demoPlants } from "@/data/plants";
import { colors, shadow } from "@/theme/colors";

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DG</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Demo Gardener</Text>
          <Text style={styles.subtitle}>Beginner path · Friends visibility</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>82%</Text>
          <Text style={styles.statLabel}>Quiz accuracy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>6</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Flower Collection</Text>
        <View style={styles.flowerGrid}>
          {demoPlants.map((plant) => (
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
        <Text style={styles.cardTitle}>Weekly Challenge Badges</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>First Budget</Text>
          <Text style={styles.badge}>APR Learner</Text>
          <Text style={styles.badge}>Reflective Spender</Text>
        </View>
      </View>

      <View style={styles.note}>
        <Text style={styles.cardTitle}>Streaks without punishment</Text>
        <Text style={styles.copy}>Missing a day pauses growth. It never kills the garden or resets learning progress.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    gap: 16,
    padding: 20,
    paddingBottom: 40,
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
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  badge: {
    backgroundColor: "#E8F7F0",
    borderRadius: 999,
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 7
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
  }
});
