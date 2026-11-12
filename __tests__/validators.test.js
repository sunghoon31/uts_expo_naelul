import {
  validateNama,
  validateEmail,
  validatePesan,
  validateContactForm,
} from '../utils/validators';

describe('validators.js (T-01)', () => {
  describe('validateNama', () => {
    it('mengembalikan error jika nama kosong atau hanya spasi', () => {
      expect(validateNama('')).toBe('Nama wajib diisi');
      expect(validateNama('   ')).toBe('Nama wajib diisi');
      expect(validateNama(null)).toBe('Nama wajib diisi');
    });

    it('mengembalikan error jika nama kurang dari 3 karakter', () => {
      expect(validateNama('Al')).toBe('Nama minimal 3 karakter');
    });

    it('mengembalikan error jika nama lebih dari 60 karakter', () => {
      const longName = 'A'.repeat(61);
      expect(validateNama(longName)).toBe('Nama maksimal 60 karakter');
    });

    it('mengembalikan null jika nama valid', () => {
      expect(validateNama('Naelul Kirom Indalloh')).toBeNull();
      expect(validateNama('Bob')).toBeNull();
    });
  });

  describe('validateEmail', () => {
    it('mengembalikan error jika email kosong', () => {
      expect(validateEmail('')).toBe('Email wajib diisi');
      expect(validateEmail(null)).toBe('Email wajib diisi');
    });

    it('mengembalikan error jika format email tidak valid', () => {
      expect(validateEmail('naelul')).toBe('Format email tidak valid');
      expect(validateEmail('naelul@')).toBe('Format email tidak valid');
      expect(validateEmail('naelul@domain')).toBe('Format email tidak valid');
      expect(validateEmail('@domain.com')).toBe('Format email tidak valid');
    });

    it('mengembalikan null jika format email valid', () => {
      expect(validateEmail('naelul@student.masoem.ac.id')).toBeNull();
      expect(validateEmail('test.user@gmail.com')).toBeNull();
    });
  });

  describe('validatePesan', () => {
    it('mengembalikan error jika pesan kosong', () => {
      expect(validatePesan('')).toBe('Pesan wajib diisi');
      expect(validatePesan('   ')).toBe('Pesan wajib diisi');
      expect(validatePesan(null)).toBe('Pesan wajib diisi');
    });

    it('mengembalikan error jika pesan kurang dari 10 karakter', () => {
      expect(validatePesan('Halo')).toBe('Pesan minimal 10 karakter');
    });

    it('mengembalikan error jika pesan lebih dari 500 karakter', () => {
      const longPesan = 'X'.repeat(501);
      expect(validatePesan(longPesan)).toBe('Pesan maksimal 500 karakter');
    });

    it('mengembalikan null jika pesan valid', () => {
      expect(validatePesan('Halo, saya tertarik berdiskusi tentang proyek UTS ini.')).toBeNull();
    });
  });

  describe('validateContactForm', () => {
    it('mengembalikan isValid: false dan errors jika semua field kosong', () => {
      const res = validateContactForm({});
      expect(res.isValid).toBe(false);
      expect(res.errors.nama).toBe('Nama wajib diisi');
      expect(res.errors.email).toBe('Email wajib diisi');
      expect(res.errors.pesan).toBe('Pesan wajib diisi');
    });

    it('mengembalikan isValid: true dan errors kosong jika semua field valid', () => {
      const res = validateContactForm({
        nama: 'Naelul Kirom',
        email: 'naelul@example.com',
        pesan: 'Selamat siang pak, izin mengumpulkan tugas UTS.',
      });
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errors).length).toBe(0);
    });
  });
});

