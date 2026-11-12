import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAsyncData } from '../../hooks/useAsyncData';
import { profileService } from '../../services/profileService';
import { scoreService } from '../../services/scoreService';
import { portfolioService } from '../../services/portfolioService';
import { Screen } from '../../components/ui/Screen';
import { Section } from '../../components/ui/Section';
import { Card } from '../../components/ui/Card';
import { StatTile } from '../../components/ui/StatTile';
import { ProfileHeader } from '../../components/ProfileHeader';
import { CvPrintCard } from '../../components/CvPrintCard';
import { ScoreSummary } from '../../components/ScoreSummary';
import { LoadingState } from '../../components/states/LoadingState';
import { ErrorState } from '../../components/states/ErrorState';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, typography, spacing, radius } = useTheme();

  const {
    data: homeData,
    loading,
    error,
    refreshing,
    reload,
    refresh,
  } = useAsyncData(async () => {
    const [profile, score, projects] = await Promise.all([
      profileService.getProfile(),
      scoreService.getScore(),
      portfolioService.getProjects(),
    ]);
    return { profile, score, projectsCount: projects?.length || 0 };
  }, []);

  if (loading && !refreshing) {
    return (
      <Screen scrollable={false}>
        <LoadingState message="Memuat profil mahasiswa..." />
      </Screen>
    );
  }

  if (error && !homeData) {
    return (
      <Screen scrollable={false}>
        <ErrorState
          title="Gagal Memuat Beranda"
          message={error}
          onRetry={reload}
        />
      </Screen>
    );
  }

  const { profile, score, projectsCount } = homeData || {};

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      {/* 1. Profile Header (NIM, Nama, Foto, Profesi) */}
      <ProfileHeader data={profile} />

      {/* 2. Short Bio / Deskripsi Singkat */}
      <Card style={styles.bioCard}>
        <Text
          style={[
            styles.bioTitle,
            { color: colors.text, fontSize: typography.h3.fontSize },
          ]}
        >
          Ringkasan Profil
        </Text>
        <Text
          style={[
            styles.bioText,
            {
              color: colors.textMuted,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
              marginTop: spacing.xs,
            },
          ]}
        >
          {profile?.deskripsi}
        </Text>

        {/* CTA Buttons */}
        <View style={[styles.ctaRow, { marginTop: spacing.md }]}>
          <TouchableOpacity
            style={[
              styles.ctaPrimary,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.md,
              },
            ]}
            onPress={() => router.push('/portfolio')}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Lihat Portofolio"
          >
            <Ionicons name="folder-open" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.ctaPrimaryText}>Lihat Portofolio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ctaSecondary,
              {
                backgroundColor: colors.surfaceMuted,
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
            onPress={() => router.push('/contact')}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Hubungi Saya"
          >
            <Ionicons name="chatbubble-ellipses" size={16} color={colors.text} style={{ marginRight: 6 }} />
            <Text style={[styles.ctaSecondaryText, { color: colors.text }]}>Hubungi Saya</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* 2b. Cetak / Unduh CV PDF Profesional */}
      <CvPrintCard />

      {/* 3. Quick Stats Grid */}
      <Section title="Sekilas Statistik" style={{ marginTop: spacing.md }}>
        <View style={styles.statsGrid}>
          <StatTile
            label="Proyek Selesai"
            value={`${projectsCount}+`}
            caption="Web & Mobile"
            icon="code-working"
            style={{ marginRight: 8 }}
          />
          <StatTile
            label="Score UTS"
            value={`${score?.currentScore?.nilai || 89}`}
            caption={`Grade ${score?.currentScore?.grade || 'A'}`}
            icon="ribbon"
            iconColor="#10B981"
            style={{ marginLeft: 8 }}
          />
        </View>
      </Section>

      {/* 4. Academic Highlights Preview */}
      <Section
        title="Capaian Akademik"
        subtitle="Mata Kuliah Pemrograman Mobile 2"
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/score')}
            style={styles.moreLink}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Buka halaman My Score lengkap"
          >
            <Text style={[styles.moreText, { color: colors.primary }]}>Buka My Score</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        }
      >
        <ScoreSummary
          score={score?.currentScore}
          learningPoints={score?.learningPoints}
          akademik={score?.akademik}
          compact={true}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bioCard: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  bioTitle: {
    fontWeight: '700',
  },
  bioText: {
    textAlign: 'left',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    minHeight: 44,
    marginRight: 8,
  },
  ctaPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  ctaSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    minHeight: 44,
    borderWidth: 1,
  },
  ctaSecondaryText: {
    fontWeight: '600',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  moreText: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 2,
  },
});

