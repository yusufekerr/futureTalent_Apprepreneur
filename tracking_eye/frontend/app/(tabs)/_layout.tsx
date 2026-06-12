import { Tabs } from "expo-router";
import { Platform, View, StyleSheet } from "react-native";
import { Home, Briefcase, Plus, Brain, Bell } from "lucide-react-native";

import { colors, shadows } from "@/design/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? 0 : 8
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        }
      }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: "Özet",
          tabBarIcon: ({ color, focused }) => (
            <Home size={22} color={color} fill={focused ? color : "transparent"} strokeWidth={focused ? 2.5 : 2} />
          )
        }} 
      />
      <Tabs.Screen 
        name="portfolio" 
        options={{ 
          title: "Portföy",
          tabBarIcon: ({ color, focused }) => (
            <Briefcase size={22} color={color} fill={focused ? color : "transparent"} strokeWidth={focused ? 2.5 : 2} />
          )
        }} 
      />
      <Tabs.Screen 
        name="add-asset" 
        options={{ 
          title: "Ekle",
          tabBarIcon: () => (
            <View style={styles.addWrap}>
              <Plus size={28} color="#FFFFFF" strokeWidth={3} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="ai-advisor" 
        options={{ 
          title: "AI Danışman",
          tabBarIcon: ({ color, focused }) => (
            <Brain size={22} color={color} fill={focused ? color : "transparent"} strokeWidth={focused ? 2.5 : 2} />
          )
        }} 
      />
      <Tabs.Screen 
        name="alerts" 
        options={{ 
          title: "Alarmlar",
          tabBarIcon: ({ color, focused }) => (
            <Bell size={22} color={color} fill={focused ? color : "transparent"} strokeWidth={focused ? 2.5 : 2} />
          )
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 20 : 30, // Pops out of the bar
    borderWidth: 4,
    borderColor: colors.bg, // Matches background to look like a cutout
    ...shadows.glow
  }
});
