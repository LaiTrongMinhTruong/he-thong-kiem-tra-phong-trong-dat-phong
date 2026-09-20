/**
 * Controller xử lý nghiệp vụ liên quan đến Phòng (Room) và Loại phòng (RoomType)
 */

import { Room, RoomType, RoomStatus, RoomStateMachine, RoomWithType } from '../entities/Room';
import { RoomRepository } from '../repository/RoomRepository';
import { BookingRepository } from '../repository/BookingRepository';
import { HistoryRepository } from '../repository/HistoryRepository';
import { validateSearchFilters, SearchFilterInput } from '../validation/searchValidator';
import { validateRoomInput } from '../validation/roomValidator';
import { calculateTotalAmount } from '../utils/money';
import { AppError } from '../entities/AppError';

export interface AvailableRoomResult {
  room: Room;
  roomType: RoomType;
  nights: number;
  subtotal: number;
  vat: number;
  totalAmount: number;
  depositAmount: number;
}

export class RoomController {
  private roomRepo: RoomRepository;
  private bookingRepo: BookingRepository;
  private historyRepo: HistoryRepository;

  constructor(
    roomRepo = new RoomRepository(),
    bookingRepo = new BookingRepository(),
    historyRepo = new HistoryRepository()
  ) {
    this.roomRepo = roomRepo;
    this.bookingRepo = bookingRepo;
    this.historyRepo = historyRepo;
  }

  /**
   * Nghiệp vụ cốt lõi: Tìm kiếm và lọc các phòng còn trống theo ngày và tiêu chí
   * - Kiểm tra validate bộ lọc
   * - Loại bỏ hoàn toàn phòng đang 'maintenance'
   * - Kiểm tra trùng lịch nửa mở [checkIn, checkOut) qua BookingRepository.findOverlapping()
   * - Lọc theo loại phòng, sức chứa, khoảng giá
   */
  public async searchAvailableRooms(filters: SearchFilterInput): Promise<{
    nights: number;
    checkInDate: string;
    checkOutDate: string;
    results: AvailableRoomResult[];
  }> {
    // 1. Validate dữ liệu đầu vào (Lớp 2 - Control)
    const validation = validateSearchFilters(filters);
    if (!validation.isValid) {
      const firstErrorKey = Object.keys(validation.errors)[0];
      throw new AppError({
        code: 'INVALID_SEARCH_FILTERS',
        message: validation.errors[firstErrorKey],
        field: firstErrorKey,
      });
    }

    const { checkInDate, checkOutDate, roomTypeId, guests, minPrice, maxPrice } = validation.sanitized;
    const nights = validation.dateValidation.nights;

    // 2. Lấy danh sách phòng và loại phòng từ CSDL
    const [allRooms, allRoomTypes] = await Promise.all([
      this.roomRepo.findAllRooms(),
      this.roomRepo.findAllRoomTypes(),
    ]);

    const roomTypeMap = new Map<string, RoomType>();
    allRoomTypes.forEach(rt => roomTypeMap.set(rt.id, rt));

    const results: AvailableRoomResult[] = [];

    for (const room of allRooms) {
      // LOẠI TRỪ 1: Phòng đang bảo trì bị loại bỏ với mọi khoảng ngày
      if (room.status === 'maintenance') {
        continue;
      }

      const roomType = roomTypeMap.get(room.roomTypeId);
      if (!roomType) continue;

      // Lọc theo loại phòng nếu có chọn
      if (roomTypeId && room.roomTypeId !== roomTypeId) {
        continue;
      }

      // Lọc theo số lượng khách (sức chứa phòng phải đủ đón khách)
      if (guests && roomType.capacity < guests) {
        continue;
      }

      // Lọc theo khoảng giá mỗi đêm
      if (minPrice !== undefined && roomType.basePricePerNight < minPrice) {
        continue;
      }
      if (maxPrice !== undefined && roomType.basePricePerNight > maxPrice) {
        continue;
      }

      // LOẠI TRỪ 2: Kiểm tra trùng lịch với các booking đang hoạt động
      // Sử dụng quy tắc giao khoảng nửa mở [checkIn, checkOut)
      const overlappingBookings = await this.bookingRepo.findOverlapping(
        room.id,
        checkInDate,
        checkOutDate
      );

      // Nếu có booking trùng lịch, phòng không còn trống trong khoảng ngày này
      if (overlappingBookings.length > 0) {
        continue;
      }

      // Tính toán giá tiền chuẩn ở Control (VAT 8%)
      const priceCalc = calculateTotalAmount(nights, roomType.basePricePerNight);

      results.push({
        room,
        roomType,
        nights,
        subtotal: priceCalc.subtotal,
        vat: priceCalc.vat,
        totalAmount: priceCalc.total,
        depositAmount: Math.round(priceCalc.total * 0.3),
      });
    }

    return {
      nights,
      checkInDate,
      checkOutDate,
      results,
    };
  }

  /**
   * Lấy thông tin chi tiết một phòng kèm loại phòng
   */
  public async getRoomDetail(roomId: string): Promise<RoomWithType | null> {
    const room = await this.roomRepo.findRoomById(roomId);
    if (!room) return null;
    const roomType = await this.roomRepo.findRoomTypeById(room.roomTypeId);
    if (!roomType) return null;
    return {
      ...room,
      roomType,
    };
  }

  /**
   * Lấy toàn bộ danh sách phòng và loại phòng (cho trang quản trị nhân viên)
   */
  public async getAllRoomsWithTypes(): Promise<RoomWithType[]> {
    const [rooms, roomTypes] = await Promise.all([
      this.roomRepo.findAllRooms(),
      this.roomRepo.findAllRoomTypes(),
    ]);

    const map = new Map<string, RoomType>();
    roomTypes.forEach(rt => map.set(rt.id, rt));

    return rooms.map(r => ({
      ...r,
      roomType: map.get(r.roomTypeId) || {
        id: r.roomTypeId,
        name: 'Chưa xác định',
        capacity: 1,
        basePricePerNight: 0,
        amenities: [],
        description: '',
      },
    }));
  }

  public async getAllRoomTypes(): Promise<RoomType[]> {
    return this.roomRepo.findAllRoomTypes();
  }

  /**
   * Nhân viên thêm phòng mới
   */
  public async createRoom(data: {
    roomNumber: string;
    floor: number;
    roomTypeId: string;
    status?: RoomStatus;
    note?: string;
  }): Promise<Room> {
    // 1. Validate
    const validation = validateRoomInput(data);
    if (!validation.isValid) {
      const firstKey = Object.keys(validation.errors)[0];
      throw new AppError({
        code: 'INVALID_ROOM_DATA',
        message: validation.errors[firstKey],
        field: firstKey,
      });
    }

    const { roomNumber, floor, roomTypeId, status, note } = validation.sanitized;

    // 2. Kiểm tra số phòng duy nhất
    const existing = await this.roomRepo.findRoomByNumber(roomNumber);
    if (existing) {
      throw new AppError({
        code: 'ROOM_NUMBER_EXISTS',
        message: `Số phòng "${roomNumber}" đã tồn tại trong hệ thống. Vui lòng chọn số khác.`,
        field: 'roomNumber',
      });
    }

    // 3. Kiểm tra loại phòng tồn tại
    const roomType = await this.roomRepo.findRoomTypeById(roomTypeId);
    if (!roomType) {
      throw new AppError({
        code: 'ROOM_TYPE_NOT_FOUND',
        message: 'Loại phòng đã chọn không tồn tại.',
        field: 'roomTypeId',
      });
    }

    const newRoom: Room = {
      id: `R_${Date.now()}`,
      roomNumber,
      floor,
      roomTypeId,
      status: status || 'available',
      note,
    };

    return this.roomRepo.createRoom(newRoom);
  }

  /**
   * Nhân viên cập nhật thông tin phòng
   */
  public async updateRoom(
    id: string,
    data: {
      roomNumber: string;
      floor: number;
      roomTypeId: string;
      note?: string;
    }
  ): Promise<Room> {
    const room = await this.roomRepo.findRoomById(id);
    if (!room) {
      throw new AppError({
        code: 'ROOM_NOT_FOUND',
        message: 'Không tìm thấy phòng cần sửa.',
      });
    }

    const validation = validateRoomInput({ ...data, status: room.status });
    if (!validation.isValid) {
      const firstKey = Object.keys(validation.errors)[0];
      throw new AppError({
        code: 'INVALID_ROOM_DATA',
        message: validation.errors[firstKey],
        field: firstKey,
      });
    }

    const { roomNumber, floor, roomTypeId, note } = validation.sanitized;

    // Nếu đổi số phòng, kiểm tra trùng
    if (roomNumber !== room.roomNumber) {
      const existing = await this.roomRepo.findRoomByNumber(roomNumber);
      if (existing && existing.id !== id) {
        throw new AppError({
          code: 'ROOM_NUMBER_EXISTS',
          message: `Số phòng "${roomNumber}" đã được sử dụng bởi phòng khác.`,
          field: 'roomNumber',
        });
      }
    }

    return this.roomRepo.updateRoom(id, {
      roomNumber,
      floor,
      roomTypeId,
      note,
    });
  }

  /**
   * Nhân viên xóa phòng:
   * CHẶN XOÁ nếu phòng đang có booking pending, confirmed, hoặc checked_in
   */
  public async deleteRoom(id: string): Promise<void> {
    const room = await this.roomRepo.findRoomById(id);
    if (!room) {
      throw new AppError({
        code: 'ROOM_NOT_FOUND',
        message: 'Không tìm thấy phòng cần xóa.',
      });
    }

    const activeBookings = await this.bookingRepo.findActiveBookingsByRoomId(id);
    if (activeBookings.length > 0) {
      throw new AppError({
        code: 'ROOM_HAS_ACTIVE_BOOKINGS',
        message: `Không thể xóa phòng ${room.roomNumber}! Phòng này hiện đang có ${activeBookings.length} đơn đặt phòng đang hoạt động (chờ duyệt/đã xác nhận/đang ở).`,
      });
    }

    await this.roomRepo.deleteRoom(id);
  }

  /**
   * Nhân viên cập nhật trạng thái phòng (State Machine):
   * - Kiểm tra chuyển đổi hợp lệ bằng RoomStateMachine
   * - Không cho chuyển về available khi đang có khách checked_in
   * - Cảnh báo nếu chuyển sang maintenance khi có booking xác nhận trong 7 ngày tới
   * - Ghi nhận lịch sử roomStatusHistory
   */
  public async updateRoomStatus(
    roomId: string,
    newStatus: RoomStatus,
    staffUsername: string,
    note?: string,
    forceConfirm = false
  ): Promise<{ room: Room; warning?: string }> {
    const room = await this.roomRepo.findRoomById(roomId);
    if (!room) {
      throw new AppError({
        code: 'ROOM_NOT_FOUND',
        message: 'Không tìm thấy phòng.',
      });
    }

    // 1. Kiểm tra State Machine
    RoomStateMachine.validateTransition(room.status, newStatus);

    // 2. Không cho chuyển về available khi đang có khách checked_in
    if (newStatus === 'available') {
      const activeBookings = await this.bookingRepo.findActiveBookingsByRoomId(roomId);
      const checkedInBooking = activeBookings.find(b => b.status === 'checked_in');
      if (checkedInBooking) {
        throw new AppError({
          code: 'CANNOT_SET_AVAILABLE_WHILE_OCCUPIED',
          message: `Không thể chuyển phòng ${room.roomNumber} sang "Sẵn sàng" vì khách hàng (${checkedInBooking.customerName}) đang làm thủ tục lưu trú trong phòng. Vui lòng thực hiện thủ tục trả phòng trước!`,
        });
      }
    }

    // 3. Cảnh báo nếu chuyển sang maintenance khi có booking confirmed trong 7 ngày tới
    let warning: string | undefined = undefined;
    if (newStatus === 'maintenance') {
      const upcomingBookings = await this.bookingRepo.findConfirmedBookingsInNextDays(roomId, 7);
      if (upcomingBookings.length > 0 && !forceConfirm) {
        warning = `Phòng ${room.roomNumber} đang có ${upcomingBookings.length} đơn đặt phòng ĐÃ XÁC NHẬN trong 7 ngày tới. Bạn có chắc chắn muốn chuyển sang trạng thái Bảo dưỡng không?`;
        return { room, warning };
      }
    }

    // 4. Cập nhật trạng thái
    const updated = await this.roomRepo.updateRoomStatus(roomId, newStatus);

    // 5. Ghi lịch sử
    await this.historyRepo.addRoomHistory({
      id: `RSH_${Date.now()}`,
      roomId,
      fromStatus: room.status,
      toStatus: newStatus,
      changedBy: staffUsername,
      changedAt: new Date().toISOString(),
      note: note || `Đổi trạng thái từ ${room.status} sang ${newStatus}`,
    });

    return { room: updated };
  }
}
