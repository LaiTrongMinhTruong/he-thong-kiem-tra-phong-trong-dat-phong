/**
 * Định nghĩa thực thể Phòng (Room) và Loại phòng (RoomType)
 * Kèm State Machine quản lý chuyển đổi trạng thái phòng
 */

import { AppError } from './AppError';

export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  basePricePerNight: number;
  amenities: string[];
  description: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  floor: number;
  status: RoomStatus;
  note?: string;
}

export interface RoomWithType extends Room {
  roomType: RoomType;
}

export const RoomStatusLabels: Record<RoomStatus, string> = {
  available: 'Sẵn sàng đón khách',
  occupied: 'Đang có khách ở',
  cleaning: 'Đang dọn dẹp vệ sinh',
  maintenance: 'Đang bảo dưỡng sửa chữa',
};

export const RoomStatusColors: Record<RoomStatus, { bg: string; text: string; badge: string }> = {
  available: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
  occupied: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
  cleaning: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
  maintenance: { bg: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800' },
};

/**
 * State Machine kiểm tra chuyển trạng thái phòng hợp lệ:
 * - available <-> occupied
 * - occupied -> cleaning
 * - cleaning -> available
 * - available <-> maintenance
 */
export class RoomStateMachine {
  private static readonly allowedTransitions: Record<RoomStatus, RoomStatus[]> = {
    available: ['occupied', 'maintenance', 'cleaning'],
    occupied: ['cleaning'], // Khi trả phòng chuyển sang dọn dẹp
    cleaning: ['available', 'maintenance'],
    maintenance: ['cleaning', 'available'],
  };

  public static canTransition(from: RoomStatus, to: RoomStatus): boolean {
    if (from === to) return true;
    const allowed = this.allowedTransitions[from] || [];
    return allowed.includes(to);
  }

  public static validateTransition(from: RoomStatus, to: RoomStatus): void {
    if (!this.canTransition(from, to)) {
      throw new AppError({
        code: 'INVALID_ROOM_STATUS_TRANSITION',
        message: `Không thể chuyển trạng thái phòng từ "${RoomStatusLabels[from]}" sang "${RoomStatusLabels[to]}".`,
      });
    }
  }
}
