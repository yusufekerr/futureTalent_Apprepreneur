import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { colors, spacing, typography } from "@/design/tokens";

export function MetricCard({
  title,
  value,
  helper,
  positive
}: {
  title: string;
  value: string;
  helper?: string;
  positive?: boolean;
}) {
  return (
    <Card>
      <View style={styles.wrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        {helper ? (
          <Text
            style={[
              styles.helper,
              typeof positive === "boolean" ? { color: positive ? colors.success : colors.danger } : null
            ]}
          >
            {helper}
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs
  },
  title: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  value: {
    fontSize: typography.h2,
    color: colors.textPrimary,
    fontWeight: "700"
  },
  helper: {
    fontSize: typography.body,
    color: colors.textSecondary
  }
});
