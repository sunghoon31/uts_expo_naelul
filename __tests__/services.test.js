import { setSimulateError } from '../services/api';
import { profileService } from '../services/profileService';
import { scoreService } from '../services/scoreService';
import { portfolioService } from '../services/portfolioService';
import { contactService } from '../services/contactService';

// Mock storage for contactService
jest.mock('../utils/storage', () => ({
  STORAGE_KEYS: { MESSAGES: '@cv/messages' },
  getStorageItem: jest.fn(async () => []),
  setStorageItem: jest.fn(async () => true),
  saveContactMessage: jest.fn(async (msg) => [msg]),
  clearContactMessages: jest.fn(async () => true),
}));

describe('Mock API Services (T-10 & FR-44)', () => {
  beforeEach(() => {
    setSimulateError(false);
  });

  afterEach(() => {
    setSimulateError(false);
  });

  it('profileService.getProfile mengembalikan data profil mahasiswa', async () => {
    const profile = await profileService.getProfile();
    expect(profile).toBeDefined();
    expect(profile.nim).toBe('242505011');
    expect(profile.nama).toBe('Naelul Kirom Indalloh');
  });

  it('scoreService.getScore mengembalikan data capaian akademik UTS', async () => {
    const score = await scoreService.getScore();
    expect(score.currentScore.nilai).toBe(89);
    expect(score.currentScore.grade).toBe('A');
    expect(score.learningPoints.total).toBe(12375);
  });

  it('portfolioService mengembalikan daftar proyek dan detail spesifik', async () => {
    const projects = await portfolioService.getProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);

    const firstId = projects[0].id;
    const detail = await portfolioService.getProjectById(firstId);
    expect(detail.id).toBe(firstId);
  });

  it('portfolioService.getProjectById melempar error jika ID tidak ada', async () => {
    await expect(portfolioService.getProjectById('id_tidak_ada')).rejects.toThrow(
      'tidak ditemukan'
    );
  });

  it('contactService.submitMessage menolak input jika data tidak valid', async () => {
    await expect(
      contactService.submitMessage({ nama: '', email: '', pesan: '' })
    ).rejects.toThrow();
  });

  it('contactService.submitMessage berhasil memproses input valid', async () => {
    const res = await contactService.submitMessage({
      nama: 'Budi Santoso',
      email: 'budi@example.com',
      pesan: 'Pertanyaan terkait UTS Mobile 2',
    });
    expect(res.success).toBe(true);
    expect(res.data.nama).toBe('Budi Santoso');
  });

  it('Mode Simulasi Galat (Simulate Error) melempar galat ramah', async () => {
    setSimulateError(true);
    await expect(profileService.getProfile()).rejects.toThrow(
      'Gagal memuat data dari Mock API (Mode Simulasi Galat Aktif)'
    );
  });
});

