import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { buildCvHtml, cvPdfService } from '../services/cvPdfService';

// Mock expo-print & expo-sharing
jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(async () => ({ uri: 'file:///path/to/cv.pdf' })),
  printAsync: jest.fn(async () => true),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => true),
}));

describe('Cetak & Ekspor CV PDF Service', () => {
  const dummyData = {
    profile: {
      nama: 'Naelul Kirom Indalloh',
      nim: '242505011',
      profesi: 'Information Systems Student & System Analyst',
      kampus: "Universitas Ma'soem",
      deskripsi: 'Mahasiswa Sistem Informasi yang berfokus pada analisis sistem.',
      kontak: {
        email: 'naelulkirom@gmail.com',
        whatsapp: '+62895328620093',
        github: 'https://github.com/sunghoon31',
        instagram: 'https://instagram.com/elqi_6',
      },
    },
    score: {
      akademik: {
        mataKuliah: 'Pemrograman Mobile 2',
        dosen: 'Iin Solihin, M.Kom',
      },
      currentScore: { nilai: 89, grade: 'A' },
      learningPoints: { total: 12375 },
    },
    skills: [
      {
        kategori: 'Mobile & Frontend Development',
        items: [{ id: 'rn-expo', nama: 'React Native & Expo', level: 88 }],
      },
    ],
    portfolio: [
      {
        id: 'surat-desa',
        judul: 'Rancang Bangun Sistem Informasi Administrasi Persuratan Di Desa Cileunyi Wetan',
        ringkasan: 'Platform digital pengajuan surat',
        tahun: 2025,
        peran: 'System Analyst & Fullstack Developer',
        teknologi: ['PHP', 'Laravel'],
      },
    ],
    experience: [
      {
        id: 'masoem',
        jenis: 'pendidikan',
        judul: 'S1 Sistem Informasi',
        instansi: "Universitas Ma'soem",
        periode: '2024 - Sekarang',
        deskripsi: 'Fokus pada Analisis & Perancangan Sistem',
      },
      {
        id: 'milad-ksi-2026',
        jenis: 'organisasi',
        judul: 'Ketua Pelaksana Silaturahmi & Milad KSI 2026',
        instansi: 'UKM KSI',
        periode: '2026',
        deskripsi: 'Memimpin kepanitiaan',
      },
      {
        id: 'porskam-2025',
        jenis: 'prestasi',
        judul: 'Juara 1 E-Sport Mobile Legends Porskam 2025',
        instansi: 'Porskam',
        periode: '2025',
        keterangan: 'Meraih medali emas',
      },
    ],
    hobbies: [
      {
        id: 'esports',
        nama: 'E-Sports & Gaming',
        deskripsi: 'Bermain game kompetitif MLBB',
      },
    ],
    photoBase64: 'data:image/jpeg;base64,mockedbase64string',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('buildCvHtml menghasilkan dokumen HTML lengkap dengan seluruh data dan foto profil', () => {
    const html = buildCvHtml(dummyData);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Naelul Kirom Indalloh');
    expect(html).toContain('242505011');
    expect(html).toContain('Information Systems Student &amp; System Analyst');
    expect(html).toContain('mockedbase64string');
    expect(html).toContain('Nilai 89 (A)');
    expect(html).toContain('Pemrograman Mobile 2');
    expect(html).toContain('React Native &amp; Expo');
    expect(html).toContain('Rancang Bangun Sistem Informasi Administrasi Persuratan');
    expect(html).toContain('Ketua Pelaksana Silaturahmi &amp; Milad KSI 2026');
    expect(html).toContain('Juara 1 E-Sport Mobile Legends Porskam 2025');
  });

  it('cvPdfService.getCompiledCvHtml mengambil data asli dan mengembalikan string HTML', async () => {
    const html = await cvPdfService.getCompiledCvHtml();
    expect(typeof html).toBe('string');
    expect(html).toContain('Naelul Kirom Indalloh');
    expect(html).toContain('242505011');
  });

  it('cvPdfService.exportPdf memanggil Print.printToFileAsync dan Sharing.shareAsync', async () => {
    const result = await cvPdfService.exportPdf();

    expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
    expect(Sharing.isAvailableAsync).toHaveBeenCalledTimes(1);
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      'file:///path/to/cv.pdf',
      expect.objectContaining({
        mimeType: 'application/pdf',
      })
    );
    expect(result.success).toBe(true);
  });

  it('cvPdfService.printDirectly memanggil Print.printAsync', async () => {
    const result = await cvPdfService.printDirectly();

    expect(Print.printAsync).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
  });
});
