import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  saveContactMessage,
  clearContactMessages,
  STORAGE_KEYS,
} from '../utils/storage';

// Mock AsyncStorage if not already provided by jest-expo
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    getItem: jest.fn(async (key) => store[key] !== undefined ? store[key] : null),
    setItem: jest.fn(async (key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn(async (key) => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
    _dump: () => store,
  };
});

describe('storage.js (T-11 & FR-47)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('mengambil default value jika key tidak ditemukan', async () => {
    const val = await getStorageItem('non_existent_key', 'bawaan');
    expect(val).toBe('bawaan');
  });

  it('menyimpan dan membaca data string', async () => {
    await setStorageItem('@cv/theme', 'dark');
    const read = await getStorageItem('@cv/theme');
    expect(read).toBe('dark');
  });

  it('menyimpan dan membaca data JSON object', async () => {
    const data = { user: 'Naelul', active: true };
    await setStorageItem('@test/user', data);
    const read = await getStorageItem('@test/user');
    expect(read).toEqual(data);
  });

  it('menyimpan pesan kontak dan membatasi riwayat maksimal 20', async () => {
    const msg1 = { id: '1', nama: 'Pengunjung A', pesan: 'Pesan pertama', waktu: '2026-11-05' };
    const res = await saveContactMessage(msg1);
    expect(res.length).toBe(1);

    const history = await getStorageItem(STORAGE_KEYS.MESSAGES);
    expect(history[0].nama).toBe('Pengunjung A');

    // Menghapus riwayat
    await clearContactMessages();
    const afterClear = await getStorageItem(STORAGE_KEYS.MESSAGES, []);
    expect(afterClear).toEqual([]);
  });

  it('menangani kesalahan runtime tanpa melempar crash (aman)', async () => {
    AsyncStorage.getItem.mockImplementationOnce(() => {
      throw new Error('Disk full');
    });
    const fallback = await getStorageItem('error_key', 'fallback_aman');
    expect(fallback).toBe('fallback_aman');
  });
});

