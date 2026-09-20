/**
 * Repository thao tác với dữ liệu Lịch sử biến động trạng thái (roomStatusHistory, bookingHistory)
 */

import { RoomStatusHistory, BookingHistory } from '../entities/History';
import { apiRequest } from './apiConfig';

export class HistoryRepository {
  public async addRoomHistory(history: RoomStatusHistory): Promise<RoomStatusHistory> {
    return apiRequest<RoomStatusHistory>('/roomStatusHistory', {
      method: 'POST',
      body: JSON.stringify(history),
    });
  }

  public async addBookingHistory(history: BookingHistory): Promise<BookingHistory> {
    return apiRequest<BookingHistory>('/bookingHistory', {
      method: 'POST',
      body: JSON.stringify(history),
    });
  }

  public async findBookingHistory(bookingId: string): Promise<BookingHistory[]> {
    return apiRequest<BookingHistory[]>(`/bookingHistory?bookingId=${encodeURIComponent(bookingId)}&_sort=changedAt&_order=desc`);
  }

  public async findRoomHistory(roomId: string): Promise<RoomStatusHistory[]> {
    return apiRequest<RoomStatusHistory[]>(`/roomStatusHistory?roomId=${encodeURIComponent(roomId)}&_sort=changedAt&_order=desc`);
  }
}
