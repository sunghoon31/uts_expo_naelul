import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export function Chip({
  label,
  selected = false,
  icon,
  onPress,
  style,
  textStyle,
}) {
  const { colors, radius, spacing, typography } = useTheme();
  const [scale] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      friction: 6,
      tension: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 200,
    }).start();
  };

  const isInteractive = typeof onPress === 'function';

  const content = (
    <View style={styles.innerRow}>
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? '#FFFFFF' : colors.textMuted}
          style={{ marginRight: 6 }}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: selected ? '#FFFFFF' : colors.text,
            fontSize: typography.captionBold.fontSize,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );

  const containerStyle = [
    styles.chip,
    {
      backgroundColor: selected ? colors.primary : colors.surfaceMuted,
      borderColor: selected ? colors.primary : colors.border,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      // Glossy selected glow
      shadowColor: selected ? colors.primary : 'transparent',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: selected ? 0.4 : 0,
      shadowRadius: selected ? 6 : 0,
      elevation: selected ? 3 : 0,
    },
    style,
  ];

  if (isInteractive) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`Filter ${label}${selected ? ', terpilih' : ''}`}
      >
        <Animated.View style={[containerStyle, { transform: [{ scale }] }]}>
          {content}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    marginRight: 8,
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 34,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

