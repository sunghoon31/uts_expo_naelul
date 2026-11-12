import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export function Section({
  title,
  subtitle,
  rightAction,
  children,
  style,
  contentStyle,
}) {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={[styles.section, { marginBottom: spacing.xl }, style]}>
      {(title || subtitle || rightAction) && (
        <View style={[styles.headerRow, { marginBottom: spacing.md }]}>
          <View style={styles.titleContainer}>
            {title && (
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                    fontSize: typography.h2.fontSize,
                  },
                ]}
                accessible={true}
                accessibilityRole="header"
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.textMuted,
                    fontSize: typography.caption.fontSize,
                    marginTop: 2,
                  },
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
          {rightAction && <View style={styles.actionContainer}>{rightAction}</View>}
        </View>
      )}
      <View style={contentStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    lineHeight: 18,
  },
  actionContainer: {
    marginLeft: 12,
  },
});

