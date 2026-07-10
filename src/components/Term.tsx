import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/components/AppText";
import { colors, shadow } from "@/theme/colors";

export function Term({ label, definition }: { label: string; definition: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Text onPress={() => setVisible(true)} style={styles.term}>
        {label}
      </Text>
      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <View style={styles.tooltip}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.definition}>{definition}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  term: {
    color: colors.deepGreen,
    fontWeight: "900",
    textDecorationLine: "underline"
  },
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(15, 110, 86, 0.28)",
    flex: 1,
    justifyContent: "center",
    padding: 28
  },
  tooltip: {
    backgroundColor: colors.card,
    borderRadius: 24,
    gap: 8,
    padding: 20,
    ...shadow
  },
  label: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "900"
  },
  definition: {
    color: colors.mutedText,
    fontSize: 16,
    lineHeight: 23
  }
});
