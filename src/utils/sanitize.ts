/**
 * Tiện ích làm sạch và chuẩn hóa dữ liệu đầu vào, ngăn ngừa tấn công XSS
 */

/**
 * Thoát các ký tự đặc biệt trong HTML để ngăn chặn XSS
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const text = String(str);
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Cắt khoảng trắng dư thừa ở hai đầu và gộp nhiều dấu cách liên tiếp thành 1 dấu cách
 */
export function normalizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Lọc và chuẩn hóa input số nguyên an toàn, chặn ký tự đặc biệt
 */
export function sanitizeInteger(val: unknown, defaultValue = 0): number {
  if (typeof val === 'number') {
    return Number.isFinite(val) && !Number.isNaN(val) ? Math.floor(val) : defaultValue;
  }
  if (typeof val === 'string') {
    const cleaned = val.trim();
    if (!/^-?\d+$/.test(cleaned)) return defaultValue;
    const parsed = parseInt(cleaned, 10);
    return Number.isFinite(parsed) ? parsed : defaultValue;
  }
  return defaultValue;
}
