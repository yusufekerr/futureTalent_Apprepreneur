import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View } from "react-native";

import { colors, spacing } from "@/design/tokens";

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg
  }
});
