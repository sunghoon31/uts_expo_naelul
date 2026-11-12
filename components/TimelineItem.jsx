import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export function TimelineItem({ item, isLast = false }) {
  const { colors, typography, spacing, radius } = useTheme();

  if (!item) return null;

  const isEducation = item.jenis === 'pendidikan';
  const isAchievement = item.jenis === 'prestasi';

  return (
    <View style={styles.container}>
      {/* Left indicator column with line */}
      <View style={styles.leftCol}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: isEducation
                ? colors.primary
                : isAchievement
                ? '#EAB308'
                : colors.accent,
              borderColor: colors.surface,
            },
          ]}
        >
          <Ionicons
            name={isEducation ? 'school' : isAchievement ? 'trophy' : 'people'}
            size={12}
            color="#FFFFFF"
          />
        </View>
        {!isLast && (
          <View
            style={[
              styles.line,
              { backgroundColor: colors.border },
            ]}
          />
        )}
      </View>

      {/* Right content card */}
      <View
        style={[
          styles.contentBox,
          {
            backgroundColor: colors.surface,
            borderColor: colors.cardBorder,
            borderRadius: radius.md,
            padding: spacing.md,
            marginBottom: isLast ? 0 : spacing.md,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View
            style={[
              styles.tag,
              {
                backgroundColor: isEducation
                  ? colors.primaryLight
                  : isAchievement
                  ? 'rgba(234, 179, 8, 0.15)'
                  : colors.accentLight,
              },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                {
                  color: isEducation
                    ? colors.primary
                    : isAchievement
                    ? '#CA8A04'
                    : colors.accent,
                  fontSize: typography.small.fontSize,
                },
              ]}
            >
              {isEducation ? 'Pendidikan' : isAchievement ? 'Prestasi' : 'Organisasi'}
            </Text>
          </View>
          <Text
            style={[
              styles.period,
              { color: colors.textMuted, fontSize: typography.caption.fontSize },
            ]}
          >
            {item.periode}
          </Text>
        </View>

        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: typography.h3.fontSize },
          ]}
        >
          {item.judul}
        </Text>

        <Text
          style={[
            styles.institution,
            { color: colors.primary, fontSize: typography.captionBold.fontSize },
          ]}
        >
          {item.instansi}
        </Text>

        <Text
          style={[
            styles.desc,
            {
              color: colors.textMuted,
              fontSize: typography.caption.fontSize,
              lineHeight: typography.caption.lineHeight,
              marginTop: spacing.xs,
            },
          ]}
        >
          {item.deskripsi}
        </Text>

        {item.keterangan && (
          <View
            style={[
              styles.extraBox,
              {
                backgroundColor: colors.surfaceMuted,
                borderRadius: radius.sm,
                marginTop: spacing.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.extraText,
                { color: colors.text, fontSize: typography.small.fontSize },
              ]}
            >
              💡 {item.keterangan}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  leftCol: {
    alignItems: 'center',
    width: 32,
    marginRight: 10,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -2,
  },
  contentBox: {
    flex: 1,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  period: {
    fontWeight: '500',
  },
  title: {
    fontWeight: '700',
    marginTop: 2,
  },
  institution: {
    fontWeight: '600',
    marginTop: 2,
  },
  desc: {
    textAlign: 'left',
  },
  extraBox: {
    padding: 8,
  },
  extraText: {
    lineHeight: 16,
  },
});

