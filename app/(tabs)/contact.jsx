import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ContactForm } from '../../components/ContactForm';
import { LoadingState } from '../../components/states/LoadingState';
import { Card } from '../../components/ui/Card';
import { Screen } from '../../components/ui/Screen';
import { Section } from '../../components/ui/Section';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useContactForm } from '../../hooks/useContactForm';
import { useTheme } from '../../hooks/useTheme';
import { contactService } from '../../services/contactService';
import { profileService } from '../../services/profileService';
import { formatDateTime } from '../../utils/format';

export default function ContactScreen() {
  const { colors, typography, spacing } = useTheme();
  const [messagesHistory, setMessagesHistory] = useState([]);

  // Fetch profile for contact links
  const { data: profile, loading: profileLoading } = useAsyncData(async () => {
    return profileService.getProfile();
  }, []);

  // Fetch local messages history
  const loadHistory = async () => {
    const history = await contactService.getMessageHistory();
    setMessagesHistory(history || []);
  };

  useEffect(() => {
    let active = true;
    contactService.getMessageHistory().then((history) => {
      if (active) {
        setMessagesHistory(history || []);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    feedbackMessage,
    handleChange,
    handleSubmit,
    handleReset,
  } = useContactForm(() => {
    // Callback on successful submit: reload message history
    loadHistory();
  });

  const handleClearHistory = async () => {
    await contactService.clearHistory();
    setMessagesHistory([]);
  };

  const handleOpenLink = async (url) => {
    if (!url) return;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Tautan', `Tidak dapat membuka: ${url}`);
      }
    } catch {
      Alert.alert('Tautan', `Gagal membuka URL: ${url}`);
    }
  };

  if (profileLoading && !profile) {
    return (
      <Screen scrollable={false}>
        <LoadingState message="Memuat informasi kontak..." />
      </Screen>
    );
  }

  const { kontak } = profile || {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Screen>
        {/* Header Intro */}
        <View style={styles.introHeader}>
          <Text
            style={[
              styles.introTitle,
              { color: colors.text, fontSize: typography.h2.fontSize },
            ]}
          >
            Mari Terhubung
          </Text>
          <Text
            style={[
              styles.introSubtitle,
              { color: colors.textMuted, fontSize: typography.caption.fontSize },
            ]}
          >
            Silakan kirim pesan, kritik, saran, atau peluang kolaborasi melalui formulir berikut.
          </Text>
        </View>

        {/* 1. Contact Form */}
        <ContactForm
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
          feedbackMessage={feedbackMessage}
          onChangeField={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />

        {/* 2. Direct Social / Contact Links */}
        <Section
          title="Tautan Langsung"
          subtitle="Hubungi via kanal resmi mahasiswa"
          style={{ marginTop: spacing.md }}
        >
          <Card style={styles.linksCard}>
            {kontak?.email && (
              <TouchableOpacity
                style={styles.linkItem}
                onPress={() => handleOpenLink(`mailto:${kontak.email}`)}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel={`Kirim email ke ${kontak.email}`}
              >
                <View style={[styles.linkIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="mail" size={18} color={colors.primary} />
                </View>
                <View style={styles.linkTextCol}>
                  <Text style={[styles.linkLabel, { color: colors.textMuted }]}>Email Resmi</Text>
                  <Text style={[styles.linkValue, { color: colors.text }]}>{kontak.email}</Text>
                </View>
                <Ionicons name="open-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}

            {kontak?.whatsapp && (
              <TouchableOpacity
                style={styles.linkItem}
                onPress={() => handleOpenLink(`https://wa.me/${kontak.whatsapp.replace(/[^0-9]/g, '')}`)}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="Hubungi WhatsApp"
              >
                <View style={[styles.linkIcon, { backgroundColor: colors.successBg }]}>
                  <Ionicons name="logo-whatsapp" size={18} color={colors.success} />
                </View>
                <View style={styles.linkTextCol}>
                  <Text style={[styles.linkLabel, { color: colors.textMuted }]}>WhatsApp</Text>
                  <Text style={[styles.linkValue, { color: colors.text }]}>{kontak.whatsapp}</Text>
                </View>
                <Ionicons name="open-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}

            {kontak?.github && (
              <TouchableOpacity
                style={[styles.linkItem, !kontak?.instagram && { borderBottomWidth: 0 }]}
                onPress={() => handleOpenLink(kontak.github)}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="Buka Profil GitHub"
              >
                <View style={[styles.linkIcon, { backgroundColor: colors.surfaceMuted }]}>
                  <Ionicons name="logo-github" size={18} color={colors.text} />
                </View>
                <View style={styles.linkTextCol}>
                  <Text style={[styles.linkLabel, { color: colors.textMuted }]}>GitHub</Text>
                  <Text style={[styles.linkValue, { color: colors.text }]}>{kontak.github}</Text>
                </View>
                <Ionicons name="open-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}

            {kontak?.instagram && (
              <TouchableOpacity
                style={[styles.linkItem, { borderBottomWidth: 0 }]}
                onPress={() => handleOpenLink(kontak.instagram)}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="Buka Profil Instagram"
              >
                <View style={[styles.linkIcon, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name="logo-instagram" size={18} color={colors.accent} />
                </View>
                <View style={styles.linkTextCol}>
                  <Text style={[styles.linkLabel, { color: colors.textMuted }]}>Instagram</Text>
                  <Text style={[styles.linkValue, { color: colors.text }]}>
                    {kontak.instagram.includes('instagram.com/')
                      ? `@${kontak.instagram.split('instagram.com/')[1].replace(/\/$/, '')}`
                      : kontak.instagram}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </Card>
        </Section>

        {/* 3. Local Message History (AsyncStorage FR-47) */}
        <Section
          title="Riwayat Pesan Lokal"
          subtitle="Pesan yang telah dikirim tersimpan di AsyncStorage"
          style={{ marginTop: spacing.md }}
          rightAction={
            messagesHistory.length > 0 ? (
              <TouchableOpacity
                onPress={handleClearHistory}
                style={styles.clearHistoryButton}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Hapus riwayat pesan lokal"
              >
                <Ionicons name="trash-outline" size={14} color={colors.danger} style={{ marginRight: 4 }} />
                <Text style={[styles.clearHistoryText, { color: colors.danger }]}>Hapus Riwayat</Text>
              </TouchableOpacity>
            ) : null
          }
        >
          {messagesHistory.length === 0 ? (
            <Card style={styles.emptyHistoryCard}>
              <Ionicons name="chatbubbles-outline" size={28} color={colors.textMuted} style={{ marginBottom: 6 }} />
              <Text style={[styles.emptyHistoryText, { color: colors.textMuted }]}>
                Belum ada pesan yang tersimpan di riwayat perangkat ini.
              </Text>
            </Card>
          ) : (
            messagesHistory.map((item) => (
              <Card key={item.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={[styles.historyNama, { color: colors.text }]}>{item.nama}</Text>
                  <Text style={[styles.historyTime, { color: colors.textMuted }]}>
                    {formatDateTime(item.waktu)}
                  </Text>
                </View>
                <Text style={[styles.historyEmail, { color: colors.primary }]}>{item.email}</Text>
                <Text style={[styles.historyPesan, { color: colors.textMuted }]}>{item.pesan}</Text>
              </Card>
            ))
          )}
        </Section>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  introHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  introTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  introSubtitle: {
    lineHeight: 18,
    marginTop: 4,
  },
  linksCard: {
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.12)',
    minHeight: 48,
  },
  linkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkTextCol: {
    flex: 1,
  },
  linkLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  linkValue: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
  clearHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  clearHistoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyHistoryCard: {
    marginHorizontal: 16,
    marginVertical: 4,
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyHistoryText: {
    fontSize: 13,
    textAlign: 'center',
  },
  historyCard: {
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  historyNama: {
    fontWeight: '700',
    fontSize: 14,
  },
  historyTime: {
    fontSize: 11,
  },
  historyEmail: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  historyPesan: {
    fontSize: 13,
    lineHeight: 18,
  },
});
