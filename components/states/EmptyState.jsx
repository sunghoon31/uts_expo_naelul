import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

export function EmptyState({
  icon = 'folder-open-outline',
  title = 'Tidak Ada Data',
  message = 'Belum ada konten yang dapat ditampilkan saat ini.',
  actionLabel,
  onAction,
  style,
}) {
  const { colors, typography, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.xl,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${message}`}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.surfaceMuted, borderRadius: radius.full },
        ]}
      >
        <Ionicons name={icon} size={38} color={colors.textMuted} />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.h3.fontSize,
            marginTop: spacing.md,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.message,
          {
            color: colors.textMuted,
            fontSize: typography.caption.fontSize,
            marginVertical: spacing.sm,
          },
        ]}
      >
        {message}
      </Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.md,
              marginTop: spacing.md,
            },
          ]}
          onPress={onAction}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 290,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

