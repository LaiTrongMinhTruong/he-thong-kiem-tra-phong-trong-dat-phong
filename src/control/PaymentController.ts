/**
 * Controller xử lý nghiệp vụ Thanh toán (Payment)
 */

import { Payment, PaymentMethod, PaymentType } from '../entities/Payment';
import { PaymentRepository } from '../repository/PaymentRepository';
import { validatePaymentInput } from '../validation/paymentValidator';
import { AppError } from '../entities/AppError';

export class PaymentController {
  private paymentRepo: PaymentRepository;

  constructor(paymentRepo = new PaymentRepository()) {
    this.paymentRepo = paymentRepo;
  }

  /**
   * Tạo bản ghi thanh toán cho đơn đặt phòng
   */
  public async createPayment(
    bookingId: string,
    amount: number,
    type: PaymentType,
    method: PaymentMethod,
    expectedTotalAmount: number
  ): Promise<Payment> {
    // 1. Kiểm tra tính hợp lệ của thông tin thanh toán (Lớp 2 - Control)
    const validation = validatePaymentInput({ amount, type, method }, expectedTotalAmount);
    if (!validation.isValid) {
      const firstKey = Object.keys(validation.errors)[0];
      throw new AppError({
        code: 'INVALID_PAYMENT_DATA',
        message: validation.errors[firstKey],
        field: firstKey,
      });
    }

    // 2. Tạo payment với id duy nhất
    const newPayment: Payment = {
      id: `P_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      bookingId,
      amount,
      method,
      type,
      status: 'unpaid',
      refundAmount: 0,
    };

    return this.paymentRepo.createPayment(newPayment);
  }

  /**
   * Lấy thông tin thanh toán theo bookingId
   */
  public async getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    return this.paymentRepo.findPaymentByBookingId(bookingId);
  }

  /**
   * Khách hàng thực hiện thanh toán (chuyển sang 'paid')
   */
  public async processPayment(
    paymentId: string,
    method: PaymentMethod,
    paidAmount: number
  ): Promise<Payment> {
    const payment = await this.paymentRepo.findPaymentById(paymentId);
    if (!payment) {
      throw new AppError({
        code: 'PAYMENT_NOT_FOUND',
        message: 'Không tìm thấy hóa đơn thanh toán yêu cầu.',
      });
    }

    if (payment.status === 'paid') {
      throw new AppError({
        code: 'PAYMENT_ALREADY_PAID',
        message: 'Đơn đặt phòng này đã được thanh toán trước đó.',
      });
    }

    if (payment.status === 'refunded') {
      throw new AppError({
        code: 'PAYMENT_ALREADY_REFUNDED',
        message: 'Đơn này đã được hoàn tiền, không thể thanh toán tiếp.',
      });
    }

    if (paidAmount !== payment.amount) {
      throw new AppError({
        code: 'PAYMENT_AMOUNT_MISMATCH',
        message: `Số tiền thanh toán (${paidAmount.toLocaleString('vi-VN')} đ) không khớp với số tiền cần trả (${payment.amount.toLocaleString('vi-VN')} đ).`,
      });
    }

    return this.paymentRepo.updatePayment(paymentId, {
      status: 'paid',
      method,
      paidAt: new Date().toISOString(),
    });
  }
}
