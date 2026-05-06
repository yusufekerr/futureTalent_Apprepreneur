import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { colors, radius, shadows, spacing, typography } from "@/design/tokens";

export function MetricCard({
  title,
  value,
  helper,
  positive,
  gradient
}: {
  title: string;
  value: string;
  helper?: string;
  positive?: boolean;
  gradient?: boolean;
}) {
  const content = (
    <View style={styles.wrap}>
      <Text style={[styles.title, gradient && styles.textWhite]}>{title}</Text>
      <Text style={[styles.value, gradient && styles.textWhite]}>{value}</Text>
      {helper ? (
        <View style={styles.helperWrap}>
          {typeof positive === "boolean" && (
            <View
              style={[
                styles.indicator,
                { backgroundColor: positive ? colors.success : colors.danger }
              ]}
            />
          )}
          <Text
            style={[
              styles.helper,
              gradient && styles.textWhiteOpacity,
              typeof positive === "boolean" && !gradient
                ? { color: positive ? colors.success : colors.danger }
                : null
            ]}
          >
            {helper}
          </Text>
        </View>
      ) : null}
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={["#3B82F6", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientCard, shadows.glow]}
      >
        {content}
      </LinearGradient>
    );
  }

  return <Card>{content}</Card>;
}

const styles = StyleSheet.create({
  gradientCard: {
    borderRadius: radius.lg,
    padding: spacing.lg
  },
  wrap: {
    gap: spacing.xs
  },
  title: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  value: {
    fontSize: typography.h1,
    color: colors.textPrimary,
    fontWeight: "800"
  },
  helperWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  helper: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textSecondary
  },
  textWhite: {
    color: "#FFFFFF"
  },
  textWhiteOpacity: {
    color: "rgba(255, 255, 255, 0.8)"
  }
});
