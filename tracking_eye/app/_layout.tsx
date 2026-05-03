import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { PortfolioProvider } from "@/context/PortfolioContext";

export default function RootLayout() {
  return (
    <PortfolioProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="asset/[id]" options={{ headerShown: true, title: "Varlik Detayi" }} />
      </Stack>
    </PortfolioProvider>
  );
}
