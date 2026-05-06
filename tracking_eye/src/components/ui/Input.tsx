import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radius, spacing, typography } from "@/design/tokens";

type InputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric";
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default"
}: InputProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.xs
  },
  label: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(0,0,0,0.2)",
    color: colors.textPrimary,
    fontSize: typography.body
  }
});
