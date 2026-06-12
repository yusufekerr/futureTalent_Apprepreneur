import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, spacing } from "@/design/tokens";
import { toPositiveNumber } from "@/utils/number";
import { formatCurrency, getAssetCost, getAssetPnL, getAssetValue } from "@/utils/portfolio";

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { assets, removeAsset, updatePrice, sellAsset } = usePortfolio();
  const asset = useMemo(() => assets.find((item) => item.id === id), [assets, id]);
  const [nextPrice, setNextPrice] = useState(asset ? String(asset.currentPrice) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sellQty, setSellQty] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [sellError, setSellError] = useState("");
  const [sellSuccess, setSellSuccess] = useState("");

  if (!asset) {
    return (
      <Screen>
        <Card>
          <Text style={styles.text}>Varlik bulunamadi.</Text>
        </Card>
      </Screen>
    );
  }

  const pnl = getAssetPnL(asset);

  const handleUpdatePrice = async () => {
    setError("");
    const parsedPrice = toPositiveNumber(nextPrice);
    if (parsedPrice === null) {
      setError("Geçerli ve negatif olmayan bir fiyat giriniz.");
      return;
    }
    setLoading(true);
    const result = await updatePrice(asset.id, parsedPrice);
    setLoading(false);
    if (result.error) setError(result.error);
  };

  const handleRemove = async () => {
    setError("");
    setLoading(true);
    const result = await removeAsset(asset.id);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace("/(tabs)/portfolio");
    }
  };

  const handleSell = async () => {
    setSellError("");
    setSellSuccess("");
    const parsedQty = toPositiveNumber(sellQty);
    const parsedPrice = toPositiveNumber(sellPrice);

    if (parsedQty === null || parsedQty <= 0) {
      setSellError("Geçerli ve 0'dan büyük bir satış adedi giriniz.");
      return;
    }
    if (parsedQty > asset.quantity) {
      setSellError(`Yetersiz varlık miktarı. En fazla ${asset.quantity} adet satabilirsiniz.`);
      return;
    }
    if (parsedPrice === null || parsedPrice <= 0) {
      setSellError("Geçerli ve 0'dan büyük bir satış fiyatı giriniz.");
      return;
    }

    setLoading(true);
    const result = await sellAsset(asset.id, parsedQty, parsedPrice);
    setLoading(false);

    if (result.error) {
      setSellError(result.error);
    } else {
      setSellSuccess("Satış işlemi başarıyla kaydedildi.");
      setSellQty("");
      setSellPrice("");
      if (parsedQty === asset.quantity) {
        setTimeout(() => {
          router.replace("/(tabs)/portfolio");
        }, 1500);
      }
    }
  };

  return (
    <Screen>
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <ArrowLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={headerRowTitleStyles.headerTitle}>Varlık Detayı</Text>
        <View style={{ width: 40 }} />
      </View>
      <SectionHeader title={`${asset.name} Detayi`} subtitle={`${asset.type} · ${asset.quantity} adet`} />
      
      <Card>
        <View style={styles.stats}>
          <Text style={styles.text}>Toplam Deger: {formatCurrency(getAssetValue(asset))}</Text>
          <Text style={styles.text}>Toplam Maliyet: {formatCurrency(getAssetCost(asset))}</Text>
          <Text style={[styles.text, { color: pnl >= 0 ? colors.success : colors.danger }]}>
            Kar/Zarar: {formatCurrency(pnl)}
          </Text>
        </View>
      </Card>

      <Card>
        <View style={styles.stats}>
          <Text style={styles.sectionTitle}>Fiyat Güncelle</Text>
          <Input label="Guncel Fiyat" value={nextPrice} onChangeText={setNextPrice} keyboardType="numeric" />
          <Button
            label={loading ? "Güncelleniyor..." : "Fiyati Guncelle"}
            disabled={loading}
            onPress={handleUpdatePrice}
          />
        </View>
      </Card>

      <Card>
        <View style={styles.stats}>
          <Text style={styles.sectionTitle}>Kısmi Satış Yap</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input 
                label="Satış Adedi" 
                value={sellQty} 
                onChangeText={setSellQty} 
                keyboardType="numeric" 
                placeholder="0" 
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input 
                label="Satış Fiyatı (TRY)" 
                value={sellPrice} 
                onChangeText={setSellPrice} 
                keyboardType="numeric" 
                placeholder="0.00" 
              />
            </View>
          </View>
          <Button
            label={loading ? "İşlem yapılıyor..." : "Satışı Kaydet"}
            disabled={loading}
            onPress={handleSell}
          />
          {sellSuccess ? <Text style={styles.successText}>{sellSuccess}</Text> : null}
          {sellError ? <Text style={styles.errorText}>{sellError}</Text> : null}
        </View>
      </Card>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <View style={{ marginTop: spacing.md }}>
        <Button
          variant="danger"
          label={loading ? "Siliniyor..." : "Varligi Sil"}
          disabled={loading}
          onPress={handleRemove}
        />
      </View>
    </Screen>
  );
}

const headerRowTitleStyles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  }
});

const styles = StyleSheet.create({
  stats: {
    gap: spacing.sm
  },
  text: {
    color: colors.textPrimary,
    fontWeight: "600"
  },
  errorText: {
    color: colors.danger,
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.xs
  },
  successText: {
    color: colors.success,
    fontWeight: "600",
    textAlign: "center",
    marginTop: spacing.xs
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
  row: {
    flexDirection: "row",
    gap: spacing.md
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs
  }
});
