/**
 * Giao diện Form Đặt phòng (Boundary - BookingFormView)
 * Triển khai tương tác: Khách hàng -> Giao diện -> Đặt phòng (BookingController.book())
 */

import { BookingController } from '../../control/BookingController';
import { RoomController } from '../../control/RoomController';
import { RoomWithType } from '../../entities/Room';
import { Toast } from '../components/Toast';
import { formatMoney, calculateTotalAmount, calculateDepositAmount } from '../../utils/money';
import { formatDateDisplay } from '../../utils/dateUtils';
import { validateCustomerInfo } from '../../validation/customerValidator';
import { validateBookingDates } from '../../validation/dateValidator';
import { escapeHtml } from '../../utils/sanitize';
import { PaymentMethod, PaymentType } from '../../entities/Payment';

export class BookingFormView {
  private container: HTMLElement;
  private bookingCtrl: BookingController;
  private roomCtrl: RoomController;

  private roomId: string;
  private checkInDate: string;
  private checkOutDate: string;

  private roomData: RoomWithType | null = null;
  private nights = 1;
  private paymentType: PaymentType = 'full';
  private paymentMethod: PaymentMethod = 'transfer';
  private isSubmitting = false;

  constructor(
    container: HTMLElement,
    params: { roomId: string; checkInDate: string; checkOutDate: string },
    bookingCtrl = new BookingController(),
    roomCtrl = new RoomController()
  ) {
    this.container = container;
    this.roomId = params.roomId;
    this.checkInDate = params.checkInDate;
    this.checkOutDate = params.checkOutDate;
    this.bookingCtrl = bookingCtrl;
    this.roomCtrl = roomCtrl;
  }

  public async render(): Promise<void> {
    // 1. Tải thông tin phòng đã chọn
    try {
      this.roomData = await this.roomCtrl.getRoomDetail(this.roomId);
      if (!this.roomData) {
        this.renderError('Phòng được chọn không tồn tại hoặc đã ngừng phục vụ.');
        return;
      }
    } catch {
      this.renderError('Không thể tải thông tin phòng. Vui lòng thử lại sau.');
      return;
    }

    // 2. Validate ngày lưu trú sơ bộ
    const dateCheck = validateBookingDates(this.checkInDate, this.checkOutDate);
    if (!dateCheck.isValid) {
      const msg = dateCheck.errors.checkInDate || dateCheck.errors.checkOutDate || 'Khoảng ngày không hợp lệ.';
      this.renderError(msg);
      return;
    }
    this.nights = dateCheck.nights;

    const rt = this.roomData.roomType;
    const priceBreakdown = calculateTotalAmount(this.nights, rt.basePricePerNight);
    const depositAmount = calculateDepositAmount(priceBreakdown.total);

    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Back button & Header -->
        <div class="flex items-center justify-between">
          <button id="btn-back-search" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Quay lại tìm phòng
          </button>
          <span class="text-xs text-slate-500">Mã phòng: <strong class="text-slate-800">${this.roomData.roomNumber}</strong></span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Booking Form -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 class="text-xl font-bold text-slate-900 mb-2">Thông tin người đặt phòng</h2>
              <p class="text-xs text-slate-500 mb-6">Mã đặt phòng sẽ được gửi qua email và dùng kèm số điện thoại để tra cứu.</p>

              <form id="booking-form" class="space-y-5" novalidate>
                <!-- Customer Name -->
                <div>
                  <label for="input-customer-name" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Họ và tên khách hàng <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="input-customer-name"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <p id="err-customerName" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                </div>

                <!-- Phone & Email Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="input-customer-phone" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Số điện thoại <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="input-customer-phone"
                      placeholder="0912345678"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <p id="err-customerPhone" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                  </div>

                  <div>
                    <label for="input-customer-email" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Địa chỉ Email <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="input-customer-email"
                      placeholder="email@example.com"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <p id="err-customerEmail" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                  </div>
                </div>

                <!-- Adults & Children Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label for="input-adults" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Người lớn (&ge; 1) <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="input-adults"
                      min="1"
                      max="${rt.capacity}"
                      value="1"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <p id="err-adults" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                  </div>

                  <div>
                    <label for="input-children" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Trẻ em (&ge; 0)
                    </label>
                    <input
                      type="number"
                      id="input-children"
                      min="0"
                      max="${rt.capacity}"
                      value="0"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <p id="err-children" class="text-xs text-rose-600 mt-1.5 hidden"></p>
                  </div>
                </div>

                <!-- Inline error for total guests exceeding capacity -->
                <p id="err-guests" class="text-xs text-rose-600 hidden font-semibold"></p>

                <!-- Special Note -->
                <div>
                  <label for="input-note" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Ghi chú / Yêu cầu đặc biệt (tùy chọn)
                  </label>
                  <textarea
                    id="input-note"
                    rows="2"
                    placeholder="Ví dụ: Nhận phòng sớm, chuẩn bị thêm gối, phòng tầng cao..."
                    class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  ></textarea>
                </div>

                <!-- Payment Options -->
                <div class="pt-4 border-t border-slate-200">
                  <h3 class="text-sm font-bold text-slate-900 mb-3">Hình thức thanh toán</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <label class="payment-type-card flex items-start p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentType === 'full' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : ''}">
                      <input type="radio" name="paymentType" value="full" class="mt-0.5 text-blue-600 focus:ring-blue-500" ${this.paymentType === 'full' ? 'checked' : ''} />
                      <div class="ml-3">
                        <span class="block text-xs font-bold text-slate-800">Thanh toán đủ 100%</span>
                        <span class="block text-[11px] text-slate-500 mt-0.5">${formatMoney(priceBreakdown.total)}</span>
                      </div>
                    </label>

                    <label class="payment-type-card flex items-start p-3.5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentType === 'deposit' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : ''}">
                      <input type="radio" name="paymentType" value="deposit" class="mt-0.5 text-blue-600 focus:ring-blue-500" ${this.paymentType === 'deposit' ? 'checked' : ''} />
                      <div class="ml-3">
                        <span class="block text-xs font-bold text-slate-800">Đặt cọc 30% giữ phòng</span>
                        <span class="block text-[11px] text-slate-500 mt-0.5">${formatMoney(depositAmount)} (Còn lại trả khi nhận phòng)</span>
                      </div>
                    </label>
                  </div>

                  <h3 class="text-sm font-bold text-slate-900 mb-2">Phương thức thanh toán</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <label class="payment-method-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentMethod === 'transfer' ? 'border-blue-600 bg-blue-50/50' : ''}">
                      <input type="radio" name="paymentMethod" value="transfer" class="text-blue-600" ${this.paymentMethod === 'transfer' ? 'checked' : ''} />
                      <span class="ml-2 text-xs font-semibold text-slate-700">Chuyển khoản QR</span>
                    </label>

                    <label class="payment-method-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : ''}">
                      <input type="radio" name="paymentMethod" value="card" class="text-blue-600" ${this.paymentMethod === 'card' ? 'checked' : ''} />
                      <span class="ml-2 text-xs font-semibold text-slate-700">Thẻ ATM / Visa</span>
                    </label>

                    <label class="payment-method-card flex items-center p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 transition-all ${this.paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50/50' : ''}">
                      <input type="radio" name="paymentMethod" value="cash" class="text-blue-600" ${this.paymentMethod === 'cash' ? 'checked' : ''} />
                      <span class="ml-2 text-xs font-semibold text-slate-700">Tiền mặt tại quầy</span>
                    </label>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-6">
                  <button
                    type="submit"
                    id="btn-submit-booking"
                    class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Xác nhận &amp; Tiến hành Đặt phòng</span>
                  </button>
                  <p class="text-center text-[11px] text-slate-400 mt-2">
                    Bằng việc nhấn xác nhận, bạn đồng ý với chính sách nhận/trả và hoàn hủy phòng của khách sạn.
                  </p>
                </div>
              </form>
            </div>
          </div>

          <!-- Right Column: Room & Price Summary Sticky Card -->
          <div class="space-y-6">
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24 space-y-4">
              <h3 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Chi tiết đặt phòng
              </h3>

              <!-- Room info -->
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-extrabold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    Phòng ${escapeHtml(this.roomData.roomNumber)}
                  </span>
                  <span class="text-xs text-slate-500">Tầng ${this.roomData.floor}</span>
                </div>
                <h4 class="text-base font-bold text-slate-900">${escapeHtml(rt.name)}</h4>
                <p class="text-xs text-slate-500">Sức chứa tối đa: <strong>${rt.capacity} người</strong></p>
              </div>

              <!-- Dates info -->
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                <div class="flex justify-between">
                  <span class="text-slate-500">Nhận phòng:</span>
                  <span class="font-bold text-slate-800">${formatDateDisplay(this.checkInDate)} (14:00)</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Trả phòng:</span>
                  <span class="font-bold text-slate-800">${formatDateDisplay(this.checkOutDate)} (12:00)</span>
                </div>
                <div class="flex justify-between pt-1 border-t border-slate-200 text-slate-700">
                  <span>Thời gian lưu trú:</span>
                  <span class="font-extrabold text-blue-600">${this.nights} đêm</span>
                </div>
              </div>

              <!-- Price Breakdown Table -->
              <div class="space-y-2 text-xs pt-2">
                <div class="flex justify-between text-slate-600">
                  <span>${formatMoney(rt.basePricePerNight)} &times; ${this.nights} đêm:</span>
                  <span>${formatMoney(priceBreakdown.subtotal)}</span>
                </div>
                <div class="flex justify-between text-slate-600">
                  <span>Thuế GTGT (VAT 8%):</span>
                  <span>${formatMoney(priceBreakdown.vat)}</span>
                </div>
                <div class="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                  <span>Tổng tiền phòng:</span>
                  <span class="text-blue-600">${formatMoney(priceBreakdown.total)}</span>
                </div>
              </div>

              <!-- Amount to pay now -->
              <div id="pay-now-banner" class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <div class="font-medium text-emerald-800">Số tiền cần thanh toán:</div>
                <div id="pay-now-amount" class="text-lg font-black text-emerald-700 mt-0.5">
                  ${formatMoney(this.paymentType === 'deposit' ? depositAmount : priceBreakdown.total)}
                </div>
                <div id="pay-now-note" class="text-[11px] text-emerald-600 mt-0.5">
                  ${this.paymentType === 'deposit' ? 'Đặt cọc 30% giữ phòng.' : 'Thanh toán trọn gói 100%.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const form = this.container.querySelector('#booking-form') as HTMLFormElement;
    const backBtn = this.container.querySelector('#btn-back-search');
    const nameInput = this.container.querySelector('#input-customer-name') as HTMLInputElement;
    const phoneInput = this.container.querySelector('#input-customer-phone') as HTMLInputElement;
    const emailInput = this.container.querySelector('#input-customer-email') as HTMLInputElement;
    const adultsInput = this.container.querySelector('#input-adults') as HTMLInputElement;
    const childrenInput = this.container.querySelector('#input-children') as HTMLInputElement;
    const noteInput = this.container.querySelector('#input-note') as HTMLTextAreaElement;

    // Chặn phím số lạ trên adults và children
    [adultsInput, childrenInput].forEach(inp => {
      inp?.addEventListener('keydown', e => {
        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
          e.preventDefault();
        }
      });
    });

    backBtn?.addEventListener('click', () => {
      window.location.hash = '#/';
    });

    // Real-time validation
    [nameInput, phoneInput, emailInput, adultsInput, childrenInput].forEach(inp => {
      inp?.addEventListener('input', () => this.validateForm());
    });

    // Toggle Payment Type
    this.container.querySelectorAll<HTMLInputElement>('input[name="paymentType"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.paymentType = radio.value as PaymentType;
        this.updatePaymentCards();
      });
    });

    // Toggle Payment Method
    this.container.querySelectorAll<HTMLInputElement>('input[name="paymentMethod"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.paymentMethod = radio.value as PaymentMethod;
        this.updatePaymentCards();
      });
    });

    // Submit form
    form?.addEventListener('submit', async e => {
      e.preventDefault();
      if (this.isSubmitting) return;

      if (!this.validateForm()) {
        Toast.warning('Vui lòng kiểm tra lại các trường thông tin báo đỏ.');
        return;
      }

      await this.submitBooking({
        customerName: nameInput.value,
        customerPhone: phoneInput.value,
        customerEmail: emailInput.value,
        adults: parseInt(adultsInput.value, 10),
        children: parseInt(childrenInput.value || '0', 10),
        note: noteInput.value,
      });
    });
  }

  private updatePaymentCards(): void {
    if (!this.roomData) return;
    const rt = this.roomData.roomType;
    const priceCalc = calculateTotalAmount(this.nights, rt.basePricePerNight);
    const depositAmount = calculateDepositAmount(priceCalc.total);

    const payNowEl = this.container.querySelector('#pay-now-amount');
    const payNowNote = this.container.querySelector('#pay-now-note');

    if (payNowEl && payNowNote) {
      if (this.paymentType === 'deposit') {
        payNowEl.textContent = formatMoney(depositAmount);
        payNowNote.textContent = 'Đặt cọc 30% giữ phòng. 70% còn lại thanh toán tại quầy.';
      } else {
        payNowEl.textContent = formatMoney(priceCalc.total);
        payNowNote.textContent = 'Thanh toán trọn gói 100%.';
      }
    }

    // Cập nhật viền các thẻ payment
    this.container.querySelectorAll('.payment-type-card').forEach(card => {
      const radio = card.querySelector('input[type="radio"]') as HTMLInputElement;
      if (radio?.value === this.paymentType) {
        card.classList.add('border-blue-600', 'bg-blue-50/50', 'ring-1', 'ring-blue-600');
      } else {
        card.classList.remove('border-blue-600', 'bg-blue-50/50', 'ring-1', 'ring-blue-600');
      }
    });

    this.container.querySelectorAll('.payment-method-card').forEach(card => {
      const radio = card.querySelector('input[type="radio"]') as HTMLInputElement;
      if (radio?.value === this.paymentMethod) {
        card.classList.add('border-blue-600', 'bg-blue-50/50');
      } else {
        card.classList.remove('border-blue-600', 'bg-blue-50/50');
      }
    });
  }

  private validateForm(): boolean {
    if (!this.roomData) return false;

    const nameInput = this.container.querySelector('#input-customer-name') as HTMLInputElement;
    const phoneInput = this.container.querySelector('#input-customer-phone') as HTMLInputElement;
    const emailInput = this.container.querySelector('#input-customer-email') as HTMLInputElement;
    const adultsInput = this.container.querySelector('#input-adults') as HTMLInputElement;
    const childrenInput = this.container.querySelector('#input-children') as HTMLInputElement;
    const submitBtn = this.container.querySelector('#btn-submit-booking') as HTMLButtonElement;

    const validation = validateCustomerInfo(
      {
        customerName: nameInput?.value,
        customerPhone: phoneInput?.value,
        customerEmail: emailInput?.value,
        adults: adultsInput?.value,
        children: childrenInput?.value,
      },
      this.roomData.roomType.capacity
    );

    this.displayFieldError('customerName', validation.errors.customerName);
    this.displayFieldError('customerPhone', validation.errors.customerPhone);
    this.displayFieldError('customerEmail', validation.errors.customerEmail);
    this.displayFieldError('adults', validation.errors.adults);
    this.displayFieldError('children', validation.errors.children);
    this.displayFieldError('guests', validation.errors.guests);

    if (submitBtn) {
      submitBtn.disabled = !validation.isValid;
      if (!validation.isValid) {
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    return validation.isValid;
  }

  private displayFieldError(field: string, error?: string): void {
    const errorEl = this.container.querySelector(`#err-${field}`);
    if (!errorEl) return;

    if (error) {
      errorEl.textContent = error;
      errorEl.classList.remove('hidden');
    } else {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  private async submitBooking(sanitizedCustomer: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    adults: number;
    children: number;
    note?: string;
  }): Promise<void> {
    this.isSubmitting = true;
    const submitBtn = this.container.querySelector('#btn-submit-booking') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">&#9696;</span> Đang xử lý đặt phòng...';
    }

    try {
      // GỌI BƯỚC CHÍNH: BookingController.book()
      const result = await this.bookingCtrl.book({
        roomId: this.roomId,
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        customerName: sanitizedCustomer.customerName,
        customerPhone: sanitizedCustomer.customerPhone,
        customerEmail: sanitizedCustomer.customerEmail,
        adults: sanitizedCustomer.adults,
        children: sanitizedCustomer.children,
        note: sanitizedCustomer.note,
        paymentType: this.paymentType,
        paymentMethod: this.paymentMethod,
      });

      Toast.success(`Đặt phòng thành công! Mã đơn của bạn là: ${result.booking.bookingCode}`);

      // Nếu chọn chuyển khoản hoặc thẻ -> chuyển qua trang thanh toán mô phỏng PaymentView
      if (this.paymentMethod === 'transfer' || this.paymentMethod === 'card') {
        window.location.hash = `#/payment?bookingId=${encodeURIComponent(result.booking.id)}`;
      } else {
        // Tiền mặt tại quầy -> chuyển thẳng sang màn hình thành công
        window.location.hash = `#/booking-success?code=${encodeURIComponent(result.booking.bookingCode)}&phone=${encodeURIComponent(result.booking.customerPhone)}`;
      }
    } catch (err: any) {
      Toast.error(err.message || 'Đặt phòng thất bại. Vui lòng thử lại.');
    } finally {
      this.isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Xác nhận &amp; Tiến hành Đặt phòng</span>';
      }
    }
  }

  private renderError(message: string): void {
    this.container.innerHTML = `
      <div class="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-rose-200 text-center shadow-sm">
        <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="font-bold text-slate-800 text-lg mb-2">Không thể tiếp tục đặt phòng</h3>
        <p class="text-sm text-slate-600 mb-6">${escapeHtml(message)}</p>
        <a href="#/" class="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
          Quay lại tìm phòng khác
        </a>
      </div>
    `;
  }
}
