import React, { useState } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function Card({
  children,
  onPress,
  style,
  contentStyle,
  accessible = true,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
}) {
  const { colors, radius, spacing, isDark } = useTheme();
  // useState lazy init: safe from react-hooks/refs lint rule
  const [scale] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
      tension: 200,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 150,
    }).start();
  };

  // Specular highlight: glass top-border shine
  const specularColor = isDark
    ? 'rgba(255,255,255,0.10)'
    : 'rgba(255,255,255,0.80)';

  const baseStyle = {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderTopColor: specularColor,
    borderTopWidth: 1.5,
    borderLeftColor: colors.cardBorder,
    borderLeftWidth: 1,
    borderRightColor: colors.cardBorder,
    borderRightWidth: 1,
    borderBottomColor: colors.cardBorder,
    borderBottomWidth: 1,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible={accessible}
        accessibilityRole={accessibilityRole || 'button'}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        <Animated.View
          style={[
            styles.card,
            baseStyle,
            { transform: [{ scale }] },
            style,
          ]}
        >
          <View style={contentStyle}>{children}</View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <View
      style={[styles.card, baseStyle, style]}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={contentStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
});
