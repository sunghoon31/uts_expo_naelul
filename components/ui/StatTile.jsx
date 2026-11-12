import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export function StatTile({
  label,
  value,
  caption,
  icon,
  iconColor,
  style,
}) {
  const { colors, typography, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: colors.surface,
          borderColor: colors.cardBorder,
          borderRadius: radius.md,
          padding: spacing.md,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}${caption ? `, ${caption}` : ''}`}
    >
      <View style={styles.topRow}>
        <Text
          style={[
            styles.label,
            { color: colors.textMuted, fontSize: typography.caption.fontSize },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={iconColor || colors.primary}
          />
        )}
      </View>

      <Text
        style={[
          styles.value,
          { color: colors.text, fontSize: typography.h2.fontSize, marginVertical: spacing.xs },
        ]}
      >
        {value}
      </Text>

      {caption && (
        <Text
          style={[
            styles.caption,
            { color: colors.textMuted, fontSize: typography.small.fontSize },
          ]}
          numberOfLines={1}
        >
          {caption}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 1,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontWeight: '700',
  },
  caption: {
    marginTop: 2,
  },
});

