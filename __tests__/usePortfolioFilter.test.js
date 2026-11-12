import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook } from '@testing-library/react-native';
import { usePortfolioFilter } from '../hooks/usePortfolioFilter';

const mockProjects = [
  {
    id: 'p1',
    judul: 'Aplikasi Penjualan Calliandra',
    ringkasan: 'Sistem POS dan inventori toko',
    kategori: 'Web',
    teknologi: ['React', 'Node.js'],
  },
  {
    id: 'p2',
    judul: 'Layanan Surat Online Desa Cileunyi',
    ringkasan: 'Platform administrasi surat warga',
    kategori: 'Sistem Informasi',
    teknologi: ['PHP', 'Laravel'],
  },
  {
    id: 'p3',
    judul: 'Personal CV Mobile App',
    ringkasan: 'Aplikasi profil portofolio mahasiswa',
    kategori: 'Mobile',
    teknologi: ['React Native', 'Expo'],
  },
];

describe('usePortfolioFilter hook (T-08 & FR-28)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('mengekstraksi kategori unik dengan "Semua" di awal', async () => {
    const { result } = await renderHook(() => usePortfolioFilter(mockProjects));
    expect(result.current.categories).toContain('Semua');
    expect(result.current.categories).toContain('Web');
    expect(result.current.categories).toContain('Sistem Informasi');
    expect(result.current.categories).toContain('Mobile');
  });

  it('menyaring proyek berdasarkan kategori terpilih', async () => {
    const { result } = await renderHook(() => usePortfolioFilter(mockProjects));

    await act(async () => {
      await result.current.setSelectedCategory('Mobile');
    });

    expect(result.current.filteredProjects.length).toBe(1);
    expect(result.current.filteredProjects[0].id).toBe('p3');
  });

  it('menyaring proyek berdasarkan kata kunci pencarian', async () => {
    const { result } = await renderHook(() => usePortfolioFilter(mockProjects));

    await act(async () => {
      await result.current.setSelectedCategory('Semua');
      result.current.setKeyword('Calliandra');
    });

    expect(result.current.filteredProjects.length).toBe(1);
    expect(result.current.filteredProjects[0].id).toBe('p1');
  });

  it('menyaring proyek berdasarkan teknologi', async () => {
    const { result } = await renderHook(() => usePortfolioFilter(mockProjects));

    await act(async () => {
      await result.current.setSelectedCategory('Semua');
      result.current.setKeyword('Laravel');
    });

    expect(result.current.filteredProjects.length).toBe(1);
    expect(result.current.filteredProjects[0].id).toBe('p2');
  });

  it('mengembalikan larik kosong jika tidak ada yang cocok', async () => {
    const { result } = await renderHook(() => usePortfolioFilter(mockProjects));

    await act(async () => {
      result.current.setKeyword('KataKunciYangTidakPernahAda123');
    });

    expect(result.current.filteredProjects.length).toBe(0);
  });
});
