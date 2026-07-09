import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GardenPreview } from "@/components/GardenPreview";
import { demoCommunityPosts, demoFriendGardens } from "@/data/community";
import { demoPlants } from "@/data/plants";
import { colors, shadow } from "@/theme/colors";

type Tab = "gardens" | "posts";

export default function CommunityScreen() {
  const [tab, setTab] = useState<Tab>("gardens");

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Garden</Text>
        <Text style={styles.subtitle}>Privacy-safe progress only. No income, savings, debt, spending, net worth, or exact financial data.</Text>
      </View>

      <View style={styles.toggle}>
        {(["gardens", "posts"] as const).map((item) => (
          <TouchableOpacity key={item} onPress={() => setTab(item)} style={[styles.toggleItem, tab === item && styles.toggleActive]}>
            <Text style={[styles.toggleText, tab === item && styles.toggleTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "gardens" ? (
        <View style={styles.stack}>
          {demoFriendGardens.map((garden, index) => (
            <View key={garden.userId} style={styles.card}>
              <Text style={styles.cardTitle}>{garden.displayName}'s Garden</Text>
              <Text style={styles.copy}>{garden.flowerTypesUnlocked} flower types unlocked · {garden.milestonesCompleted} milestones · {index === 0 ? "5 week streak" : garden.streakLevel}</Text>
              <GardenPreview plants={demoPlants.slice(0, index === 0 ? 5 : 3)} />
              <View style={styles.badgeRow}>
                <Text style={styles.badge}>Budget Builder</Text>
                <Text style={styles.badge}>Quiz Sprout</Text>
                <Text style={styles.badge}>Weekly Challenge</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.stack}>
          {demoCommunityPosts.map((post) => (
            <View key={post.id} style={styles.post}>
              <Text style={styles.postLabel}>Milestone</Text>
              <Text style={styles.cardTitle}>{post.content}</Text>
              <Text style={styles.copy}>Shared as a template-based progress post.</Text>
            </View>
          ))}
        </View>
      )}
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
    gap: 8
  },
  title: {
    color: colors.darkText,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 39
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22
  },
  toggle: {
    backgroundColor: "#E9D8B9",
    borderRadius: 22,
    flexDirection: "row",
    padding: 5
  },
  toggleItem: {
    alignItems: "center",
    borderRadius: 17,
    flex: 1,
    padding: 11
  },
  toggleActive: {
    backgroundColor: colors.deepGreen
  },
  toggleText: {
    color: colors.mutedText,
    fontWeight: "900",
    textTransform: "capitalize"
  },
  toggleTextActive: {
    color: colors.white
  },
  stack: {
    gap: 16
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    gap: 12,
    padding: 16,
    ...shadow
  },
  post: {
    backgroundColor: colors.card,
    borderRadius: 26,
    gap: 8,
    padding: 18,
    ...shadow
  },
  postLabel: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  cardTitle: {
    color: colors.darkText,
    fontSize: 19,
    fontWeight: "900"
  },
  copy: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 21
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
    paddingVertical: 6
  }
});
