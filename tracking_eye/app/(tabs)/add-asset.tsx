import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, spacing, typography } from "@/design/tokens";
import type { AssetType } from "@/types/portfolio";

const assetTypeOptions: AssetType[] = ["Hisse", "Kripto", "Emtia", "Fon", "Doviz"];

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
      <SectionHeader title="Varlik Ekle" subtitle="Mock data ile aninda portfoye kaydet." />
      <Card>
        <View style={styles.form}>
          <Input label="Varlik Adi" value={name} onChangeText={setName} placeholder="BTC, ASELS, XAU..." />
          <Input label="Adet" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
          <Input label="Alis Fiyati (TRY)" value={buyPrice} onChangeText={setBuyPrice} keyboardType="numeric" />
          <Input
            label="Guncel Fiyat (TRY)"
            value={currentPrice}
            onChangeText={setCurrentPrice}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Varlik Turu</Text>
          <View style={styles.types}>
            {assetTypeOptions.map((item) => (
              <Button
                key={item}
                label={item}
                variant={type === item ? "primary" : "secondary"}
                onPress={() => setType(item)}
              />
            ))}
          </View>
          <Button
            label="Portfoye Ekle"
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
              setDone("Varlik portfoye eklendi.");
            }}
          />
          {done ? <Text style={styles.done}>{done}</Text> : null}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md
  },
  label: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  types: {
    gap: spacing.sm
  },
  done: {
    color: colors.success,
    fontWeight: "600"
  }
});
