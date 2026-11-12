import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export function HobbyCard({ item }) {
  const { colors, typography, spacing, radius } = useTheme();

  if (!item) return null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.cardBorder,
          borderRadius: radius.md,
          padding: spacing.md,
        },
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Hobi: ${item.nama}. ${item.deskripsi}`}
    >
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: colors.primaryLight,
            borderRadius: radius.full,
          },
        ]}
      >
        <Ionicons
          name={item.ikon || 'heart-outline'}
          size={22}
          color={colors.primary}
        />
      </View>

      <View style={styles.textCol}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: typography.bodyBold.fontSize },
          ]}
        >
          {item.nama}
        </Text>
        <Text
          style={[
            styles.desc,
            {
              color: colors.textMuted,
              fontSize: typography.caption.fontSize,
              marginTop: 2,
            },
          ]}
        >
          {item.deskripsi}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
  },
  desc: {
    lineHeight: 18,
  },
});

