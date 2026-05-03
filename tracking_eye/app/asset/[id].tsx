import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";

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
            label="Fiyati Guncelle"
            onPress={() => {
              updatePrice(asset.id, Number(nextPrice));
            }}
          />
        </View>
      </Card>
      <Button
        variant="danger"
        label="Varligi Sil"
        onPress={() => {
          removeAsset(asset.id);
          router.replace("/(tabs)/portfolio");
        }}
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
  }
});
