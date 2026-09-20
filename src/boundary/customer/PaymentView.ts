/**
 * Giao diện Thanh toán (Boundary - PaymentView)
 * Mô phỏng cổng thanh toán trực tuyến (Chuyển khoản QR / Thẻ ngân hàng)
 */

import { PaymentController } from '../../control/PaymentController';
import { BookingRepository } from '../../repository/BookingRepository';
import { Toast } from '../components/Toast';
import { formatMoney } from '../../utils/money';
import { escapeHtml } from '../../utils/sanitize';
import { Payment } from '../../entities/Payment';
import { Booking } from '../../entities/Booking';

export class PaymentView {
  private container: HTMLElement;
  private bookingId: string;
  private paymentCtrl: PaymentController;
  private bookingRepo: BookingRepository;

  private payment: Payment | null = null;
  private booking: Booking | null = null;
  private isProcessing = false;

  constructor(
    container: HTMLElement,
    bookingId: string,
    paymentCtrl = new PaymentController(),
    bookingRepo = new BookingRepository()
  ) {
    this.container = container;
    this.bookingId = bookingId;
    this.paymentCtrl = paymentCtrl;
    this.bookingRepo = bookingRepo;
  }

  public async render(): Promise<void> {
    this.container.innerHTML = `
      <div class="py-16 text-center text-slate-500">
        <div class="inline-block animate-spin text-3xl mb-3 text-blue-600">&#9696;</div>
        <p class="text-sm font-medium">Đang tải thông tin hóa đơn thanh toán...</p>
      </div>
    `;

    try {
      this.booking = await this.bookingRepo.findBookingById(this.bookingId);
      if (!this.booking) {
        this.renderError('Không tìm thấy đơn đặt phòng yêu cầu thanh toán.');
        return;
      }

      this.payment = await this.paymentCtrl.getPaymentByBookingId(this.bookingId);
      if (!this.payment) {
        this.renderError('Không tìm thấy hóa đơn thanh toán tương ứng.');
        return;
      }

      if (this.payment.status === 'paid') {
        window.location.hash = `#/booking-success?code=${encodeURIComponent(
          this.booking.bookingCode
        )}&phone=${encodeURIComponent(this.booking.customerPhone)}`;
        return;
      }

      this.renderPaymentScreen();
    } catch {
      this.renderError('Đã xảy ra lỗi khi kết nối máy chủ thanh toán.');
    }
  }

  private renderPaymentScreen(): void {
    if (!this.booking || !this.payment) return;

    const isTransfer = this.payment.method === 'transfer';

    this.container.innerHTML = `
      <div class="max-w-xl mx-auto space-y-6">
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div class="text-center pb-6 border-b border-slate-100">
            <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              Cổng thanh toán điện tử
            </span>
            <h2 class="text-2xl font-extrabold text-slate-900">
              ${isTransfer ? 'Chuyển khoản Ngân hàng (VietQR)' : 'Thanh toán qua Thẻ'}
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Mã đặt phòng: <strong class="text-blue-600 font-mono text-sm">${escapeHtml(this.booking.bookingCode)}</strong>
            </p>
          </div>

          <!-- Payment Amount Highlight -->
          <div class="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-500 font-medium">Số tiền cần thanh toán</span>
              <div class="text-2xl font-black text-slate-900 mt-0.5">${formatMoney(this.payment.amount)}</div>
              <span class="text-[11px] text-slate-400">
                (${this.payment.type === 'deposit' ? 'Đặt cọc 30%' : 'Thanh toán đủ 100%'})
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-500">Khách hàng</span>
              <div class="text-sm font-bold text-slate-800">${escapeHtml(this.booking.customerName)}</div>
              <div class="text-xs text-slate-400 font-mono">${escapeHtml(this.booking.customerPhone)}</div>
            </div>
          </div>

          ${isTransfer ? `
            <!-- QR Transfer Instructions -->
            <div class="space-y-4">
              <div class="flex justify-center my-4">
                <div class="p-4 bg-white rounded-2xl border-2 border-dashed border-blue-300 shadow-sm text-center">
                  <!-- Simulated VietQR SVG -->
                  <div class="w-48 h-48 bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center p-3 relative overflow-hidden">
                    <div class="text-xs font-bold tracking-widest text-emerald-400 mb-1">VIETQR PRO</div>
                    <div class="w-28 h-28 bg-white p-2 rounded-lg grid grid-cols-4 gap-1">
                      <div class="bg-black rounded-sm"></div><div class="bg-black rounded-sm"></div><div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div>
                      <div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div><div class="bg-black rounded-sm"></div><div class="bg-slate-200"></div>
                      <div class="bg-black rounded-sm"></div><div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div><div class="bg-black rounded-sm"></div>
                      <div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div><div class="bg-slate-200"></div><div class="bg-black rounded-sm"></div>
                    </div>
                    <div class="text-[9px] text-slate-400 mt-2 font-mono">LOTUS_${this.booking.bookingCode}</div>
                  </div>
                  <p class="text-xs text-slate-500 mt-2 font-medium">Quét mã QR bằng App Ngân hàng</p>
                </div>
              </div>

              <div class="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1.5">
                <div class="flex justify-between">
                  <span class="text-slate-500">Ngân hàng thụ hưởng:</span>
                  <strong class="text-slate-900">MB BANK (Ngân hàng Quân Đội)</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Số tài khoản:</span>
                  <strong class="font-mono text-blue-700 font-bold">999988886666</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Tên chủ tài khoản:</span>
                  <strong class="text-slate-900 uppercase">KHACH SAN LOTUS HOTEL</strong>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Nội dung chuyển khoản:</span>
                  <strong class="font-mono text-rose-600 font-bold">LOTUS ${this.booking.bookingCode}</strong>
                </div>
              </div>
            </div>
          ` : `
            <!-- Card Form Simulation -->
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số thẻ ngân hàng</label>
                <input
                  type="text"
                  placeholder="4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8899"
                  value="9704 2200 1234 5678"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ngày hết hạn</label>
                  <input type="text" placeholder="MM/YY" value="12/28" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Mã CVV</label>
                  <input type="password" placeholder="123" value="888" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono" />
                </div>
              </div>
            </div>
          `}

          <!-- Actions -->
          <div class="mt-8 space-y-3">
            <button
              type="button"
              id="btn-confirm-paid"
              class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Xác nhận tôi đã chuyển khoản / Thanh toán</span>
            </button>
            <button
              type="button"
              id="btn-pay-later"
              class="w-full py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-all border border-slate-200"
            >
              Thanh toán sau (Lưu đơn ở trạng thái chưa thanh toán)
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const confirmBtn = this.container.querySelector('#btn-confirm-paid') as HTMLButtonElement;
    const payLaterBtn = this.container.querySelector('#btn-pay-later');

    confirmBtn?.addEventListener('click', async () => {
      if (this.isProcessing || !this.payment || !this.booking) return;
      this.isProcessing = true;
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<span class="inline-block animate-spin mr-2">&#9696;</span> Đang kiểm tra giao dịch...';

      try {
        await this.paymentCtrl.processPayment(
          this.payment.id,
          this.payment.method,
          this.payment.amount
        );

        Toast.success('Giao dịch thanh toán thành công!');
        window.location.hash = `#/booking-success?code=${encodeURIComponent(
          this.booking.bookingCode
        )}&phone=${encodeURIComponent(this.booking.customerPhone)}`;
      } catch (err: any) {
        Toast.error(err.message || 'Xác nhận thanh toán thất bại.');
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<span>Xác nhận tôi đã chuyển khoản / Thanh toán</span>';
      } finally {
        this.isProcessing = false;
      }
    });

    payLaterBtn?.addEventListener('click', () => {
      if (!this.booking) return;
      Toast.info('Đơn đặt phòng đã được lưu. Vui lòng thanh toán sớm để đảm bảo giữ phòng.');
      window.location.hash = `#/booking-success?code=${encodeURIComponent(
        this.booking.bookingCode
      )}&phone=${encodeURIComponent(this.booking.customerPhone)}`;
    });
  }

  private renderError(message: string): void {
    this.container.innerHTML = `
      <div class="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-rose-200 text-center shadow-sm">
        <h3 class="font-bold text-slate-800 text-lg mb-2">Lỗi thanh toán</h3>
        <p class="text-sm text-slate-600 mb-6">${escapeHtml(message)}</p>
        <a href="#/" class="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
          Về trang chủ
        </a>
      </div>
    `;
  }
}
