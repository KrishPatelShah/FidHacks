import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlowerIcon } from "@/components/FlowerIcon";
import { Sparkline } from "@/components/Sparkline";
import { etfs, riskProfileCopy, timeRanges, TimeRange } from "@/data/investments";
import { canAccessCategory, investingUnlocked } from "@/lib/levels";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { Etf } from "@/types/domain";

const ladder = [
  { flower: "White Lily", label: "Savings / Cash", risk: "Lowest risk" },
  { flower: "Bluebell", label: "Bonds", risk: "Low-to-moderate" },
  { flower: "Purple Tulip", label: "Index / Mutual Funds", risk: "Medium" },
  { flower: "Red Poppy", label: "Individual Stocks", risk: "Highest risk" }
];

export default function StocksScreen() {
  const { riskProfile, plantInvestment, plants, experienceLevel } = useGarden();
  const [range, setRange] = useState<TimeRange>("1M");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [planted, setPlanted] = useState<Record<string, boolean>>({});

  function handlePlant(etf: Etf) {
    plantInvestment(etf.category);
    setPlanted((current) => ({ ...current, [etf.symbol]: true }));
  }

  // Beginners haven't unlocked investing yet — show a locked gate instead.
  if (!investingUnlocked(experienceLevel)) {
    return (
      <ScrollView contentContainerStyle={styles.screen}>
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
            like bonds — then mutual funds and stocks at Advanced.
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

  const accessibleEtfs = etfs.filter((etf) => canAccessCategory(experienceLevel, etf.category));
  const lockedEtfs = etfs.filter((etf) => !canAccessCategory(experienceLevel, etf.category));

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Invest Garden</Text>
        <Text style={styles.title}>Educational picks for your profile.</Text>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.profilePill}>
          <Ionicons color={colors.deepGreen} name="person" size={14} />
          <Text style={styles.profileText}>{riskProfile}</Text>
        </View>
        <View style={styles.marketPill}>
          <View style={styles.liveDot} />
          <Text style={styles.marketText}>Market open · 15-min delay</Text>
        </View>
      </View>

      <View style={styles.profileCard}>
        <Ionicons color={colors.deepGreen} name="compass" size={18} />
        <Text style={styles.profileCopy}>{riskProfileCopy[riskProfile]}</Text>
      </View>

      <View style={styles.rangeRow}>
        {timeRanges.map((item) => (
          <TouchableOpacity key={item} onPress={() => setRange(item)} style={[styles.rangeChip, range === item && styles.rangeChipActive]}>
            <Text style={[styles.rangeText, range === item && styles.rangeTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {accessibleEtfs.map((etf) => {
        const positive = etf.changePct >= 0;
        const fits = etf.fitsProfiles.includes(riskProfile);
        const isPlanted = planted[etf.symbol];
        const isOpen = expanded === etf.symbol;
        const trendColor = positive ? colors.deepGreen : colors.roseRed;
        return (
          <View key={etf.symbol} style={styles.etfCard}>
            <View style={styles.etfTop}>
              <View style={styles.etfIdentity}>
                <FlowerIcon name={etf.flowerName} size={44} />
                <View>
                  <Text style={styles.etfSymbol}>{etf.symbol}</Text>
                  <Text style={styles.etfName}>{etf.name}</Text>
                </View>
              </View>
              <View style={styles.etfPriceCol}>
                <Text style={styles.etfPrice}>${etf.price.toFixed(2)}</Text>
                <Text style={[styles.etfChange, { color: trendColor }]}>
                  {positive ? "▲" : "▼"} {Math.abs(etf.changePct).toFixed(2)}%
                </Text>
              </View>
            </View>

            <View style={styles.etfChartRow}>
              <Sparkline data={etf.spark} width={150} height={44} color={trendColor} />
              <View style={styles.etfMetaCol}>
                <Text style={styles.riskLabel}>{etf.riskLabel}</Text>
                <View style={[styles.fitPill, fits ? styles.fitYes : styles.fitNo]}>
                  <Ionicons color={fits ? colors.deepGreen : colors.mutedText} name={fits ? "checkmark-circle" : "information-circle"} size={13} />
                  <Text style={[styles.fitText, { color: fits ? colors.deepGreen : colors.mutedText }]}>{fits ? `Fits ${riskProfile}` : "Outside profile"}</Text>
                </View>
                <Text style={styles.rangeNote}>{range} view</Text>
              </View>
            </View>

            {isOpen ? (
              <View style={styles.detail}>
                <Text style={styles.detailTitle}>Why this pick?</Text>
                <Text style={styles.detailCopy}>{etf.why}</Text>
                <Text style={styles.detailTitle}>More info</Text>
                <Text style={styles.detailCopy}>{etf.info}</Text>
              </View>
            ) : null}

            <View style={styles.etfActions}>
              <TouchableOpacity onPress={() => setExpanded(isOpen ? null : etf.symbol)} style={styles.infoButton}>
                <Text style={styles.infoButtonText}>{isOpen ? "Hide info" : "Why this pick?"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePlant(etf)} style={[styles.plantButton, isPlanted && styles.plantedButton]}>
                <Ionicons color={colors.white} name={isPlanted ? "checkmark" : "add"} size={18} />
                <Text style={styles.plantButtonText}>{isPlanted ? "Planted" : "Plant"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {lockedEtfs.map((etf) => (
        <View key={etf.symbol} style={styles.lockedEtfCard}>
          <View style={styles.lockedIcon}>
            <Ionicons color={colors.mutedText} name="lock-closed" size={20} />
          </View>
          <View style={styles.lockedEtfText}>
            <Text style={styles.lockedEtfSymbol}>{etf.symbol} · {etf.name}</Text>
            <Text style={styles.lockedEtfNote}>{etf.riskLabel} — unlocks at the Advanced level.</Text>
          </View>
        </View>
      ))}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>Simulated & educational only</Text>
        <Text style={styles.disclaimerCopy}>Prices and picks are mock data for learning. This is not investment advice. Planting grows an educational flower, not a real position.</Text>
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

      <Text style={styles.footNote}>You have {plants.filter((p) => ["cash", "bonds", "funds", "stocks"].includes(p.type)).reduce((s, p) => s + p.quantity, 0)} investment flowers growing.</Text>
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
