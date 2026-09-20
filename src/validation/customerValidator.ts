/**
 * Bộ kiểm tra thông tin khách hàng và số lượng người lưu trú
 */

import { normalizeString } from '../utils/sanitize';

export interface CustomerValidationResult {
  isValid: boolean;
  errors: {
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    adults?: string;
    children?: string;
    guests?: string;
  };
  sanitized: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    adults: number;
    children: number;
  };
}

// Regex họ tên tiếng Việt đầy đủ dấu, độ dài từ 2 đến 50 ký tự, không chứa chữ số hoặc ký tự đặc biệt
const VIETNAMESE_NAME_REGEX = /^[a-zA-ZàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ\s]{2,50}$/;

// Regex số điện thoại di động Việt Nam chuẩn
const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

// Regex email chuẩn, tối đa 100 ký tự
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateCustomerInfo(
  data: {
    customerName: unknown;
    customerPhone: unknown;
    customerEmail: unknown;
    adults: unknown;
    children: unknown;
  },
  roomCapacity: number
): CustomerValidationResult {
  const errors: CustomerValidationResult['errors'] = {};

  // 1. Chuẩn hóa chuỗi
  const name = normalizeString(data.customerName);
  const phone = typeof data.customerPhone === 'string' ? data.customerPhone.trim() : '';
  const email = typeof data.customerEmail === 'string' ? data.customerEmail.trim().toLowerCase() : '';

  // 2. Validate Họ tên
  if (!name) {
    errors.customerName = 'Vui lòng nhập họ và tên của bạn.';
  } else if (name.length < 2 || name.length > 50) {
    errors.customerName = 'Họ và tên phải có độ dài từ 2 đến 50 ký tự.';
  } else if (!VIETNAMESE_NAME_REGEX.test(name)) {
    errors.customerName = 'Họ tên chỉ được chứa chữ cái và khoảng trắng, không chứa số hoặc ký tự đặc biệt.';
  }

  // 3. Validate Số điện thoại
  if (!phone) {
    errors.customerPhone = 'Vui lòng nhập số điện thoại liên hệ.';
  } else if (!VN_PHONE_REGEX.test(phone)) {
    errors.customerPhone = 'Số điện thoại không hợp lệ (Ví dụ hợp lệ: 0912345678 hoặc +84912345678).';
  }

  // 4. Validate Email
  if (!email) {
    errors.customerEmail = 'Vui lòng nhập email để nhận mã đặt phòng.';
  } else if (email.length > 100) {
    errors.customerEmail = 'Địa chỉ email không được vượt quá 100 ký tự.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.customerEmail = 'Định dạng email không hợp lệ (Ví dụ: khachhang@gmail.com).';
  }

  // 5. Chặn triệt để ô nhập số người (adults, children)
  let adultsNum = 0;
  let childrenNum = 0;

  // Validate Người lớn
  const adultsStr = String(data.adults ?? '').trim();
  if (!adultsStr) {
    errors.adults = 'Vui lòng nhập số lượng người lớn.';
  } else if (!/^\d+$/.test(adultsStr)) {
    errors.adults = 'Số người lớn phải là số nguyên dương, không chứa ký tự lạ hoặc số thập phân.';
  } else {
    adultsNum = parseInt(adultsStr, 10);
    if (adultsNum < 1) {
      errors.adults = 'Phải có ít nhất 1 người lớn trong phòng.';
    } else if (adultsNum > 20) {
      errors.adults = 'Số lượng người lớn không hợp lý.';
    }
  }

  // Validate Trẻ em
  const childrenStr = String(data.children ?? '').trim();
  if (childrenStr === '') {
    childrenNum = 0;
  } else if (!/^\d+$/.test(childrenStr)) {
    errors.children = 'Số trẻ em phải là số nguyên không âm (0, 1, 2...).';
  } else {
    childrenNum = parseInt(childrenStr, 10);
    if (childrenNum < 0) {
      errors.children = 'Số trẻ em không được âm.';
    } else if (childrenNum > 20) {
      errors.children = 'Số lượng trẻ em không hợp lý.';
    }
  }

  // 6. Tổng số người không được vượt quá sức chứa tối đa của phòng
  const totalGuests = adultsNum + childrenNum;
  if (!errors.adults && !errors.children) {
    if (totalGuests > roomCapacity) {
      errors.guests = `Phòng này chỉ chứa tối đa ${roomCapacity} khách (Bạn đang chọn ${totalGuests} người: ${adultsNum} người lớn + ${childrenNum} trẻ em).`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      adults: adultsNum,
      children: childrenNum,
    },
  };
}
