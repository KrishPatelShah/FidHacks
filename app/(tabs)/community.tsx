import { ScrollView, StyleSheet, Text, View } from "react-native";
import { demoCommunityPosts, demoFriendGardens } from "@/data/community";

export default function CommunityScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Community Garden</Text>
      <Text style={styles.copy}>Privacy-safe progress only. No income, savings, debt, spending, or net worth.</Text>
      {demoFriendGardens.map((garden) => (
        <View key={garden.userId} style={styles.card}>
          <Text style={styles.cardTitle}>{garden.displayName}</Text>
          <Text style={styles.copy}>{garden.flowerTypesUnlocked} flower types · {garden.milestonesCompleted} milestones · {garden.streakLevel} streak</Text>
        </View>
      ))}
      <Text style={styles.section}>Milestone Posts</Text>
      {demoCommunityPosts.map((post) => (
        <View key={post.id} style={styles.post}>
          <Text style={styles.cardTitle}>{post.content}</Text>
          <Text style={styles.copy}>{post.templateType}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#fffaf0",
    gap: 14,
    padding: 20,
    paddingTop: 64
  },
  title: {
    color: "#234330",
    fontSize: 32,
    fontWeight: "900"
  },
  section: {
    color: "#234330",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10
  },
  copy: {
    color: "#65735f",
    fontSize: 15,
    lineHeight: 22
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16
  },
  post: {
    backgroundColor: "#e4f0dc",
    borderRadius: 20,
    padding: 16
  },
  cardTitle: {
    color: "#234330",
    fontSize: 17,
    fontWeight: "900"
  }
});
