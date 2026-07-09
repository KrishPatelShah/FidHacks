import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
    color: "#1f6f8b",
    fontWeight: "900",
    textDecorationLine: "underline"
  },
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(35, 67, 48, 0.35)",
    flex: 1,
    justifyContent: "center",
    padding: 28
  },
  tooltip: {
    backgroundColor: "#fffaf0",
    borderRadius: 22,
    gap: 8,
    padding: 20
  },
  label: {
    color: "#234330",
    fontSize: 20,
    fontWeight: "900"
  },
  definition: {
    color: "#65735f",
    fontSize: 16,
    lineHeight: 23
  }
});
