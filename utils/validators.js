/**
 * Pure validator functions for contact form and inputs
 */

export function validateNama(nama) {
  if (nama === undefined || nama === null || String(nama).trim() === '') {
    return 'Nama wajib diisi';
  }
  const clean = String(nama).trim();
  if (clean.length < 3) {
    return 'Nama minimal 3 karakter';
  }
  if (clean.length > 60) {
    return 'Nama maksimal 60 karakter';
  }
  return null;
}

export function validateEmail(email) {
  if (email === undefined || email === null || String(email).trim() === '') {
    return 'Email wajib diisi';
  }
  const clean = String(email).trim();
  // Standard robust email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clean)) {
    return 'Format email tidak valid';
  }
  return null;
}

export function validatePesan(pesan) {
  if (pesan === undefined || pesan === null || String(pesan).trim() === '') {
    return 'Pesan wajib diisi';
  }
  const clean = String(pesan).trim();
  if (clean.length < 10) {
    return 'Pesan minimal 10 karakter';
  }
  if (clean.length > 500) {
    return 'Pesan maksimal 500 karakter';
  }
  return null;
}

/**
 * Validate full contact form payload
 * Returns: { isValid: boolean, errors: { nama?: string, email?: string, pesan?: string } }
 */
export function validateContactForm(values = {}) {
  const errors = {};
  const namaErr = validateNama(values.nama);
  if (namaErr) errors.nama = namaErr;

  const emailErr = validateEmail(values.email);
  if (emailErr) errors.email = emailErr;

  const pesanErr = validatePesan(values.pesan);
  if (pesanErr) errors.pesan = pesanErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

