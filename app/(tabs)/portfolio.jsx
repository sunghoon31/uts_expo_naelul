import React from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAsyncData } from '../../hooks/useAsyncData';
import { usePortfolioFilter } from '../../hooks/usePortfolioFilter';
import { portfolioService } from '../../services/portfolioService';
import { Screen } from '../../components/ui/Screen';
import { SearchBar } from '../../components/ui/SearchBar';
import { Chip } from '../../components/ui/Chip';
import { ProjectCard } from '../../components/ProjectCard';
import { EmptyState } from '../../components/states/EmptyState';
import { LoadingState } from '../../components/states/LoadingState';
import { ErrorState } from '../../components/states/ErrorState';

export default function PortfolioScreen() {
  const { colors, typography, spacing } = useTheme();

  const {
    data: rawProjects,
    loading,
    error,
    refreshing,
    reload,
    refresh,
  } = useAsyncData(async () => {
    return portfolioService.getProjects();
  }, []);

  const {
    keyword,
    setKeyword,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredProjects,
  } = usePortfolioFilter(rawProjects || []);

  if (loading && !refreshing) {
    return (
      <Screen scrollable={false}>
        <LoadingState message="Memuat galeri portofolio..." />
      </Screen>
    );
  }

  if (error && !rawProjects) {
    return (
      <Screen scrollable={false}>
        <ErrorState
          title="Gagal Memuat Portofolio"
          message={error}
          onRetry={reload}
        />
      </Screen>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text
        style={[
          styles.headerTitle,
          { color: colors.text, fontSize: typography.h2.fontSize },
        ]}
      >
        Portofolio Proyek
      </Text>
      <Text
        style={[
          styles.headerSubtitle,
          { color: colors.textMuted, fontSize: typography.caption.fontSize },
        ]}
      >
        Karya analisis sistem informasi, aplikasi web, dan mobile yang pernah dikembangkan.
      </Text>

      {/* Search Input */}
      <SearchBar
        value={keyword}
        onChangeText={setKeyword}
        onClear={() => setKeyword('')}
        placeholder="Cari nama proyek atau teknologi..."
        style={{ marginTop: spacing.sm }}
      />

      {/* Filter Category Chips (Horizontal Scroll) */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* Results Counter */}
      <View style={styles.metaRow}>
        <Text style={[styles.counterText, { color: colors.textMuted }]}>
          Menampilkan {filteredProjects.length} dari {rawProjects?.length || 0} proyek
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <EmptyState
      icon="search-outline"
      title="Tidak Ada Proyek yang Cocok"
      message={`Tidak ditemukan proyek dengan kata kunci "${keyword}" atau kategori "${selectedCategory}". Coba ubah pencarian Anda.`}
      actionLabel="Reset Pencarian"
      onAction={() => {
        setKeyword('');
        setSelectedCategory('Semua');
      }}
    />
  );

  return (
    <Screen scrollable={false}>
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProjectCard project={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 32,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    lineHeight: 18,
    marginTop: 4,
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

