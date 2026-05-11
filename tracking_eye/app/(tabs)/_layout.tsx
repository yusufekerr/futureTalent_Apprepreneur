import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View, StyleSheet } from "react-native";

import { colors, typography, shadows, radius } from "@/design/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarShowLabel: false, // Cleaner look without text, just icons
        tabBarStyle: {
          position: "absolute", // Floating effect
          bottom: Platform.OS === "ios" ? 32 : 24,
          left: 24,
          right: 24,
          backgroundColor: colors.glassBg,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          elevation: 10,
          height: 64,
          borderRadius: radius.full,
          ...shadows.md
        }
      }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: "Özet",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconFocused]}>
              <Feather name="pie-chart" size={size} color={color} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="add-asset" 
        options={{ 
          title: "Ekle",
          tabBarIcon: ({ color, size }) => (
            <View style={styles.addWrap}>
              <Feather name="plus" size={size + 6} color="#FFFFFF" />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="portfolio" 
        options={{ 
          title: "Portföy",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconFocused]}>
              <Feather name="briefcase" size={size} color={color} />
            </View>
          )
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    padding: 8,
    borderRadius: radius.full,
  },
  iconFocused: {
    backgroundColor: colors.primarySoft,
  },
  addWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24, // Pop out slightly
    ...shadows.glow
  }
});
