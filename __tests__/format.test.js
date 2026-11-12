import { formatNumber, formatLP, formatDateTime } from '../utils/format';

describe('format.js (T-09)', () => {
  it('memformat angka ribuan dengan titik sesuai standar Indonesia', () => {
    expect(formatNumber(12375)).toBe('12.375');
    expect(formatNumber(1000000)).toBe('1.000.000');
    expect(formatNumber(89)).toBe('89');
    expect(formatNumber(0)).toBe('0');
  });

  it('menangani input tidak valid dengan aman', () => {
    expect(formatNumber(null)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
    expect(formatNumber('abc')).toBe('0');
  });

  it('memformat Learning Points dengan satuan LP', () => {
    expect(formatLP(12375)).toBe('12.375 LP');
    expect(formatLP(500)).toBe('500 LP');
    expect(formatLP(12375, 'PTS')).toBe('12.375 PTS');
  });

  it('memformat tanggal ke format lokal yang terbaca', () => {
    const formatted = formatDateTime('2026-11-05T16:30:00.000Z');
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(5);
  });
});

