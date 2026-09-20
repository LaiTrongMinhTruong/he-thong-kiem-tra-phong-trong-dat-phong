/**
 * Bộ kiểm tra dữ liệu phòng cho phân hệ quản lý của Nhân viên
 */

import { RoomStatus } from '../entities/Room';

export interface RoomValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: {
    roomNumber: string;
    floor: number;
    roomTypeId: string;
    status: RoomStatus;
    note: string;
  };
}

export function validateRoomInput(
  data: {
    roomNumber: unknown;
    floor: unknown;
    roomTypeId: unknown;
    status?: unknown;
    note?: unknown;
  }
): RoomValidationResult {
  const errors: Record<string, string> = {};

  // 1. Validate Số phòng
  const roomNumber = String(data.roomNumber || '').trim();
  if (!roomNumber) {
    errors.roomNumber = 'Vui lòng nhập số phòng (ví dụ: 101, 202).';
  } else if (roomNumber.length < 1 || roomNumber.length > 10) {
    errors.roomNumber = 'Số phòng phải từ 1 đến 10 ký tự.';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(roomNumber)) {
    errors.roomNumber = 'Số phòng chỉ được chứa chữ cái, số và dấu gạch nối.';
  }

  // 2. Validate Tầng
  const floorStr = String(data.floor ?? '').trim();
  let floorNum = 1;
  if (!floorStr) {
    errors.floor = 'Vui lòng nhập số tầng.';
  } else if (!/^\d+$/.test(floorStr)) {
    errors.floor = 'Số tầng phải là số nguyên dương.';
  } else {
    floorNum = parseInt(floorStr, 10);
    if (floorNum < 1 || floorNum > 100) {
      errors.floor = 'Số tầng phải từ 1 đến 100.';
    }
  }

  // 3. Validate Loại phòng
  const roomTypeId = String(data.roomTypeId || '').trim();
  if (!roomTypeId) {
    errors.roomTypeId = 'Vui lòng chọn loại phòng.';
  }

  // 4. Validate Trạng thái phòng
  const status = (String(data.status || 'available').trim()) as RoomStatus;
  const validStatuses: RoomStatus[] = ['available', 'occupied', 'cleaning', 'maintenance'];
  if (!validStatuses.includes(status)) {
    errors.status = 'Trạng thái phòng không hợp lệ.';
  }

  const note = String(data.note || '').trim();

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      roomNumber,
      floor: floorNum,
      roomTypeId,
      status,
      note,
    },
  };
}
