/**
 * Formatting utilities for numbers, LP currency, and dates
 */

/**
 * Format integer with thousand separator using dot (Indonesian standard)
 * 12375 -> "12.375"
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(Number(num))) {
    return '0';
  }
  return Number(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Format Learning Points with thousand separator and unit
 * 12375 -> "12.375 LP"
 */
export function formatLP(points, unit = 'LP') {
  return `${formatNumber(points)} ${unit}`;
}

/**
 * Format ISO date string or Date object to readable Indonesian string
 */
export function formatDateTime(isoString) {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return String(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  } catch {
    return String(isoString);
  }
}

