import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';

export function ProfileHeader({ data, compact = false }) {
  const { typography, spacing, radius, isDark } = useTheme();

  // ── Pulsing Live Dot ────────────────────────────────────────────────────
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [pulseOpacity] = useState(() => new Animated.Value(0.7));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1.5, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.2, duration: 700, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim, pulseOpacity]);

  if (!data) return null;

  const gradientColors = isDark
    ? ['#1E1B4B', '#0F172A']
    : ['#4F46E5', '#7C3AED'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          borderRadius: radius.xl,
          padding: compact ? spacing.lg : spacing.xl,
          marginBottom: spacing.lg,
        },
      ]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={`Profil ${data.nama}, NIM ${data.nim}, ${data.profesi}`}
    >
      {/* Specular shine overlay — top half glass reflection */}
      <View
        style={[
          styles.specularOverlay,
          { borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
        ]}
        pointerEvents="none"
      />

      <View style={styles.topRow}>
        {/* Profile Avatar — Dual Ring */}
        <View style={styles.avatarOuterRing}>
          <View
            style={[
              styles.avatarInnerRing,
              { borderRadius: radius.full },
            ]}
          >
            <Image
              source={require('../assets/profile.jpg')}
              style={[styles.avatar, { borderRadius: radius.full }]}
              accessible={true}
              accessibilityLabel={`Foto profil ${data.nama}`}
            />
          </View>
        </View>

        {/* Identity Details */}
        <View style={styles.details}>
          <View style={styles.nimBadge}>
            <Text style={styles.nimText}>NIM: {data.nim}</Text>
          </View>
          <Text
            style={[
              styles.nama,
              { fontSize: compact ? typography.h2.fontSize : typography.h1.fontSize },
            ]}
            numberOfLines={2}
          >
            {data.nama}
          </Text>
          <Text style={styles.profesi} numberOfLines={2}>
            {data.profesi}
          </Text>

          {/* Live Dot Badge */}
          <View style={styles.liveBadge}>
            <View style={styles.liveDotContainer}>
              {/* Pulse ring */}
              <Animated.View
                style={[
                  styles.liveDotRing,
                  { transform: [{ scale: pulseAnim }], opacity: pulseOpacity },
                ]}
              />
              {/* Solid dot */}
              <View style={styles.liveDotCore} />
            </View>
            <Text style={styles.liveText}>Aktif</Text>
          </View>
        </View>
      </View>

      {!compact && (
        <View style={styles.footerRow}>
          <Text style={styles.campusInfo}>
            {data.kampus} {data.fakultas ? `· Fak. ${data.fakultas}` : ''}
          </Text>
          {data.lokasi && <Text style={styles.locationInfo}>{data.lokasi}</Text>}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  specularOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarOuterRing: {
    padding: 3,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 999,
    marginRight: 16,
  },
  avatarInnerRing: {
    padding: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  avatar: {
    width: 72,
    height: 72,
    backgroundColor: '#3730A3',
  },
  details: {
    flex: 1,
  },
  nimBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  nimText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  nama: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  profesi: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  liveDotContainer: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  liveDotRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.5)',
  },
  liveDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveText: {
    color: '#86EFAC',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  footerRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  campusInfo: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
  locationInfo: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
});
