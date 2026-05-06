import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, shadows, spacing, typography } from "@/design/tokens";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export function Button({ label, onPress, variant = "primary", disabled = false }: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const tone = {
    primary: {
      bg: colors.primary,
      text: "#FFFFFF",
      border: colors.primary,
      shadow: shadows.glow
    },
    secondary: {
      bg: "transparent",
      text: colors.textPrimary,
      border: colors.border,
      shadow: {}
    },
    danger: {
      bg: "rgba(239, 68, 68, 0.15)",
      text: colors.danger,
      border: "rgba(239, 68, 68, 0.3)",
      shadow: {}
    }
  }[variant];

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: tone.bg,
            borderColor: tone.border,
            opacity: disabled ? 0.55 : 1
          },
          !disabled && tone.shadow
        ]}
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={[styles.label, { color: tone.text }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1
  },
  label: {
    fontSize: typography.body,
    fontWeight: "700",
    letterSpacing: 0.3
  }
});
