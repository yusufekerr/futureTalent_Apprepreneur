import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { AuthProvider as RealAuthProvider } from "@/context/AuthContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { AlertsProvider, useAlerts } from "@/context/AlertsContext";
import { colors, radius, spacing, typography, shadows } from "@/design/tokens";
import { formatCurrency } from "@/utils/portfolio";

function AppContent() {
  const { triggeredAlerts, dismissTriggeredAlert } = useAlerts();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="asset/[id]" options={{ headerShown: true, title: "Varlık Detayı" }} />
        <Stack.Screen name="alerts" options={{ headerShown: true, title: "Fiyat Alarmları" }} />
      </Stack>

      {/* Global Price Alert Overlay Modal */}
      {triggeredAlerts.map((alert) => (
        <Modal
          key={alert.id}
          transparent
          animationType="fade"
          visible={true}
          onRequestClose={() => dismissTriggeredAlert(alert.id)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.alertCard}>
              <LinearGradient
                colors={["#EF4444", "#F59E0B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.alertHeader}
              >
                <MaterialCommunityIcons name="bell-ring" size={40} color="#FFFFFF" />
                <Text style={styles.alertHeaderTitle}>Fiyat Alarmı Tetiklendi!</Text>
              </LinearGradient>
              
              <View style={styles.alertBody}>
                <Text style={styles.alertText}>
                  <Text style={styles.boldText}>{alert.assetName}</Text> varlığınız belirlediğiniz hedef fiyat seviyesine ulaştı.
                </Text>
                
                <View style={styles.detailsRow}>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Kriter</Text>
                    <Text style={styles.detailValue}>
                      {alert.condition === "above" ? "Üzerine Çıktı" : "Altına İndi"}
                    </Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Hedef Fiyat</Text>
                    <Text style={styles.detailValue}>{formatCurrency(alert.targetPrice)}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.dismissButton} 
                  activeOpacity={0.8}
                  onPress={() => dismissTriggeredAlert(alert.id)}
                >
                  <Text style={styles.dismissButtonText}>Anlaşıldı, Kapat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ))}
    </>
  );
}

export default function RootLayout() {
  return (
    <RealAuthProvider>
      <PortfolioProvider>
        <AlertsProvider>
          <StatusBar style="dark" />
          <AppContent />
        </AlertsProvider>
      </PortfolioProvider>
    </RealAuthProvider>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  alertCard: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadows.lg,
  },
  alertHeader: {
    paddingVertical: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
  },
  alertHeaderTitle: {
    color: "#FFFFFF",
    fontSize: typography.h3,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  alertBody: {
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: "center",
  },
  alertText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 22,
  },
  boldText: {
    fontWeight: "800",
    color: colors.primary,
  },
  detailsRow: {
    flexDirection: "row",
    gap: spacing.md,
    width: "100%",
    justifyContent: "center",
    marginVertical: spacing.xs,
  },
  detailBox: {
    flex: 1,
    backgroundColor: colors.surfaceHighlight,
    padding: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "800",
  },
  dismissButton: {
    width: "100%",
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  dismissButtonText: {
    color: "#FFFFFF",
    fontSize: typography.body,
    fontWeight: "700",
  },
});
