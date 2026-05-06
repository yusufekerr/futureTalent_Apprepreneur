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
      <View style={styles.headerWrap}>
        <SectionHeader title="Portföy Detayı" subtitle="Tüm varlıklarınızı tek bir listede görün." />
      </View>

      {assets.length === 0 ? (
        <Card>
          <Text style={styles.empty}>Henüz varlık eklemediniz.</Text>
        </Card>
      ) : (
        <View style={styles.listWrap}>
          <Text style={styles.heading}>{assets.length} varlık bulundu</Text>
          <View style={styles.list}>
            {assets.map((asset) => (
              <AssetRow key={asset.id} asset={asset} onPress={() => router.push(`/asset/${asset.id}`)} />
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    marginBottom: spacing.xs
  },
  listWrap: {
    gap: spacing.sm
  },
  list: {
    gap: spacing.sm
  },
  heading: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  empty: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: "center",
    paddingVertical: spacing.lg
  }
});
