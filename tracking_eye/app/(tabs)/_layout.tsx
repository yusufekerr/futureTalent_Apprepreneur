import { Tabs } from "expo-router";

import { colors } from "@/design/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="portfolio" options={{ title: "Portfoy" }} />
      <Tabs.Screen name="add-asset" options={{ title: "Varlik Ekle" }} />
    </Tabs>
  );
}
