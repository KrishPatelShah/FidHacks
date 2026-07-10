import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/AppText";
import { FlowerIcon } from "@/components/FlowerIcon";
import { Sparkline } from "@/components/Sparkline";
import { TopNav } from "@/components/TopNav";
import { riskProfileCopy, timeRanges, topics, TimeRange } from "@/data/investments";
import { canAccessCategory, investingUnlocked } from "@/lib/levels";
import { fetchDailySeries, marketDataConfigured } from "@/services/marketData";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { InvestTopic } from "@/types/domain";

// How many trailing daily closes each range chip shows. One daily series is
// fetched per topic and sliced by these counts, so each range renders a
// different window of the same live data without another API request.
const RANGE_POINTS: Record<TimeRange, number> = {
  "1D": 2,
  "1W": 6,
  "1M": 22,
  "3M": 66
};

const ladder = [
  { flower: "White Lily", label: "Savings / Cash", risk: "Lowest risk" },
  { flower: "Bluebell", label: "Bonds", risk: "Low-to-moderate" },
  { flower: "Purple Tulip", label: "Index / Mutual Funds", risk: "Medium" },
  { flower: "Red Poppy", label: "Individual Stocks", risk: "Highest risk" }
];

export default function StocksScreen() {
  const { riskProfile, plantInvestment, experienceLevel, investmentsPlanted } = useGarden();
  const [range, setRange] = useState<TimeRange>("1M");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [planted, setPlanted] = useState<Record<string, boolean>>({});
  const [plantNote, setPlantNote] = useState<string | null>(null);

  // One daily price series per topic, fetched lazily the first time its card is
  // expanded and cached by topic id. Every range chip slices this same dataset
  // locally, so switching 1D/1W/1M/3M never triggers another request — that
  // avoids the free tier's per-minute rate limit (429s) and keeps the graphs
  // updating accurately and instantly. When a fetch fails (no key, rate limit,
  // offline) the cache stays empty and the card renders the static mock values.
  const [seriesByTopic, setSeriesByTopic] = useState<Record<string, Record<string, number[]>>>({});
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    if (!investingUnlocked(experienceLevel) || !marketDataConfigured()) return;
    const topic = topics.find((item) => item.id === expanded);
    if (!topic || !canAccessCategory(experienceLevel, topic.category)) return;
    if (seriesByTopic[topic.id]) return; // already cached — no refetch on range change
    let active = true;
    setLoadingTopic(topic.id);
    fetchDailySeries(topic.stocks.map((stock) => stock.symbol)).then((next) => {
      if (!active) return;
      if (Object.keys(next).length > 0) {
        setSeriesByTopic((prev) => ({ ...prev, [topic.id]: next }));
        setLive(true);
      }
      setLoadingTopic((current) => (current === topic.id ? null : current));
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, experienceLevel]);

  function handlePlant(topic: InvestTopic) {
    if (planted[topic.id]) return;
    const reward = plantInvestment(topic.category);
    setPlanted((current) => ({ ...current, [topic.id]: true }));
    setPlantNote(`You planted the ${topic.title} theme - a new ${reward.flowerName} bloomed in your garden (${reward.quantity} total).`);
  }

  // Beginners haven't unlocked investing yet, so show a locked gate instead.
  if (!investingUnlocked(experienceLevel)) {
    return (
      <ScrollView contentContainerStyle={styles.screen}>
        <TopNav />
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Invest Garden</Text>
          <Text style={styles.title}>Investing unlocks soon.</Text>
        </View>
        <View style={styles.lockCard}>
          <View style={styles.lockBadge}>
            <Ionicons color={colors.deepGreen} name="lock-closed" size={34} />
          </View>
          <Text style={styles.lockTitle}>Locked at the Beginner level</Text>
          <Text style={styles.lockCopy}>
            Master budgeting and building your savings first. Reach the Intermediate level to unlock low-risk investing
            like bonds, then mutual funds and stocks at Advanced.
          </Text>
          <Link href="/(tabs)/learn" asChild>
            <TouchableOpacity style={styles.lockButton}>
              <Ionicons color={colors.white} name="book" size={18} />
              <Text style={styles.lockButtonText}>Build your basics in Learn</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <View style={styles.ladderCard}>
          <Text style={styles.ladderTitle}>Here's what's coming</Text>
          {ladder.map((item, index) => (
            <View key={item.flower} style={styles.ladderRow}>
              <View style={styles.rank}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <FlowerIcon name={item.flower} size={34} />
              <View style={styles.ladderText}>
                <Text style={styles.ladderLabel}>{item.label}</Text>
                <Text style={styles.ladderRisk}>{item.risk}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  const accessibleTopics = topics.filter((topic) => canAccessCategory(experienceLevel, topic.category));
  const lockedTopics = topics.filter((topic) => !canAccessCategory(experienceLevel, topic.category));

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <TopNav />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Invest Garden</Text>
        <Text style={styles.title}>Explore themes, not single stocks.</Text>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.profilePill}>
          <Ionicons color={colors.deepGreen} name="person" size={14} />
          <Text style={styles.profileText}>{riskProfile}</Text>
        </View>
        <View style={styles.marketPill}>
          {loadingTopic ? (
            <ActivityIndicator color={colors.mintGreen} size="small" />
          ) : (
            <View style={styles.liveDot} />
          )}
          <Text style={styles.marketText}>
            {loadingTopic ? "Updating prices…" : live ? "Live prices · 15-min delay" : "Simulated prices"}
          </Text>
        </View>
      </View>

      <View style={styles.profileCard}>
        <Ionicons color={colors.deepGreen} name="compass" size={18} />
        <Text style={styles.profileCopy}>{riskProfileCopy[riskProfile]}</Text>
      </View>

      {plantNote ? (
        <View style={styles.plantNote}>
          <Ionicons color={colors.deepGreen} name="flower" size={18} />
          <Text style={styles.plantNoteText}>{plantNote}</Text>
          <TouchableOpacity hitSlop={8} onPress={() => setPlantNote(null)}>
            <Ionicons color={colors.mutedText} name="close" size={18} />
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.rangeRow}>
        {timeRanges.map((item) => (
          <TouchableOpacity key={item} onPress={() => setRange(item)} style={[styles.rangeChip, range === item && styles.rangeChipActive]}>
            <Text style={[styles.rangeText, range === item && styles.rangeTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {accessibleTopics.map((topic) => {
        const isOpen = expanded === topic.id;
        const isPlanted = planted[topic.id];
        const fits = topic.fitsProfiles.includes(riskProfile);
        // The one daily series fetched for this topic (empty until expanded and a
        // fetch succeeds). Each range chip slices a trailing window of it, so the
        // graph and % change reflect the selected range. Falls back to the static
        // mock spark when live data is unavailable.
        const series = seriesByTopic[topic.id] ?? {};
        const isLoading = loadingTopic === topic.id;
        const points = RANGE_POINTS[range];

        const rows = topic.stocks.map((stock) => {
          const full = series[stock.symbol] ?? stock.spark;
          const spark = full.length > points ? full.slice(-points) : full;
          const price = full[full.length - 1];
          const rangeStart = spark.length >= 2 ? spark[0] : null;
          const changePct = rangeStart !== null && rangeStart !== 0 ? ((price - rangeStart) / rangeStart) * 100 : stock.changePct;
          return { stock, spark, price, changePct };
        });
        return (
          <View key={topic.id} style={styles.etfCard}>
            <View style={styles.etfTop}>
              <View style={styles.etfIdentity}>
                <FlowerIcon name={topic.flowerName} size={44} />
                <View style={styles.topicHeaderText}>
                  <Text style={styles.etfSymbol}>{topic.title}</Text>
                  <Text style={styles.etfName}>{topic.theme}</Text>
                </View>
              </View>
            </View>

            <View style={styles.topicMetaRow}>
              <Text style={styles.riskLabel}>{topic.riskLabel}</Text>
              <View style={[styles.fitPill, fits ? styles.fitYes : styles.fitNo]}>
                <Ionicons color={fits ? colors.deepGreen : colors.mutedText} name={fits ? "checkmark-circle" : "information-circle"} size={13} />
                <Text style={[styles.fitText, { color: fits ? colors.deepGreen : colors.mutedText }]}>{fits ? `Fits ${riskProfile}` : "Outside profile"}</Text>
              </View>
              <Text style={styles.topicCount}>Top {topic.stocks.length}</Text>
            </View>

            <View style={styles.etfActions}>
              <TouchableOpacity onPress={() => setExpanded(isOpen ? null : topic.id)} style={styles.infoButton}>
                <Text style={styles.infoButtonText}>{isOpen ? "Hide stocks" : `See top ${topic.stocks.length} stocks`}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePlant(topic)} style={[styles.plantButton, isPlanted && styles.plantedButton]}>
                <Ionicons color={colors.white} name={isPlanted ? "checkmark" : "add"} size={18} />
                <Text style={styles.plantButtonText}>{isPlanted ? "Planted" : "Plant"}</Text>
              </TouchableOpacity>
            </View>

            {isOpen ? (
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Why this theme?</Text>
                <Text style={styles.detailCopy}>{topic.why}</Text>

                <View style={styles.stockHeaderRow}>
                  <Text style={styles.detailTitle}>Top {topic.stocks.length} stocks · {range}</Text>
                  {isLoading ? <ActivityIndicator color={colors.mintGreen} size="small" /> : null}
                </View>
                {rows.map(({ stock, spark, price, changePct }) => {
                  const positive = changePct >= 0;
                  const trendColor = positive ? colors.deepGreen : colors.roseRed;
                  return (
                    <View key={stock.symbol} style={styles.stockRow}>
                      <View style={styles.stockIdentity}>
                        <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                        <Text style={styles.stockName} numberOfLines={1}>{stock.name}</Text>
                      </View>
                      <Sparkline data={spark} width={72} height={28} color={trendColor} />
                      <View style={styles.stockPriceCol}>
                        <Text style={styles.stockPrice}>${price.toFixed(2)}</Text>
                        <Text style={[styles.stockChange, { color: trendColor }]}>
                          {positive ? "▲" : "▼"} {Math.abs(changePct).toFixed(2)}% · {range}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                <Text style={styles.detailTitle}>More info</Text>
                <Text style={styles.detailCopy}>{topic.info}</Text>
              </View>
            ) : null}
          </View>
        );
      })}

      {lockedTopics.map((topic) => (
        <View key={topic.id} style={styles.lockedEtfCard}>
          <View style={styles.lockedIcon}>
            <Ionicons color={colors.mutedText} name="lock-closed" size={20} />
          </View>
          <View style={styles.lockedEtfText}>
            <Text style={styles.lockedEtfSymbol}>{topic.title}</Text>
            <Text style={styles.lockedEtfNote}>{topic.riskLabel}, unlocks at the Advanced level.</Text>
          </View>
        </View>
      ))}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>Educational only</Text>
        <Text style={styles.disclaimerCopy}>
          {live
            ? "Prices and charts are live market data shown for learning, on a delay. The picks are curated examples, not investment advice."
            : "Prices and picks are simulated data for learning. This is not investment advice."}
          {" "}Planting grows the matching flower in your garden - it simulates a position, it does not buy anything real.
        </Text>
      </View>

      <View style={styles.ladderCard}>
        <Text style={styles.ladderTitle}>Learn the risk / return ladder</Text>
        {ladder.map((item, index) => (
          <View key={item.flower} style={styles.ladderRow}>
            <View style={styles.rank}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <FlowerIcon name={item.flower} size={34} />
            <View style={styles.ladderText}>
              <Text style={styles.ladderLabel}>{item.label}</Text>
              <Text style={styles.ladderRisk}>{item.risk}</Text>
            </View>
          </View>
        ))}
      </View>

      <Link href="/sunflower" asChild>
        <TouchableOpacity style={styles.askButton}>
          <Text style={styles.askButtonText}>Ask Sunflower about stocks vs. bonds</Text>
        </TouchableOpacity>
      </Link>

      <Text style={styles.footNote}>You have planted {investmentsPlanted} simulated investment pick{investmentsPlanted === 1 ? "" : "s"} locally.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    gap: 14,
    padding: 20,
    paddingBottom: 120,
    paddingTop: 64
  },
  header: {
    gap: 6
  },
  eyebrow: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    color: colors.darkText,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  profilePill: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  profileText: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900"
  },
  marketPill: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  liveDot: {
    backgroundColor: colors.mintGreen,
    borderRadius: 4,
    height: 8,
    width: 8
  },
  marketText: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "800"
  },
  profileCard: {
    alignItems: "flex-start",
    backgroundColor: colors.card,
    borderRadius: 22,
    flexDirection: "row",
    gap: 10,
    padding: 16,
    ...shadow
  },
  profileCopy: {
    color: colors.darkText,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  plantNote: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    padding: 14
  },
  plantNoteText: {
    color: colors.darkText,
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19
  },
  rangeRow: {
    backgroundColor: "#E9D8B9",
    borderRadius: 18,
    flexDirection: "row",
    padding: 4
  },
  rangeChip: {
    alignItems: "center",
    borderRadius: 14,
    flex: 1,
    paddingVertical: 9
  },
  rangeChipActive: {
    backgroundColor: colors.deepGreen
  },
  rangeText: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "900"
  },
  rangeTextActive: {
    color: colors.white
  },
  etfCard: {
    backgroundColor: colors.card,
    borderRadius: 26,
    gap: 14,
    padding: 18,
    ...shadow
  },
  etfTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  etfIdentity: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10
  },
  etfSymbol: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "900"
  },
  etfName: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700"
  },
  etfPriceCol: {
    alignItems: "flex-end"
  },
  etfPrice: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "900"
  },
  etfChange: {
    fontSize: 14,
    fontWeight: "900"
  },
  etfChangeRange: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2
  },
  etfChartRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between"
  },
  etfMetaCol: {
    alignItems: "flex-end",
    gap: 6
  },
  riskLabel: {
    color: colors.darkText,
    fontSize: 13,
    fontWeight: "900"
  },
  fitPill: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  fitYes: {
    backgroundColor: "#E8F7F0"
  },
  fitNo: {
    backgroundColor: "#F0E6CE"
  },
  fitText: {
    fontSize: 11,
    fontWeight: "900"
  },
  rangeNote: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "700"
  },
  detail: {
    backgroundColor: "#FFFDF6",
    borderRadius: 18,
    gap: 6,
    padding: 14
  },
  detailTitle: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  detailCopy: {
    color: colors.darkText,
    fontSize: 14,
    lineHeight: 20
  },
  topicHeaderText: {
    flex: 1
  },
  topicMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  topicCount: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: "auto"
  },
  stockHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between"
  },
  stockRow: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    flexDirection: "row",
    gap: 10,
    padding: 10
  },
  stockIdentity: {
    flex: 1
  },
  stockSymbol: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  stockName: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700"
  },
  stockPriceCol: {
    alignItems: "flex-end",
    minWidth: 78
  },
  stockPrice: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  stockChange: {
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2
  },
  etfActions: {
    flexDirection: "row",
    gap: 10
  },
  infoButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    padding: 13
  },
  infoButtonText: {
    color: colors.deepGreen,
    fontSize: 14,
    fontWeight: "900"
  },
  plantButton: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 16,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    padding: 13
  },
  plantedButton: {
    backgroundColor: colors.mintGreen
  },
  plantButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900"
  },
  disclaimer: {
    backgroundColor: "#FFF4CB",
    borderRadius: 22,
    padding: 16
  },
  disclaimerTitle: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  disclaimerCopy: {
    color: colors.mutedText,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4
  },
  ladderCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    gap: 10,
    padding: 16,
    ...shadow
  },
  ladderTitle: {
    color: colors.darkText,
    fontSize: 17,
    fontWeight: "900"
  },
  ladderRow: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    padding: 10
  },
  rank: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  rankText: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "900"
  },
  ladderText: {
    flex: 1
  },
  ladderLabel: {
    color: colors.darkText,
    fontSize: 14,
    fontWeight: "900"
  },
  ladderRisk: {
    color: colors.deepGreen,
    fontSize: 12,
    fontWeight: "800"
  },
  askButton: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 22,
    padding: 16,
    ...shadow
  },
  askButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  },
  footNote: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center"
  },
  lockCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 26,
    gap: 12,
    padding: 24,
    ...shadow
  },
  lockBadge: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 999,
    height: 64,
    justifyContent: "center",
    width: 64
  },
  lockTitle: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center"
  },
  lockCopy: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center"
  },
  lockButton: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 4,
    paddingHorizontal: 18,
    paddingVertical: 14
  },
  lockButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900"
  },
  lockedEtfCard: {
    alignItems: "center",
    backgroundColor: "#F3ECDD",
    borderRadius: 22,
    flexDirection: "row",
    gap: 12,
    opacity: 0.85,
    padding: 16
  },
  lockedIcon: {
    alignItems: "center",
    backgroundColor: "#E4D6BC",
    borderRadius: 14,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  lockedEtfText: {
    flex: 1,
    gap: 3
  },
  lockedEtfSymbol: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  lockedEtfNote: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700"
  }
});
