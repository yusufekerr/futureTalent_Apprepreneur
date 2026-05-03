import { Redirect } from "expo-router";

import { usePortfolio } from "@/context/PortfolioContext";

export default function HomeScreen() {
  const { isAuthenticated } = usePortfolio();
  return <Redirect href={isAuthenticated ? "/(tabs)/dashboard" : "/(auth)/login"} />;
}
