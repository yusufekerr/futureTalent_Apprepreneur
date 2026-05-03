import { Link, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePortfolio } from "@/context/PortfolioContext";
import { colors, spacing, typography } from "@/design/tokens";

export default function RegisterScreen() {
  const { signIn } = usePortfolio();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Screen>
      <SectionHeader title="Hemen basla" subtitle="Dakikalar icinde kendi yatirim panonu olustur." />
      <Card>
        <View style={styles.form}>
          <Input label="Ad Soyad" value={name} onChangeText={setName} placeholder="Yusuf Demir" />
          <Input
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            placeholder="mail@ornek.com"
            keyboardType="email-address"
          />
          <Input label="Sifre" value={password} onChangeText={setPassword} placeholder="******" />
          <Button
            label="Kayit Ol"
            onPress={() => {
              signIn();
              router.replace("/(tabs)/dashboard");
            }}
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
  }
});
