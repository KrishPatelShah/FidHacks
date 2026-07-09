import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { learningModules } from "@/data/lessons";

export default function LearningPathScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.title}>Learning Path</Text>
      {learningModules.map((module) => (
        <View key={module.id} style={styles.module}>
          <Text style={styles.flower}>{module.flowerName}</Text>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          {module.lessons.map((lesson) => (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`} asChild>
              <TouchableOpacity style={styles.lesson}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonMeta}>{lesson.difficulty} · {lesson.contentType} · +{lesson.reward.sunlight ?? 0} sunlight</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#fffaf0",
    gap: 16,
    padding: 20,
    paddingTop: 64
  },
  title: {
    color: "#234330",
    fontSize: 32,
    fontWeight: "900"
  },
  module: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    gap: 10,
    padding: 18
  },
  flower: {
    color: "#a56620",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  moduleTitle: {
    color: "#234330",
    fontSize: 21,
    fontWeight: "900"
  },
  lesson: {
    backgroundColor: "#f7efd9",
    borderRadius: 16,
    padding: 14
  },
  lessonTitle: {
    color: "#234330",
    fontSize: 16,
    fontWeight: "800"
  },
  lessonMeta: {
    color: "#65735f",
    marginTop: 4,
    textTransform: "capitalize"
  }
});
