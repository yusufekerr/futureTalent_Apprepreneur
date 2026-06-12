import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAuth } from "@/context/AuthContext";
import { colors, radius, spacing, typography } from "@/design/tokens";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("E-posta ve şifre alanları zorunludur.");
      return;
    }
    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace("/(tabs)/dashboard");
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    const demoEmail = "demo@investwatch.com";
    const demoPassword = "DemoUser123!";

    // 1. Try to sign in first
    let result = await signIn(demoEmail, demoPassword);

    // 2. If it fails, sign up automatically
    if (result && result.error) {
      console.log("Demo user not found, creating user...");
      const signupResult = await signUp(demoEmail, demoPassword);
      if (signupResult.error) {
        setError(signupResult.error);
        setLoading(false);
        return;
      }
      
      // Sign in after creation
      result = await signIn(demoEmail, demoPassword);
      if (result.error) {
        setError(
          "Test kullanıcısı otomatik oluşturuldu fakat e-posta doğrulaması gerekiyor olabilir.\n\n" +
          "Lütfen Supabase panelinden 'Confirm Email' ayarını kapatın veya demo@investwatch.com kullanıcısını onaylayın."
        );
        setLoading(false);
        return;
      }
    }

    // 3. Seed demo assets & snapshots if empty
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existingAssets } = await supabase
          .from("assets")
          .select("id")
          .eq("user_id", user.id);

        if (!existingAssets || existingAssets.length === 0) {
          console.log("Seeding demo assets...");
          await supabase.from("assets").insert([
            { user_id: user.id, name: "BTC", type: "Kripto", quantity: 0.45, buy_price: 2150000, current_price: 2280000 },
            { user_id: user.id, name: "ASELS", type: "Hisse", quantity: 150, buy_price: 55.4, current_price: 62.1 },
            { user_id: user.id, name: "ALTIN (XAU)", type: "Emtia", quantity: 15, buy_price: 2450, current_price: 2580 },
            { user_id: user.id, name: "USD", type: "Döviz", quantity: 1200, buy_price: 32.2, current_price: 32.55 }
          ]);

          console.log("Seeding demo snapshots...");
          await supabase.from("portfolio_snapshots").insert([
            { user_id: user.id, total_value: 1040000, total_cost: 1040000, recorded_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
            { user_id: user.id, total_value: 1060000, total_cost: 1040000, recorded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { user_id: user.id, total_value: 1055000, total_cost: 1040000, recorded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { user_id: user.id, total_value: 1090000, total_cost: 1040000, recorded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
            { user_id: user.id, total_value: 1115000, total_cost: 1040000, recorded_at: new Date().toISOString() }
          ]);
        }
      }
    } catch (seedErr) {
      console.warn("Seeding failed, proceeding to dashboard:", seedErr);
    }

    setLoading(false);
    router.replace("/(tabs)/dashboard");
  };

  return (
    <Screen>
      <SectionHeader title="Tekrar hos geldin" subtitle="Portfoyunu takip etmeye devam et." />
      <Card>
        <View style={styles.form}>
          <Input
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            placeholder="mail@ornek.com"
            keyboardType="email-address"
          />
          <Input
            label="Sifre"
            value={password}
            onChangeText={setPassword}
            placeholder="******"
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label={loading ? "Giriş yapılıyor..." : "Giris Yap"} disabled={loading} onPress={handleLogin} />
        </View>
      </Card>
      <Text style={styles.helper}>
        Hesabın yok mu? <Link href="/(auth)/register" style={styles.link}>Kayıt ol</Link>
      </Text>

      <View style={styles.demoContainer}>
        <View style={styles.demoHeaderRow}>
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>Hızlı Test Modu 🧪</Text>
          </View>
        </View>
        <Text style={styles.demoDescription}>
          Geliştirici değerlendirmesi için uygulamayı dolu bir portföy ve hazır grafik verileriyle tek tıklamayla başlatabilirsiniz.
        </Text>
        <TouchableOpacity 
          style={styles.demoQuickButton} 
          onPress={handleDemoLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.demoQuickButtonText}>
            {loading ? "Test Oturumu Hazırlanıyor..." : "Tek Tıkla Giriş Yap ⚡"}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md
  },
  helper: {
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: "center",
    marginTop: spacing.md,
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
  demoContainer: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  demoHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  demoBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  demoDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  demoQuickButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xs,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  demoQuickButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
