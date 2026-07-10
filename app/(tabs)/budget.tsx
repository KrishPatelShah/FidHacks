import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { ProgressBar } from "@/components/ProgressBar";
import { ReceiptReviewModal } from "@/components/ReceiptReviewModal";
import { spendCategoryLabels } from "@/data/transactions";
import { scanReceipt, ScanResult } from "@/services/receiptScanner";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { ParsedReceipt, SpendCategory } from "@/types/domain";

type Filter = "all" | SpendCategory;
type BudgetGroup = "needs" | "wants" | "save";

const filters: Filter[] = ["all", "needs", "wants", "save", "income"];
const filterLabels: Record<Filter, string> = { all: "All", needs: "Needs", wants: "Wants", save: "Save", income: "Income" };

const categoryMeta: Record<SpendCategory, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  needs: { color: colors.deepGreen, icon: "cart" },
  wants: { color: colors.softOrange, icon: "sparkles" },
  save: { color: colors.skyBlue, icon: "trending-up" },
  income: { color: colors.orchidPurple, icon: "arrow-down-circle" }
};

// 50 / 30 / 20 targets for the three spending groups.
const targets: Record<BudgetGroup, number> = { needs: 0.5, wants: 0.3, save: 0.2 };
const groupOrder: BudgetGroup[] = ["needs", "wants", "save"];

const manualCategories: SpendCategory[] = ["needs", "wants", "save", "income"];

function formatMoney(amount: number) {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatMoneyExact(amount: number) {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BudgetScreen() {
  const { transactions, addTransaction, logBudget, commitReceipt } = useGarden();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const [parsed, setParsed] = useState<ScanResult | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const [draftMerchant, setDraftMerchant] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [draftCategory, setDraftCategory] = useState<SpendCategory>("needs");

  const groups = useMemo(() => {
    const totals = { needs: 0, wants: 0, save: 0, income: 0 };
    transactions.forEach((txn) => {
      totals[txn.category] += txn.amount;
    });
    const allocated = totals.needs + totals.wants + totals.save;
    const income = totals.income || allocated || 1;
    return { totals, allocated, income };
  }, [transactions]);

  const pieData = useMemo(
    () =>
      groupOrder.map((group) => ({
        value: Math.max(groups.totals[group], 0.01),
        color: categoryMeta[group].color,
        text: `${Math.round((groups.totals[group] / (groups.allocated || 1)) * 100)}%`
      })),
    [groups]
  );

  const guidance = useMemo(() => {
    for (const group of groupOrder) {
      const actual = groups.totals[group] / groups.income;
      const diff = actual - targets[group];
      if (group !== "save" && diff > 0.05) {
        return `${spendCategoryLabels[group]} are a bit high, ${Math.round(actual * 100)}% of income vs a ${Math.round(targets[group] * 100)}% goal.`;
      }
      if (group === "save" && diff < -0.05) {
        return `Savings are a little low, ${Math.round(actual * 100)}% of income vs a ${Math.round(targets.save * 100)}% goal. A small transfer helps.`;
      }
    }
    return "Nice balance! Your Needs, Wants, and Save split is close to the 50/30/20 guide.";
  }, [groups]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((txn) => {
      if (filter !== "all" && txn.category !== filter) return false;
      if (q && !`${txn.merchant} ${txn.note ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [transactions, filter, query]);

  async function pickImage(mode: "camera" | "library") {
    setChooserOpen(false);
    try {
      const permission =
        mode === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      // Even without permission we still run the demo via the fallback receipt.
      let result: ImagePicker.ImagePickerResult;
      if (permission.granted && mode === "camera") {
        result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.5 });
      } else if (permission.granted) {
        result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.5, mediaTypes: ImagePicker.MediaTypeOptions.Images });
      } else {
        result = { canceled: true, assets: null };
      }

      if (result.canceled) {
        // User backed out but still wants to see the demo -> run with fallback.
        await runScan(null, null);
        return;
      }

      const asset = result.assets?.[0];
      await runScan(asset?.base64 ?? null, asset?.uri ?? null);
    } catch {
      await runScan(null, null);
    }
  }

  async function runScan(base64: string | null, uri: string | null) {
    setScanning(true);
    setPickedImage(uri);
    try {
      const receipt = await scanReceipt(base64 ?? "", "image/jpeg");
      setParsed(receipt);
      setScanning(false);
      setReviewOpen(true);
    } catch {
      setScanning(false);
    }
  }

  function handleAddReceipt(receipt: ParsedReceipt) {
    const result = commitReceipt(receipt);
    logBudget();
    setReviewOpen(false);
    setParsed(null);
    setPickedImage(null);
    setSavedNote(`First Receipt Sprout! Added ${result.added} items from ${receipt.merchant}, a new ${result.flowerName} grew in your garden.`);
  }

  function handleManualSave() {
    const amount = Number(draftAmount.replace(/[^0-9.]/g, ""));
    if (!draftMerchant.trim() || !Number.isFinite(amount) || amount <= 0) return;
    addTransaction({ merchant: draftMerchant.trim(), amount, category: draftCategory, source: "manual" });
    logBudget();
    setSavedNote(`Added ${draftMerchant.trim()} · ${formatMoneyExact(amount)}`);
    setDraftMerchant("");
    setDraftAmount("");
    setDraftCategory("needs");
    setManualOpen(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Budget Garden</Text>
        <Text style={styles.subtitle}>Track purchases and keep your 50/30/20 balance.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>50 / 30 / 20 this month</Text>
          <Text style={styles.allocated}>{formatMoney(groups.income)} income</Text>
        </View>

        <View style={styles.chartWrap}>
          <PieChart
            data={pieData}
            donut
            radius={108}
            innerRadius={68}
            strokeWidth={2}
            strokeColor={colors.card}
            centerLabelComponent={() => (
              <View style={styles.center}>
                <Text style={styles.centerLabel}>Spent</Text>
                <Text style={styles.centerValue}>{formatMoney(groups.allocated)}</Text>
                <Text style={styles.centerSub}>of {formatMoney(groups.income)}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.legendRow}>
          {groupOrder.map((group) => {
            const share = groups.allocated ? groups.totals[group] / groups.allocated : 0;
            return (
              <View key={group} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: categoryMeta[group].color }]} />
                <Text style={styles.legendText}>
                  {spendCategoryLabels[group]} {Math.round(share * 100)}%
                </Text>
              </View>
            );
          })}
        </View>

        {groupOrder.map((group) => {
          const spent = groups.totals[group];
          const goalPct = targets[group];
          const goalMoney = groups.income * goalPct;
          const actualPct = spent / groups.income;
          const progress = goalMoney > 0 ? Math.min(spent / goalMoney, 1.25) : 0;
          const over = actualPct > goalPct + 0.02;
          const under = actualPct < goalPct - 0.02;
          const remaining = Math.max(goalMoney - spent, 0);
          const overBy = Math.max(spent - goalMoney, 0);

          return (
            <View key={group} style={styles.groupRow}>
              <View style={styles.groupTop}>
                <View style={styles.groupLabelWrap}>
                  <View style={[styles.dot, { backgroundColor: categoryMeta[group].color }]} />
                  <Text style={styles.groupLabel}>{spendCategoryLabels[group]}</Text>
                </View>
                <Text style={[styles.groupPct, over && styles.over, under && group === "save" && styles.over]}>
                  {Math.round(actualPct * 100)}% / {Math.round(goalPct * 100)}%
                </Text>
              </View>
              <ProgressBar progress={Math.min(progress, 1)} color={categoryMeta[group].color} />
              <View style={styles.moneyRow}>
                <Text style={styles.groupStatus}>
                  {formatMoneyExact(spent)} of {formatMoneyExact(goalMoney)} goal
                </Text>
                <Text style={[styles.groupStatus, over ? styles.over : under && group === "save" ? styles.over : styles.onTrack]}>
                  {over ? `${formatMoneyExact(overBy)} over` : under ? `${formatMoneyExact(remaining)} left` : "On target"}
                </Text>
              </View>
            </View>
          );
        })}

        <View style={styles.guidance}>
          <Ionicons color={colors.deepGreen} name="bulb" size={16} />
          <Text style={styles.guidanceText}>{guidance}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => setChooserOpen(true)} style={[styles.actionButton, styles.primaryAction]} disabled={scanning}>
          <Ionicons color={colors.white} name="scan" size={20} />
          <Text style={styles.primaryActionText}>{scanning ? "Scanning…" : "Scan Receipt"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setManualOpen(true)} style={[styles.actionButton, styles.secondaryAction]}>
          <Ionicons color={colors.deepGreen} name="create" size={20} />
          <Text style={styles.secondaryActionText}>Manual Entry</Text>
        </TouchableOpacity>
      </View>

      {savedNote ? (
        <View style={styles.savedCard}>
          <Ionicons color={colors.deepGreen} name="leaf" size={18} />
          <Text style={styles.savedText}>{savedNote}</Text>
        </View>
      ) : null}

      <View style={styles.searchBar}>
        <Ionicons color={colors.mutedText} name="search" size={18} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search purchases"
          placeholderTextColor={colors.mutedText}
          style={styles.searchInput}
        />
        {query ? (
          <Pressable onPress={() => setQuery("")}>
            <Ionicons color={colors.mutedText} name="close-circle" size={18} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {filters.map((item) => (
          <TouchableOpacity key={item} onPress={() => setFilter(item)} style={[styles.chip, filter === item && styles.chipActive]}>
            <Text style={[styles.chipText, filter === item && styles.chipTextActive]}>{filterLabels[item]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent purchases</Text>
      <View style={styles.list}>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>No purchases match that filter yet.</Text>
        ) : (
          filtered.map((txn) => {
            const meta = categoryMeta[txn.category];
            return (
              <View key={txn.id} style={styles.txn}>
                <View style={[styles.txnIcon, { backgroundColor: `${meta.color}22` }]}>
                  <Ionicons color={meta.color} name={meta.icon} size={18} />
                </View>
                <View style={styles.txnBody}>
                  <Text style={styles.txnMerchant}>{txn.merchant}</Text>
                  <View style={styles.txnTags}>
                    <Text style={[styles.tag, { color: meta.color, backgroundColor: `${meta.color}18` }]}>{spendCategoryLabels[txn.category]}</Text>
                    <Text style={[styles.tag, styles.sourceTag]}>
                      {txn.source === "scanned" ? "Scanned" : "Manual"}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.txnAmount, txn.category === "income" && styles.income]}>
                  {txn.category === "income" ? "+" : "-"}
                  {formatMoneyExact(txn.amount)}
                </Text>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Gentle insight</Text>
        <Text style={styles.insightCopy}>Want to understand a spending gap? Sunflower can explain it in plain language.</Text>
        <Link href="/sunflower" asChild>
          <TouchableOpacity style={styles.askButton}>
            <Text style={styles.askButtonText}>Ask Sunflower to Explain</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Modal transparent animationType="fade" visible={chooserOpen} onRequestClose={() => setChooserOpen(false)}>
        <Pressable style={styles.chooserBackdrop} onPress={() => setChooserOpen(false)}>
          <View style={styles.chooserCard}>
            <Text style={styles.chooserTitle}>Scan a receipt</Text>
            <Text style={styles.chooserCopy}>We'll read the items with AI and let you review before saving.</Text>
            <TouchableOpacity onPress={() => pickImage("camera")} style={styles.chooserOption}>
              <Ionicons color={colors.deepGreen} name="camera" size={20} />
              <Text style={styles.chooserOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage("library")} style={styles.chooserOption}>
              <Ionicons color={colors.deepGreen} name="images" size={20} />
              <Text style={styles.chooserOptionText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooserOpen(false)} style={styles.chooserCancel}>
              <Text style={styles.chooserCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal transparent animationType="fade" visible={scanning}>
        <View style={styles.scanBackdrop}>
          <View style={styles.scanCard}>
            <ActivityIndicator color={colors.deepGreen} size="large" />
            <Text style={styles.scanTitle}>Reading your receipt…</Text>
            <Text style={styles.scanCopy}>Extracting merchant, items, and totals with AI.</Text>
          </View>
        </View>
      </Modal>

      <ReceiptReviewModal
        visible={reviewOpen}
        receipt={parsed}
        source={parsed?.source ?? null}
        imageUri={pickedImage}
        onCancel={() => {
          setReviewOpen(false);
          setParsed(null);
          setPickedImage(null);
        }}
        onConfirm={handleAddReceipt}
      />

      <Modal transparent animationType="slide" visible={manualOpen} onRequestClose={() => setManualOpen(false)}>
        <View style={styles.manualBackdrop}>
          <View style={styles.manualCard}>
            <View style={styles.manualHeader}>
              <Text style={styles.manualTitle}>Add a purchase</Text>
              <Pressable onPress={() => setManualOpen(false)}>
                <Ionicons color={colors.darkText} name="close" size={22} />
              </Pressable>
            </View>
            <Text style={styles.inputLabel}>Merchant</Text>
            <TextInput value={draftMerchant} onChangeText={setDraftMerchant} placeholder="e.g. Target" placeholderTextColor={colors.mutedText} style={styles.input} />
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput value={draftAmount} onChangeText={setDraftAmount} keyboardType="numeric" placeholder="0.00" placeholderTextColor={colors.mutedText} style={styles.input} />
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryPicker}>
              {manualCategories.map((cat) => (
                <TouchableOpacity key={cat} onPress={() => setDraftCategory(cat)} style={[styles.categoryOption, draftCategory === cat && { backgroundColor: categoryMeta[cat].color }]}>
                  <Text style={[styles.categoryOptionText, draftCategory === cat && styles.categoryOptionTextActive]}>{spendCategoryLabels[cat]}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={handleManualSave} style={styles.manualSave}>
              <Text style={styles.manualSaveText}>Add purchase</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    gap: 16,
    padding: 20,
    paddingBottom: 120,
    paddingTop: 64
  },
  header: {
    gap: 8
  },
  title: {
    color: colors.darkText,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.5
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    gap: 16,
    padding: 20,
    ...shadow
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "900"
  },
  allocated: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "800"
  },
  chartWrap: {
    alignItems: "center",
    paddingVertical: 4
  },
  center: {
    alignItems: "center"
  },
  centerLabel: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  centerValue: {
    color: colors.darkText,
    fontSize: 22,
    fontWeight: "900"
  },
  centerSub: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700"
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center"
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6
  },
  legendText: {
    color: colors.darkText,
    fontSize: 13,
    fontWeight: "800"
  },
  groupRow: {
    gap: 8
  },
  groupTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  groupLabelWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  dot: {
    borderRadius: 6,
    height: 12,
    width: 12
  },
  groupLabel: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  groupPct: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  over: {
    color: colors.roseRed
  },
  onTrack: {
    color: colors.deepGreen
  },
  moneyRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  groupStatus: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700"
  },
  guidance: {
    alignItems: "flex-start",
    backgroundColor: "#E8F7F0",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    padding: 14
  },
  guidanceText: {
    color: colors.darkText,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  actionRow: {
    flexDirection: "row",
    gap: 12
  },
  actionButton: {
    alignItems: "center",
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    padding: 16,
    ...shadow
  },
  primaryAction: {
    backgroundColor: colors.deepGreen
  },
  primaryActionText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900"
  },
  secondaryAction: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1
  },
  secondaryActionText: {
    color: colors.deepGreen,
    fontSize: 15,
    fontWeight: "900"
  },
  savedCard: {
    alignItems: "center",
    backgroundColor: "#E8F7F0",
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    padding: 14
  },
  savedText: {
    color: colors.darkText,
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  searchInput: {
    color: colors.darkText,
    flex: 1,
    fontSize: 15,
    fontWeight: "700"
  },
  chips: {
    gap: 8,
    paddingRight: 8
  },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9
  },
  chipActive: {
    backgroundColor: colors.deepGreen,
    borderColor: colors.deepGreen
  },
  chipText: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "900"
  },
  chipTextActive: {
    color: colors.white
  },
  list: {
    gap: 10
  },
  empty: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "700",
    paddingVertical: 12,
    textAlign: "center"
  },
  txn: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 20,
    flexDirection: "row",
    gap: 12,
    padding: 14,
    ...shadow
  },
  txnIcon: {
    alignItems: "center",
    borderRadius: 14,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  txnBody: {
    flex: 1,
    gap: 6
  },
  txnMerchant: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  txnTags: {
    flexDirection: "row",
    gap: 6
  },
  tag: {
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  sourceTag: {
    backgroundColor: "#E9D8B9",
    color: colors.mutedText
  },
  txnAmount: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  income: {
    color: colors.deepGreen
  },
  insightCard: {
    backgroundColor: "#FFF4CB",
    borderRadius: 26,
    gap: 10,
    padding: 18
  },
  insightTitle: {
    color: colors.darkText,
    fontSize: 19,
    fontWeight: "900"
  },
  insightCopy: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22
  },
  askButton: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14
  },
  askButtonText: {
    color: colors.deepGreen,
    fontSize: 15,
    fontWeight: "900"
  },
  chooserBackdrop: {
    backgroundColor: "rgba(15, 61, 48, 0.5)",
    flex: 1,
    justifyContent: "flex-end"
  },
  chooserCard: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: 10,
    padding: 24,
    paddingBottom: 40
  },
  chooserTitle: {
    color: colors.darkText,
    fontSize: 22,
    fontWeight: "900"
  },
  chooserCopy: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 6
  },
  chooserOption: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    ...shadow
  },
  chooserOptionText: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  chooserCancel: {
    alignItems: "center",
    marginTop: 4,
    padding: 12
  },
  chooserCancelText: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: "800"
  },
  scanBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(15, 61, 48, 0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 32
  },
  scanCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 28,
    gap: 12,
    padding: 32,
    width: "100%",
    ...shadow
  },
  scanTitle: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "900"
  },
  scanCopy: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  },
  manualBackdrop: {
    backgroundColor: "rgba(15, 61, 48, 0.5)",
    flex: 1,
    justifyContent: "flex-end"
  },
  manualCard: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    gap: 10,
    padding: 24,
    paddingBottom: 40
  },
  manualHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  manualTitle: {
    color: colors.darkText,
    fontSize: 22,
    fontWeight: "900"
  },
  inputLabel: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 6,
    textTransform: "uppercase"
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "800",
    padding: 14
  },
  categoryPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  categoryOption: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  categoryOptionText: {
    color: colors.darkText,
    fontSize: 14,
    fontWeight: "900"
  },
  categoryOptionTextActive: {
    color: colors.white
  },
  manualSave: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 20,
    marginTop: 14,
    padding: 16
  },
  manualSaveText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  }
});
