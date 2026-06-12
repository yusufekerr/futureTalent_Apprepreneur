import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View, Image, TouchableOpacity, Modal, ScrollView } from "react-native";
import { 
  RefreshCw, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  ArrowRight,
  Plus,
  PieChart,
  History,
  BellRing,
  BellOff,
  Trash2,
  X
} from 'lucide-react-native';

import { AllocationBars } from "@/components/ui/AllocationBars";
import { AssetRow } from "@/components/ui/AssetRow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HistoryChart } from "@/components/ui/HistoryChart";
import { Screen } from "@/components/ui/Screen";
import { useAuth } from "@/context/AuthContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { useAlerts } from "@/context/AlertsContext";
import { colors, radius, shadows, spacing, typography } from "@/design/tokens";
import { getQuickDashboardInsight } from "@/services/ai";
import { formatCurrency, formatPercent } from "@/utils/portfolio";

export default function DashboardScreen() {
  const { assets, distribution, metrics, snapshots, transactions, clearTransactions, isLoading, error, syncMarketPrices } = usePortfolio();
  const { signOut, user } = useAuth();
  const { alerts, removeAlert } = useAlerts();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeHistoryTab, setActiveHistoryTab] = useState<"transactions" | "snapshots">("transactions");

  const isPositive = metrics.totalPnL >= 0;

  const displayEmail = user?.email ?? "Kullanıcı";

  const handleSyncPrices = async () => {
    setIsSyncing(true);
    const result = await syncMarketPrices();
    setIsSyncing(false);
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <Screen>
      {/* HEADER SECTION */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: `https://i.pravatar.cc/150?u=${displayEmail}` }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.greeting}>Günaydın,</Text>
            <Text style={styles.name} numberOfLines={1}>{displayEmail}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: spacing.xs }}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleSyncPrices}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <RefreshCw size={20} color={colors.textPrimary} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowNotifications(true)}>
            <Bell size={20} color={colors.textPrimary} />
            {alerts.some(a => a.isTriggered) && <View style={styles.notificationDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN BALANCE SECTION */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Toplam Varlık</Text>
        <Text style={styles.balanceValue}>{formatCurrency(metrics.totalValue)}</Text>
        
        <View style={[styles.pnlBadge, { backgroundColor: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)" }]}>
          {isPositive ? (
            <TrendingUp size={16} color={colors.success} />
          ) : (
            <TrendingDown size={16} color={colors.danger} />
          )}
          <Text style={[styles.pnlText, { color: isPositive ? colors.success : colors.danger }]}>
            {formatCurrency(metrics.totalPnL)} ({formatPercent(metrics.pnlPercent)}) Bugün
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.actionsRow}>
        <ActionButton 
          icon="plus" 
          label="Yeni Varlık" 
          color={colors.primary} 
          onPress={() => router.push("/(tabs)/add-asset")}
        />
        <ActionButton 
          icon="chart-pie" 
          label="Analiz" 
          color={colors.secondary} 
          onPress={() => router.push("/(tabs)/ai-advisor")}
        />
        <ActionButton 
          icon="history" 
          label="Geçmiş" 
          color={colors.textSecondary} 
          onPress={() => setShowHistory(true)}
        />
      </View>

      {/* HISTORICAL TREND CHART */}
      <View style={{ marginBottom: spacing.xl }}>
        <HistoryChart snapshots={snapshots} />
      </View>

      {/* AI PORTFOLIO INSIGHT WIDGET */}
      <TouchableOpacity 
        style={styles.aiCard} 
        activeOpacity={0.9} 
        onPress={() => router.push("/(tabs)/ai-advisor")}
      >
        <View style={styles.aiCardHeader}>
          <Brain size={22} color={colors.secondary} />
          <Text style={styles.aiCardTitle}>AI Portföy Analizi</Text>
        </View>
        <Text style={styles.aiCardText}>
          {getQuickDashboardInsight(assets, distribution, metrics)}
        </Text>
        <View style={styles.aiCardFooter}>
          <Text style={styles.aiCardLink}>Detaylı AI Danışmana Sor</Text>
          <ArrowRight size={14} color={colors.secondary} />
        </View>
      </TouchableOpacity>

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
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ paddingVertical: spacing.lg }} />
          ) : error ? (
            <Text style={styles.emptyText}>{error}</Text>
          ) : assets.length === 0 ? (
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
          variant="danger"
          label="Hesaptan Çıkış Yap"
          onPress={async () => {
            await signOut();
            router.replace("/(auth)/login");
          }}
        />
      </View>

      {/* Notifications History Modal */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalBackdrop}>
          <Card style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Bell size={20} color={colors.primary} />
                <Text style={styles.modalTitle}>Bildirim Geçmişi</Text>
              </View>
              <TouchableOpacity onPress={() => setShowNotifications(false)} style={styles.closeModalButton}>
                <X size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {alerts.filter(a => a.isTriggered).length === 0 ? (
                <View style={styles.emptyNotifications}>
                  <BellOff size={32} color={colors.textMuted} />
                  <Text style={styles.emptyNotificationsText}>Henüz tetiklenen bir fiyat alarmınız bulunmuyor.</Text>
                </View>
              ) : (
                <>
                  <View style={styles.notificationActions}>
                    <Text style={styles.notificationSubtitle}>Son tetiklenen fiyat hareketleri:</Text>
                    <TouchableOpacity 
                      onPress={async () => {
                        const triggered = alerts.filter(a => a.isTriggered);
                        for (const item of triggered) {
                          await removeAlert(item.id);
                        }
                      }}
                      style={styles.clearAllButton}
                    >
                      <Text style={styles.clearAllText}>Tümünü Temizle</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.notificationScroll} showsVerticalScrollIndicator={false}>
                    {alerts.filter(a => a.isTriggered).map((alert) => (
                      <View key={alert.id} style={styles.notificationItem}>
                        <View style={styles.notificationInfo}>
                          <Text style={styles.notificationAsset}>{alert.assetName}</Text>
                          <Text style={styles.notificationDetails}>
                            Fiyat {alert.condition === "above" ? "hedefin üzerine çıktı" : "hedefin altına indi"} ·{" "}
                            <Text style={{ fontWeight: "800", color: colors.textPrimary }}>
                              {formatCurrency(alert.targetPrice)}
                            </Text>
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeAlert(alert.id)}
                          style={styles.deleteNotificationButton}
                        >
                          <Trash2 size={16} color={colors.danger} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </>
              )}
            </View>
          </Card>
        </View>
      </Modal>

      {/* History Modal */}
      <Modal
        visible={showHistory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalBackdrop}>
          <Card style={styles.historyModalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <History size={20} color={colors.primary} />
                <Text style={styles.modalTitle}>Geçmiş Kayıtları</Text>
              </View>
              <TouchableOpacity onPress={() => setShowHistory(false)} style={styles.closeModalButton}>
                <X size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Tab Selector */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, activeHistoryTab === "transactions" && styles.activeTabButton]}
                onPress={() => setActiveHistoryTab("transactions")}
              >
                <Text style={[styles.tabButtonText, activeHistoryTab === "transactions" && styles.activeTabButtonText]}>
                  İşlem Logları
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, activeHistoryTab === "snapshots" && styles.activeTabButton]}
                onPress={() => setActiveHistoryTab("snapshots")}
              >
                <Text style={[styles.tabButtonText, activeHistoryTab === "snapshots" && styles.activeTabButtonText]}>
                  Portföy Değişimi
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {activeHistoryTab === "transactions" ? (
                // Transactions tab
                transactions.length === 0 ? (
                  <View style={styles.emptyNotifications}>
                    <History size={32} color={colors.textMuted} />
                    <Text style={styles.emptyNotificationsText}>Henüz kayıtlı bir işlem bulunmuyor.</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.notificationActions}>
                      <Text style={styles.notificationSubtitle}>Son yapılan işlemler:</Text>
                      <TouchableOpacity 
                        onPress={async () => {
                          await clearTransactions();
                        }}
                        style={styles.clearAllButton}
                      >
                        <Text style={styles.clearAllText}>Temizle</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.notificationScroll} showsVerticalScrollIndicator={false}>
                      {transactions.map((tx) => {
                        let icon = <Plus size={16} color={colors.success} />;
                        let title = "Varlık Eklendi";
                        let details = `${tx.assetName} · ${tx.quantity} adet @ ${formatCurrency(tx.price ?? 0)}`;

                        if (tx.type === "REMOVE") {
                          icon = <Trash2 size={16} color={colors.danger} />;
                          title = "Varlık Silindi";
                          details = `${tx.assetName} portföyden çıkarıldı.`;
                        } else if (tx.type === "UPDATE") {
                          icon = <RefreshCw size={16} color={colors.secondary} />;
                          title = "Fiyat Güncellendi";
                          details = `${tx.assetName} fiyatı güncellendi: ${formatCurrency(tx.price ?? 0)}`;
                        } else if (tx.type === "SYNC") {
                          icon = <RefreshCw size={16} color={colors.primary} />;
                          title = "Senkronizasyon";
                          details = "Piyasa fiyatları güncellendi.";
                        } else if (tx.type === "SELL") {
                          icon = <TrendingDown size={16} color={colors.warning} />;
                          title = "Varlık Satıldı";
                          details = `${tx.assetName} · ${tx.quantity} adet satıldı @ ${formatCurrency(tx.price ?? 0)}`;
                        }

                        const txDate = new Date(tx.timestamp).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        });

                        return (
                          <View key={tx.id} style={styles.notificationItem}>
                            <View style={styles.txIconWrap}>
                              {icon}
                            </View>
                            <View style={styles.notificationInfo}>
                              <Text style={styles.notificationAsset}>{title}</Text>
                              <Text style={styles.notificationDetails}>{details}</Text>
                              <Text style={styles.txDateText}>{txDate}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </>
                )
              ) : (
                // Snapshots tab
                snapshots.length === 0 ? (
                  <View style={styles.emptyNotifications}>
                    <PieChart size={32} color={colors.textMuted} />
                    <Text style={styles.emptyNotificationsText}>Henüz portföy değişim kaydı bulunmuyor.</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.notificationSubtitle}>Portföy Değer Geçmişi:</Text>
                    <ScrollView style={styles.notificationScroll} showsVerticalScrollIndicator={false}>
                      {[...snapshots].reverse().map((snap) => {
                        const snapDate = new Date(snap.recordedAt).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        });

                        const snapPnL = snap.totalValue - snap.totalCost;
                        const snapIsPositive = snapPnL >= 0;

                        return (
                          <View key={snap.id} style={styles.notificationItem}>
                            <View style={styles.notificationInfo}>
                              <Text style={styles.notificationAsset}>{formatCurrency(snap.totalValue)}</Text>
                              <Text style={styles.notificationDetails}>
                                Maliyet: {formatCurrency(snap.totalCost)} · Kar/Zarar:{" "}
                                <Text style={{ color: snapIsPositive ? colors.success : colors.danger, fontWeight: "700" }}>
                                  {snapIsPositive ? "+" : ""}{formatCurrency(snapPnL)}
                                </Text>
                              </Text>
                              <Text style={styles.txDateText}>{snapDate}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </>
                )
              )}
            </View>
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}

const iconMap = {
  plus: Plus,
  "chart-pie": PieChart,
  history: History,
  "bell-ring-outline": BellRing,
};

function ActionButton({
  icon,
  label,
  color,
  onPress
}: {
  icon: keyof typeof iconMap;
  label: string;
  color: string;
  onPress?: () => void;
}) {
  const IconComponent = iconMap[icon];
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={[styles.actionIconWrap, { backgroundColor: color === colors.primary ? colors.textPrimary : colors.surface }]}>
        <IconComponent size={22} color={color === colors.primary ? "#FFFFFF" : color} />
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
    flex: 1,
    marginRight: spacing.sm,
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
    justifyContent: "space-around",
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
  },
  aiCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  aiCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  aiCardTitle: {
    fontSize: typography.body,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  aiCardText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  aiCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  aiCardLink: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.secondary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.md,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  modalTitle: {
    fontSize: typography.h3,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  closeModalButton: {
    padding: 4,
  },
  modalBody: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  emptyNotifications: {
    paddingVertical: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  emptyNotificationsText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: "center",
    lineHeight: 20,
  },
  notificationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  clearAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearAllText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: "700",
  },
  notificationScroll: {
    maxHeight: 250,
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notificationInfo: {
    flex: 1,
    gap: 2,
  },
  notificationAsset: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  notificationDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteNotificationButton: {
    padding: 6,
    borderRadius: radius.sm,
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  historyModalCard: {
    width: "100%",
    maxWidth: 360,
    height: 480,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.md,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  activeTabButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },
  txIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceHighlight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  txDateText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
