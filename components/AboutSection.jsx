import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card } from './ui/Card';

export function AboutSection({ profile }) {
  const { colors, typography, spacing } = useTheme();

  if (!profile) return null;

  return (
    <Card style={styles.card}>
      <Text
        style={[
          styles.heading,
          { color: colors.text, fontSize: typography.h3.fontSize },
        ]}
      >
        Tentang Saya
      </Text>
      <Text
        style={[
          styles.description,
          {
            color: colors.textMuted,
            fontSize: typography.body.fontSize,
            lineHeight: typography.body.lineHeight,
            marginTop: spacing.xs,
          },
        ]}
      >
        {profile.deskripsi}
      </Text>

      <View style={[styles.infoGrid, { marginTop: spacing.md }]}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Kelas</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{profile.kelas || 'SI-R-5, SI-NR-5'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Mata Kuliah</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{profile.mataKuliah || 'Pemrograman Mobile 2'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Dosen Pengampu</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{profile.dosen || 'Iin, M.Kom'}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  heading: {
    fontWeight: '700',
  },
  description: {
    textAlign: 'left',
  },
  infoGrid: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.15)',
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});

