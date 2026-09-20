/**
 * Controller xử lý toàn bộ nghiệp vụ Đặt phòng (Booking), Tra cứu & Hủy phòng
 * Tuân thủ đúng thứ tự trong Collaboration / Sequence Diagram
 */

import { Booking, BookingStateMachine } from '../entities/Booking';
import { RoomRepository } from '../repository/RoomRepository';
import { BookingRepository } from '../repository/BookingRepository';
import { HistoryRepository } from '../repository/HistoryRepository';
import { PaymentController } from './PaymentController';
import { validateBookingDates } from '../validation/dateValidator';
import { validateCustomerInfo } from '../validation/customerValidator';
import { validateLookupInput } from '../validation/lookupValidator';
import { generateBookingCode } from '../utils/bookingCode';
import { calculateTotalAmount, calculateRefund, calculateDepositAmount } from '../utils/money';
import { getLocalTodayString, getDaysFromToday } from '../utils/dateUtils';
import { RateLimiter } from '../utils/rateLimiter';
import { AppError } from '../entities/AppError';
import { Payment, PaymentMethod, PaymentType } from '../entities/Payment';
import { Room, RoomType } from '../entities/Room';

export interface BookRequestData {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  adults: number;
  children: number;
  note?: string;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
}

export interface BookingDetailsResult {
  booking: Booking;
  room: Room;
  roomType: RoomType;
  payment: Payment | null;
}

export class BookingController {
  private roomRepo: RoomRepository;
  private bookingRepo: BookingRepository;
  private historyRepo: HistoryRepository;
  private paymentCtrl: PaymentController;
  private lookupLimiter: RateLimiter;

  constructor(
    roomRepo = new RoomRepository(),
    bookingRepo = new BookingRepository(),
    historyRepo = new HistoryRepository(),
    paymentCtrl = new PaymentController()
  ) {
    this.roomRepo = roomRepo;
    this.bookingRepo = bookingRepo;
    this.historyRepo = historyRepo;
    this.paymentCtrl = paymentCtrl;
    this.lookupLimiter = new RateLimiter('booking_lookup', 5, 60);
  }

  /**
   * LUỒNG USE CASE TRỌNG TÂM: Khách hàng đặt phòng
   * Thứ tự: validate -> RoomRepository.findById() -> BookingRepository.findOverlapping() 
   *         -> PaymentController.createPayment() -> BookingRepository.create() -> trả kết quả
   */
  public async book(data: BookRequestData): Promise<{
    booking: Booking;
    payment: Payment;
    room: Room;
    roomType: RoomType;
  }> {
    // BƯỚC 1: Validate Ngày & Thông tin khách & Số lượng người (Lớp 2 - Control)
    const dateValidation = validateBookingDates(data.checkInDate, data.checkOutDate);
    if (!dateValidation.isValid) {
      const firstKey = Object.keys(dateValidation.errors)[0] as keyof typeof dateValidation.errors;
      throw new AppError({
        code: 'INVALID_BOOKING_DATES',
        message: dateValidation.errors[firstKey] || 'Ngày nhận hoặc trả phòng không hợp lệ.',
        field: firstKey,
      });
    }

    // BƯỚC 2: Kiểm tra phòng tồn tại và không ở trạng thái bảo dưỡng
    const room = await this.roomRepo.findRoomById(data.roomId);
    if (!room) {
      throw new AppError({
        code: 'ROOM_NOT_FOUND',
        message: 'Phòng được chọn không tồn tại hoặc đã ngừng phục vụ.',
      });
    }

    if (room.status === 'maintenance') {
      throw new AppError({
        code: 'ROOM_UNDER_MAINTENANCE',
        message: `Phòng ${room.roomNumber} hiện đang bảo dưỡng sửa chữa, không thể đặt lúc này.`,
      });
    }

    const roomType = await this.roomRepo.findRoomTypeById(room.roomTypeId);
    if (!roomType) {
      throw new AppError({
        code: 'ROOM_TYPE_NOT_FOUND',
        message: 'Không tìm thấy thông tin loại phòng tương ứng.',
      });
    }

    // Validate khách hàng theo sức chứa của loại phòng
    const customerValidation = validateCustomerInfo(
      {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        adults: data.adults,
        children: data.children,
      },
      roomType.capacity
    );

    if (!customerValidation.isValid) {
      const firstKey = Object.keys(customerValidation.errors)[0] as keyof typeof customerValidation.errors;
      throw new AppError({
        code: 'INVALID_CUSTOMER_INFO',
        message: customerValidation.errors[firstKey] || 'Thông tin khách hàng chưa hợp lệ.',
        field: firstKey,
      });
    }

    const { sanitized } = customerValidation;
    const nights = dateValidation.nights;

    // BƯỚC 3: Kiểm tra lại phòng trống ngay trước khi ghi (gọi findOverlapping() lần nữa, chống race condition)
    const overlappingBookings = await this.bookingRepo.findOverlapping(
      room.id,
      data.checkInDate,
      data.checkOutDate
    );

    if (overlappingBookings.length > 0) {
      throw new AppError({
        code: 'ROOM_ALREADY_BOOKED',
        message: `Rất tiếc! Phòng ${room.roomNumber} vừa có khách khác đặt trong khoảng thời gian ${data.checkInDate} đến ${data.checkOutDate}. Vui lòng chọn phòng hoặc ngày khác.`,
      });
    }

    // BƯỚC 4: Chống spam đặt trùng - Cùng 1 SĐT không được có 2 booking pending/confirmed trùng ngày nhau
    const duplicatePhoneBookings = await this.bookingRepo.findActiveBookingsByPhone(
      sanitized.customerPhone,
      data.checkInDate,
      data.checkOutDate
    );

    if (duplicatePhoneBookings.length > 0) {
      throw new AppError({
        code: 'DUPLICATE_PHONE_BOOKING',
        message: `Số điện thoại ${sanitized.customerPhone} đã có một đơn đặt phòng khác đang chờ duyệt hoặc đã xác nhận trong khoảng thời gian này.`,
      });
    }

    // BƯỚC 5: Sinh bookingCode duy nhất dạng BK + 8 ký tự, kiểm tra không trùng trong DB
    let bookingCode = '';
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      bookingCode = generateBookingCode();
      const existing = await this.bookingRepo.findBookingByCode(bookingCode);
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new AppError({
        code: 'CODE_GENERATION_FAILED',
        message: 'Hệ thống đang bận sinh mã đặt phòng, vui lòng thử lại.',
      });
    }

    // BƯỚC 6: Tính toán lại giá tiền chuẩn ở Control (VAT 8%)
    const priceCalculation = calculateTotalAmount(nights, roomType.basePricePerNight);
    const totalAmount = priceCalculation.total;

    // Xác định số tiền thanh toán (cọc 30% hoặc đủ 100%)
    const paymentAmount = data.paymentType === 'deposit'
      ? calculateDepositAmount(totalAmount)
      : totalAmount;

    const newBookingId = `B_${Date.now()}`;
    const nowIso = new Date().toISOString();

    // BƯỚC 7: Tạo hóa đơn thanh toán qua PaymentController (status: 'unpaid')
    const payment = await this.paymentCtrl.createPayment(
      newBookingId,
      paymentAmount,
      data.paymentType,
      data.paymentMethod,
      totalAmount
    );

    // BƯỚC 8: Ghi đơn đặt phòng BookingRepository.create() (status: 'pending')
    const newBooking: Booking = {
      id: newBookingId,
      bookingCode,
      customerName: sanitized.customerName,
      customerPhone: sanitized.customerPhone,
      customerEmail: sanitized.customerEmail,
      roomId: room.id,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      adults: sanitized.adults,
      children: sanitized.children,
      nights,
      totalAmount,
      status: 'pending',
      note: data.note?.trim(),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const savedBooking = await this.bookingRepo.createBooking(newBooking);

    // BƯỚC 9: Ghi lịch sử bookingHistory
    await this.historyRepo.addBookingHistory({
      id: `BH_${Date.now()}`,
      bookingId: newBookingId,
      fromStatus: 'none',
      toStatus: 'pending',
      changedBy: 'customer',
      changedAt: nowIso,
      note: `Khách hàng đặt phòng qua website. Mã: ${bookingCode}`,
    });

    return {
      booking: savedBooking,
      payment,
      room,
      roomType,
    };
  }

  /**
   * Tra cứu thông tin đặt phòng bằng mã đặt phòng + số điện thoại (Bắt buộc cả hai)
   * Có giới hạn thử sai (Rate Limiting: 5 lần / 60 giây)
   */
  public async lookupBooking(
    bookingCode: string,
    customerPhone: string
  ): Promise<BookingDetailsResult> {
    // 1. Kiểm tra giới hạn số lần thử
    const limitCheck = this.lookupLimiter.check();
    if (!limitCheck.allowed) {
      throw new AppError({
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Bạn đã thử tra cứu sai quá 5 lần. Vui lòng chờ ${limitCheck.waitSeconds} giây trước khi thử lại.`,
      });
    }

    // 2. Validate input
    const validation = validateLookupInput({ bookingCode, customerPhone });
    if (!validation.isValid) {
      const firstKey = Object.keys(validation.errors)[0] as keyof typeof validation.errors;
      throw new AppError({
        code: 'INVALID_LOOKUP_INPUT',
        message: validation.errors[firstKey] || 'Thông tin tra cứu không hợp lệ.',
        field: firstKey,
      });
    }

    // 3. Tìm kiếm trong CSDL
    const booking = await this.bookingRepo.findBookingByCodeAndPhone(
      validation.sanitized.bookingCode,
      validation.sanitized.customerPhone
    );

    if (!booking) {
      this.lookupLimiter.recordFailure();
      const remaining = this.lookupLimiter.check().remainingAttempts;
      throw new AppError({
        code: 'BOOKING_NOT_FOUND',
        message: `Không tìm thấy đặt phòng phù hợp với mã "${validation.sanitized.bookingCode}" và số điện thoại đã nhập. (Còn ${remaining} lần thử).`,
      });
    }

    // Tra cứu thành công -> reset bộ đếm
    this.lookupLimiter.reset();

    // Lấy thông tin phòng, loại phòng và thanh toán liên quan
    const room = await this.roomRepo.findRoomById(booking.roomId);
    const roomType = room ? await this.roomRepo.findRoomTypeById(room.roomTypeId) : null;
    const payment = await this.paymentCtrl.getPaymentByBookingId(booking.id);

    return {
      booking,
      room: room || {
        id: booking.roomId,
        roomNumber: 'N/A',
        roomTypeId: 'N/A',
        floor: 1,
        status: 'available',
      },
      roomType: roomType || {
        id: 'N/A',
        name: 'Phòng tiêu chuẩn',
        capacity: 2,
        basePricePerNight: 0,
        amenities: [],
        description: '',
      },
      payment,
    };
  }

  /**
   * Xem trước thông tin hủy phòng & chính sách hoàn tiền
   */
  public async previewCancel(
    bookingCode: string,
    customerPhone: string
  ): Promise<{
    booking: Booking;
    payment: Payment | null;
    daysUntilCheckIn: number;
    refundPercent: number;
    refundAmount: number;
    refundDescription: string;
    canCancel: boolean;
    reasonBlocked?: string;
  }> {
    const details = await this.lookupBooking(bookingCode, customerPhone);
    const { booking, payment } = details;
    const today = getLocalTodayString();

    // Kiểm tra điều kiện được hủy:
    // 1. Trạng thái phải là pending hoặc confirmed
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return {
        booking,
        payment,
        daysUntilCheckIn: 0,
        refundPercent: 0,
        refundAmount: 0,
        refundDescription: 'Đơn này không thể hủy.',
        canCancel: false,
        reasonBlocked: `Không thể hủy đơn đặt phòng ở trạng thái "${booking.status}". Đơn đã hoàn tất hoặc đã bị hủy trước đó.`,
      };
    }

    // 2. hôm nay < checkInDate
    if (today >= booking.checkInDate) {
      return {
        booking,
        payment,
        daysUntilCheckIn: 0,
        refundPercent: 0,
        refundAmount: 0,
        refundDescription: 'Không thể hủy vào hoặc sau ngày nhận phòng.',
        canCancel: false,
        reasonBlocked: `Ngày nhận phòng là ${booking.checkInDate}. Đã đến hoặc quá ngày nhận phòng, hệ thống không cho phép hủy trực tuyến. Vui lòng liên hệ trực tiếp lễ tân khách sạn.`,
      };
    }

    const daysUntilCheckIn = getDaysFromToday(booking.checkInDate);
    const paidAmount = (payment && payment.status === 'paid') ? payment.amount : 0;
    const refundInfo = calculateRefund(paidAmount, daysUntilCheckIn);

    return {
      booking,
      payment,
      daysUntilCheckIn,
      refundPercent: refundInfo.refundPercent,
      refundAmount: refundInfo.refundAmount,
      refundDescription: refundInfo.description,
      canCancel: true,
    };
  }

  /**
   * Thực hiện Hủy phòng (Khách hàng xác nhận)
   */
  public async cancelBooking(
    bookingCode: string,
    customerPhone: string,
    reason?: string
  ): Promise<{
    booking: Booking;
    refundAmount: number;
  }> {
    const preview = await this.previewCancel(bookingCode, customerPhone);
    if (!preview.canCancel) {
      throw new AppError({
        code: 'CANNOT_CANCEL_BOOKING',
        message: preview.reasonBlocked || 'Không thể hủy đơn đặt phòng này.',
      });
    }

    const { booking, payment, refundAmount } = preview;

    // Kiểm tra State Machine
    BookingStateMachine.validateTransition(booking.status, 'cancelled');

    // 1. Cập nhật booking status = 'cancelled'
    const updatedBooking = await this.bookingRepo.updateBooking(booking.id, {
      status: 'cancelled',
      note: reason ? `Khách hủy: ${reason}` : 'Khách hủy phòng qua website',
    });

    // 2. Cập nhật thanh toán nếu đã trả tiền
    if (payment) {
      await this.paymentCtrl['paymentRepo'].updatePayment(payment.id, {
        refundAmount,
        status: refundAmount > 0 ? 'refunded' : payment.status,
      });
    }

    // 3. Ghi lịch sử bookingHistory
    await this.historyRepo.addBookingHistory({
      id: `BH_${Date.now()}`,
      bookingId: booking.id,
      fromStatus: booking.status,
      toStatus: 'cancelled',
      changedBy: 'customer',
      changedAt: new Date().toISOString(),
      note: `Khách hủy phòng. Hoàn tiền: ${refundAmount.toLocaleString('vi-VN')} đ (${preview.refundPercent}%). Lý do: ${reason || 'Không nêu'}`,
    });

    return {
      booking: updatedBooking,
      refundAmount,
    };
  }
}
