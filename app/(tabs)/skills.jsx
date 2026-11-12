import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAsyncData } from '../../hooks/useAsyncData';
import { profileService } from '../../services/profileService';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { SkillItem } from '../../components/SkillItem';
import { LoadingState } from '../../components/states/LoadingState';
import { ErrorState } from '../../components/states/ErrorState';

export default function SkillsScreen() {
  const { colors, typography, spacing, radius } = useTheme();
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const {
    data: skillsCategories,
    loading,
    error,
    refreshing,
    reload,
    refresh,
  } = useAsyncData(async () => {
    return profileService.getSkills();
  }, []);

  const toggleCategory = (kategori) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [kategori]: !prev[kategori],
    }));
  };

  if (loading && !refreshing) {
    return (
      <Screen scrollable={false}>
        <LoadingState message="Memuat daftar keahlian..." />
      </Screen>
    );
  }

  if (error && !skillsCategories) {
    return (
      <Screen scrollable={false}>
        <ErrorState
          title="Gagal Memuat Keahlian"
          message={error}
          onRetry={reload}
        />
      </Screen>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Text
        style={[
          styles.headerTitle,
          { color: colors.text, fontSize: typography.h2.fontSize },
        ]}
      >
        Keahlian & Kemampuan Teknis
      </Text>
      <Text
        style={[
          styles.headerSubtitle,
          { color: colors.textMuted, fontSize: typography.caption.fontSize },
        ]}
      >
        Daftar kompetensi analisis, pemrograman mobile, dan penunjang rekayasa perangkat lunak.
      </Text>
    </View>
  );

  const renderCategoryItem = ({ item }) => {
    const isCollapsed = Boolean(collapsedCategories[item.kategori]);
    const avgScore =
      item.items?.length > 0
        ? Math.round(
            item.items.reduce((acc, curr) => acc + (curr.level || 0), 0) /
              item.items.length
          )
        : 0;

    return (
      <Card style={styles.categoryCard}>
        {/* Category Header */}
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => toggleCategory(item.kategori)}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Kategori ${item.kategori}, ${item.items?.length} keahlian, rata-rata ${avgScore}%. ${isCollapsed ? 'Ketuk untuk membuka' : 'Ketuk untuk melipat'}`}
        >
          <View style={styles.categoryTitleGroup}>
            <Text
              style={[
                styles.categoryName,
                { color: colors.text, fontSize: typography.h3.fontSize },
              ]}
            >
              {item.kategori}
            </Text>
            <Text
              style={[
                styles.categoryMeta,
                { color: colors.textMuted, fontSize: typography.small.fontSize },
              ]}
            >
              {item.items?.length || 0} Keahlian · Rata-rata {avgScore}%
            </Text>
          </View>

          <View
            style={[
              styles.collapseIcon,
              {
                backgroundColor: colors.surfaceMuted,
                borderRadius: radius.full,
              },
            ]}
          >
            <Ionicons
              name={isCollapsed ? 'chevron-down' : 'chevron-up'}
              size={18}
              color={colors.primary}
            />
          </View>
        </TouchableOpacity>

        {/* Skill Items List */}
        {!isCollapsed && (
          <View style={[styles.skillsList, { marginTop: spacing.sm }]}>
            {item.items?.map((skill) => (
              <SkillItem key={skill.id} item={skill} />
            ))}
          </View>
        )}
      </Card>
    );
  };

  return (
    <Screen scrollable={false}>
      <FlatList
        data={skillsCategories || []}
        keyExtractor={(item, index) => item.kategori || `cat-${index}`}
        renderItem={renderCategoryItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    lineHeight: 18,
    marginTop: 4,
  },
  categoryCard: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    minHeight: 44,
  },
  categoryTitleGroup: {
    flex: 1,
  },
  categoryName: {
    fontWeight: '700',
  },
  categoryMeta: {
    marginTop: 2,
    fontWeight: '500',
  },
  collapseIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  skillsList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.12)',
    paddingTop: 8,
  },
});

