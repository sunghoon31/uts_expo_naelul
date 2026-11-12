import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAsyncData } from '../../hooks/useAsyncData';
import { scoreService } from '../../services/scoreService';
import { Screen } from '../../components/ui/Screen';
import { Section } from '../../components/ui/Section';
import { Card } from '../../components/ui/Card';
import { ScoreSummary } from '../../components/ScoreSummary';
import { ProgressCard } from '../../components/ProgressCard';
import { StatTile } from '../../components/ui/StatTile';
import { LoadingState } from '../../components/states/LoadingState';
import { ErrorState } from '../../components/states/ErrorState';

export default function ScoreScreen() {
  const { colors, typography, spacing, radius } = useTheme();

  const {
    data: scoreData,
    loading,
    error,
    refreshing,
    reload,
    refresh,
  } = useAsyncData(async () => {
    return scoreService.getScore();
  }, []);

  if (loading && !refreshing) {
    return (
      <Screen scrollable={false}>
        <LoadingState message="Memuat rekap capaian akademik..." />
      </Screen>
    );
  }

  if (error && !scoreData) {
    return (
      <Screen scrollable={false}>
        <ErrorState
          title="Gagal Memuat Nilai"
          message={error}
          onRetry={reload}
        />
      </Screen>
    );
  }

  const { akademik, currentScore, learningPoints, learningProgress, catatan } =
    scoreData || {};

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      {/* 1. Score Summary Highlight (Nilai 89, Grade A, 12.375 LP) */}
      <ScoreSummary
        score={currentScore}
        learningPoints={learningPoints}
        akademik={akademik}
      />

      {/* 2. Academic Identity Card */}
      <Card style={styles.akademikCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="school" size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text
            style={[
              styles.cardTitle,
              { color: colors.text, fontSize: typography.h3.fontSize },
            ]}
          >
            Informasi Ujian Akademik
          </Text>
        </View>

        <View style={[styles.detailTable, { marginTop: spacing.sm }]}>
          <View style={styles.tableRow}>
            <Text style={[styles.colLabel, { color: colors.textMuted }]}>Nama Mahasiswa</Text>
            <Text style={[styles.colValue, { color: colors.text }]}>{akademik?.nama}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.colLabel, { color: colors.textMuted }]}>NIM</Text>
            <Text style={[styles.colValue, { color: colors.text }]}>{akademik?.nim}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.colLabel, { color: colors.textMuted }]}>Mata Kuliah</Text>
            <Text style={[styles.colValue, { color: colors.text }]}>{akademik?.mataKuliah}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.colLabel, { color: colors.textMuted }]}>Dosen Pengampu</Text>
            <Text style={[styles.colValue, { color: colors.text }]}>{akademik?.dosen}</Text>
          </View>
        </View>
      </Card>

      {/* 3. Learning Progress Indicators (Attendance, Practice, Quest, Challenge) */}
      <Section
        title="Progres Pembelajaran"
        subtitle="Rincian indikator penilaian aktivitas perkuliahan"
        style={{ marginTop: spacing.md }}
      >
        {Array.isArray(learningProgress) &&
          learningProgress.map((item) => (
            <ProgressCard
              key={item.id}
              label={item.label}
              persen={item.persen}
              color={item.persen >= 90 ? colors.success : colors.primary}
            />
          ))}
      </Section>

      {/* 4. Stat Summary Row */}
      <Section title="Distribusi Capaian" style={{ marginTop: spacing.sm }}>
        <View style={styles.statsRow}>
          <StatTile
            label="Rata-rata Progres"
            value="95.5%"
            caption="4 Kriteria"
            icon="trending-up"
            iconColor="#10B981"
            style={{ marginRight: 8 }}
          />
          <StatTile
            label="Status Kelulusan"
            value="Lulus (A)"
            caption="Tingkat Industri"
            icon="checkmark-done-circle"
            iconColor={colors.primary}
            style={{ marginLeft: 8 }}
          />
        </View>
      </Section>

      {/* 5. Disclaimer / Dummy Note (NFR-09) */}
      <View
        style={[
          styles.disclaimerBox,
          {
            backgroundColor: colors.surfaceMuted,
            borderColor: colors.border,
            borderRadius: radius.md,
          },
        ]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Catatan: ${catatan || 'Data dummy untuk UTS'}`}
      >
        <Ionicons
          name="information-circle-outline"
          size={18}
          color={colors.textMuted}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
          * {catatan || 'Data dummy untuk UTS (Target Level 10 Industry)'}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  akademikCard: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
    paddingBottom: 8,
  },
  cardTitle: {
    fontWeight: '700',
  },
  detailTable: {
    paddingVertical: 2,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  colLabel: {
    fontSize: 13,
  },
  colValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
  },
  disclaimerText: {
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
  },
});

