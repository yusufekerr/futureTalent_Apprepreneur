import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";

import { AllocationBars } from "@/components/ui/AllocationBars";
import { AssetRow } from "@/components/ui/AssetRow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, radius, shadows, spacing, typography } from "@/design/tokens";
import { formatCurrency, formatPercent } from "@/utils/portfolio";

export default function DashboardScreen() {
  const { assets, distribution, metrics, signOut } = usePortfolio();

  const isPositive = metrics.totalPnL >= 0;

  return (
    <Screen>
      {/* HEADER SECTION */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: "https://i.pravatar.cc/150?u=yusuf" }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.greeting}>Günaydın,</Text>
            <Text style={styles.name}>Yusuf Eker</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* MAIN BALANCE SECTION */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Toplam Varlık</Text>
        <Text style={styles.balanceValue}>{formatCurrency(metrics.totalValue)}</Text>
        
        <View style={[styles.pnlBadge, { backgroundColor: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)" }]}>
          <MaterialCommunityIcons 
            name={isPositive ? "trending-up" : "trending-down"} 
            size={16} 
            color={isPositive ? colors.success : colors.danger} 
          />
          <Text style={[styles.pnlText, { color: isPositive ? colors.success : colors.danger }]}>
            {formatCurrency(metrics.totalPnL)} ({formatPercent(metrics.pnlPercent)}) Bugün
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.actionsRow}>
        <ActionButton icon="arrow-down" label="Yatır" color={colors.primary} />
        <ActionButton icon="arrow-up" label="Çek" color={colors.primary} />
        <ActionButton icon="swap-horizontal" label="Takas" color={colors.secondary} />
        <ActionButton icon="dots-horizontal" label="Daha Fazla" color={colors.textSecondary} />
      </View>

      {/* ALLOCATION */}
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Portföy Dağılımı</Text>
        </View>
        <AllocationBars items={distribution} />
      </Card>

      {/* RECENT ASSETS */}
      <View style={styles.listWrap}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Piyasa Hareketleri</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/portfolio")}>
            <Text style={styles.seeAll}>Tümü</Text>
          </TouchableOpacity>
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

      <View style={{ marginTop: spacing.xl, marginBottom: 40 }}>
        <Button
          variant="secondary"
          label="Hesaptan Çıkış Yap"
          onPress={() => {
            signOut();
            router.replace("/(auth)/login");
          }}
        />
      </View>
    </Screen>
  );
}

function ActionButton({ icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <TouchableOpacity style={styles.actionItem}>
      <View style={[styles.actionIconWrap, { backgroundColor: color === colors.primary ? colors.textPrimary : colors.surface }]}>
        <MaterialCommunityIcons name={icon} size={24} color={color === colors.primary ? "#FFFFFF" : color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceHighlight,
  },
  greeting: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  name: {
    fontSize: typography.h3,
    color: colors.textPrimary,
    fontWeight: "800",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  balanceContainer: {
    alignItems: "center",
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  balanceLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  pnlBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  pnlText: {
    fontSize: typography.caption,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  actionItem: {
    alignItems: "center",
    gap: spacing.xs,
  },
  actionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  sectionCard: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    borderWidth: 0,
    ...shadows.sm,
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3,
    color: colors.textPrimary,
    fontWeight: "800",
  },
  seeAll: {
    fontSize: typography.body,
    color: colors.secondary,
    fontWeight: "700",
  },
  listWrap: {
    gap: spacing.xs,
  },
  listContainer: {
    gap: spacing.sm,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: "center",
    paddingVertical: spacing.lg,
  }
});
