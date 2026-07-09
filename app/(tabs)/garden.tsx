import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GardenPreview } from "@/components/GardenPreview";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ResourcePill } from "@/components/ResourcePill";
import { demoPlants } from "@/data/plants";

export default function GardenDashboardScreen() {
  const totals = demoPlants.reduce(
    (sum, plant) => ({
      sunlight: sum.sunlight + plant.sunlight,
      water: sum.water + plant.water,
      fertilizer: sum.fertilizer + plant.fertilizer
    }),
    { sunlight: 0, water: 0, fertilizer: 0 }
  );

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>7 day streak</Text>
        <Text style={styles.title}>Your garden is growing from habits.</Text>
      </View>
      <GardenPreview plants={demoPlants} />
      <View style={styles.resources}>
        <ResourcePill label="Sunlight" value={totals.sunlight} />
        <ResourcePill label="Water" value={totals.water} />
        <ResourcePill label="Fertilizer" value={totals.fertilizer} />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommended next action</Text>
        <Text style={styles.cardCopy}>Complete the Daisy budgeting quiz to earn water and grow another budgeting flower.</Text>
        <Link href="/lesson/budgeting-expected-actual" asChild>
          <PrimaryButton label="Continue Lesson" />
        </Link>
      </View>
      <View style={styles.grid}>
        <Link href="/(tabs)/budget" asChild>
          <PrimaryButton label="Review Budget" variant="secondary" />
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
    backgroundColor: "#fffaf0",
    gap: 18,
    padding: 20,
    paddingTop: 64
  },
  header: {
    gap: 6
  },
  kicker: {
    color: "#a56620",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: "#234330",
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 36
  },
  resources: {
    flexDirection: "row",
    gap: 8
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    gap: 12,
    padding: 20
  },
  cardTitle: {
    color: "#234330",
    fontSize: 20,
    fontWeight: "900"
  },
  cardCopy: {
    color: "#65735f",
    fontSize: 15,
    lineHeight: 22
  },
  grid: {
    gap: 12
  }
});
