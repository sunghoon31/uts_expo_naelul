import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { Card } from './ui/Card';
import { Chip } from './ui/Chip';

export function ProjectCard({ project }) {
  const router = useRouter();
  const { colors, typography, spacing } = useTheme();

  if (!project) return null;

  const handlePress = () => {
    router.push({
      pathname: '/project/[id]',
      params: { id: project.id },
    });
  };

  return (
    <Card
      style={styles.card}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Lihat detail proyek: ${project.judul}`}
      accessibilityHint="Ketuk untuk membuka halaman detail proyek ini"
    >
      <View style={styles.topRow}>
        <Chip
          label={project.kategori || 'Proyek'}
          selected={false}
          style={styles.categoryChip}
        />
        {project.tahun && (
          <Text style={[styles.year, { color: colors.textMuted }]}>
            {project.tahun}
          </Text>
        )}
      </View>

      <Text
        style={[
          styles.title,
          {
            color: colors.text,
            fontSize: typography.h3.fontSize,
            marginVertical: spacing.xs,
          },
        ]}
        numberOfLines={2}
      >
        {project.judul}
      </Text>

      <Text
        style={[
          styles.summary,
          {
            color: colors.textMuted,
            fontSize: typography.caption.fontSize,
            lineHeight: typography.caption.lineHeight,
            marginBottom: spacing.md,
          },
        ]}
        numberOfLines={2}
      >
        {project.ringkasan}
      </Text>

      <View style={styles.bottomRow}>
        <View style={styles.techWrapper}>
          {Array.isArray(project.teknologi) &&
            project.teknologi.slice(0, 3).map((tech, idx) => (
              <View
                key={`${project.id}-tech-${idx}`}
                style={[
                  styles.techBadge,
                  {
                    backgroundColor: colors.surfaceMuted,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.techText,
                    { color: colors.textMuted, fontSize: typography.small.fontSize },
                  ]}
                >
                  {tech}
                </Text>
              </View>
            ))}
          {Array.isArray(project.teknologi) && project.teknologi.length > 3 && (
            <Text style={[styles.moreTech, { color: colors.textMuted }]}>
              +{project.teknologi.length - 3}
            </Text>
          )}
        </View>

        <View style={styles.detailLink}>
          <Text
            style={[
              styles.detailText,
              { color: colors.primary, fontSize: typography.captionBold.fontSize },
            ]}
          >
            Detail
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.primary}
            style={{ marginLeft: 2 }}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryChip: {
    marginVertical: 0,
    minHeight: 26,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  year: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontWeight: '700',
  },
  summary: {
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.1)',
    paddingTop: 10,
    marginTop: 2,
  },
  techWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  techBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 6,
    marginVertical: 2,
  },
  techText: {
    fontWeight: '500',
  },
  moreTech: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  detailText: {
    fontWeight: '600',
  },
});

