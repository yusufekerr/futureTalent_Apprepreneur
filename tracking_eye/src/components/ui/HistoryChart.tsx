import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { colors, radius, spacing, typography } from "@/design/tokens";
import type { PortfolioSnapshot } from "@/types/portfolio";
import { formatCurrency } from "@/utils/portfolio";

type HistoryChartProps = {
  snapshots: PortfolioSnapshot[];
};

export function HistoryChart({ snapshots }: HistoryChartProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (snapshots.length < 2) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Tarihsel Değişim Grafiği</Text>
        <Text style={styles.emptyText}>
          Portföyünüzün zaman içindeki gelişimini görmek için yeni varlıklar ekleyin veya fiyat senkronizasyonunu çalıştırın.
        </Text>
      </View>
    );
  }

  // Calculate min, max to scale the bars
  const values = snapshots.map((s) => s.totalValue);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const valueRange = maxValue - minValue || 1;

  // Active snapshot displayed (hover/tap state)
  const activeIndex = selectedIndex !== null ? selectedIndex : snapshots.length - 1;
  const activeSnapshot = snapshots[activeIndex];

  // Calculate percentage change between first and last snapshots
  const firstVal = snapshots[0].totalValue;
  const lastVal = snapshots[snapshots.length - 1].totalValue;
  const overallChangePercent = firstVal === 0 ? 0 : ((lastVal - firstVal) / firstVal) * 100;
  const isPositive = overallChangePercent >= 0;

  // Helper to format dates
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tarihsel Değişim</Text>
          <Text style={styles.dateLabel}>{formatDate(activeSnapshot.recordedAt)}</Text>
        </View>
        <View style={styles.metrics}>
          <Text style={styles.valueText}>{formatCurrency(activeSnapshot.totalValue)}</Text>
          <Text style={[styles.changeText, { color: isPositive ? colors.success : colors.danger }]}>
            {overallChangePercent >= 0 ? "▲" : "▼"} {overallChangePercent.toFixed(2)}% (Genel)
          </Text>
        </View>
      </View>

      {/* Visual Chart Area */}
      <View style={styles.chartArea}>
        <View style={styles.barsContainer}>
          {snapshots.map((snapshot, idx) => {
            // Scale bar height based on relative position between min and max
            const heightPercent = ((snapshot.totalValue - minValue) / valueRange) * 70 + 20; // range 20% to 90%
            const isActive = idx === activeIndex;

            return (
              <TouchableOpacity
                key={snapshot.id}
                style={styles.barColumn}
                activeOpacity={0.8}
                onPressIn={() => setSelectedIndex(idx)}
              >
                <View style={styles.barWrapper}>
                  {isActive && <View style={styles.indicatorDot} />}
                  <View style={[styles.barContainer, { height: `${heightPercent}%` }]}>
                    <LinearGradient
                      colors={isActive ? [colors.primary, colors.secondary] : [colors.surfaceHighlight, colors.border]}
                      style={styles.gradientBar}
                    />
                  </View>
                </View>
                <Text style={[styles.barLabel, isActive && styles.activeBarLabel]}>
                  #{idx + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Interactive Tooltip helper */}
      <Text style={styles.helperText}>
        * Portföy değerlerini görmek için sütunlara dokunun.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  emptyTitle: {
    fontSize: typography.h3,
    color: colors.textPrimary,
    fontWeight: "800",
    textAlign: "center"
  },
  emptyText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  title: {
    fontSize: typography.h3,
    color: colors.textPrimary,
    fontWeight: "800"
  },
  dateLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: 2
  },
  metrics: {
    alignItems: "flex-end"
  },
  valueText: {
    fontSize: typography.h2,
    color: colors.textPrimary,
    fontWeight: "900"
  },
  changeText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2
  },
  chartArea: {
    height: 150,
    justifyContent: "flex-end",
    paddingTop: spacing.md
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "100%"
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end"
  },
  barWrapper: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  barContainer: {
    width: 14,
    borderRadius: radius.full,
    overflow: "hidden"
  },
  gradientBar: {
    flex: 1
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginBottom: 4
  },
  barLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    marginTop: spacing.xs
  },
  activeBarLabel: {
    color: colors.primary,
    fontWeight: "800"
  },
  helperText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center"
  }
});
