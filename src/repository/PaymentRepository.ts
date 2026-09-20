/**
 * Repository thao tác với dữ liệu Thanh toán (payments)
 * Nơi duy nhất gọi apiRequest() cho thực thể Payment
 */

import { Payment } from '../entities/Payment';
import { apiRequest } from './apiConfig';

export class PaymentRepository {
  public async findAllPayments(): Promise<Payment[]> {
    return apiRequest<Payment[]>('/payments');
  }

  public async findPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    const list = await apiRequest<Payment[]>(`/payments?bookingId=${encodeURIComponent(bookingId)}`);
    return list.length > 0 ? list[0] : null;
  }

  public async findPaymentById(id: string): Promise<Payment | null> {
    try {
      return await apiRequest<Payment>(`/payments/${id}`);
    } catch (err: any) {
      if (err.code === 'HTTP_404') return null;
      throw err;
    }
  }

  public async createPayment(payment: Payment): Promise<Payment> {
    return apiRequest<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  public async updatePayment(id: string, partial: Partial<Payment>): Promise<Payment> {
    return apiRequest<Payment>(`/payments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(partial),
    });
  }
}
