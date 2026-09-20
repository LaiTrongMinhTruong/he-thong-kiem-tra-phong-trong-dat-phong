/**
 * Giao diện Tra cứu & Hủy phòng (Boundary - BookingLookupView)
 * Chỉ gọi BookingController, tuân thủ chặt chẽ nghiệp vụ bảo mật và chính sách hoàn tiền
 */

import { BookingController, BookingDetailsResult } from '../../control/BookingController';
import { HistoryRepository } from '../../repository/HistoryRepository';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { formatMoney } from '../../utils/money';
import { formatDateDisplay, getDaysFromToday, getLocalTodayString } from '../../utils/dateUtils';
import { escapeHtml } from '../../utils/sanitize';
import { BookingStatusBadges, BookingStatusLabels } from '../../entities/Booking';
import { PaymentStatusBadges, PaymentStatusLabels, PaymentMethodLabels } from '../../entities/Payment';

export class BookingLookupView {
  private container: HTMLElement;
  private bookingCtrl: BookingController;
  private historyRepo: HistoryRepository;

  private bookingCodeInput = '';
  private customerPhoneInput = '';
  private activeDetails: BookingDetailsResult | null = null;
  private isSearching = false;

  constructor(
    container: HTMLElement,
    initialParams?: { code?: string; phone?: string },
    bookingCtrl = new BookingController(),
    historyRepo = new HistoryRepository()
  ) {
    this.container = container;
    this.bookingCtrl = bookingCtrl;
    this.historyRepo = historyRepo;
    if (initialParams?.code) this.bookingCodeInput = initialParams.code;
    if (initialParams?.phone) this.customerPhoneInput = initialParams.phone;
  }

  public async render(): Promise<void> {
    this.container.innerHTML = `
      <div class="max-w-3xl mx-auto space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-slate-900">Tra cứu &amp; Quản lý Đặt phòng</h1>
          <p class="text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
            Để bảo vệ thông tin khách hàng, vui lòng cung cấp chính xác <strong>Mã đặt phòng</strong> và <strong>Số điện thoại</strong> đã đăng ký.
          </p>
        </div>

        <!-- Lookup Form Card -->
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <form id="lookup-form" class="space-y-4" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="lookup-code" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mã đặt phòng <span class="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="lookup-code"
                  placeholder="Ví dụ: BKTEST01"
                  value="${escapeHtml(this.bookingCodeInput)}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 uppercase"
                  required
                />
                <p id="err-lookup-code" class="text-xs text-rose-600 mt-1 hidden"></p>
              </div>

              <div>
                <label for="lookup-phone" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại đặt phòng <span class="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="lookup-phone"
                  placeholder="Ví dụ: 0912345678"
                  value="${escapeHtml(this.customerPhoneInput)}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p id="err-lookup-phone" class="text-xs text-rose-600 mt-1 hidden"></p>
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button
                type="submit"
                id="btn-submit-lookup"
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Tra cứu đặt phòng</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Result Container -->
        <div id="lookup-result-container">
          <!-- Kết quả tra cứu sẽ render ở đây -->
        </div>
      </div>
    `;

    this.bindFormEvents();

    // Nếu đã có sẵn code và phone trong URL -> tự động tra cứu
    if (this.bookingCodeInput && this.customerPhoneInput) {
      await this.executeLookup();
    }
  }

  private bindFormEvents(): void {
    const form = this.container.querySelector('#lookup-form') as HTMLFormElement;
    const codeInput = this.container.querySelector('#lookup-code') as HTMLInputElement;
    const phoneInput = this.container.querySelector('#lookup-phone') as HTMLInputElement;

    form?.addEventListener('submit', async e => {
      e.preventDefault();
      this.bookingCodeInput = codeInput.value.trim().toUpperCase();
      this.customerPhoneInput = phoneInput.value.trim();
      await this.executeLookup();
    });
  }

  private async executeLookup(): Promise<void> {
    if (this.isSearching) return;
    this.isSearching = true;

    const btn = this.container.querySelector('#btn-submit-lookup') as HTMLButtonElement;
    const resultContainer = this.container.querySelector('#lookup-result-container');

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="inline-block animate-spin mr-2">&#9696;</span> Đang kiểm tra...';
    }

    if (resultContainer) {
      resultContainer.innerHTML = `
        <div class="py-12 text-center text-slate-500">
          <div class="inline-block animate-spin text-3xl mb-3 text-blue-600">&#9696;</div>
          <p class="text-sm">Đang xác thực thông tin đặt phòng...</p>
        </div>
      `;
    }

    try {
      this.activeDetails = await this.bookingCtrl.lookupBooking(
        this.bookingCodeInput,
        this.customerPhoneInput
      );
      Toast.success('Đã tìm thấy thông tin đơn đặt phòng.');
      await this.renderBookingDetails();
    } catch (err: any) {
      Toast.error(err.message || 'Không tìm thấy thông tin đặt phòng phù hợp.');
      if (resultContainer) {
        resultContainer.innerHTML = `
          <div class="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-700">
            <svg class="w-8 h-8 text-rose-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h4 class="font-bold text-base mb-1">Tra cứu không thành công</h4>
            <p class="text-sm">${escapeHtml(err.message)}</p>
          </div>
        `;
      }
    } finally {
      this.isSearching = false;
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Tra cứu đặt phòng</span>';
      }
    }
  }

  private async renderBookingDetails(): Promise<void> {
    if (!this.activeDetails) return;
    const { booking, room, roomType, payment } = this.activeDetails;
    const resultContainer = this.container.querySelector('#lookup-result-container');
    if (!resultContainer) return;

    const today = getLocalTodayString();
    const canCancel = (booking.status === 'pending' || booking.status === 'confirmed') && today < booking.checkInDate;
    const daysUntilCheckIn = getDaysFromToday(booking.checkInDate);

    // Tải lịch sử biến động của booking này
    const histories = await this.historyRepo.findBookingHistory(booking.id);

    resultContainer.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
        <!-- Top status bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">MÃ ĐẶT PHÒNG:</span>
              <span class="font-mono font-black text-xl text-blue-700">${escapeHtml(booking.bookingCode)}</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">Tạo lúc: ${new Date(booking.createdAt).toLocaleString('vi-VN')}</p>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold border ${BookingStatusBadges[booking.status]}">
              ${BookingStatusLabels[booking.status]}
            </span>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Room info -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
            <h4 class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              Thông tin phòng
            </h4>
            <div class="flex justify-between">
              <span class="text-slate-500">Số phòng:</span>
              <strong class="text-slate-800">Phòng ${escapeHtml(room.roomNumber)} (Tầng ${room.floor})</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Loại phòng:</span>
              <strong class="text-slate-800">${escapeHtml(roomType.name)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Thời gian lưu trú:</span>
              <strong class="text-slate-800">${formatDateDisplay(booking.checkInDate)} &rarr; ${formatDateDisplay(booking.checkOutDate)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Số đêm:</span>
              <strong class="text-blue-600">${booking.nights} đêm</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Số khách:</span>
              <strong class="text-slate-800">${booking.adults} người lớn${booking.children > 0 ? `, ${booking.children} trẻ em` : ''}</strong>
            </div>
          </div>

          <!-- Customer & Payment info -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
            <h4 class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Thông tin người đặt &amp; Thanh toán
            </h4>
            <div class="flex justify-between">
              <span class="text-slate-500">Khách hàng:</span>
              <strong class="text-slate-800">${escapeHtml(booking.customerName)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Số điện thoại:</span>
              <strong class="text-slate-800 font-mono">${escapeHtml(booking.customerPhone)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Email:</span>
              <strong class="text-slate-800">${escapeHtml(booking.customerEmail)}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Tổng tiền đơn đặt (VAT 8%):</span>
              <strong class="text-blue-600 font-bold text-sm">${formatMoney(booking.totalAmount)}</strong>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="text-slate-500">Tình trạng thanh toán:</span>
              ${payment ? `
                <span class="px-2 py-0.5 rounded text-[11px] font-bold border ${PaymentStatusBadges[payment.status]}">
                  ${PaymentStatusLabels[payment.status]} (${PaymentMethodLabels[payment.method]})
                </span>
              ` : '<span class="text-slate-400">Chưa có hóa đơn</span>'}
            </div>
            ${payment && payment.refundAmount > 0 ? `
              <div class="flex justify-between text-rose-600 font-bold pt-1">
                <span>Số tiền đã hoàn lại:</span>
                <span>${formatMoney(payment.refundAmount)}</span>
              </div>
            ` : ''}
          </div>
        </div>

        ${booking.note ? `
          <div class="text-xs text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong>Ghi chú:</strong> ${escapeHtml(booking.note)}
          </div>
        ` : ''}

        <!-- Timeline Lịch sử biến động trạng thái -->
        <div class="pt-4 border-t border-slate-100">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Lịch sử xử lý đơn đặt phòng
          </h4>
          <div class="space-y-3">
            ${histories.map(h => `
              <div class="flex items-start text-xs text-slate-600 gap-2.5">
                <span class="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0"></span>
                <div>
                  <span class="font-bold text-slate-800">${new Date(h.changedAt).toLocaleString('vi-VN')}:</span>
                  <span class="text-slate-600">${escapeHtml(h.note || 'Cập nhật trạng thái')}</span>
                  <span class="text-slate-400 font-mono text-[11px]">(${h.changedBy})</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Action Box (Hủy phòng) -->
        <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-xs text-slate-500">
            ${canCancel ? `
              <span>Còn <strong>${daysUntilCheckIn} ngày</strong> tới ngày nhận phòng. Bạn có thể yêu cầu hủy đặt phòng trực tuyến.</span>
            ` : `
              <span class="text-slate-400">Đơn đặt phòng không trong diện được hủy trực tuyến (${BookingStatusLabels[booking.status]}).</span>
            `}
          </div>

          ${canCancel ? `
            <button
              type="button"
              id="btn-request-cancel"
              class="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all shadow-sm"
            >
              Hủy đặt phòng này
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // Gắn sự kiện hủy phòng
    if (canCancel) {
      const cancelBtn = resultContainer.querySelector('#btn-request-cancel');
      cancelBtn?.addEventListener('click', () => this.handleCancelClick());
    }
  }

  /**
   * Xử lý xác nhận hủy phòng 2 bước & chính sách hoàn tiền
   */
  private async handleCancelClick(): Promise<void> {
    if (!this.activeDetails) return;
    const { booking } = this.activeDetails;

    try {
      // 1. Gọi previewCancel() để lấy chính sách hoàn tiền và tỷ lệ hoàn
      const preview = await this.bookingCtrl.previewCancel(
        booking.bookingCode,
        booking.customerPhone
      );

      if (!preview.canCancel) {
        Toast.warning(preview.reasonBlocked || 'Không thể hủy đơn đặt phòng này.');
        return;
      }

      // 2. Hiển thị Modal 2 bước xác nhận hủy phòng kèm biểu phí hoàn
      const contentHtml = `
        <div class="space-y-4">
          <p class="text-sm text-slate-600">
            Bạn đang yêu cầu hủy đơn đặt phòng <strong>${escapeHtml(booking.bookingCode)}</strong>.
          </p>

          <!-- Chính sách hoàn tiền hiển thị trước khi khách xác nhận -->
          <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
            <h5 class="font-bold text-amber-900 uppercase">Chính sách hoàn tiền áp dụng:</h5>
            <p class="text-amber-800">${escapeHtml(preview.refundDescription)}</p>
            <div class="pt-2 border-t border-amber-200 flex justify-between font-bold text-sm">
              <span class="text-amber-900">Số tiền hoàn lại dự kiến:</span>
              <span class="text-blue-700">${formatMoney(preview.refundAmount)} (${preview.refundPercent}%)</span>
            </div>
          </div>

          <div>
            <label for="cancel-reason-input" class="block text-xs font-bold text-slate-700 mb-1.5">
              Lý do hủy phòng (tùy chọn)
            </label>
            <textarea
              id="cancel-reason-input"
              rows="2"
              placeholder="Ví dụ: Thay đổi kế hoạch du lịch, bận việc đột xuất..."
              class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
            ></textarea>
          </div>

          <p class="text-[11px] text-slate-400">
            * Sau khi hủy, phòng sẽ được giải phóng cho khách khác đặt và không thể hoàn tác hành động này.
          </p>
        </div>
      `;

      Modal.show({
        title: 'Xác nhận hủy đặt phòng',
        contentHtml,
        confirmText: 'Xác nhận hủy phòng ngay',
        cancelText: 'Giữ lại đặt phòng',
        confirmClass: 'bg-rose-600 hover:bg-rose-700',
        onConfirm: async () => {
          const reasonInput = document.getElementById('cancel-reason-input') as HTMLTextAreaElement | null;
          const reason = reasonInput?.value.trim() || '';

          const cancelResult = await this.bookingCtrl.cancelBooking(
            booking.bookingCode,
            booking.customerPhone,
            reason
          );

          Toast.success(`Đã hủy đặt phòng thành công! Hoàn tiền: ${formatMoney(cancelResult.refundAmount)}`);
          // Tải lại chi tiết
          await this.executeLookup();
        },
      });
    } catch (err: any) {
      Toast.error(err.message || 'Lỗi khi chuẩn bị thông tin hủy phòng.');
    }
  }
}
