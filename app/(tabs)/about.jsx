import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAsyncData } from '../../hooks/useAsyncData';
import { profileService } from '../../services/profileService';
import { Screen } from '../../components/ui/Screen';
import { Section } from '../../components/ui/Section';
import { Chip } from '../../components/ui/Chip';
import { AboutSection } from '../../components/AboutSection';
import { TimelineItem } from '../../components/TimelineItem';
import { HobbyCard } from '../../components/HobbyCard';
import { LoadingState } from '../../components/states/LoadingState';
import { ErrorState } from '../../components/states/ErrorState';

export default function AboutScreen() {
  const { spacing } = useTheme();
  const [timelineFilter, setTimelineFilter] = useState('Semua');

  const {
    data,
    loading,
    error,
    refreshing,
    reload,
    refresh,
  } = useAsyncData(async () => {
    const [profile, experience, hobbies] = await Promise.all([
      profileService.getProfile(),
      profileService.getExperience(),
      profileService.getHobbies(),
    ]);
    return { profile, experience, hobbies };
  }, []);

  const experienceList = data?.experience;

  const filteredExperience = useMemo(() => {
    if (!experienceList) return [];
    if (timelineFilter === 'Semua') return experienceList;
    return experienceList.filter(
      (item) => item.jenis?.toLowerCase() === timelineFilter.toLowerCase()
    );
  }, [experienceList, timelineFilter]);

  if (loading && !refreshing) {
    return (
      <Screen scrollable={false}>
        <LoadingState message="Memuat profil & pengalaman..." />
      </Screen>
    );
  }

  if (error && !data) {
    return (
      <Screen scrollable={false}>
        <ErrorState
          title="Gagal Memuat Informasi"
          message={error}
          onRetry={reload}
        />
      </Screen>
    );
  }

  const { profile, hobbies } = data || {};

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      {/* 1. Profil & Bio Singkat */}
      <AboutSection profile={profile} />

      {/* 2. Experience Timeline (Pendidikan & Organisasi) */}
      <Section
        title="Pengalaman & Riwayat"
        subtitle="Jejak pendidikan akademik dan keaktifan organisasi"
        style={{ marginTop: spacing.md }}
      >
        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {['Semua', 'Pendidikan', 'Organisasi'].map((filter) => (
            <Chip
              key={filter}
              label={filter}
              selected={timelineFilter === filter}
              onPress={() => setTimelineFilter(filter)}
            />
          ))}
        </View>

        {/* Timeline Items */}
        <View style={styles.timelineList}>
          {filteredExperience.map((item, idx) => (
            <TimelineItem
              key={item.id || `timeline-${idx}`}
              item={item}
              isLast={idx === filteredExperience.length - 1}
            />
          ))}
        </View>
      </Section>

      {/* 3. Hobby Section */}
      <Section
        title="Minat & Hobi"
        subtitle="Aktivitas di luar perkuliahan dan eksplorasi minat"
        style={{ marginTop: spacing.md }}
      >
        <View style={styles.hobbiesContainer}>
          {Array.isArray(hobbies) &&
            hobbies.map((hobby) => (
              <HobbyCard key={hobby.id} item={hobby} />
            ))}
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  timelineList: {
    marginTop: 4,
  },
  hobbiesContainer: {
    paddingHorizontal: 0,
  },
});
