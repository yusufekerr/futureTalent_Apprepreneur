import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/design/tokens";
import { formatCurrency, getTypeColor } from "@/utils/portfolio";

type AllocationItem = {
  id: string;
  label: string;
  type: string;
  value: number;
  ratio: number;
};

function AnimatedBar({ ratio, color }: { ratio: number; color: string }) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: Math.max(2, ratio), // Minimum %2 width to show color
      duration: 800,
      useNativeDriver: false // Width animation doesn't support native driver
    }).start();
  }, [ratio, animatedWidth]);

  return (
    <Animated.View
      style={[
        styles.fill,
        {
          backgroundColor: color,
          width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"]
          })
        }
      ]}
    />
  );
}

export function AllocationBars({ items }: { items: AllocationItem[] }) {
  if (!items.length) {
    return <Text style={styles.empty}>Dagilim gormek icin once varlik ekle.</Text>;
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.top}>
            <View style={styles.labelWrap}>
              <View style={[styles.dot, { backgroundColor: getTypeColor(item.type) }]} />
              <Text style={styles.label}>
                {item.label} · <Text style={{ textTransform: "capitalize" }}>{item.type}</Text>
              </Text>
            </View>
            <Text style={styles.value}>
              {item.ratio.toFixed(1)}% · {formatCurrency(item.value)}
            </Text>
          </View>
          <View style={styles.track}>
            <AnimatedBar ratio={item.ratio} color={getTypeColor(item.type)} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg
  },
  item: {
    gap: spacing.sm
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  labelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  label: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  value: {
    fontSize: typography.caption,
    color: colors.textPrimary,
    fontWeight: "700"
  },
  track: {
    height: 8,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: radius.full,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: radius.full
  },
  empty: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: "center",
    paddingVertical: spacing.lg
  }
});
