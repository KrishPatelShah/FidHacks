import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "@/theme/colors";
import { SunflowerCompanion } from "@/components/SunflowerCompanion";

export function FloatingSunflower({ message = "Want a quick task?" }: { message?: string }) {
  return (
    <Link href="/sunflower" asChild>
      <Pressable style={styles.link}>
        <View style={styles.wrap}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{message}</Text>
        </View>
        <View style={styles.sunflower}>
          <SunflowerCompanion size={72} />
        </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    alignSelf: "flex-end"
  },
  wrap: {
    alignItems: "flex-end",
    marginTop: 4
  },
  bubble: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 46,
    paddingHorizontal: 14,
    paddingVertical: 9,
    ...shadow
  },
  bubbleText: {
    color: colors.darkText,
    fontSize: 13,
    fontWeight: "800"
  },
  sunflower: {
    marginRight: -10,
    marginTop: -8
  }
});
