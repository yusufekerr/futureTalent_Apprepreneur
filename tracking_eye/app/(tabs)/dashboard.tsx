import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AllocationBars } from "@/components/ui/AllocationBars";
import { AssetRow } from "@/components/ui/AssetRow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, spacing, typography } from "@/design/tokens";
import { formatCurrency, formatPercent } from "@/utils/portfolio";

export default function DashboardScreen() {
  const { assets, distribution, metrics, signOut } = usePortfolio();

  return (
    <Screen>
      <SectionHeader title="TrackingEye Dashboard" subtitle="Portfoyunun genel ozeti" />

      <View style={styles.grid}>
        <MetricCard title="Toplam Deger" value={formatCurrency(metrics.totalValue)} />
        <MetricCard
          title="Toplam Kar/Zarar"
          value={formatCurrency(metrics.totalPnL)}
          helper={formatPercent(metrics.pnlPercent)}
          positive={metrics.totalPnL >= 0}
        />
      </View>

      <Card>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Varlik Dagilimi</Text>
        </View>
        <AllocationBars items={distribution} />
      </Card>

      <View style={styles.listWrap}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Son Eklenenler</Text>
          <Text style={styles.count}>{assets.length} varlik</Text>
        </View>
        {assets.slice(0, 3).map((asset) => (
          <AssetRow key={asset.id} asset={asset} onPress={() => router.push(`/asset/${asset.id}`)} />
        ))}
      </View>

      <Button
        variant="secondary"
        label="Cikis (mock)"
        onPress={() => {
          signOut();
          router.replace("/(auth)/login");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm
  },
  sectionTitle: {
    fontSize: typography.h3,
    color: colors.textPrimary,
    fontWeight: "700"
  },
  count: {
    color: colors.textSecondary
  },
  listWrap: {
    gap: spacing.md
  }
});
