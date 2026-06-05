import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { colors, radius, spacing, typography } from "@/design/tokens";
import type { Asset } from "@/types/portfolio";
import { formatCurrency, getAssetPnL, getAssetValue, getTypeColor } from "@/utils/portfolio";

export function AssetRow({
  asset,
  onPress
}: {
  asset: Asset;
  onPress?: () => void;
}) {
  const pnl = getAssetPnL(asset);
  const isPositive = pnl >= 0;
  
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 20
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable 
        onPress={onPress} 
        onPressIn={handlePressIn} 
        onPressOut={handlePressOut}
      >
        <Card style={styles.cardOverride}>
          <View style={styles.row}>
            <View style={styles.left}>
              <View style={[styles.iconDot, { backgroundColor: getTypeColor(asset.type) }]} />
              <View style={styles.textWrap}>
                <Text style={styles.name}>{asset.name}</Text>
                <Text style={styles.meta}>
                  {asset.type} • {asset.quantity} adet
                </Text>
              </View>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{formatCurrency(getAssetValue(asset))}</Text>
              <View style={[styles.pnlBadge, { backgroundColor: isPositive ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)" }]}>
                <Text style={[styles.pnl, { color: isPositive ? colors.success : colors.danger }]}>
                  {isPositive ? "+" : ""}
                  {formatCurrency(pnl)}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOverride: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceHighlight, // Biraz daha belirgin zemin
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  iconDot: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
  },
  textWrap: {
    gap: 2
  },
  right: {
    alignItems: "flex-end",
    gap: 4
  },
  name: {
    fontSize: typography.h3,
    fontWeight: "700",
    color: colors.textPrimary
  },
  meta: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    textTransform: "capitalize"
  },
  value: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: "700"
  },
  pnlBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  pnl: {
    fontSize: typography.caption,
    fontWeight: "700"
  }
});
