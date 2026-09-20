/**
 * Bộ kiểm tra dữ liệu tra cứu đơn đặt phòng
 */

import { isValidBookingCodeFormat } from '../utils/bookingCode';

const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

export interface LookupValidationResult {
  isValid: boolean;
  errors: {
    bookingCode?: string;
    customerPhone?: string;
  };
  sanitized: {
    bookingCode: string;
    customerPhone: string;
  };
}

export function validateLookupInput(data: {
  bookingCode: unknown;
  customerPhone: unknown;
}): LookupValidationResult {
  const errors: { bookingCode?: string; customerPhone?: string } = {};

  const bookingCode = String(data.bookingCode || '').trim().toUpperCase();
  const customerPhone = String(data.customerPhone || '').trim();

  if (!bookingCode) {
    errors.bookingCode = 'Vui lòng nhập mã đặt phòng (Ví dụ: BKTEST01).';
  } else if (!isValidBookingCodeFormat(bookingCode)) {
    errors.bookingCode = 'Mã đặt phòng không đúng định dạng (Gồm tiền tố BK và 8 ký tự).';
  }

  if (!customerPhone) {
    errors.customerPhone = 'Vui lòng nhập số điện thoại dùng khi đặt phòng.';
  } else if (!VN_PHONE_REGEX.test(customerPhone)) {
    errors.customerPhone = 'Số điện thoại không đúng định dạng số di động Việt Nam.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      bookingCode,
      customerPhone,
    },
  };
}
