import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SunflowerCompanion } from "@/components/SunflowerCompanion";
import { askSunflower } from "@/services/ai";

export default function SunflowerScreen() {
  const [question, setQuestion] = useState("Why did I spend more than expected?");
  const [answer, setAnswer] = useState(askSunflower(question));

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <SunflowerCompanion size={96} />
      <Text style={styles.title}>Ask Sunflower</Text>
      <Text style={styles.copy}>Educational explanations only. No personalized investment, tax, or legal advice.</Text>
      <TextInput multiline value={question} onChangeText={setQuestion} style={styles.input} />
      <PrimaryButton label="Ask" onPress={() => setAnswer(askSunflower(question))} />
      <View style={styles.answer}>
        <Text style={styles.answerTitle}>Sunflower says</Text>
        <Text style={styles.copy}>{answer}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    backgroundColor: "#fffaf0",
    gap: 16,
    padding: 24,
    paddingTop: 72
  },
  title: {
    color: "#234330",
    fontSize: 32,
    fontWeight: "900"
  },
  copy: {
    color: "#65735f",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center"
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#d9c99a",
    borderRadius: 20,
    borderWidth: 1,
    color: "#234330",
    minHeight: 100,
    padding: 16,
    textAlignVertical: "top",
    width: "100%"
  },
  answer: {
    backgroundColor: "#e4f0dc",
    borderRadius: 24,
    gap: 8,
    padding: 20,
    width: "100%"
  },
  answerTitle: {
    color: "#234330",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center"
  }
});
