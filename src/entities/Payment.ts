/**
 * Thực thể Thanh toán (Payment)
 */

export type PaymentMethod = 'cash' | 'card' | 'transfer';
export type PaymentType = 'deposit' | 'full';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;       // Số tiền thực tế của giao dịch này (số nguyên VNĐ)
  method: PaymentMethod;
  type: PaymentType;
  status: PaymentStatus;
  paidAt?: string;
  refundAmount: number; // Số tiền đã hoàn (nếu có)
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  cash: 'Tiền mặt tại quầy',
  card: 'Thẻ tín dụng / Thẻ ghi nợ',
  transfer: 'Chuyển khoản ngân hàng (QR Code)',
};

export const PaymentTypeLabels: Record<PaymentType, string> = {
  deposit: 'Đặt cọc giữ phòng (30%)',
  full: 'Thanh toán toàn bộ (100%)',
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
};

export const PaymentStatusBadges: Record<PaymentStatus, string> = {
  unpaid: 'bg-rose-100 text-rose-800 border-rose-200',
  paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  refunded: 'bg-slate-100 text-slate-700 border-slate-200',
};
