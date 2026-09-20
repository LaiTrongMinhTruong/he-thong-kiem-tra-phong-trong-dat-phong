/**
 * Bộ kiểm tra tính hợp lệ của ngày nhận và trả phòng
 */

import {
  isValidCalendarDate,
  getLocalTodayString,
  addDays,
  calculateNights,
} from '../utils/dateUtils';

export interface DateValidationResult {
  isValid: boolean;
  nights: number;
  errors: {
    checkInDate?: string;
    checkOutDate?: string;
  };
}

export function validateBookingDates(
  checkInDateStr: string,
  checkOutDateStr: string
): DateValidationResult {
  const errors: { checkInDate?: string; checkOutDate?: string } = {};
  const today = getLocalTodayString();
  const maxAdvanceDate = addDays(today, 365);

  const checkIn = (checkInDateStr || '').trim();
  const checkOut = (checkOutDateStr || '').trim();

  // 1. Kiểm tra rỗng
  if (!checkIn) {
    errors.checkInDate = 'Vui lòng chọn ngày nhận phòng.';
  }
  if (!checkOut) {
    errors.checkOutDate = 'Vui lòng chọn ngày trả phòng.';
  }
  if (errors.checkInDate || errors.checkOutDate) {
    return { isValid: false, nights: 0, errors };
  }

  // 2. Kiểm tra định dạng và ngày thực tế (31/02, 30/02, năm nhuận...)
  if (!isValidCalendarDate(checkIn)) {
    errors.checkInDate = 'Ngày nhận phòng không hợp lệ hoặc không tồn tại trong lịch.';
  }
  if (!isValidCalendarDate(checkOut)) {
    errors.checkOutDate = 'Ngày trả phòng không hợp lệ hoặc không tồn tại trong lịch.';
  }
  if (errors.checkInDate || errors.checkOutDate) {
    return { isValid: false, nights: 0, errors };
  }

  // 3. checkInDate >= hôm nay (theo giờ địa phương)
  if (checkIn < today) {
    errors.checkInDate = `Ngày nhận phòng không được ở quá khứ (tối thiểu là hôm nay: ${today}).`;
  }

  // 4. Không được đặt trước quá 365 ngày
  if (checkIn > maxAdvanceDate) {
    errors.checkInDate = `Không thể đặt phòng trước quá 365 ngày (tối đa đến ngày ${maxAdvanceDate}).`;
  }

  // 5. checkOutDate > checkInDate (không cho phép bằng nhau, tối thiểu 1 đêm)
  if (checkOut <= checkIn) {
    errors.checkOutDate = 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 đêm.';
  }

  if (errors.checkInDate || errors.checkOutDate) {
    return { isValid: false, nights: 0, errors };
  }

  // 6. Tính số đêm và kiểm tra tối đa 30 đêm
  const nights = calculateNights(checkIn, checkOut);
  if (nights <= 0) {
    errors.checkOutDate = 'Khoảng thời gian lưu trú không hợp lệ.';
  } else if (nights > 30) {
    errors.checkOutDate = 'Thời gian lưu trú tối đa cho một lần đặt là 30 đêm.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    nights: errors.checkOutDate ? 0 : nights,
    errors,
  };
}
