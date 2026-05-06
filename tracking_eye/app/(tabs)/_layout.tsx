import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { colors, typography } from "@/design/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 0,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingTop: 12
        },
        tabBarLabelStyle: {
          fontSize: typography.caption,
          fontWeight: "600",
          marginTop: 4
        }
      }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: "Özet",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="portfolio" 
        options={{ 
          title: "Portföy",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          )
        }} 
      />
      <Tabs.Screen 
        name="add-asset" 
        options={{ 
          title: "Ekle",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size + 4} color={color} />
          )
        }} 
      />
    </Tabs>
  );
}
