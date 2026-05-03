import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AssetRow } from "@/components/ui/AssetRow";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, spacing, typography } from "@/design/tokens";

export default function PortfolioScreen() {
  const { assets } = usePortfolio();

  return (
    <Screen>
      <SectionHeader title="Portfoy Detayi" subtitle="Tum varliklarini tek bir listede gor." />

      {assets.length === 0 ? (
        <Card>
          <Text style={styles.empty}>Henuz varlik eklemedin.</Text>
        </Card>
      ) : (
        <View style={styles.list}>
          <Text style={styles.heading}>{assets.length} varlik bulundu</Text>
          {assets.map((asset) => (
            <AssetRow key={asset.id} asset={asset} onPress={() => router.push(`/asset/${asset.id}`)} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md
  },
  heading: {
    fontSize: typography.body,
    color: colors.textSecondary
  },
  empty: {
    color: colors.textSecondary
  }
});
