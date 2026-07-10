import { Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BackButton } from "@/components/BackButton";
import { FlowerIcon } from "@/components/FlowerIcon";
import { learningModules } from "@/data/lessons";
import { colors, shadow } from "@/theme/colors";

// Flower + accent shown per module category, matching the Learn screen cards.
const categoryStyle: Record<string, { flower: string; accent: string }> = {
  budgeting: { flower: "Daisy", accent: colors.sunflowerYellow },
  savings: { flower: "Marigold", accent: colors.softOrange },
  credit_debt: { flower: "Rose", accent: colors.roseRed },
  retirement: { flower: "Orchid", accent: colors.orchidPurple },
  funds: { flower: "Purple Tulip", accent: colors.orchidPurple }
};

const difficultyLabel: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced"
};

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const module = learningModules.find((item) => item.id === id);

  if (!module) {
    return (
      <View style={styles.root}>
        <BackButton />
        <View style={styles.screen}>
          <Text style={styles.title}>Module not found</Text>
        </View>
      </View>
    );
  }

  const style = categoryStyle[module.category] ?? categoryStyle.budgeting;
  const totalLessons = module.lessons.length;

  return (
    <View style={styles.root}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.hero}>
          <View style={[styles.iconWrap, { backgroundColor: `${style.accent}33` }]}>
            <FlowerIcon name={style.flower} size={58} />
          </View>
          <Text style={styles.kicker}>{module.flowerName}</Text>
          <Text style={styles.title}>{module.title}</Text>
          <Text style={styles.meta}>{totalLessons} lessons · complete each to grow your garden</Text>
        </View>

        {module.lessons.map((lesson, index) => (
          <Link key={lesson.id} href={`/lesson/${lesson.id}`} asChild>
            <TouchableOpacity style={styles.lessonCard}>
              <View style={[styles.lessonNumber, { backgroundColor: `${style.accent}22` }]}>
                <Text style={[styles.lessonNumberText, { color: style.accent }]}>{index + 1}</Text>
              </View>
              <View style={styles.lessonBody}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonSummary} numberOfLines={2}>{lesson.summary}</Text>
                <Text style={styles.lessonDifficulty}>{difficultyLabel[lesson.difficulty] ?? lesson.difficulty}</Text>
              </View>
              <Ionicons color={colors.mutedText} name="chevron-forward" size={20} />
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.cream,
    flex: 1
  },
  screen: {
    backgroundColor: colors.cream,
    gap: 12,
    padding: 20,
    paddingBottom: 42,
    paddingTop: 72
  },
  hero: {
    alignItems: "flex-start",
    backgroundColor: colors.card,
    borderRadius: 32,
    gap: 8,
    padding: 22,
    ...shadow
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 24,
    height: 78,
    justifyContent: "center",
    marginBottom: 4,
    width: 78
  },
  kicker: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.darkText,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 35
  },
  meta: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "700"
  },
  lessonCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 22,
    flexDirection: "row",
    gap: 14,
    padding: 16,
    ...shadow
  },
  lessonNumber: {
    alignItems: "center",
    borderRadius: 16,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  lessonNumberText: {
    fontSize: 17,
    fontWeight: "900"
  },
  lessonBody: {
    flex: 1,
    gap: 4
  },
  lessonTitle: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 21
  },
  lessonSummary: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 18
  },
  lessonDifficulty: {
    color: colors.deepGreen,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  }
});
