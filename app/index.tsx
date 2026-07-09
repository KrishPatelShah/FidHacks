import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SunflowerCompanion } from "@/components/SunflowerCompanion";

export default function WelcomeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <SunflowerCompanion size={124} />
        <Text style={styles.name}>Financial Garden</Text>
        <Text style={styles.tagline}>Grow your money knowledge one habit at a time.</Text>
      </View>
      <View style={styles.actions}>
        <Link href="/auth" asChild>
          <PrimaryButton label="Get Started" />
        </Link>
        <Link href="/auth" style={styles.login}>
          Log In
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f8efd2",
    padding: 24,
    paddingTop: 96,
    paddingBottom: 48
  },
  hero: {
    alignItems: "center",
    gap: 18
  },
  name: {
    color: "#234330",
    fontSize: 38,
    fontWeight: "900",
    textAlign: "center"
  },
  tagline: {
    color: "#5f6f52",
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center"
  },
  actions: {
    gap: 16
  },
  login: {
    color: "#234330",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center"
  }
});
