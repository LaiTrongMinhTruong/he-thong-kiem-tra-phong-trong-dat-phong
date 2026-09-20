/**
 * Tiện ích xử lý tiền tệ VNĐ (số nguyên, không dùng số thực)
 */

/**
 * Định dạng số tiền sang chuẩn hiển thị Việt Nam Đồng (vd: 1.500.000 đ)
 */
export function formatMoney(amount: number): string {
  const safeInt = Math.round(amount || 0);
  return new Intl.NumberFormat('vi-VN').format(safeInt) + ' đ';
}

/**
 * Tính thuế VAT 8% (làm tròn số nguyên đồng)
 */
export function calculateVAT(subtotal: number): number {
  return Math.round(subtotal * 0.08);
}

/**
 * Tính tổng tiền bao gồm VAT 8%
 */
export function calculateTotalAmount(nights: number, basePricePerNight: number, extraFee = 0): {
  subtotal: number;
  extraFee: number;
  vat: number;
  total: number;
} {
  const safeNights = Math.max(1, Math.floor(nights));
  const safePrice = Math.max(0, Math.floor(basePricePerNight));
  const safeExtra = Math.max(0, Math.floor(extraFee));

  const subtotal = safeNights * safePrice;
  const taxable = subtotal + safeExtra;
  const vat = calculateVAT(taxable);
  const total = taxable + vat;

  return {
    subtotal,
    extraFee: safeExtra,
    vat,
    total,
  };
}

/**
 * Tính số tiền đặt cọc 30% (làm tròn số nguyên đồng)
 */
export function calculateDepositAmount(totalAmount: number): number {
  return Math.round(totalAmount * 0.3);
}

/**
 * Tính tỷ lệ hoàn tiền và số tiền hoàn dự kiến dựa trên số ngày còn lại đến ngày nhận phòng:
 * - >= 7 ngày: hoàn 100%
 * - 3 - 6 ngày: hoàn 50%
 * - < 3 ngày: hoàn 0%
 */
export function calculateRefund(paidAmount: number, daysUntilCheckIn: number): {
  refundPercent: number;
  refundAmount: number;
  description: string;
} {
  const safePaid = Math.max(0, Math.floor(paidAmount));
  if (daysUntilCheckIn >= 7) {
    return {
      refundPercent: 100,
      refundAmount: safePaid,
      description: 'Hủy trước ngày nhận phòng từ 7 ngày trở lên: Hoàn 100% số tiền đã thanh toán.',
    };
  } else if (daysUntilCheckIn >= 3) {
    const refundAmount = Math.round(safePaid * 0.5);
    return {
      refundPercent: 50,
      refundAmount,
      description: 'Hủy trước ngày nhận phòng từ 3 đến 6 ngày: Hoàn 50% số tiền đã thanh toán.',
    };
  } else {
    return {
      refundPercent: 0,
      refundAmount: 0,
      description: 'Hủy sát ngày nhận phòng (< 3 ngày): Không áp dụng hoàn tiền (0%).',
    };
  }
}
