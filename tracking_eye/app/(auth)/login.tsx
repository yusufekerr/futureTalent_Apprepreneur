import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAuth } from "@/context/AuthContext";
import { colors, spacing, typography } from "@/design/tokens";

export default function LoginScreen() {
  const { signIn } = useAuth();
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
        Hesabin yok mu? <Link href="/(auth)/register">Kayit ol</Link>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md
  },
  helper: {
    color: colors.textSecondary,
    fontSize: typography.body
  },
  error: {
    color: colors.danger,
    fontSize: typography.caption,
    fontWeight: "600",
    textAlign: "center"
  }
});
