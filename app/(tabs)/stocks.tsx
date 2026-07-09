import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FloatingSunflower } from "@/components/FloatingSunflower";
import { FlowerIcon } from "@/components/FlowerIcon";
import { PrimaryButton } from "@/components/PrimaryButton";
import { colors, shadow } from "@/theme/colors";

const ladder = [
  { flower: "White Lily", label: "Savings Account / Cash", risk: "Lowest risk", copy: "Stable place to hold money; usually lower growth." },
  { flower: "Bluebell", label: "Bonds", risk: "Low-to-moderate", copy: "A loan to an organization that may pay interest." },
  { flower: "Purple Tulip", label: "Mutual Funds / Index Funds", risk: "Medium", copy: "A basket of investments that can help with diversification." },
  { flower: "Red Poppy", label: "Individual Stocks", risk: "Highest risk", copy: "Ownership in one company; bigger swings are possible." }
];

const lessons = ["What are stocks?", "What are bonds?", "What is an index fund?", "Risk vs. return basics", "Diversification basics"];

export default function StocksScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Investing Garden</Text>
        <Text style={styles.title}>Learn risk and return before making decisions.</Text>
      </View>

      <View style={styles.ladderCard}>
        <Text style={styles.cardTitle}>Risk / Return Ladder</Text>
        {ladder.map((item, index) => (
          <View key={item.flower} style={styles.ladderRow}>
            <View style={styles.rank}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <FlowerIcon name={item.flower} size={46} />
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.label}</Text>
              <Text style={styles.rowMeta}>{item.risk}</Text>
              <Text style={styles.rowCopy}>{item.copy}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.lessonGrid}>
        {lessons.map((lesson) => (
          <View key={lesson} style={styles.lessonCard}>
            <Text style={styles.lessonTitle}>{lesson}</Text>
            <Text style={styles.lessonCopy}>Learn how this works</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>Educational only</Text>
        <Text style={styles.disclaimerCopy}>Sunflower explains investing concepts, but does not give personal investment advice.</Text>
      </View>

      <PrimaryButton label="Ask Sunflower about stocks vs. bonds" />
      <FloatingSunflower message="Stocks vs. bonds?" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    gap: 18,
    padding: 20,
    paddingBottom: 110,
    paddingTop: 64
  },
  header: {
    gap: 8
  },
  eyebrow: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.darkText,
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 37
  },
  ladderCard: {
    backgroundColor: colors.card,
    borderRadius: 30,
    gap: 14,
    padding: 18,
    ...shadow
  },
  cardTitle: {
    color: colors.darkText,
    fontSize: 21,
    fontWeight: "900"
  },
  ladderRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    flexDirection: "row",
    gap: 12,
    padding: 12
  },
  rank: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  rankText: {
    color: colors.deepGreen,
    fontWeight: "900"
  },
  rowText: {
    flex: 1,
    gap: 2
  },
  rowTitle: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  rowMeta: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900"
  },
  rowCopy: {
    color: colors.mutedText,
    fontSize: 12,
    lineHeight: 17
  },
  lessonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  lessonCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 16,
    width: "48%",
    ...shadow
  },
  lessonTitle: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  lessonCopy: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8
  },
  disclaimer: {
    backgroundColor: "#FFF4CB",
    borderRadius: 24,
    padding: 16
  },
  disclaimerTitle: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  disclaimerCopy: {
    color: colors.mutedText,
    lineHeight: 21,
    marginTop: 4
  }
});
