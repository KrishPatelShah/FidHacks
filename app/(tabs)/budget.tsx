import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "@/components/ProgressBar";
import { mockReceipts, spendCategoryLabels } from "@/data/transactions";
import { useGarden } from "@/state/garden";
import { colors, shadow } from "@/theme/colors";
import { SpendCategory } from "@/types/domain";

type Filter = "all" | SpendCategory;

const filters: Filter[] = ["all", "needs", "wants", "save", "income"];
const filterLabels: Record<Filter, string> = { all: "All", needs: "Needs", wants: "Wants", save: "Save", income: "Income" };

const categoryMeta: Record<SpendCategory, { color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  needs: { color: colors.deepGreen, icon: "cart" },
  wants: { color: colors.softOrange, icon: "sparkles" },
  save: { color: colors.skyBlue, icon: "trending-up" },
  income: { color: colors.orchidPurple, icon: "arrow-down-circle" }
};

// 50 / 30 / 20 targets for the three spending groups.
const targets: Record<"needs" | "wants" | "save", number> = { needs: 0.5, wants: 0.3, save: 0.2 };
const groupOrder: Array<"needs" | "wants" | "save"> = ["needs", "wants", "save"];

const manualCategories: SpendCategory[] = ["needs", "wants", "save", "income"];

function formatMoney(amount: number) {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BudgetScreen() {
  const { transactions, addTransaction, logBudget } = useGarden();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  const [draftMerchant, setDraftMerchant] = useState("");
  const [draftAmount, setDraftAmount] = useState("");
  const [draftCategory, setDraftCategory] = useState<SpendCategory>("needs");

  const groups = useMemo(() => {
    const totals = { needs: 0, wants: 0, save: 0, income: 0 };
    transactions.forEach((txn) => {
      totals[txn.category] += txn.amount;
    });
    const allocated = totals.needs + totals.wants + totals.save || 1;
    return { totals, allocated };
  }, [transactions]);

  const guidance = useMemo(() => {
    for (const group of groupOrder) {
      const actual = groups.totals[group] / groups.allocated;
      const diff = actual - targets[group];
      if (group !== "save" && diff > 0.05) {
        return `${spendCategoryLabels[group]} are a bit high this week — ${Math.round(actual * 100)}% vs a ${Math.round(targets[group] * 100)}% target.`;
      }
      if (group === "save" && diff < -0.05) {
        return `Savings are a little low — you're at ${Math.round(actual * 100)}% vs a ${Math.round(targets.save * 100)}% target. A small transfer helps.`;
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

  function handleScan() {
    setScanning(true);
    const receipt = mockReceipts[Math.floor(Math.random() * mockReceipts.length)];
    setTimeout(() => {
      addTransaction({ ...receipt, source: "scanned" });
      logBudget();
      setScanning(false);
      setSavedNote(`Scanned ${receipt.merchant} · ${formatMoney(receipt.amount)}`);
    }, 1400);
  }

  function handleManualSave() {
    const amount = Number(draftAmount.replace(/[^0-9.]/g, ""));
    if (!draftMerchant.trim() || !Number.isFinite(amount) || amount <= 0) return;
    addTransaction({ merchant: draftMerchant.trim(), amount, category: draftCategory, source: "manual" });
    logBudget();
    setSavedNote(`Added ${draftMerchant.trim()} · ${formatMoney(amount)}`);
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
          <Text style={styles.allocated}>{formatMoney(groups.allocated)} allocated</Text>
        </View>
        {groupOrder.map((group) => {
          const actual = groups.totals[group] / groups.allocated;
          const target = targets[group];
          const over = actual > target + 0.02;
          const under = actual < target - 0.02;
          return (
            <View key={group} style={styles.groupRow}>
              <View style={styles.groupTop}>
                <View style={styles.groupLabelWrap}>
                  <View style={[styles.dot, { backgroundColor: categoryMeta[group].color }]} />
                  <Text style={styles.groupLabel}>{spendCategoryLabels[group]}</Text>
                  <Text style={styles.groupTarget}>target {Math.round(target * 100)}%</Text>
                </View>
                <Text style={[styles.groupPct, over && styles.over, under && group === "save" && styles.over]}>{Math.round(actual * 100)}%</Text>
              </View>
              <ProgressBar progress={actual / Math.max(target * 1.6, actual)} color={categoryMeta[group].color} />
              <Text style={styles.groupStatus}>
                {over ? `Over target by ${Math.round((actual - target) * 100)}%` : under ? `Under target by ${Math.round((target - actual) * 100)}%` : "On target"}
                {"  ·  "}
                {formatMoney(groups.totals[group])}
              </Text>
            </View>
          );
        })}
        <View style={styles.guidance}>
          <Ionicons color={colors.deepGreen} name="bulb" size={16} />
          <Text style={styles.guidanceText}>{guidance}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity onPress={handleScan} style={[styles.actionButton, styles.primaryAction]} disabled={scanning}>
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
          <Ionicons color={colors.deepGreen} name="checkmark-circle" size={18} />
          <Text style={styles.savedText}>{savedNote} — logged and your Daisy grew.</Text>
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
                  {formatMoney(txn.amount)}
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

      <Modal transparent animationType="fade" visible={scanning}>
        <View style={styles.scanBackdrop}>
          <View style={styles.scanCard}>
            <ActivityIndicator color={colors.deepGreen} size="large" />
            <Text style={styles.scanTitle}>Scanning receipt…</Text>
            <Text style={styles.scanCopy}>Reading merchant and total (simulated for the demo).</Text>
          </View>
        </View>
      </Modal>

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
  groupTarget: {
    color: colors.mutedText,
    fontSize: 12,
    fontWeight: "700"
  },
  groupPct: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: "900"
  },
  over: {
    color: colors.roseRed
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
