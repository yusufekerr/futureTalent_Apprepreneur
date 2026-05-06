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
      <View style={styles.headerWrap}>
        <SectionHeader title="TrackingEye" subtitle="Portföyünüzün genel özeti" />
      </View>

      <View style={styles.grid}>
        <MetricCard 
          title="Toplam Değer" 
          value={formatCurrency(metrics.totalValue)} 
          gradient={true}
        />
        <MetricCard
          title="Toplam Kâr/Zarar"
          value={formatCurrency(metrics.totalPnL)}
          helper={formatPercent(metrics.pnlPercent)}
          positive={metrics.totalPnL >= 0}
        />
      </View>

      <Card>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Varlık Dağılımı</Text>
        </View>
        <AllocationBars items={distribution} />
      </Card>

      <View style={styles.listWrap}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Son Eklenenler</Text>
          <Text style={styles.count}>{assets.length} varlık</Text>
        </View>
        <View style={styles.listContainer}>
          {assets.length === 0 ? (
            <Text style={styles.emptyText}>Henüz varlık eklenmedi.</Text>
          ) : (
            assets.slice(0, 3).map((asset) => (
              <AssetRow key={asset.id} asset={asset} onPress={() => router.push(`/asset/${asset.id}`)} />
            ))
          )}
        </View>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Button
          variant="secondary"
          label="Çıkış Yap (Mock)"
          onPress={() => {
            signOut();
            router.replace("/(auth)/login");
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: spacing.xs
  },
  grid: {
    gap: spacing.md
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md
  },
  sectionTitle: {
    fontSize: typography.h3,
    color: colors.textPrimary,
    fontWeight: "700"
  },
  count: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: "600"
  },
  listWrap: {
    gap: spacing.xs
  },
  listContainer: {
    gap: spacing.sm
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: "center",
    paddingVertical: spacing.lg
  }
});
