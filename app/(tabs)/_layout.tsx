import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#234330",
        tabBarInactiveTintColor: "#8b927d",
        tabBarStyle: {
          backgroundColor: "#fffaf0",
          borderTopColor: "#eadcb9"
        }
      }}
    >
      <Tabs.Screen name="garden" options={{ title: "Garden", tabBarIcon: ({ color }) => <Ionicons color={color} name="flower" size={22} /> }} />
      <Tabs.Screen name="learn" options={{ title: "Learn", tabBarIcon: ({ color }) => <Ionicons color={color} name="book" size={22} /> }} />
      <Tabs.Screen name="budget" options={{ title: "Budget", tabBarIcon: ({ color }) => <Ionicons color={color} name="pie-chart" size={22} /> }} />
      <Tabs.Screen name="community" options={{ title: "Community", tabBarIcon: ({ color }) => <Ionicons color={color} name="people" size={22} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <Ionicons color={color} name="person" size={22} /> }} />
    </Tabs>
  );
}
