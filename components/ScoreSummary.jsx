import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { formatLP } from '../utils/format';

export function ScoreSummary({ score, learningPoints, akademik, compact = false }) {
  const { typography, spacing, radius, isDark } = useTheme();

  const nilai = score?.nilai !== undefined ? score.nilai : 89;
  const grade = score?.grade || 'A';
  const lpTotal = learningPoints?.total !== undefined ? learningPoints.total : 12375;
  const formattedLP = formatLP(lpTotal, learningPoints?.satuan || 'LP');

  const gradientColors = isDark
    ? ['#312E81', '#1E1B4B']
    : ['#4F46E5', '#6366F1'];

  // ── Glow pulse on grade badge ───────────────────────────────────────────
  const [glowAnim] = useState(() => new Animated.Value(0.2));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.5, duration: 1000, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0.2, duration: 1000, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [glowAnim]);

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          borderRadius: radius.xl,
          padding: compact ? spacing.md : spacing.xl,
          marginHorizontal: 16,
          marginVertical: 8,
        },
      ]}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Ringkasan Nilai: Nilai ${nilai}, Grade ${grade}, Total ${formattedLP}`}
    >
      {/* Specular gloss overlay */}
      <View
        style={[
          styles.specularOverlay,
          { borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
        ]}
        pointerEvents="none"
      />

      {akademik && !compact && (
        <View style={styles.akademikHeader}>
          <Text style={styles.courseName}>{akademik.mataKuliah || 'Pemrograman Mobile 2'}</Text>
          <Text style={styles.lecturerName}>Dosen: {akademik.dosen || 'Iin, M.Kom'}</Text>
          <Text style={styles.studentInfo}>
            {akademik.nama} · NIM {akademik.nim}
          </Text>
        </View>
      )}

      <View style={styles.scoreRow}>
        {/* Main Current Score Badge */}
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreLabel}>CURRENT SCORE</Text>
          <View style={styles.scoreValueRow}>
            <Text
              style={[
                styles.nilaiBig,
                { fontSize: compact ? 36 : 48 },
              ]}
            >
              {nilai}
            </Text>
            {/* Animated glowing grade box */}
            <Animated.View
              style={[
                styles.gradeBox,
                { backgroundColor: glowAnim.interpolate({
                    inputRange: [0.2, 0.5],
                    outputRange: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.38)'],
                  }) },
              ]}
            >
              <Text style={styles.gradeText}>Grade {grade}</Text>
            </Animated.View>
          </View>
        </View>

        {/* Learning Points Box */}
        <View style={styles.lpBox}>
          <View style={styles.lpHeader}>
            <Ionicons name="sparkles" size={16} color="#FBBF24" style={{ marginRight: 4 }} />
            <Text style={styles.lpLabel}>LEARNING POINTS</Text>
          </View>
          <Text
            style={[
              styles.lpValue,
              { fontSize: compact ? typography.h2.fontSize : typography.h1.fontSize },
            ]}
          >
            {formattedLP}
          </Text>
          <Text style={styles.lpSubtitle}>Poin Capaian Belajar</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  specularOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  akademikHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingBottom: 10,
    marginBottom: 12,
  },
  courseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  lecturerName: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  studentInfo: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scoreBadge: {
    flex: 1,
    minWidth: 140,
  },
  scoreLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  scoreValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  nilaiBig: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: -1,
  },
  gradeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
    alignSelf: 'center',
  },
  gradeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  lpBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
    minWidth: 130,
  },
  lpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  lpLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lpValue: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  lpSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 2,
  },
});

