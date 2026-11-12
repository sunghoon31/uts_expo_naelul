import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { cvPdfService } from '../services/cvPdfService';

export function CvPrintCard({ style }) {
  const { colors, typography, spacing, radius, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null); // 'export' | 'print'

  const handleExportPdf = async () => {
    try {
      setLoading(true);
      setActionType('export');
      await cvPdfService.exportPdf();
    } catch (err) {
      Alert.alert(
        'Gagal Mengekspor CV',
        err?.message || 'Terjadi kesalahan saat memproses dokumen PDF. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const handlePrintDirect = async () => {
    try {
      setLoading(true);
      setActionType('print');
      await cvPdfService.printDirectly();
    } catch (err) {
      Alert.alert(
        'Gagal Mencetak CV',
        err?.message || 'Terjadi kesalahan saat membuka dialog pencetakan.'
      );
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1E1B4B' : '#EEF2FF',
          borderColor: isDark ? '#312E81' : '#C7D2FE',
          borderRadius: radius.xl,
          padding: spacing.lg,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel="Kartu Ekspor dan Cetak CV Profesional"
    >
      {/* Top Banner Tag */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isDark ? '#3730A3' : '#4F46E5' },
          ]}
        >
          <Ionicons name="document-text" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>FORMAT A4 RESMI</Text>
        </View>

        <View style={styles.featurePills}>
          <Text style={[styles.pillText, { color: isDark ? '#A5B4FC' : '#4338CA' }]}>
            • Berfoto Profil
          </Text>
          <Text style={[styles.pillText, { color: isDark ? '#A5B4FC' : '#4338CA' }]}>
            • 2-Kolom Modern
          </Text>
        </View>
      </View>

      {/* Main Title & Description */}
      <View style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>
        <Text
          style={[
            styles.title,
            { color: isDark ? '#FFFFFF' : '#1E1B4B', fontSize: typography.h3.fontSize },
          ]}
        >
          Cetak CV Profesional (PDF)
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: isDark ? '#C7D2FE' : '#4B5563',
              fontSize: typography.caption.fontSize,
              lineHeight: 18,
            },
          ]}
        >
          Mencetak seluruh portofolio proyek, keahlian teknis ber-indikator progress,
          pengalaman organisasi, riwayat pendidikan, dan nilai akademik ke dalam CV elegan.
        </Text>
      </View>

      {/* Feature Highlights Grid */}
      <View
        style={[
          styles.highlightsRow,
          {
            backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#FFFFFF',
            borderRadius: radius.md,
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
            borderColor: isDark ? '#3730A3' : '#E0E7FF',
          },
        ]}
      >
        <View style={styles.highlightItem}>
          <Ionicons name="school" size={14} color="#10B981" />
          <Text style={[styles.highlightText, { color: colors.text }]}>Score 89 (A)</Text>
        </View>
        <View style={styles.highlightDivider} />
        <View style={styles.highlightItem}>
          <Ionicons name="briefcase" size={14} color="#6366F1" />
          <Text style={[styles.highlightText, { color: colors.text }]}>7 Portofolio</Text>
        </View>
        <View style={styles.highlightDivider} />
        <View style={styles.highlightItem}>
          <Ionicons name="trophy" size={14} color="#F59E0B" />
          <Text style={[styles.highlightText, { color: colors.text }]}>3 Prestasi</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionRow, { marginTop: spacing.md }]}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.md,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          onPress={handleExportPdf}
          disabled={loading}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Cetak dan Ekspor PDF CV"
        >
          {loading && actionType === 'export' ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name={Platform.OS === 'web' ? 'open-outline' : 'share-social-outline'}
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.primaryButtonText}>
                {Platform.OS === 'web' ? 'Buka & Unduh PDF CV' : 'Unduh / Bagikan PDF'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            {
              backgroundColor: isDark ? '#2E1065' : '#FFFFFF',
              borderColor: isDark ? '#4C1D95' : '#C7D2FE',
              borderRadius: radius.md,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          onPress={handlePrintDirect}
          disabled={loading}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Cetak Cepat CV A4"
        >
          {loading && actionType === 'print' ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Ionicons name="print-outline" size={18} color={isDark ? '#E0E7FF' : colors.primary} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1.5,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featurePills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 3,
  },
  highlightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 5,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '700',
  },
  highlightDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CBD5E1',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButton: {
    width: 48,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
