import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, spacing, typography } from "@/design/tokens";
import type { AssetType } from "@/types/portfolio";

const assetTypeOptions: AssetType[] = ["Hisse", "Kripto", "Emtia", "Fon", "Döviz"];

export default function AddAssetScreen() {
  const { addAsset } = usePortfolio();
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetType>("Hisse");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [done, setDone] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(name.trim() && Number(quantity) > 0 && Number(buyPrice) >= 0 && Number(currentPrice) >= 0);
  }, [buyPrice, currentPrice, name, quantity]);

  return (
    <Screen>
      <View style={styles.headerWrap}>
        <SectionHeader title="Varlık Ekle" subtitle="Portföyünüzü genişletin." />
      </View>
      <Card>
        <View style={styles.form}>
          <Input label="Varlık Adı" value={name} onChangeText={setName} placeholder="BTC, ASELS, XAU..." />
          
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
                  onPress={() => setType(item)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.submitWrap}>
            <Button
              label="Portföye Ekle"
              disabled={!canSubmit}
              onPress={() => {
                addAsset({
                  name: name.trim().toUpperCase(),
                  type,
                  quantity: Number(quantity),
                  buyPrice: Number(buyPrice),
                  currentPrice: Number(currentPrice)
                });
                setName("");
                setQuantity("");
                setBuyPrice("");
                setCurrentPrice("");
                setDone("Varlık başarıyla eklendi.");
                setTimeout(() => setDone(""), 3000);
              }}
            />
          </View>
          {done ? <Text style={styles.done}>{done}</Text> : null}
        </View>
      </Card>
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
  }
});
