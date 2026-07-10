import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlowerIcon } from "@/components/FlowerIcon";
import { GardenPreview } from "@/components/GardenPreview";
import { achievementDefs } from "@/data/achievements";
import { demoCommunityPosts, demoDirectory, demoFriendGardens, demoLeaderboard, suggestedMessages } from "@/data/community";
import { demoPlants } from "@/data/plants";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";

type Tab = "leaderboard" | "gardens" | "directory" | "posts";

const tabs: Tab[] = ["leaderboard", "gardens", "directory", "posts"];
const tabLabels: Record<Tab, string> = { leaderboard: "Leaders", gardens: "Gardens", directory: "Directory", posts: "Posts" };
const rankColors = ["#F4B740", "#B9C4CC", "#C98A5E"];

export default function CommunityScreen() {
  const { unlockedAchievements, totalFlowers, streak } = useGarden();
  const [tab, setTab] = useState<Tab>("leaderboard");
  const [messageTo, setMessageTo] = useState<string | null>(null);

  const myPills = achievementDefs.filter((a) => unlockedAchievements.includes(a.id)).slice(0, 4);

  // Replace the placeholder "you" row with the player's real garden stats, then
  // re-rank so their position reflects their actual flower count.
  const myTopBadge = [...achievementDefs].reverse().find((a) => unlockedAchievements.includes(a.id))?.title ?? "Just Started";
  const leaderboard = demoLeaderboard
    .map((row) =>
      row.userId === "you"
        ? { ...row, plantsThisWeek: totalFlowers, streakLevel: `${streak} day streak`, topBadge: myTopBadge }
        : row
    )
    .sort((a, b) => b.plantsThisWeek - a.plantsThisWeek);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Garden</Text>
        <Text style={styles.subtitle}>Privacy-safe progress only. No income, savings, debt, or spending amounts are ever shown.</Text>
      </View>

      {myPills.length ? (
        <View style={styles.myBadges}>
          <Text style={styles.myBadgesLabel}>Your achievements</Text>
          <View style={styles.badgeRow}>
            {myPills.map((a) => (
              <View key={a.id} style={styles.achievementPill}>
                <Ionicons color={colors.deepGreen} name={a.icon as keyof typeof Ionicons.glyphMap} size={13} />
                <Text style={styles.achievementPillText}>{a.title}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.toggle}>
        {tabs.map((item) => (
          <TouchableOpacity key={item} onPress={() => setTab(item)} style={[styles.toggleItem, tab === item && styles.toggleActive]}>
            <Text style={[styles.toggleText, tab === item && styles.toggleTextActive]}>{tabLabels[item]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === "leaderboard" ? (
        <View style={styles.stack}>
          <Text style={styles.sectionTitle}>Top growers this week</Text>
          {leaderboard.map((row, index) => {
            const isYou = row.userId === "you";
            return (
              <View key={row.userId} style={[styles.rankCard, isYou && styles.rankCardYou]}>
                <View style={[styles.rankBadge, { backgroundColor: rankColors[index] ?? "#E8F7F0" }]}>
                  <Text style={[styles.rankBadgeText, index < 3 && styles.rankBadgeTextTop]}>{index + 1}</Text>
                </View>
                <View style={styles.rankBody}>
                  <Text style={styles.rankName}>{row.displayName}{isYou ? " (you)" : ""}</Text>
                  <Text style={styles.rankMeta}>{row.streakLevel} · {row.topBadge}</Text>
                </View>
                <View style={styles.plantsCount}>
                  <Ionicons color={colors.deepGreen} name="flower" size={15} />
                  <Text style={styles.plantsCountText}>{row.plantsThisWeek}</Text>
                </View>
              </View>
            );
          })}
          <Text style={styles.footNote}>Ranked by flowers grown this week — never by money.</Text>
        </View>
      ) : null}

      {tab === "gardens" ? (
        <View style={styles.stack}>
          {demoFriendGardens.map((garden, index) => (
            <View key={garden.userId} style={styles.card}>
              <Text style={styles.cardTitle}>{garden.displayName}'s Garden</Text>
              <Text style={styles.copy}>{garden.flowerTypesUnlocked} flower types · {garden.milestonesCompleted} milestones · {garden.streakLevel}</Text>
              <GardenPreview plants={demoPlants.slice(0, index === 0 ? 5 : 3)} />
              <View style={styles.badgeRow}>
                <Text style={styles.badge}>Budget Builder</Text>
                <Text style={styles.badge}>Quiz Sprout</Text>
                <Text style={styles.badge}>Weekly Challenge</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {tab === "directory" ? (
        <View style={styles.stack}>
          <Text style={styles.sectionTitle}>Find garden buddies</Text>
          {demoDirectory.map((person) => (
            <View key={person.userId} style={styles.directoryCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{person.displayName.slice(0, 1)}</Text>
              </View>
              <View style={styles.directoryBody}>
                <Text style={styles.directoryName}>{person.displayName}</Text>
                <Text style={styles.goalTag}>{person.goal}</Text>
                <Text style={styles.copy}>{person.blurb}</Text>
                <Text style={styles.directoryMeta}>{person.flowerTypes} flower types · {person.streakLevel}</Text>
              </View>
              <TouchableOpacity onPress={() => setMessageTo(person.displayName)} style={styles.messageButton}>
                <Ionicons color={colors.white} name="chatbubble-ellipses" size={16} />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}

      {tab === "posts" ? (
        <View style={styles.stack}>
          {demoCommunityPosts.map((post) => (
            <View key={post.id} style={styles.post}>
              <View style={styles.postFlower}>
                <FlowerIcon name={post.flowerName} size={46} />
              </View>
              <View style={styles.postTextCol}>
                <Text style={styles.postLabel}>Milestone</Text>
                <Text style={styles.cardTitle}>{post.content}</Text>
                <Text style={styles.copy}>Unlocked the {post.flowerName} · shared as a progress post.</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <Modal transparent animationType="slide" visible={Boolean(messageTo)} onRequestClose={() => setMessageTo(null)}>
        <View style={styles.msgBackdrop}>
          <View style={styles.msgCard}>
            <View style={styles.msgHeader}>
              <Text style={styles.msgTitle}>Message {messageTo}</Text>
              <Pressable onPress={() => setMessageTo(null)}>
                <Ionicons color={colors.darkText} name="close" size={22} />
              </Pressable>
            </View>
            <Text style={styles.msgSub}>Pick a starter (mocked for the demo):</Text>
            {suggestedMessages.map((msg) => (
              <TouchableOpacity key={msg} onPress={() => setMessageTo(null)} style={styles.msgPrompt}>
                <Ionicons color={colors.deepGreen} name="send" size={15} />
                <Text style={styles.msgPromptText}>{msg}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
  myBadges: {
    backgroundColor: colors.card,
    borderRadius: 22,
    gap: 10,
    padding: 16,
    ...shadow
  },
  myBadgesLabel: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  achievementPill: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 999,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  achievementPillText: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900"
  },
  toggle: {
    backgroundColor: "#E9D8B9",
    borderRadius: 20,
    flexDirection: "row",
    padding: 4
  },
  toggleItem: {
    alignItems: "center",
    borderRadius: 16,
    flex: 1,
    paddingVertical: 10
  },
  toggleActive: {
    backgroundColor: colors.deepGreen
  },
  toggleText: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "900"
  },
  toggleTextActive: {
    color: colors.white
  },
  stack: {
    gap: 12
  },
  sectionTitle: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "900"
  },
  rankCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 20,
    flexDirection: "row",
    gap: 12,
    padding: 14,
    ...shadow
  },
  rankCardYou: {
    borderColor: colors.mintGreen,
    borderWidth: 2
  },
  rankBadge: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  rankBadgeText: {
    color: colors.deepGreen,
    fontSize: 15,
    fontWeight: "900"
  },
  rankBadgeTextTop: {
    color: colors.white
  },
  rankBody: {
    flex: 1,
    gap: 2
  },
  rankName: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  rankMeta: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700"
  },
  plantsCount: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 14,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  plantsCountText: {
    color: colors.deepGreen,
    fontSize: 15,
    fontWeight: "900"
  },
  footNote: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center"
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    gap: 12,
    padding: 16,
    ...shadow
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
  directoryCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 22,
    flexDirection: "row",
    gap: 12,
    padding: 14,
    ...shadow
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  avatarText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900"
  },
  directoryBody: {
    flex: 1,
    gap: 3
  },
  directoryName: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  goalTag: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF4CB",
    borderRadius: 999,
    color: colors.softOrange,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  directoryMeta: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2
  },
  messageButton: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 14,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  messageButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900"
  },
  post: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 26,
    flexDirection: "row",
    gap: 14,
    padding: 18,
    ...shadow
  },
  postFlower: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 20,
    height: 62,
    justifyContent: "center",
    width: 62
  },
  postTextCol: {
    flex: 1,
    gap: 6
  },
  postLabel: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
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
  },
  msgBackdrop: {
    backgroundColor: "rgba(15, 61, 48, 0.5)",
    flex: 1,
    justifyContent: "flex-end"
  },
  msgCard: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: 10,
    padding: 24,
    paddingBottom: 40
  },
  msgHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  msgTitle: {
    color: colors.darkText,
    fontSize: 22,
    fontWeight: "900"
  },
  msgSub: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4
  },
  msgPrompt: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 14
  },
  msgPromptText: {
    color: colors.darkText,
    flex: 1,
    fontSize: 14,
    fontWeight: "800"
  }
});
