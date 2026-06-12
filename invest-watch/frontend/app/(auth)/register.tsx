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

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("E-posta ve şifre alanları zorunludur.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    const result = await signUp(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace("/(tabs)/dashboard");
    }
  };

  return (
    <Screen>
      <SectionHeader title="Hemen basla" subtitle="Dakikalar icinde kendi yatirim panonu olustur." />
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
          <Input
            label="Sifre Tekrar"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="******"
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            label={loading ? "Kayıt yapılıyor..." : "Kayit Ol"}
            disabled={loading}
            onPress={handleRegister}
          />
        </View>
      </Card>
      <Text style={styles.helper}>
        Zaten hesabin var mi? <Link href="/(auth)/login">Giris yap</Link>
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
