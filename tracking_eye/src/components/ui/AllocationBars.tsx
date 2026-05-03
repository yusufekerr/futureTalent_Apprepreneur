import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/design/tokens";
import { formatCurrency } from "@/utils/portfolio";

type AllocationItem = {
  id: string;
  label: string;
  type: string;
  value: number;
  ratio: number;
};

export function AllocationBars({ items }: { items: AllocationItem[] }) {
  if (!items.length) {
    return <Text style={styles.empty}>Dagilim gormek icin once varlik ekle.</Text>;
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.top}>
            <Text style={styles.label}>
              {item.label} · {item.type}
            </Text>
            <Text style={styles.value}>
              {item.ratio.toFixed(1)}% · {formatCurrency(item.value)}
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(3, item.ratio)}%` }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md
  },
  item: {
    gap: spacing.xs
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  label: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  value: {
    fontSize: typography.caption,
    color: colors.textPrimary
  },
  track: {
    height: 10,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    backgroundColor: colors.primary
  },
  empty: {
    color: colors.textSecondary,
    fontSize: typography.body
  }
});
