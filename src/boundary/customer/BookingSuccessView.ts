/**
 * Giao diện Đặt phòng thành công (Boundary - BookingSuccessView)
 */

import { BookingRepository } from '../../repository/BookingRepository';
import { RoomRepository } from '../../repository/RoomRepository';
import { PaymentRepository } from '../../repository/PaymentRepository';
import { formatMoney } from '../../utils/money';
import { formatDateDisplay } from '../../utils/dateUtils';
import { escapeHtml } from '../../utils/sanitize';
import { Toast } from '../components/Toast';

export class BookingSuccessView {
  private container: HTMLElement;
  private code: string;
  private bookingRepo = new BookingRepository();
  private roomRepo = new RoomRepository();
  private paymentRepo = new PaymentRepository();

  constructor(container: HTMLElement, code: string, _phone: string) {
    this.container = container;
    this.code = code;
  }

  public async render(): Promise<void> {
    const booking = await this.bookingRepo.findBookingByCode(this.code);
    if (!booking) {
      this.container.innerHTML = `
        <div class="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
          <h3 class="font-bold text-slate-800 text-lg mb-2">Không tìm thấy thông tin</h3>
          <p class="text-sm text-slate-600 mb-6">Mã đặt phòng không tồn tại.</p>
          <a href="#/" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold">Về trang chủ</a>
        </div>
      `;
      return;
    }

    const room = await this.roomRepo.findRoomById(booking.roomId);
    const roomType = room ? await this.roomRepo.findRoomTypeById(room.roomTypeId) : null;
    const payment = await this.paymentRepo.findPaymentByBookingId(booking.id);

    this.container.innerHTML = `
      <div class="max-w-2xl mx-auto space-y-6">
        <!-- Success Card -->
        <div class="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200 text-center">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/10">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>

          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Đặt phòng thành công
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Cảm ơn bạn đã đặt phòng!
          </h1>
          <p class="text-slate-500 text-sm mt-2">
            Đơn đặt phòng của bạn đã được tiếp nhận và đang chờ nhân viên kiểm duyệt.
          </p>

          <!-- Crucial Reminder Box -->
          <div class="my-6 p-4 sm:p-5 bg-amber-50 rounded-2xl border border-amber-200 text-left flex items-start gap-3">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <div class="text-xs text-amber-900 leading-relaxed">
              <strong class="font-bold block text-sm mb-1">LƯU Ý QUAN TRỌNG:</strong>
              Khách hàng không cần tài khoản đăng nhập. Để <strong>tra cứu hoặc hủy phòng</strong>, bạn bắt buộc phải nhập đúng cả hai thông tin:
              <ul class="list-disc list-inside mt-1.5 space-y-0.5 font-medium">
                <li>Mã đặt phòng: <span class="font-mono font-bold text-blue-700 text-sm">${escapeHtml(booking.bookingCode)}</span></li>
                <li>Số điện thoại đặt phòng: <span class="font-mono font-bold text-slate-800 text-sm">${escapeHtml(booking.customerPhone)}</span></li>
              </ul>
            </div>
          </div>

          <!-- Booking Code Box with Copy Button -->
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div class="text-left">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">MÃ ĐẶT PHÒNG CỦA BẠN</span>
              <div class="text-2xl font-black font-mono text-blue-600 tracking-wider">${escapeHtml(booking.bookingCode)}</div>
            </div>
            <button
              type="button"
              id="btn-copy-code"
              class="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              <span>Sao chép mã</span>
            </button>
          </div>

          <!-- Summary details -->
          <div class="mt-6 border-t border-slate-100 pt-6 text-xs text-left space-y-2.5">
            <div class="flex justify-between py-1 border-b border-slate-50">
              <span class="text-slate-500">Phòng &amp; Loại phòng:</span>
              <strong class="text-slate-800">Phòng ${room?.roomNumber || 'N/A'} - ${roomType?.name || ''}</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-50">
              <span class="text-slate-500">Thời gian lưu trú:</span>
              <strong class="text-slate-800">${formatDateDisplay(booking.checkInDate)} &rarr; ${formatDateDisplay(booking.checkOutDate)} (${booking.nights} đêm)</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-50">
              <span class="text-slate-500">Người đại diện đặt:</span>
              <strong class="text-slate-800">${escapeHtml(booking.customerName)} (${escapeHtml(booking.customerPhone)})</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-50">
              <span class="text-slate-500">Tổng chi phí (VAT 8%):</span>
              <strong class="text-blue-600 font-bold text-sm">${formatMoney(booking.totalAmount)}</strong>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-slate-500">Tình trạng thanh toán:</span>
              <span class="font-bold ${payment?.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}">
                ${payment?.status === 'paid' ? 'ĐÃ THANH TOÁN THÀNH CÔNG' : 'CHƯA THANH TOÁN (THANH TOÁN TẠI QUẦY)'}
              </span>
            </div>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#/lookup?code=${encodeURIComponent(booking.bookingCode)}&phone=${encodeURIComponent(booking.customerPhone)}"
              class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all text-center"
            >
              Tra cứu đơn đặt này
            </a>
            <a
              href="#/"
              class="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition-all text-center"
            >
              Về trang tìm phòng
            </a>
          </div>
        </div>
      </div>
    `;

    // Gắn sự kiện copy
    const copyBtn = this.container.querySelector('#btn-copy-code');
    copyBtn?.addEventListener('click', () => {
      navigator.clipboard.writeText(booking.bookingCode);
      Toast.success('Đã sao chép mã đặt phòng vào bộ nhớ tạm.');
    });
  }
}
