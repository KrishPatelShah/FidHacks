import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/AppText";
import { spendCategoryLabels } from "@/data/transactions";
import { colors, shadow } from "@/theme/colors";
import { ParsedReceipt, ParsedReceiptItem, SpendCategory } from "@/types/domain";

type Props = {
  visible: boolean;
  receipt: ParsedReceipt | null;
  source: "gemini" | "fallback" | null;
  imageUri?: string | null;
  onCancel: () => void;
  onConfirm: (receipt: ParsedReceipt) => void;
};

const categories: SpendCategory[] = ["needs", "wants", "save", "income"];
const categoryColor: Record<SpendCategory, string> = {
  needs: colors.deepGreen,
  wants: colors.softOrange,
  save: colors.skyBlue,
  income: colors.orchidPurple
};

function money(amount: number) {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function ReceiptReviewModal({ visible, receipt, source, imageUri, onCancel, onConfirm }: Props) {
  const [items, setItems] = useState<ParsedReceiptItem[]>([]);

  useEffect(() => {
    if (receipt) setItems(receipt.items.map((item) => ({ ...item })));
  }, [receipt]);

  if (!receipt) return null;

  const itemTotal = items.reduce((sum, item) => sum + item.price, 0);

  function setCategory(index: number, category: SpendCategory) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, category } : item)));
  }

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Review Receipt</Text>
              <Text style={styles.subtitle}>Check the items before adding them to your budget.</Text>
            </View>
            <Pressable onPress={onCancel} hitSlop={8}>
              <Ionicons color={colors.darkText} name="close" size={24} />
            </Pressable>
          </View>

          <View style={[styles.sourcePill, source === "gemini" ? styles.sourceLive : styles.sourceMock]}>
            <Ionicons
              color={source === "gemini" ? colors.deepGreen : colors.softOrange}
              name={source === "gemini" ? "sparkles" : "flask"}
              size={13}
            />
            <Text style={[styles.sourceText, { color: source === "gemini" ? colors.deepGreen : colors.softOrange }]}>
              {source === "gemini" ? "Parsed by Gemini" : "Demo fallback data"}
            </Text>
          </View>

          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.merchantRow}>
              {imageUri ? <Image source={{ uri: imageUri }} style={styles.thumb} /> : null}
              <View style={styles.merchantInfo}>
                <Text style={styles.merchant}>{receipt.merchant}</Text>
                <Text style={styles.meta}>{receipt.date}</Text>
                <Text style={styles.meta}>Receipt total {money(receipt.total)}</Text>
              </View>
            </View>

            {items.map((item, index) => (
              <View key={`${item.name}_${index}`} style={styles.item}>
                <View style={styles.itemTop}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{money(item.price)}</Text>
                </View>
                <View style={styles.catRow}>
                  {categories.map((cat) => {
                    const active = item.category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(index, cat)}
                        style={[styles.catChip, active && { backgroundColor: categoryColor[cat], borderColor: categoryColor[cat] }]}
                      >
                        <Text style={[styles.catText, active && styles.catTextActive]}>{spendCategoryLabels[cat]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{items.length} items</Text>
              <Text style={styles.totalValue}>{money(itemTotal)}</Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onCancel} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm({ ...receipt, items })} style={[styles.button, styles.confirmButton]}>
              <Ionicons color={colors.white} name="leaf" size={18} />
              <Text style={styles.confirmText}>Add to Budget</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(15, 61, 48, 0.5)",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "88%",
    paddingBottom: 32,
    paddingHorizontal: 22,
    paddingTop: 20
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    color: colors.darkText,
    fontSize: 24,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
    maxWidth: 260
  },
  sourcePill: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  sourceLive: {
    backgroundColor: "#E8F7F0"
  },
  sourceMock: {
    backgroundColor: "#FFF4CB"
  },
  sourceText: {
    fontSize: 12,
    fontWeight: "900"
  },
  body: {
    gap: 12,
    paddingVertical: 16
  },
  merchantRow: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 20,
    flexDirection: "row",
    gap: 14,
    padding: 14,
    ...shadow
  },
  thumb: {
    backgroundColor: "#EFE3C8",
    borderRadius: 14,
    height: 64,
    width: 48
  },
  merchantInfo: {
    flex: 1,
    gap: 2
  },
  merchant: {
    color: colors.darkText,
    fontSize: 18,
    fontWeight: "900"
  },
  meta: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700"
  },
  item: {
    backgroundColor: colors.card,
    borderRadius: 20,
    gap: 12,
    padding: 14,
    ...shadow
  },
  itemTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemName: {
    color: colors.darkText,
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    paddingRight: 10
  },
  itemPrice: {
    color: colors.darkText,
    fontSize: 15,
    fontWeight: "900"
  },
  catRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  catChip: {
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  catText: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "800"
  },
  catTextActive: {
    color: colors.white
  },
  totalRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingTop: 4
  },
  totalLabel: {
    color: colors.mutedText,
    fontSize: 14,
    fontWeight: "800"
  },
  totalValue: {
    color: colors.darkText,
    fontSize: 18,
    fontWeight: "900"
  },
  footer: {
    flexDirection: "row",
    gap: 12
  },
  button: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    padding: 16
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderWidth: 1,
    flex: 1
  },
  cancelText: {
    color: colors.mutedText,
    fontSize: 15,
    fontWeight: "900"
  },
  confirmButton: {
    backgroundColor: colors.deepGreen,
    flex: 2,
    ...shadow
  },
  confirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900"
  }
});
