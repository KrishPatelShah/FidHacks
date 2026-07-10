import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlowerIcon } from "@/components/FlowerIcon";
import { GardenPreview } from "@/components/GardenPreview";
import { TopNav } from "@/components/TopNav";
import { achievementDefs } from "@/data/achievements";
import { demoCommunityPosts, discoverPeople, friendFlowerCount, friendFlowerTypes, friendPlants, friends } from "@/data/community";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";

type Tab = "leaderboard" | "gardens" | "directory" | "posts";

const tabs: Tab[] = ["leaderboard", "gardens", "directory", "posts"];
const tabLabels: Record<Tab, string> = { leaderboard: "Leaders", gardens: "Gardens", directory: "Find", posts: "Posts" };
const rankColors = ["#F4B740", "#B9C4CC", "#C98A5E"];

// Mocked phone contacts for the "invite via contacts" demo flow.
const phoneContacts = [
  { id: "contact_1", name: "Taylor Brooks", detail: "In your contacts" },
  { id: "contact_2", name: "Jamie Nguyen", detail: "In your contacts" },
  { id: "contact_3", name: "Morgan Lee", detail: "In your contacts" }
];

export default function CommunityScreen() {
  const { unlockedAchievements, totalFlowers, streak } = useGarden();
  const [tab, setTab] = useState<Tab>("leaderboard");
  const [query, setQuery] = useState("");
  const [requested, setRequested] = useState<string[]>([]);
  const [contactsOpen, setContactsOpen] = useState(false);

  const myPills = achievementDefs.filter((a) => unlockedAchievements.includes(a.id)).slice(0, 4);

  // Build the leaderboard from the shared friend data plus the player's real
  // garden stats, then re-rank so positions reflect actual flower counts.
  const myTopBadge = [...achievementDefs].reverse().find((a) => unlockedAchievements.includes(a.id))?.title ?? "Just Started";
  const leaderboard = useMemo(() => {
    const friendRows = friends.map((friend) => ({
      userId: friend.userId,
      displayName: friend.displayName,
      flowers: friendFlowerCount(friend),
      streakLevel: `${friend.streakDays} day streak`,
      topBadge: friend.topBadge
    }));
    const youRow = { userId: "you", displayName: "You", flowers: totalFlowers, streakLevel: `${streak} day streak`, topBadge: myTopBadge };
    return [...friendRows, youRow].sort((a, b) => b.flowers - a.flowers);
  }, [totalFlowers, streak, myTopBadge]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return discoverPeople;
    return discoverPeople.filter(
      (person) => person.displayName.toLowerCase().includes(q) || person.username.toLowerCase().includes(q)
    );
  }, [query]);

  const toggleRequest = (userId: string) =>
    setRequested((current) => (current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]));

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <TopNav />
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
                  <Text style={styles.plantsCountText}>{row.flowers}</Text>
                </View>
              </View>
            );
          })}
          <Text style={styles.footNote}>Ranked by flowers grown, never by money.</Text>
        </View>
      ) : null}

      {tab === "gardens" ? (
        <View style={styles.stack}>
          {friends.map((friend) => (
            <View key={friend.userId} style={styles.card}>
              <Text style={styles.cardTitle}>{friend.displayName}'s Garden</Text>
              <Text style={styles.copy}>
                {friendFlowerCount(friend)} flowers · {friendFlowerTypes(friend)} flower types · {friend.streakDays} day streak
              </Text>
              <GardenPreview plants={friendPlants(friend)} ownGarden={false} />
              <View style={styles.badgeRow}>
                <Text style={styles.badge}>{friend.topBadge}</Text>
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
          <View style={styles.searchBar}>
            <Ionicons color={colors.mutedText} name="search" size={18} />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder="Search by username"
              placeholderTextColor={colors.mutedText}
              style={styles.searchInput}
              value={query}
            />
            {query ? (
              <Pressable onPress={() => setQuery("")}>
                <Ionicons color={colors.mutedText} name="close-circle" size={18} />
              </Pressable>
            ) : null}
          </View>

          <TouchableOpacity onPress={() => setContactsOpen(true)} style={styles.contactsButton}>
            <Ionicons color={colors.deepGreen} name="people" size={18} />
            <Text style={styles.contactsButtonText}>Invite from contacts</Text>
            <Ionicons color={colors.mutedText} name="chevron-forward" size={18} />
          </TouchableOpacity>

          {results.length ? (
            results.map((person) => {
              const isRequested = requested.includes(person.userId);
              return (
                <View key={person.userId} style={styles.directoryCard}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{person.displayName.slice(0, 1)}</Text>
                  </View>
                  <View style={styles.directoryBody}>
                    <Text style={styles.directoryName}>{person.displayName}</Text>
                    <Text style={styles.username}>@{person.username}</Text>
                    <Text style={styles.directoryMeta}>
                      {person.goal}
                      {person.mutualFriends > 0 ? ` · ${person.mutualFriends} mutual` : ""}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleRequest(person.userId)}
                    style={[styles.addButton, isRequested && styles.addButtonDone]}
                  >
                    <Ionicons color={isRequested ? colors.deepGreen : colors.white} name={isRequested ? "checkmark" : "person-add"} size={16} />
                    <Text style={[styles.addButtonText, isRequested && styles.addButtonTextDone]}>{isRequested ? "Requested" : "Add"}</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No one matches “{query}”. Try another username.</Text>
          )}
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

      <Modal transparent animationType="slide" visible={contactsOpen} onRequestClose={() => setContactsOpen(false)}>
        <View style={styles.msgBackdrop}>
          <View style={styles.msgCard}>
            <View style={styles.msgHeader}>
              <Text style={styles.msgTitle}>Invite from contacts</Text>
              <Pressable onPress={() => setContactsOpen(false)}>
                <Ionicons color={colors.darkText} name="close" size={22} />
              </Pressable>
            </View>
            <Text style={styles.msgSub}>Contacts syncing is mocked for the demo.</Text>
            {phoneContacts.map((contact) => {
              const isRequested = requested.includes(contact.id);
              return (
                <View key={contact.id} style={styles.msgPrompt}>
                  <View style={styles.avatarSmall}>
                    <Text style={styles.avatarText}>{contact.name.slice(0, 1)}</Text>
                  </View>
                  <View style={styles.contactBody}>
                    <Text style={styles.directoryName}>{contact.name}</Text>
                    <Text style={styles.username}>{contact.detail}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleRequest(contact.id)}
                    style={[styles.addButton, isRequested && styles.addButtonDone]}
                  >
                    <Ionicons color={isRequested ? colors.deepGreen : colors.white} name={isRequested ? "checkmark" : "person-add"} size={16} />
                    <Text style={[styles.addButtonText, isRequested && styles.addButtonTextDone]}>{isRequested ? "Invited" : "Invite"}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
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
  username: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700"
  },
  directoryMeta: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadow
  },
  searchInput: {
    color: colors.darkText,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    padding: 0
  },
  contactsButton: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14
  },
  contactsButtonText: {
    color: colors.deepGreen,
    flex: 1,
    fontSize: 15,
    fontWeight: "900"
  },
  addButton: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 14,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  addButtonDone: {
    backgroundColor: "#E8F7F0",
    borderColor: colors.mintGreen,
    borderWidth: 1
  },
  addButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900"
  },
  addButtonTextDone: {
    color: colors.deepGreen
  },
  emptyText: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "700",
    paddingVertical: 8,
    textAlign: "center"
  },
  avatarSmall: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  contactBody: {
    flex: 1,
    gap: 2
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
  }
});
