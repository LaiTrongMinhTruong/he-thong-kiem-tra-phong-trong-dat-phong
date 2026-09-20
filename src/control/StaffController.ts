/**
 * Controller xử lý nghiệp vụ xác thực và tác vụ của Nhân viên (Staff)
 */

import { StaffRepository } from '../repository/StaffRepository';
import { BookingRepository } from '../repository/BookingRepository';
import { RoomRepository } from '../repository/RoomRepository';
import { HistoryRepository } from '../repository/HistoryRepository';
import { PaymentRepository } from '../repository/PaymentRepository';
import { Booking, BookingStateMachine, BookingStatus } from '../entities/Booking';
import { RoomStateMachine } from '../entities/Room';
import { StaffSession, StaffSessionData } from '../utils/session';
import { hashPassword } from '../utils/crypto';
import { RateLimiter } from '../utils/rateLimiter';
import { AppError } from '../entities/AppError';

export class StaffController {
  private staffRepo: StaffRepository;
  private bookingRepo: BookingRepository;
  private roomRepo: RoomRepository;
  private historyRepo: HistoryRepository;
  private paymentRepo: PaymentRepository;
  private loginLimiter: RateLimiter;

  constructor(
    staffRepo = new StaffRepository(),
    bookingRepo = new BookingRepository(),
    roomRepo = new RoomRepository(),
    historyRepo = new HistoryRepository(),
    paymentRepo = new PaymentRepository()
  ) {
    this.staffRepo = staffRepo;
    this.bookingRepo = bookingRepo;
    this.roomRepo = roomRepo;
    this.historyRepo = historyRepo;
    this.paymentRepo = paymentRepo;
    this.loginLimiter = new RateLimiter('staff_login', 5, 60);
  }

  /**
   * Đăng nhập nhân viên:
   * - Kiểm tra số lần thử sai (Rate limit: 5 lần / 60s)
   * - Băm mật khẩu bằng SHA-256 và so khớp hash trong DB
   */
  public async login(username: string, plainPassword: string): Promise<StaffSessionData> {
    const limitCheck = this.loginLimiter.check();
    if (!limitCheck.allowed) {
      throw new AppError({
        code: 'LOGIN_LOCKED',
        message: `Tài khoản tạm thời bị khóa do đăng nhập sai quá 5 lần. Vui lòng thử lại sau ${limitCheck.waitSeconds} giây.`,
      });
    }

    const cleanUsername = username.trim();
    if (!cleanUsername || !plainPassword) {
      throw new AppError({
        code: 'MISSING_CREDENTIALS',
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.',
      });
    }

    const staff = await this.staffRepo.findByUsername(cleanUsername);
    if (!staff || staff.status !== 'active') {
      this.loginLimiter.recordFailure();
      const remaining = this.loginLimiter.check().remainingAttempts;
      throw new AppError({
        code: 'INVALID_CREDENTIALS',
        message: `Tên đăng nhập hoặc mật khẩu không chính xác. (Còn ${remaining} lần thử).`,
      });
    }

    const inputHash = await hashPassword(plainPassword);
    if (inputHash !== staff.passwordHash) {
      this.loginLimiter.recordFailure();
      const remaining = this.loginLimiter.check().remainingAttempts;
      throw new AppError({
        code: 'INVALID_CREDENTIALS',
        message: `Tên đăng nhập hoặc mật khẩu không chính xác. (Còn ${remaining} lần thử).`,
      });
    }

    // Đăng nhập thành công
    this.loginLimiter.reset();
    const sessionData = {
      id: staff.id,
      username: staff.username,
      fullName: staff.fullName,
      status: staff.status,
    };
    StaffSession.set(sessionData);
    return StaffSession.get()!;
  }

  public logout(): void {
    StaffSession.clear();
  }

  public getCurrentStaff(): StaffSessionData | null {
    return StaffSession.get();
  }

  /**
   * Nhân viên xác nhận đặt phòng:
   * - Chỉ xác nhận được booking đang 'pending'
   * - Kiểm tra lại trùng lịch lần cuối
   * - Đưa ra cảnh báo nếu thanh toán vẫn 'unpaid'
   */
  public async confirmBooking(
    bookingId: string,
    staffUsername: string
  ): Promise<{ booking: Booking; warning?: string }> {
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) {
      throw new AppError({
        code: 'BOOKING_NOT_FOUND',
        message: 'Không tìm thấy đơn đặt phòng.',
      });
    }

    // Kiểm tra State Machine
    BookingStateMachine.validateTransition(booking.status, 'confirmed');

    // Kiểm tra trùng lịch lần cuối trước khi xác nhận
    const overlaps = await this.bookingRepo.findOverlapping(
      booking.roomId,
      booking.checkInDate,
      booking.checkOutDate,
      booking.id
    );

    if (overlaps.length > 0) {
      throw new AppError({
        code: 'ROOM_CONFLICT',
        message: `Không thể xác nhận vì phòng này đã có đơn khác (${overlaps[0].bookingCode}) được xác nhận trùng lịch (${booking.checkInDate} -> ${booking.checkOutDate})!`,
      });
    }

    // Kiểm tra tình trạng thanh toán để cảnh báo
    const payment = await this.paymentRepo.findPaymentByBookingId(bookingId);
    let warning: string | undefined = undefined;
    if (!payment || payment.status === 'unpaid') {
      warning = 'Đơn này khách hàng chưa hoàn tất thanh toán (hoặc chọn thanh toán tiền mặt tại quầy).';
    }

    const updated = await this.bookingRepo.updateBooking(bookingId, {
      status: 'confirmed',
    });

    await this.historyRepo.addBookingHistory({
      id: `BH_${Date.now()}`,
      bookingId,
      fromStatus: booking.status,
      toStatus: 'confirmed',
      changedBy: staffUsername,
      changedAt: new Date().toISOString(),
      note: 'Nhân viên phê duyệt xác nhận đặt phòng.',
    });

    return { booking: updated, warning };
  }

  /**
   * Nhân viên làm thủ tục nhận phòng (Check-in)
   */
  public async checkIn(bookingId: string, staffUsername: string): Promise<Booking> {
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) throw new AppError({ code: 'BOOKING_NOT_FOUND', message: 'Không tìm thấy đơn đặt phòng.' });

    BookingStateMachine.validateTransition(booking.status, 'checked_in');

    const updatedBooking = await this.bookingRepo.updateBooking(bookingId, {
      status: 'checked_in',
    });

    // Cập nhật trạng thái phòng sang occupied
    const room = await this.roomRepo.findRoomById(booking.roomId);
    if (room) {
      RoomStateMachine.validateTransition(room.status, 'occupied');
      await this.roomRepo.updateRoomStatus(room.id, 'occupied');
      await this.historyRepo.addRoomHistory({
        id: `RSH_${Date.now()}`,
        roomId: room.id,
        fromStatus: room.status,
        toStatus: 'occupied',
        changedBy: staffUsername,
        changedAt: new Date().toISOString(),
        note: `Khách nhận phòng (Booking: ${booking.bookingCode})`,
      });
    }

    await this.historyRepo.addBookingHistory({
      id: `BH_${Date.now()}`,
      bookingId,
      fromStatus: booking.status,
      toStatus: 'checked_in',
      changedBy: staffUsername,
      changedAt: new Date().toISOString(),
      note: 'Nhân viên hoàn tất thủ tục Check-in cho khách.',
    });

    return updatedBooking;
  }

  /**
   * Nhân viên làm thủ tục trả phòng (Check-out)
   */
  public async checkOut(bookingId: string, staffUsername: string): Promise<Booking> {
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) throw new AppError({ code: 'BOOKING_NOT_FOUND', message: 'Không tìm thấy đơn đặt phòng.' });

    BookingStateMachine.validateTransition(booking.status, 'checked_out');

    const updatedBooking = await this.bookingRepo.updateBooking(bookingId, {
      status: 'checked_out',
    });

    // Chuyển phòng sang 'cleaning' để dọn dẹp
    const room = await this.roomRepo.findRoomById(booking.roomId);
    if (room) {
      RoomStateMachine.validateTransition(room.status, 'cleaning');
      await this.roomRepo.updateRoomStatus(room.id, 'cleaning');
      await this.historyRepo.addRoomHistory({
        id: `RSH_${Date.now()}`,
        roomId: room.id,
        fromStatus: room.status,
        toStatus: 'cleaning',
        changedBy: staffUsername,
        changedAt: new Date().toISOString(),
        note: `Khách trả phòng (Booking: ${booking.bookingCode}). Chuyển dọn vệ sinh.`,
      });
    }

    await this.historyRepo.addBookingHistory({
      id: `BH_${Date.now()}`,
      bookingId,
      fromStatus: booking.status,
      toStatus: 'checked_out',
      changedBy: staffUsername,
      changedAt: new Date().toISOString(),
      note: 'Nhân viên hoàn tất thủ tục Check-out.',
    });

    return updatedBooking;
  }

  /**
   * Đánh dấu khách không đến (No-show)
   */
  public async markNoShow(bookingId: string, staffUsername: string): Promise<Booking> {
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) throw new AppError({ code: 'BOOKING_NOT_FOUND', message: 'Không tìm thấy đơn đặt phòng.' });

    BookingStateMachine.validateTransition(booking.status, 'no_show');

    const updated = await this.bookingRepo.updateBooking(bookingId, { status: 'no_show' });

    await this.historyRepo.addBookingHistory({
      id: `BH_${Date.now()}`,
      bookingId,
      fromStatus: booking.status,
      toStatus: 'no_show',
      changedBy: staffUsername,
      changedAt: new Date().toISOString(),
      note: 'Nhân viên đánh dấu khách không đến nhận phòng (No-show).',
    });

    return updated;
  }

  /**
   * Nhân viên hủy đặt phòng
   */
  public async cancelBookingByStaff(bookingId: string, staffUsername: string, reason: string): Promise<Booking> {
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) throw new AppError({ code: 'BOOKING_NOT_FOUND', message: 'Không tìm thấy đơn đặt phòng.' });

    BookingStateMachine.validateTransition(booking.status, 'cancelled');

    const updated = await this.bookingRepo.updateBooking(bookingId, {
      status: 'cancelled',
      note: `Nhân viên hủy: ${reason}`,
    });

    await this.historyRepo.addBookingHistory({
      id: `BH_${Date.now()}`,
      bookingId,
      fromStatus: booking.status,
      toStatus: 'cancelled',
      changedBy: staffUsername,
      changedAt: new Date().toISOString(),
      note: `Nhân viên hủy đơn đặt phòng. Lý do: ${reason}`,
    });

    return updated;
  }

  /**
   * Lấy toàn bộ danh sách đơn đặt phòng kèm thông tin phòng & thanh toán
   */
  public async getAllBookingsWithDetails(statusFilter?: BookingStatus): Promise<Array<{
    booking: Booking;
    roomNumber: string;
    payment: { status: string; amount: number; method: string; type: string } | null;
  }>> {
    const [allBookings, allRooms, allPayments] = await Promise.all([
      this.bookingRepo.findAllBookings(),
      this.roomRepo.findAllRooms(),
      this.paymentRepo.findAllPayments(),
    ]);

    const roomMap = new Map<string, string>();
    allRooms.forEach(r => roomMap.set(r.id, r.roomNumber));

    const paymentMap = new Map<string, any>();
    allPayments.forEach((p: any) => paymentMap.set(p.bookingId, p));

    let list = allBookings;
    if (statusFilter) {
      list = list.filter(b => b.status === statusFilter);
    }

    // Sắp xếp mới nhất lên trước
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list.map(booking => {
      const pay = paymentMap.get(booking.id);
      return {
        booking,
        roomNumber: roomMap.get(booking.roomId) || 'N/A',
        payment: pay
          ? {
              status: pay.status,
              amount: pay.amount,
              method: pay.method,
              type: pay.type,
            }
          : null,
      };
    });
  }

  /**
   * Lấy số liệu thống kê tổng quan (Dashboard)
   */
  public async getDashboardStats(): Promise<{
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    cleaningRooms: number;
    maintenanceRooms: number;
    pendingBookings: number;
    todayCheckIns: number;
  }> {
    const [rooms, bookings] = await Promise.all([
      this.roomRepo.findAllRooms(),
      this.bookingRepo.findAllBookings(),
    ]);

    return {
      totalRooms: rooms.length,
      availableRooms: rooms.filter(r => r.status === 'available').length,
      occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
      cleaningRooms: rooms.filter(r => r.status === 'cleaning').length,
      maintenanceRooms: rooms.filter(r => r.status === 'maintenance').length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      todayCheckIns: bookings.filter(b => b.status === 'confirmed').length,
    };
  }
}
