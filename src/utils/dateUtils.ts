/**
 * Tiện ích xử lý và kiểm tra ngày tháng
 * Mọi ngày lưu trữ dạng YYYY-MM-DD (chỉ ngày, không giờ, không lệch múi giờ)
 */

/**
 * Kiểm tra xem một chuỗi có đúng định dạng YYYY-MM-DD và có phải ngày tồn tại thực tế hay không
 * (Bao gồm kiểm tra số ngày của từng tháng và năm nhuận: 29/02, 31/04...)
 */
export function isValidCalendarDate(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;

  // Kiểm tra số ngày tối đa trong tháng
  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  if (day < 1 || day > daysInMonth[month - 1]) {
    return false;
  }

  return true;
}

/**
 * Kiểm tra năm nhuận (chia hết cho 4 nhưng không chia hết cho 100, hoặc chia hết cho 400)
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Lấy ngày hôm nay theo giờ địa phương (Local Time) định dạng YYYY-MM-DD
 */
export function getLocalTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Cộng thêm số ngày vào chuỗi ngày YYYY-MM-DD, trả về YYYY-MM-DD
 */
export function addDays(dateStr: string, daysToAdd: number): string {
  const parts = dateStr.split('-').map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() + daysToAdd);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Tính số đêm lưu trú giữa checkInDate và checkOutDate (chuẩn số nguyên dương)
 */
export function calculateNights(checkInDate: string, checkOutDate: string): number {
  if (!isValidCalendarDate(checkInDate) || !isValidCalendarDate(checkOutDate)) {
    return 0;
  }
  const [inY, inM, inD] = checkInDate.split('-').map(Number);
  const [outY, outM, outD] = checkOutDate.split('-').map(Number);

  // Tạo đối tượng Date theo UTC để loại bỏ hoàn toàn sai số do Daylight Saving Time hoặc Timezone
  const inUtc = Date.UTC(inY, inM - 1, inD);
  const outUtc = Date.UTC(outY, outM - 1, outD);

  const diffMs = outUtc - inUtc;
  const nights = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return nights;
}

/**
 * Tính khoảng cách số ngày từ hôm nay đến ngày mục tiêu (tính theo ngày tròn địa phương)
 */
export function getDaysFromToday(targetDate: string): number {
  const today = getLocalTodayString();
  return calculateNights(today, targetDate);
}

/**
 * KIỂM TRA TRÙNG LỊCH (Khoảng nửa mở [checkIn, checkOut)):
 * 
 * Hai khoảng thời gian A = [A.checkIn, A.checkOut) và B = [B.checkIn, B.checkOut)
 * trùng nhau khi và chỉ khi:
 * A.checkIn < B.checkOut && B.checkIn < A.checkOut
 * 
 * Ví dụ:
 * - Khách A ở từ ngày 22 đến ngày 25 (trả phòng trưa ngày 25: [22, 25))
 * - Khách B muốn nhận phòng ngày 25 và trả ngày 28: [25, 28)
 * => A.checkIn (22) < B.checkOut (28) (ĐÚNG)
 *    B.checkIn (25) < A.checkOut (25) (SAI: 25 không < 25)
 * => Không trùng! Khách B có thể nhận phòng ngay ngày khách A trả phòng.
 */
export function isOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  // So sánh chuỗi ngày theo định dạng ISO YYYY-MM-DD tương đương so sánh thứ tự thời gian
  return startA < endB && startB < endA;
}

/**
 * Định dạng ngày YYYY-MM-DD sang chuẩn Việt Nam DD/MM/YYYY để hiển thị
 */
export function formatDateDisplay(dateStr: string): string {
  if (!isValidCalendarDate(dateStr)) return dateStr;
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}
