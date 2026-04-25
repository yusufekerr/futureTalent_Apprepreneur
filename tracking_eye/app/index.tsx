import { StyleSheet, Text, View } from "react-native";

import { env } from "../src/config/env";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TrackingEye MVP</Text>
      <Text style={styles.subtitle}>1. Asama iskeleti hazir</Text>
      <Text style={styles.detail}>Supabase URL: {env.supabaseUrl}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc"
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a"
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#334155"
  },
  detail: {
    marginTop: 16,
    fontSize: 14,
    color: "#475569",
    textAlign: "center"
  }
});
