import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAlerts } from "@/context/AlertsContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, radius, spacing, typography, shadows } from "@/design/tokens";
import { toPositiveNumber } from "@/utils/number";
import { formatCurrency } from "@/utils/portfolio";

export default function AlertsScreen() {
  const { assets } = usePortfolio();
  const { alerts, addAlert, removeAlert } = useAlerts();

  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [targetPrice, setTargetPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddAlert = async () => {
    setError("");
    setSuccess("");

    if (!selectedAsset) {
      setError("Lütfen bir varlık seçin.");
      return;
    }

    const parsedPrice = toPositiveNumber(targetPrice);
    if (parsedPrice === null || parsedPrice <= 0) {
      setError("Hedef fiyat sıfırdan büyük geçerli bir sayı olmalıdır.");
      return;
    }

    setLoading(true);
    const result = await addAlert({
      assetName: selectedAsset,
      targetPrice: parsedPrice,
      condition
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setTargetPrice("");
      setSuccess("Alarm başarıyla kuruldu.");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    await removeAlert(id);
  };

  return (
    <Screen>
      <SectionHeader title="Fiyat Alarmları" subtitle="Hedef fiyatlara ulaşıldığında anında uyarı alın." />

      {/* NEW ALERT FORM */}
      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Yeni Alarm Kur</Text>
        
        {/* Asset Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Varlık Seçin</Text>
          {assets.length === 0 ? (
            <Text style={styles.emptyPortfolioText}>
              Önce portföyünüze bir varlık eklemelisiniz.
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.assetSelector}>
              {assets.map((asset) => (
                <TouchableOpacity
                  key={asset.id}
                  style={[
                    styles.assetBadge,
                    selectedAsset === asset.name && styles.selectedAssetBadge
                  ]}
                  onPress={() => setSelectedAsset(asset.name)}
                >
                  <Text
                    style={[
                      styles.assetBadgeText,
                      selectedAsset === asset.name && styles.selectedAssetBadgeText
                    ]}
                  >
                    {asset.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Condition Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Kriter</Text>
          <View style={styles.conditionRow}>
            <TouchableOpacity
              style={[
                styles.conditionButton,
                condition === "above" && styles.selectedConditionButton
              ]}
              onPress={() => setCondition("above")}
            >
              <MaterialCommunityIcons 
                name="trending-up" 
                size={18} 
                color={condition === "above" ? "#FFFFFF" : colors.textPrimary} 
              />
              <Text
                style={[
                  styles.conditionButtonText,
                  condition === "above" && styles.selectedConditionButtonText
                ]}
              >
                Üzerine Çıktı
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.conditionButton,
                condition === "below" && styles.selectedConditionButton
              ]}
              onPress={() => setCondition("below")}
            >
              <MaterialCommunityIcons 
                name="trending-down" 
                size={18} 
                color={condition === "below" ? "#FFFFFF" : colors.textPrimary} 
              />
              <Text
                style={[
                  styles.conditionButtonText,
                  condition === "below" && styles.selectedConditionButtonText
                ]}
              >
                Altına İndi
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Target Price Input */}
        <Input
          label="Hedef Fiyat (TRY)"
          value={targetPrice}
          onChangeText={setTargetPrice}
          keyboardType="numeric"
          placeholder="0.00"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <Button
          label={loading ? "Alarm kuruluyor..." : "Alarmı Etkinleştir"}
          disabled={loading || !selectedAsset || !targetPrice}
          onPress={handleAddAlert}
        />
      </Card>

      {/* ALERTS LIST */}
      <View style={styles.listWrap}>
        <Text style={styles.sectionTitle}>Alarmlarım ({alerts.length})</Text>
        
        {alerts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <MaterialCommunityIcons name="bell-off-outline" size={32} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Henüz kurulmuş bir fiyat alarmınız bulunmuyor.</Text>
          </Card>
        ) : (
          <ScrollView contentContainerStyle={styles.listContainer} scrollEnabled={false}>
            {alerts.map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={styles.alertInfo}>
                  <View style={styles.assetHeader}>
                    <Text style={styles.alertAssetName}>{alert.assetName}</Text>
                    {alert.isTriggered ? (
                      <View style={[styles.statusBadge, styles.statusTriggered]}>
                        <Text style={styles.statusBadgeText}>Tetiklendi</Text>
                      </View>
                    ) : (
                      <View style={[styles.statusBadge, styles.statusActive]}>
                        <View style={styles.activeDot} />
                        <Text style={[styles.statusBadgeText, { color: colors.success }]}>Aktif</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.alertDetails}>
                    Fiyat {alert.condition === "above" ? "hedefin üzerine çıkınca" : "hedefin altına inince"} ·{" "}
                    <Text style={styles.boldDetail}>{formatCurrency(alert.targetPrice)}</Text>
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteAlert(alert.id)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formCard: {
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.h3,
    color: colors.textPrimary,
    fontWeight: "800",
    marginBottom: spacing.xs,
  },
  formGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyPortfolioText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: spacing.xs,
  },
  assetSelector: {
    gap: spacing.xs,
    paddingVertical: 4,
  },
  assetBadge: {
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedAssetBadge: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  assetBadgeText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 13,
  },
  selectedAssetBadgeText: {
    color: "#FFFFFF",
  },
  conditionRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  conditionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.surfaceHighlight,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedConditionButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  conditionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  selectedConditionButtonText: {
    color: "#FFFFFF",
  },
  errorText: {
    color: colors.danger,
    fontWeight: "600",
    textAlign: "center",
    fontSize: typography.caption,
  },
  successText: {
    color: colors.success,
    fontWeight: "600",
    textAlign: "center",
    fontSize: typography.caption,
  },
  listWrap: {
    marginTop: spacing.xl,
    gap: spacing.sm,
    marginBottom: 40,
  },
  listContainer: {
    gap: spacing.sm,
  },
  alertItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  alertInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  assetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  alertAssetName: {
    fontSize: typography.body,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusTriggered: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  statusActive: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.danger,
  },
  alertDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  boldDetail: {
    fontWeight: "800",
    color: colors.textPrimary,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: "center",
    lineHeight: 20,
  },
});
