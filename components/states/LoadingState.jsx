import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function LoadingState({ message = 'Memuat data...', style }) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: 'transparent' }, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <Text
        style={[
          styles.text,
          {
            color: colors.textMuted,
            fontSize: typography.body.fontSize,
            marginTop: spacing.md,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
});

