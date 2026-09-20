/**
 * Tiện ích sinh và kiểm tra mã đặt phòng (Booking Code)
 * Định dạng: 'BK' + 8 ký tự chữ cái viết hoa và chữ số (vd: BK9F2D8A1B)
 */

export function generateBookingCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Loại bỏ ký tự dễ nhầm lẫn như 0, O, 1, I
  let result = 'BK';
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

export function isValidBookingCodeFormat(code: string): boolean {
  if (!code || typeof code !== 'string') return false;
  return /^BK[A-Z0-9]{8}$/i.test(code.trim());
}
