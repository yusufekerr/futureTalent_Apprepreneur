import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@/design/tokens";

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs
  },
  title: {
    fontSize: typography.h2,
    fontWeight: "700",
    color: colors.textPrimary
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary
  }
});
