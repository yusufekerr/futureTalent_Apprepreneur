import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { colors, spacing, typography } from "@/design/tokens";
import type { Asset } from "@/types/portfolio";
import { formatCurrency, getAssetPnL, getAssetValue } from "@/utils/portfolio";

export function AssetRow({
  asset,
  onPress
}: {
  asset: Asset;
  onPress?: () => void;
}) {
  const pnl = getAssetPnL(asset);
  const isPositive = pnl >= 0;

  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={styles.row}>
          <View style={styles.left}>
            <Text style={styles.name}>{asset.name}</Text>
            <Text style={styles.meta}>
              {asset.type} · {asset.quantity} adet
            </Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.value}>{formatCurrency(getAssetValue(asset))}</Text>
            <Text style={[styles.pnl, { color: isPositive ? colors.success : colors.danger }]}>
              {isPositive ? "+" : ""}
              {formatCurrency(pnl)}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md
  },
  left: {
    flex: 1,
    gap: spacing.xs
  },
  right: {
    alignItems: "flex-end",
    gap: spacing.xs
  },
  name: {
    fontSize: typography.h3,
    fontWeight: "700",
    color: colors.textPrimary
  },
  meta: {
    fontSize: typography.caption,
    color: colors.textSecondary
  },
  value: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: "700"
  },
  pnl: {
    fontSize: typography.caption,
    fontWeight: "600"
  }
});
