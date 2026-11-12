import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAsyncData } from '../../hooks/useAsyncData';
import { portfolioService } from '../../services/portfolioService';
import { Screen } from '../../components/ui/Screen';
import { Section } from '../../components/ui/Section';
import { Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { LoadingState } from '../../components/states/LoadingState';
import { ErrorState } from '../../components/states/ErrorState';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, typography, spacing, radius } = useTheme();

  const {
    data: project,
    loading,
    error,
    refreshing,
    reload,
    refresh,
  } = useAsyncData(async () => {
    if (!id) throw new Error('ID proyek tidak valid.');
    return portfolioService.getProjectById(id);
  }, [id]);

  const handleOpenLink = async (url) => {
    if (!url) return;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Tautan', `Tidak dapat membuka tautan: ${url}`);
      }
    } catch {
      Alert.alert('Tautan', `Gagal membuka tautan proyek: ${url}`);
    }
  };

  if (loading && !refreshing) {
    return (
      <Screen scrollable={false}>
        <LoadingState message="Memuat detail proyek..." />
      </Screen>
    );
  }

  if (error || !project) {
    return (
      <Screen scrollable={false}>
        <View style={styles.topBackHeader}>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
            ]}
            onPress={() => router.back()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Kembali ke galeri portofolio"
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ErrorState
          title="Proyek Tidak Ditemukan"
          message={error || `Proyek dengan ID "${id}" tidak terdaftar dalam basis data.`}
          onRetry={reload}
        />
      </Screen>
    );
  }

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      {/* Top Navigation Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
          ]}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke daftar proyek"
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: colors.text, fontSize: typography.h3.fontSize },
          ]}
          numberOfLines={1}
        >
          Detail Proyek
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Main Info Card */}
      <Card style={styles.mainCard}>
        <View style={styles.badgeRow}>
          <Chip label={project.kategori || 'Proyek'} selected={true} />
          {project.tahun && (
            <View
              style={[
                styles.yearBadge,
                { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
              ]}
            >
              <Ionicons name="calendar-outline" size={13} color={colors.textMuted} style={{ marginRight: 4 }} />
              <Text style={[styles.yearText, { color: colors.textMuted }]}>{project.tahun}</Text>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.projectTitle,
            { color: colors.text, fontSize: typography.h2.fontSize, marginVertical: spacing.sm },
          ]}
        >
          {project.judul}
        </Text>

        {project.peran && (
          <View style={[styles.roleBox, { backgroundColor: colors.primaryLight, borderRadius: radius.sm }]}>
            <Text style={[styles.roleText, { color: colors.primary }]}>
              Peran: {project.peran}
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.summaryText,
            {
              color: colors.textMuted,
              fontSize: typography.body.fontSize,
              lineHeight: typography.body.lineHeight,
              marginTop: spacing.md,
            },
          ]}
        >
          {project.ringkasan}
        </Text>
      </Card>

      {/* Full Description */}
      {project.deskripsi && (
        <Section title="Latar Belakang & Deskripsi" style={{ marginTop: spacing.md }}>
          <Card>
            <Text
              style={[
                styles.descText,
                {
                  color: colors.text,
                  fontSize: typography.body.fontSize,
                  lineHeight: typography.body.lineHeight,
                },
              ]}
            >
              {project.deskripsi}
            </Text>
          </Card>
        </Section>
      )}

      {/* Key Features List */}
      {Array.isArray(project.fitur) && project.fitur.length > 0 && (
        <Section title="Fitur Utama Sistem" style={{ marginTop: spacing.md }}>
          <Card>
            {project.fitur.map((fitur, idx) => (
              <View key={`fitur-${idx}`} style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.success}
                  style={{ marginRight: 10, marginTop: 2 }}
                />
                <Text
                  style={[
                    styles.featureText,
                    { color: colors.text, fontSize: typography.body.fontSize },
                  ]}
                >
                  {fitur}
                </Text>
              </View>
            ))}
          </Card>
        </Section>
      )}

      {/* Technologies Used */}
      {Array.isArray(project.teknologi) && project.teknologi.length > 0 && (
        <Section title="Teknologi yang Digunakan" style={{ marginTop: spacing.md }}>
          <View style={styles.techChipsContainer}>
            {project.teknologi.map((tech, idx) => (
              <Chip key={`tech-${idx}`} label={tech} selected={false} />
            ))}
          </View>
        </Section>
      )}

      {/* External Repository / Demo Link Button */}
      {project.link ? (
        <View style={styles.linkButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.openButton,
              { backgroundColor: colors.primary, borderRadius: radius.md },
            ]}
            onPress={() => handleOpenLink(project.link)}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel={`Buka tautan repository atau demo untuk ${project.judul}`}
          >
            <Ionicons name="logo-github" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.openButtonText}>Lihat Kode di GitHub</Text>
            <Ionicons name="open-outline" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topBackHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: '700',
  },
  mainCard: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  yearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    marginLeft: 8,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '600',
  },
  projectTitle: {
    fontWeight: '700',
    lineHeight: 28,
  },
  roleBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  summaryText: {
    lineHeight: 21,
  },
  descText: {
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  featureText: {
    flex: 1,
    lineHeight: 20,
  },
  techChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  linkButtonWrapper: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    minHeight: 44,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

