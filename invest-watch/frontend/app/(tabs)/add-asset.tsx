import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, ChevronDown, Check, Plus } from "lucide-react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, spacing, typography, radius } from "@/design/tokens";
import type { AssetType } from "@/types/portfolio";
import { toPositiveNumber } from "@/utils/number";
import { BASELINE_PRICES } from "@/services/marketData";
import { formatCurrency } from "@/utils/portfolio";

const assetTypeOptions: AssetType[] = ["Hisse", "Kripto", "Emtia", "Fon", "Döviz"];

interface PredefinedAsset {
  symbol: string;
  name: string;
}

const PREDEFINED_ASSETS: Record<AssetType, PredefinedAsset[]> = {
  Hisse: [
    { symbol: "THYAO", name: "Türk Hava Yolları" },
    { symbol: "ASELS", name: "Aselsan" },
    { symbol: "EREGL", name: "Ereğli Demir Çelik" },
    { symbol: "TUPRS", name: "Tüpraş" },
    { symbol: "BIMAS", name: "BİM Birleşik Mağazalar" },
    { symbol: "ISCTR", name: "İş Bankası (C)" },
    { symbol: "KCHOL", name: "Koç Holding" }
  ],
  Kripto: [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "XRP", name: "Ripple" },
    { symbol: "ADA", name: "Cardano" }
  ],
  Emtia: [
    { symbol: "Gram Altın", name: "Gram Altın" },
    { symbol: "Çeyrek Altın", name: "Çeyrek Altın" },
    { symbol: "Cumhuriyet Altını", name: "Cumhuriyet Altını" },
    { symbol: "Gram Gümüş", name: "Gram Gümüş" }
  ],
  Fon: [
    { symbol: "TECD", name: "TEFAS Para Piyasası Fonu" },
    { symbol: "AFT", name: "Ak Portföy Yeni Teknolojiler Fonu" },
    { symbol: "MAC", name: "Marmara Capital Hisse Senedi Fonu" }
  ],
  Döviz: [
    { symbol: "USD", name: "Amerikan Doları" },
    { symbol: "EUR", name: "Euro" },
    { symbol: "GBP", name: "İngiliz Sterlini" },
    { symbol: "CHF", name: "İsviçre Frangı" }
  ]
};

export default function AddAssetScreen() {
  const { addAsset } = usePortfolio();
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetType>("Hisse");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [done, setDone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  const canSubmit = useMemo(() => {
    const parsedQuantity = toPositiveNumber(quantity);
    const parsedBuyPrice = toPositiveNumber(buyPrice);
    const parsedCurrentPrice = toPositiveNumber(currentPrice);

    return Boolean(
      name.trim() &&
        parsedQuantity !== null &&
        parsedQuantity > 0 &&
        parsedBuyPrice !== null &&
        parsedCurrentPrice !== null
    );
  }, [buyPrice, currentPrice, name, quantity]);

  const handleTypeChange = (newType: AssetType) => {
    setType(newType);
    setName("");
    setBuyPrice("");
    setCurrentPrice("");
    setIsCustom(false);
  };

  const handleSelectAsset = (symbol: string) => {
    setName(symbol);
    setIsCustom(false);
    setIsModalVisible(false);

    const lookupSymbol = symbol.toUpperCase();
    const baselinePrice = BASELINE_PRICES[lookupSymbol];
    if (baselinePrice !== undefined) {
      setBuyPrice(baselinePrice.toString());
      setCurrentPrice(baselinePrice.toString());
    } else {
      setBuyPrice("");
      setCurrentPrice("");
    }
  };

  const handleSubmit = async () => {
    setError("");
    setDone("");
    const parsedQuantity = toPositiveNumber(quantity);
    const parsedBuyPrice = toPositiveNumber(buyPrice);
    const parsedCurrentPrice = toPositiveNumber(currentPrice);

    if (!name.trim()) {
      setError("Varlık adı zorunludur.");
      return;
    }
    if (parsedQuantity === null || parsedQuantity <= 0) {
      setError("Adet değeri 0'dan büyük bir sayı olmalıdır.");
      return;
    }
    if (parsedBuyPrice === null || parsedCurrentPrice === null) {
      setError("Fiyat alanları geçerli ve negatif olmayan sayı olmalıdır.");
      return;
    }

    setLoading(true);

    const result = await addAsset({
      name: name.trim().toUpperCase(),
      type,
      quantity: parsedQuantity,
      buyPrice: parsedBuyPrice,
      currentPrice: parsedCurrentPrice
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setName("");
      setQuantity("");
      setBuyPrice("");
      setCurrentPrice("");
      setIsCustom(false);
      setDone("Varlık başarıyla eklendi.");
      setTimeout(() => setDone(""), 3000);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/dashboard");
    }
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Varlık Ekle</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.headerWrap}>
        <SectionHeader title="Yeni Varlık" subtitle="Portföyünüzü genişletin." />
      </View>
      <Card>
        <View style={styles.form}>
          {isCustom ? (
            <View style={styles.customInputRow}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Varlık Adı (Manuel)"
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn: VESTL, DOGE..."
                />
              </View>
              <TouchableOpacity
                style={styles.backToListBtn}
                onPress={() => {
                  setIsCustom(false);
                  setName("");
                  setBuyPrice("");
                  setCurrentPrice("");
                }}
              >
                <Text style={styles.backToListBtnText}>Listeden Seç</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.group}>
              <Text style={styles.label}>Varlık Adı</Text>
              <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={name ? styles.selectorText : styles.selectorPlaceholder} numberOfLines={1}>
                  {name ? (
                    `${name} - ${PREDEFINED_ASSETS[type]?.find(a => a.symbol === name)?.name || "Seçilen Varlık"}`
                  ) : (
                    "Bir varlık seçmek için tıklayın..."
                  )}
                </Text>
                <ChevronDown size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input label="Adet" value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="0" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Alış Fiyatı (TRY)" value={buyPrice} onChangeText={setBuyPrice} keyboardType="numeric" placeholder="0.00" />
            </View>
          </View>
          
          <Input
            label="Güncel Fiyat (TRY)"
            value={currentPrice}
            onChangeText={setCurrentPrice}
            keyboardType="numeric"
            placeholder="0.00"
          />
          
          <View style={styles.typeSection}>
            <Text style={styles.label}>Varlık Türü</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.types}>
              {assetTypeOptions.map((item) => (
                <Button
                  key={item}
                  label={item}
                  variant={type === item ? "primary" : "secondary"}
                  onPress={() => handleTypeChange(item)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.submitWrap}>
            <Button
              label={loading ? "Ekleniyor..." : "Portföye Ekle"}
              disabled={!canSubmit || loading}
              onPress={handleSubmit}
            />
          </View>
          {done ? <Text style={styles.done}>{done}</Text> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </Card>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity 
            style={styles.modalDismissArea} 
            activeOpacity={1} 
            onPress={() => setIsModalVisible(false)} 
          />
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>{type} Seçin</Text>
            
            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {PREDEFINED_ASSETS[type]?.map((item) => {
                const lookupSymbol = item.symbol.toUpperCase();
                const baselinePrice = BASELINE_PRICES[lookupSymbol];
                const isSelected = name === item.symbol;
                
                return (
                  <TouchableOpacity
                    key={item.symbol}
                    style={[styles.modalItem, isSelected && styles.modalItemActive]}
                    onPress={() => handleSelectAsset(item.symbol)}
                  >
                    <View style={styles.modalItemLeft}>
                      <Text style={[styles.modalItemSymbol, isSelected && styles.modalItemTextActive]}>
                        {item.symbol}
                      </Text>
                      <Text style={styles.modalItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    
                    <View style={styles.modalItemRight}>
                      {baselinePrice !== undefined && (
                        <Text style={styles.modalItemPrice}>
                          ~ {formatCurrency(baselinePrice)}
                        </Text>
                      )}
                      {isSelected && (
                        <Check size={18} color={colors.success} style={{ marginLeft: spacing.xs }} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
              
              <TouchableOpacity
                style={[styles.modalItem, isCustom && styles.modalItemActive, { marginTop: spacing.xs }]}
                onPress={() => {
                  setIsCustom(true);
                  setName("");
                  setBuyPrice("");
                  setCurrentPrice("");
                  setIsModalVisible(false);
                }}
              >
                <View style={styles.modalItemLeft}>
                  <View style={styles.customIconContainer}>
                    <Plus size={16} color={colors.secondary} />
                  </View>
                  <Text style={[styles.modalItemSymbol, { color: colors.secondary }]}>
                    Diğer (Manuel Ekle)
                  </Text>
                </View>
                <View style={styles.modalItemRight}>
                  <Text style={styles.modalItemSubtext}>Listede yoksa elle yazın</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.modalCloseButton} 
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Vazgeç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: spacing.xs
  },
  form: {
    gap: spacing.lg
  },
  row: {
    flexDirection: "row",
    gap: spacing.md
  },
  typeSection: {
    gap: spacing.xs
  },
  label: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  types: {
    gap: spacing.sm,
    paddingVertical: spacing.xs
  },
  submitWrap: {
    marginTop: spacing.sm
  },
  done: {
    color: colors.success,
    fontWeight: "600",
    textAlign: "center"
  },
  errorText: {
    color: colors.danger,
    fontWeight: "600",
    textAlign: "center",
    fontSize: typography.caption
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  group: {
    gap: spacing.xs
  },
  customInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  backToListBtn: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceHighlight,
  },
  backToListBtnText: {
    color: colors.secondary,
    fontWeight: "600",
    fontSize: typography.caption
  },
  selectorButton: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(0,0,0,0.02)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  selectorText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    flex: 1,
    marginRight: spacing.xs
  },
  selectorPlaceholder: {
    fontSize: typography.body,
    color: colors.textMuted
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end"
  },
  modalDismissArea: {
    flex: 1
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: "75%",
    borderWidth: 1,
    borderColor: colors.border
  },
  modalIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: spacing.md
  },
  modalTitle: {
    fontSize: typography.h2,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center"
  },
  modalList: {
    marginBottom: spacing.md
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: spacing.xs,
    backgroundColor: colors.surfaceHighlight
  },
  modalItemActive: {
    borderColor: colors.border,
    backgroundColor: "rgba(59, 130, 246, 0.05)"
  },
  modalItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1
  },
  modalItemSymbol: {
    fontSize: typography.body,
    fontWeight: "800",
    color: colors.textPrimary
  },
  modalItemTextActive: {
    color: colors.secondary
  },
  modalItemName: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    flex: 1,
    marginLeft: spacing.xs
  },
  modalItemRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  modalItemPrice: {
    fontSize: typography.caption,
    fontWeight: "600",
    color: colors.textSecondary
  },
  modalItemSubtext: {
    fontSize: 11,
    color: colors.textMuted
  },
  customIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalCloseButton: {
    height: 52,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.border
  },
  modalCloseButtonText: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.textSecondary
  }
});
