/**
 * Thực thể Lịch sử biến động trạng thái (History)
 */

export interface RoomStatusHistory {
  id: string;
  roomId: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedAt: string;
  note?: string;
}

export interface BookingHistory {
  id: string;
  bookingId: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedAt: string;
  note?: string;
}
