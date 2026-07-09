import { router } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function AuthScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Save your garden</Text>
      <Text style={styles.copy}>Use hard-coded demo auth now. Swap these calls for Supabase Auth when keys are configured.</Text>
      <TextInput autoCapitalize="none" placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <PrimaryButton label="Sign Up / Log In" onPress={() => router.replace("/questionnaire")} />
      <PrimaryButton label="Continue as Demo User" variant="secondary" onPress={() => router.replace("/questionnaire")} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fffaf0",
    gap: 16,
    justifyContent: "center",
    padding: 24
  },
  title: {
    color: "#234330",
    fontSize: 32,
    fontWeight: "900"
  },
  copy: {
    color: "#65735f",
    fontSize: 16,
    lineHeight: 23
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#d9c99a",
    borderRadius: 18,
    borderWidth: 1,
    fontSize: 16,
    padding: 16
  }
});
