import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, spacing } from "@/design/tokens";
import { formatCurrency, getAssetCost, getAssetPnL, getAssetValue } from "@/utils/portfolio";

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { assets, removeAsset, updatePrice } = usePortfolio();
  const asset = useMemo(() => assets.find((item) => item.id === id), [assets, id]);
  const [nextPrice, setNextPrice] = useState(asset ? String(asset.currentPrice) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);
    const result = await updatePrice(asset.id, Number(nextPrice));
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

  return (
    <Screen>
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
          <Input label="Guncel Fiyat" value={nextPrice} onChangeText={setNextPrice} keyboardType="numeric" />
          <Button
            label={loading ? "Güncelleniyor..." : "Fiyati Guncelle"}
            disabled={loading}
            onPress={handleUpdatePrice}
          />
        </View>
      </Card>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        variant="danger"
        label={loading ? "Siliniyor..." : "Varligi Sil"}
        disabled={loading}
        onPress={handleRemove}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    gap: spacing.sm
  },
  text: {
    color: colors.textPrimary
  },
  errorText: {
    color: colors.danger,
    fontWeight: "600",
    textAlign: "center"
  }
});
