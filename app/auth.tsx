import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { PrimaryButton } from "@/components/PrimaryButton";
import { colors } from "@/theme/colors";
import { useGarden } from "@/state/garden";

export default function AuthScreen() {
  const { loginDemo, loadingAccount, accountError } = useGarden();
  const [error, setError] = useState<string | null>(null);

  async function continueAsDemo() {
    setError(null);
    try {
      await loginDemo();
      router.replace("/questionnaire");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in. Please try again.");
    }
  }

  return (
    <View style={styles.screen}>
      <BackButton />
      <Text style={styles.title}>Save your garden</Text>
      <Text style={styles.copy}>Continue with the demo account to save your progress securely in your garden.</Text>
      {error || accountError ? <Text style={styles.error}>{error ?? accountError}</Text> : null}
      <PrimaryButton label={loadingAccount ? "Connecting..." : "Continue as Demo User"} variant="secondary" onPress={continueAsDemo} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
    gap: 16,
    justifyContent: "center",
    padding: 24
  },
  title: {
    color: colors.darkText,
    fontSize: 32,
    fontWeight: "900"
  },
  copy: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23
  },
  error: {
    color: "#B42318",
    fontSize: 14,
    lineHeight: 20
  }
});
