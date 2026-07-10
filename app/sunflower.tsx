import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SunflowerCompanion } from "@/components/SunflowerCompanion";
import { askSunflower } from "@/services/ai";
import { askSunflowerRemote } from "@/services/api";
import { colors, shadow } from "@/theme/colors";

type Message = {
  id: string;
  role: "user" | "sunflower";
  text: string;
};

const chips = ["What is APR?", "Roth IRA?", "Stocks vs. bonds", "Why did I overspend?", "What should I learn next?", "401(k) match"];

let messageId = 0;
function nextId() {
  messageId += 1;
  return `m${messageId}`;
}

export default function SunflowerScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId(),
      role: "sunflower",
      text: "Hi, I'm your Sunflower tutor. Ask me anything about money basics — budgeting, credit, saving, retirement, or investing. I explain simply and never give personalized advice."
    }
  ]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: Message = { id: nextId(), role: "user", text: trimmed };
    const replyId = nextId();
    const pending: Message = { id: replyId, role: "sunflower", text: "…" };
    setMessages((current) => [...current, userMessage, pending]);
    setDraft("");
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

    // Ask the FastAPI backend first, fall back to the on-device answerer.
    const remote = await askSunflowerRemote(trimmed);
    const answer = remote ?? askSunflower(trimmed);
    setMessages((current) => current.map((message) => (message.id === replyId ? { ...message, text: answer } : message)));
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SunflowerCompanion size={44} />
          <View>
            <Text style={styles.title}>Sunflower</Text>
            <Text style={styles.subtitle}>Financial literacy tutor</Text>
          </View>
        </View>
        <Pressable onPress={() => router.back()} style={styles.close} accessibilityLabel="Close chat">
          <Ionicons color={colors.darkText} name="close" size={22} />
        </Pressable>
      </View>

      <ScrollView ref={scrollRef} style={styles.threadScroll} contentContainerStyle={styles.thread} keyboardShouldPersistTaps="handled">
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.bubble, message.role === "user" ? styles.userBubble : styles.botBubble]}
          >
            <Text style={message.role === "user" ? styles.userText : styles.botText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chips}>
        {chips.map((chip) => (
          <TouchableOpacity key={chip} onPress={() => send(chip)} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Ask about money basics…"
          placeholderTextColor={colors.mutedText}
          style={styles.input}
          onSubmitEditing={() => send(draft)}
          returnKeyType="send"
        />
        <Pressable onPress={() => send(draft)} style={styles.sendButton} accessibilityLabel="Send message">
          <Ionicons color={colors.white} name="arrow-up" size={22} />
        </Pressable>
      </View>

      <Text style={styles.disclaimer}>Educational guidance only — not personalized financial, tax, legal, or investment advice.</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.cream,
    flex: 1
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    paddingHorizontal: 18
  },
  headerLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  title: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700"
  },
  close: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  threadScroll: {
    flex: 1
  },
  thread: {
    gap: 12,
    padding: 18
  },
  bubble: {
    borderRadius: 22,
    maxWidth: "86%",
    padding: 14
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.card,
    borderBottomLeftRadius: 6,
    ...shadow
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.deepGreen,
    borderBottomRightRadius: 6
  },
  botText: {
    color: colors.darkText,
    fontSize: 15,
    lineHeight: 22
  },
  userText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22
  },
  chipsScroll: {
    flexGrow: 0
  },
  chips: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 4
  },
  chip: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  chipText: {
    color: colors.deepGreen,
    fontSize: 13,
    fontWeight: "900"
  },
  inputRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 24,
    borderWidth: 1,
    color: colors.darkText,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 18,
    paddingVertical: 13
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.deepGreen,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  disclaimer: {
    color: colors.mutedText,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    paddingBottom: 14,
    paddingHorizontal: 20,
    paddingTop: 8,
    textAlign: "center"
  }
});
