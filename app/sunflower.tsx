import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SunflowerCompanion } from "@/components/SunflowerCompanion";
import { askSunflower } from "@/services/ai";
import { colors, shadow } from "@/theme/colors";

const chips = ["Explain this", "Recommend a lesson", "Why did I overspend?", "What is APR?", "Stocks vs. bonds", "Weekly challenge"];

export default function SunflowerScreen() {
  const [question, setQuestion] = useState("Why did I spend more than expected?");
  const [answer, setAnswer] = useState(askSunflower(question));

  function ask(nextQuestion = question) {
    setQuestion(nextQuestion);
    setAnswer(askSunflower(nextQuestion));
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.panel}>
        <SunflowerCompanion size={104} />
        <Text style={styles.title}>Ask Sunflower</Text>
        <Text style={styles.copy}>A friendly financial literacy tutor for quick explanations and next-step suggestions.</Text>

        <View style={styles.chips}>
          {chips.map((chip) => (
            <TouchableOpacity key={chip} onPress={() => ask(chip)} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput multiline value={question} onChangeText={setQuestion} style={styles.input} />
        <PrimaryButton label="Ask Sunflower" onPress={() => ask()} />

        <View style={styles.answer}>
          <Text style={styles.answerTitle}>Sunflower says</Text>
          <Text style={styles.answerCopy}>{answer}</Text>
        </View>

        <Text style={styles.disclaimer}>Sunflower gives educational guidance, not personalized financial, tax, legal, or investment advice.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "rgba(15, 110, 86, 0.18)",
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: 16,
    paddingTop: 72
  },
  panel: {
    alignItems: "center",
    backgroundColor: colors.cream,
    borderRadius: 36,
    gap: 16,
    padding: 22,
    ...shadow
  },
  title: {
    color: colors.darkText,
    fontSize: 32,
    fontWeight: "900"
  },
  copy: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center"
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center"
  },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  chipText: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900"
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 22,
    borderWidth: 1,
    color: colors.darkText,
    fontSize: 16,
    minHeight: 104,
    padding: 16,
    textAlignVertical: "top",
    width: "100%"
  },
  answer: {
    backgroundColor: "#E8F7F0",
    borderRadius: 24,
    gap: 8,
    padding: 18,
    width: "100%"
  },
  answerTitle: {
    color: colors.darkText,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center"
  },
  answerCopy: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center"
  },
  disclaimer: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center"
  }
});
