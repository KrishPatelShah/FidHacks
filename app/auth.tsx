import { router } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { colors, shadow } from "@/theme/colors";

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
  input: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 22,
    borderWidth: 1,
    color: colors.darkText,
    fontSize: 16,
    padding: 16,
    ...shadow
  }
});
