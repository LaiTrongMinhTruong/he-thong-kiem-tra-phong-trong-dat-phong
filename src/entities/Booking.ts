/**
 * Thực thể Đặt phòng (Booking) và State Machine quản lý vòng đời đơn đặt
 */

import { AppError } from './AppError';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export interface Booking {
  id: string;
  bookingCode: string; // Định dạng BK + 8 ký tự alphanumeric
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  roomId: string;
  checkInDate: string;  // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adults: number;
  children: number;
  nights: number;
  totalAmount: number;  // Số nguyên VNĐ đã bao gồm 8% VAT
  status: BookingStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export const BookingStatusLabels: Record<BookingStatus, string> = {
  pending: 'Chờ nhân viên xác nhận',
  confirmed: 'Đã xác nhận đặt phòng',
  checked_in: 'Đang lưu trú (Đã nhận phòng)',
  checked_out: 'Đã trả phòng hoàn tất',
  cancelled: 'Đã hủy phòng',
  no_show: 'Khách không đến nhận phòng',
};

export const BookingStatusBadges: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  checked_in: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  checked_out: 'bg-slate-100 text-slate-700 border-slate-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  no_show: 'bg-purple-100 text-purple-800 border-purple-200',
};

/**
 * State Machine vòng đời Đặt phòng:
 * - pending -> confirmed -> checked_in -> checked_out
 * - pending -> cancelled
 * - confirmed -> cancelled
 * - confirmed -> no_show
 * Mọi chuyển đổi ngoài sơ đồ sẽ bị ném lỗi rõ ràng
 */
export class BookingStateMachine {
  private static readonly allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['checked_in', 'cancelled', 'no_show'],
    checked_in: ['checked_out'],
    checked_out: [],
    cancelled: [],
    no_show: [],
  };

  public static canTransition(from: BookingStatus, to: BookingStatus): boolean {
    if (from === to) return true;
    const allowed = this.allowedTransitions[from] || [];
    return allowed.includes(to);
  }

  public static validateTransition(from: BookingStatus, to: BookingStatus): void {
    if (!this.canTransition(from, to)) {
      throw new AppError({
        code: 'INVALID_BOOKING_STATUS_TRANSITION',
        message: `Chuyển trạng thái đơn đặt phòng không hợp lệ: Không thể chuyển từ "${BookingStatusLabels[from]}" sang "${BookingStatusLabels[to]}".`,
      });
    }
  }
}
