import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, spacing, typography } from "@/design/tokens";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export function Button({ label, onPress, variant = "primary", disabled = false }: ButtonProps) {
  const tone = {
    primary: {
      bg: colors.primary,
      text: "#FFFFFF",
      border: colors.primary
    },
    secondary: {
      bg: colors.surface,
      text: colors.textPrimary,
      border: colors.border
    },
    danger: {
      bg: "#FEE2E2",
      text: colors.danger,
      border: "#FECACA"
    }
  }[variant];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: tone.bg,
          borderColor: tone.border,
          opacity: disabled ? 0.55 : pressed ? 0.9 : 1
        }
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[styles.label, { color: tone.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1
  },
  label: {
    fontSize: typography.body,
    fontWeight: "700"
  }
});
