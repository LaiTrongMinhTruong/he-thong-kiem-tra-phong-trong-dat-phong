/**
 * Repository thao tác với dữ liệu Đặt phòng (bookings)
 * Nơi duy nhất gọi apiRequest() cho thực thể Booking
 */

import { Booking, BookingStatus } from '../entities/Booking';
import { apiRequest } from './apiConfig';
import { isOverlapping, getLocalTodayString, addDays } from '../utils/dateUtils';

export class BookingRepository {
  public async findAllBookings(): Promise<Booking[]> {
    return apiRequest<Booking[]>('/bookings');
  }

  public async findBookingById(id: string): Promise<Booking | null> {
    try {
      return await apiRequest<Booking>(`/bookings/${id}`);
    } catch (err: any) {
      if (err.code === 'HTTP_404') return null;
      throw err;
    }
  }

  public async findBookingByCode(bookingCode: string): Promise<Booking | null> {
    const list = await apiRequest<Booking[]>(`/bookings?bookingCode=${encodeURIComponent(bookingCode.trim())}`);
    return list.length > 0 ? list[0] : null;
  }

  public async findBookingByCodeAndPhone(bookingCode: string, customerPhone: string): Promise<Booking | null> {
    const cleanCode = bookingCode.trim().toUpperCase();
    const cleanPhone = customerPhone.trim();
    const list = await apiRequest<Booking[]>(
      `/bookings?bookingCode=${encodeURIComponent(cleanCode)}&customerPhone=${encodeURIComponent(cleanPhone)}`
    );
    return list.length > 0 ? list[0] : null;
  }

  /**
   * Tìm các booking đang trùng lịch với khoảng thời gian [checkInDate, checkOutDate) của 1 phòng
   * Chỉ tính các booking có status ∈ {'pending', 'confirmed', 'checked_in'}
   */
  public async findOverlapping(
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
    excludeBookingId?: string
  ): Promise<Booking[]> {
    const allBookings = await apiRequest<Booking[]>(`/bookings?roomId=${encodeURIComponent(roomId)}`);
    const blockingStatuses: BookingStatus[] = ['pending', 'confirmed', 'checked_in'];

    return allBookings.filter(b => {
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (!blockingStatuses.includes(b.status)) return false;
      return isOverlapping(checkInDate, checkOutDate, b.checkInDate, b.checkOutDate);
    });
  }

  /**
   * Kiểm tra xem cùng 1 số điện thoại đã có booking active (pending/confirmed) trùng ngày hay chưa (chống spam)
   */
  public async findActiveBookingsByPhone(
    customerPhone: string,
    checkInDate: string,
    checkOutDate: string
  ): Promise<Booking[]> {
    const cleanPhone = customerPhone.trim();
    const list = await apiRequest<Booking[]>(`/bookings?customerPhone=${encodeURIComponent(cleanPhone)}`);
    const activeStatuses: BookingStatus[] = ['pending', 'confirmed'];

    return list.filter(b => {
      if (!activeStatuses.includes(b.status)) return false;
      return isOverlapping(checkInDate, checkOutDate, b.checkInDate, b.checkOutDate);
    });
  }

  /**
   * Lấy danh sách booking đang hoạt động của 1 phòng (dùng khi kiểm tra trước khi xóa phòng)
   */
  public async findActiveBookingsByRoomId(roomId: string): Promise<Booking[]> {
    const list = await apiRequest<Booking[]>(`/bookings?roomId=${encodeURIComponent(roomId)}`);
    const blockingStatuses: BookingStatus[] = ['pending', 'confirmed', 'checked_in'];
    return list.filter(b => blockingStatuses.includes(b.status));
  }

  /**
   * Lấy danh sách booking đã xác nhận của phòng trong N ngày tới (dùng khi chuyển sang bảo trì)
   */
  public async findConfirmedBookingsInNextDays(roomId: string, days = 7): Promise<Booking[]> {
    const today = getLocalTodayString();
    const limitDate = addDays(today, days);
    const list = await apiRequest<Booking[]>(`/bookings?roomId=${encodeURIComponent(roomId)}&status=confirmed`);

    return list.filter(b => {
      // Có giao nhau với khoảng [today, limitDate)
      return isOverlapping(today, limitDate, b.checkInDate, b.checkOutDate);
    });
  }

  public async createBooking(booking: Booking): Promise<Booking> {
    return apiRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  public async updateBooking(id: string, partial: Partial<Booking>): Promise<Booking> {
    return apiRequest<Booking>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...partial,
        updatedAt: new Date().toISOString(),
      }),
    });
  }
}
