import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.name}>Demo Gardener</Text>
        <Text style={styles.copy}>Current path: beginner</Text>
        <Text style={styles.copy}>Garden visibility: friends</Text>
        <Text style={styles.copy}>Streak count: 7</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Streaks without punishment</Text>
        <Text style={styles.copy}>Missing a day pauses growth. It never kills the garden or resets learning progress.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#fffaf0",
    flex: 1,
    gap: 16,
    padding: 20,
    paddingTop: 64
  },
  title: {
    color: "#234330",
    fontSize: 32,
    fontWeight: "900"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    gap: 8,
    padding: 18
  },
  name: {
    color: "#234330",
    fontSize: 22,
    fontWeight: "900"
  },
  cardTitle: {
    color: "#234330",
    fontSize: 18,
    fontWeight: "900"
  },
  copy: {
    color: "#65735f",
    fontSize: 15,
    lineHeight: 22
  }
});
