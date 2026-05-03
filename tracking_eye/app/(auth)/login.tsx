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

export default function LoginScreen() {
  const { signIn } = usePortfolio();
  const [email, setEmail] = useState("demo@trackingeye.app");
  const [password, setPassword] = useState("123456");

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
          <Input label="Sifre" value={password} onChangeText={setPassword} placeholder="******" />
          <Button
            label="Giris Yap"
            onPress={() => {
              signIn();
              router.replace("/(tabs)/dashboard");
            }}
          />
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
  }
});
