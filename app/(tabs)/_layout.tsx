import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { FloatingSunflower } from "@/components/FloatingSunflower";
import { colors } from "@/theme/colors";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.deepGreen,
          tabBarInactiveTintColor: "#8DA199",
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: "#E9D8B9",
            height: 86,
            paddingBottom: 22,
            paddingTop: 10
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "800"
          }
        }}
      >
        <Tabs.Screen name="garden" options={{ title: "Garden", tabBarIcon: ({ color }) => <Ionicons color={color} name="flower" size={22} /> }} />
        <Tabs.Screen name="learn" options={{ title: "Learn", tabBarIcon: ({ color }) => <Ionicons color={color} name="book" size={22} /> }} />
        <Tabs.Screen name="budget" options={{ title: "Budget", tabBarIcon: ({ color }) => <Ionicons color={color} name="pie-chart" size={22} /> }} />
        <Tabs.Screen name="stocks" options={{ title: "Stocks", tabBarIcon: ({ color }) => <Ionicons color={color} name="trending-up" size={22} /> }} />
        <Tabs.Screen name="community" options={{ title: "Community", tabBarIcon: ({ color }) => <Ionicons color={color} name="people" size={22} /> }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
      </Tabs>
      <FloatingSunflower />
    </View>
  );
}
