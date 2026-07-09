import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Term } from "@/components/Term";
import { findLesson } from "@/data/lessons";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = findLesson(id);

  if (!lesson) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Lesson not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.kicker}>{lesson.category}</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.copy}>{lesson.summary}</Text>
      <View style={styles.lessonBox}>
        <Text style={styles.copy}>Money concepts become easier when you compare the plan with what happened.</Text>
        <View style={styles.inlineRow}>
          <Text style={styles.copy}>If your </Text>
          <Term label="actual spending" definition="The amount you really spent during a period." />
          <Text style={styles.copy}> is higher than expected, the gap is a signal to review habits.</Text>
        </View>
        <View style={styles.inlineRow}>
          <Text style={styles.copy}>Terms like </Text>
          <Term label="APR" definition="The yearly cost of borrowing money, shown as a percentage." />
          <Text style={styles.copy}> and </Text>
          <Term label="employer match" definition="Money an employer contributes to your retirement account when you contribute." />
          <Text style={styles.copy}> can be tapped anywhere they appear.</Text>
        </View>
      </View>
      <Link href={`/quiz/${lesson.id}`} asChild>
        <PrimaryButton label="Take Quiz" />
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#fffaf0",
    gap: 16,
    padding: 24,
    paddingTop: 72
  },
  kicker: {
    color: "#a56620",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: "#234330",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38
  },
  copy: {
    color: "#4f604b",
    fontSize: 17,
    lineHeight: 27
  },
  lessonBox: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    gap: 14,
    padding: 20
  },
  inlineRow: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});
