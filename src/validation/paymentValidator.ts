/**
 * Bộ kiểm tra dữ liệu thanh toán
 */

import { PaymentMethod, PaymentType } from '../entities/Payment';
import { calculateDepositAmount } from '../utils/money';

export interface PaymentValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validatePaymentInput(
  input: {
    amount: unknown;
    type: unknown;
    method: unknown;
  },
  expectedTotalAmount: number
): PaymentValidationResult {
  const errors: Record<string, string> = {};

  const type = String(input.type || '').trim() as PaymentType;
  if (type !== 'deposit' && type !== 'full') {
    errors.type = 'Hình thức thanh toán phải là Đặt cọc (deposit) hoặc Thanh toán đủ (full).';
  }

  const method = String(input.method || '').trim() as PaymentMethod;
  if (method !== 'cash' && method !== 'card' && method !== 'transfer') {
    errors.method = 'Phương thức thanh toán không hợp lệ (hỗ trợ Tiền mặt, Thẻ hoặc Chuyển khoản).';
  }

  const amountStr = String(input.amount ?? '').trim();
  if (!/^\d+$/.test(amountStr)) {
    errors.amount = 'Số tiền thanh toán phải là số nguyên dương.';
  } else {
    const amountNum = parseInt(amountStr, 10);
    const expectedDeposit = calculateDepositAmount(expectedTotalAmount);

    if (type === 'full') {
      if (amountNum !== expectedTotalAmount) {
        errors.amount = `Số tiền thanh toán đủ phải chính xác là ${expectedTotalAmount.toLocaleString('vi-VN')} đ (gửi lên: ${amountNum.toLocaleString('vi-VN')} đ).`;
      }
    } else if (type === 'deposit') {
      if (amountNum !== expectedDeposit) {
        errors.amount = `Số tiền đặt cọc 30% phải chính xác là ${expectedDeposit.toLocaleString('vi-VN')} đ (gửi lên: ${amountNum.toLocaleString('vi-VN')} đ).`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
