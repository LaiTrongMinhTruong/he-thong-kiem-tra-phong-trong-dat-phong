/**
 * Giao diện Phê duyệt & Quản lý Đặt phòng cho Nhân viên (Boundary - BookingConfirmView)
 * Triển khai các use case của nhân viên: Xác nhận đặt phòng, Check-in, Check-out, No-show
 */

import { StaffController } from '../../control/StaffController';
import { HistoryRepository } from '../../repository/HistoryRepository';
import { Booking, BookingStatus, BookingStatusBadges, BookingStatusLabels } from '../../entities/Booking';
import { PaymentStatusBadges, PaymentStatusLabels } from '../../entities/Payment';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { formatMoney } from '../../utils/money';
import { formatDateDisplay } from '../../utils/dateUtils';
import { escapeHtml } from '../../utils/sanitize';
import { StaffSession } from '../../utils/session';

export class BookingConfirmView {
  private container: HTMLElement;
  private staffCtrl: StaffController;
  private historyRepo = new HistoryRepository();

  private allBookings: Array<{
    booking: Booking;
    roomNumber: string;
    payment: { status: string; amount: number; method: string; type: string } | null;
  }> = [];
  private currentTab: BookingStatus | 'all' = 'all';
  private searchKeyword = '';
  private currentPage = 1;
  private pageSize = 10;

  constructor(container: HTMLElement, staffCtrl = new StaffController()) {
    this.container = container;
    this.staffCtrl = staffCtrl;
  }

  public async render(): Promise<void> {
    this.container.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <div class="inline-block animate-spin text-3xl mb-3 text-indigo-600">&#9696;</div>
        <p class="text-sm">Đang tải danh sách đặt phòng...</p>
      </div>
    `;

    try {
      this.allBookings = await this.staffCtrl.getAllBookingsWithDetails();
      this.renderScreen();
    } catch (err: any) {
      Toast.error(err.message || 'Lỗi khi tải danh sách đặt phòng.');
    }
  }

  private getFilteredList() {
    let list = this.allBookings;
    if (this.currentTab !== 'all') {
      list = list.filter(item => item.booking.status === this.currentTab);
    }
    if (this.searchKeyword) {
      const kw = this.searchKeyword.toLowerCase();
      list = list.filter(
        item =>
          item.booking.bookingCode.toLowerCase().includes(kw) ||
          item.booking.customerName.toLowerCase().includes(kw) ||
          item.booking.customerPhone.includes(kw) ||
          item.roomNumber.toLowerCase().includes(kw)
      );
    }
    return list;
  }

  private renderScreen(): void {
    const filtered = this.getFilteredList();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pageItems = filtered.slice(startIndex, endIndex);

    const tabs: Array<{ key: BookingStatus | 'all'; label: string }> = [
      { key: 'all', label: 'Tất cả' },
      { key: 'pending', label: 'Chờ duyệt' },
      { key: 'confirmed', label: 'Đã xác nhận' },
      { key: 'checked_in', label: 'Đang lưu trú' },
      { key: 'checked_out', label: 'Đã trả phòng' },
      { key: 'cancelled', label: 'Đã hủy' },
    ];

    const tabsHtml = tabs
      .map(
        t => `
        <button
          type="button"
          class="tab-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            this.currentTab === t.key
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }"
          data-tab="${t.key}"
        >
          ${t.label}
        </button>
      `
      )
      .join('');

    const rowsHtml = pageItems.length === 0
      ? `<tr><td colspan="7" class="px-6 py-12 text-center text-slate-400 text-xs">Không có đơn đặt phòng nào trong mục này</td></tr>`
      : pageItems
          .map(item => {
            const b = item.booking;
            const pay = item.payment;
            return `
              <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
                <td class="px-6 py-4">
                  <span class="font-mono font-black text-blue-700 text-sm block">${escapeHtml(b.bookingCode)}</span>
                  <span class="text-[11px] text-slate-400">${new Date(b.createdAt).toLocaleDateString('vi-VN')}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-900">${escapeHtml(b.customerName)}</div>
                  <div class="text-[11px] font-mono text-slate-500">${escapeHtml(b.customerPhone)}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="font-bold text-slate-800">Phòng ${escapeHtml(item.roomNumber)}</span>
                </td>
                <td class="px-6 py-4">
                  <div>${formatDateDisplay(b.checkInDate)} &rarr; ${formatDateDisplay(b.checkOutDate)}</div>
                  <span class="text-[11px] text-blue-600 font-bold">${b.nights} đêm &bull; ${b.adults} lớn${b.children ? ` + ${b.children} nhỏ` : ''}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-extrabold text-slate-900">${formatMoney(b.totalAmount)}</div>
                  ${
                    pay
                      ? `<span class="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          PaymentStatusBadges[pay.status as keyof typeof PaymentStatusBadges]
                        }">${PaymentStatusLabels[pay.status as keyof typeof PaymentStatusLabels] || pay.status}</span>`
                      : '<span class="text-slate-400 text-[10px]">Chưa tạo</span>'
                  }
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    BookingStatusBadges[b.status]
                  }">
                    ${BookingStatusLabels[b.status]}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-y-1 whitespace-nowrap">
                  ${this.renderActionButtons(b)}
                </td>
              </tr>
            `;
          })
          .join('');

    const paginationHtml = Pagination.render({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      totalItems: filtered.length,
      onPageChange: () => {},
      onPageSizeChange: () => {},
    });

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900">Kiểm duyệt &amp; Xác nhận Đặt phòng</h1>
            <p class="text-xs text-slate-500 mt-1">
              Phê duyệt đơn đặt, quản lý quy trình Check-in nhận phòng và Check-out trả phòng
            </p>
          </div>
        </div>

        <!-- Filter Tabs & Search -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-wrap gap-2">
            ${tabsHtml}
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
            <input
              type="text"
              id="input-search-booking"
              placeholder="Tìm theo mã BK, tên khách, số điện thoại, số phòng..."
              value="${escapeHtml(this.searchKeyword)}"
              class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-full sm:w-80 focus:ring-2 focus:ring-indigo-500"
            />
            <span class="text-xs text-slate-500">
              Tổng cộng: <strong>${filtered.length}</strong> đơn
            </span>
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th class="px-6 py-3.5">Mã đơn</th>
                  <th class="px-6 py-3.5">Khách hàng</th>
                  <th class="px-6 py-3.5">Phòng</th>
                  <th class="px-6 py-3.5">Lưu trú</th>
                  <th class="px-6 py-3.5">Tổng tiền / TT</th>
                  <th class="px-6 py-3.5">Trạng thái</th>
                  <th class="px-6 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>

          <div id="booking-confirm-pagination" class="px-4 pb-2">
            ${paginationHtml}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private renderActionButtons(b: Booking): string {
    const actions: string[] = [];

    if (b.status === 'pending') {
      actions.push(`
        <button
          type="button"
          class="btn-confirm-booking px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-sm"
          data-id="${b.id}"
        >
          Xác nhận đơn
        </button>
      `);
      actions.push(`
        <button
          type="button"
          class="btn-cancel-booking px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-all"
          data-id="${b.id}"
        >
          Từ chối
        </button>
      `);
    } else if (b.status === 'confirmed') {
      actions.push(`
        <button
          type="button"
          class="btn-checkin-booking px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm"
          data-id="${b.id}"
        >
          Check-in
        </button>
      `);
      actions.push(`
        <button
          type="button"
          class="btn-noshow-booking px-2.5 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold transition-all"
          data-id="${b.id}"
        >
          No-show
        </button>
      `);
      actions.push(`
        <button
          type="button"
          class="btn-cancel-booking px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-all"
          data-id="${b.id}"
        >
          Hủy
        </button>
      `);
    } else if (b.status === 'checked_in') {
      actions.push(`
        <button
          type="button"
          class="btn-checkout-booking px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-sm"
          data-id="${b.id}"
        >
          Check-out (Trả phòng)
        </button>
      `);
    }

    actions.push(`
      <button
        type="button"
        class="btn-view-history px-2 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium transition-all"
        data-id="${b.id}"
        title="Xem lịch sử biến động"
      >
        Lịch sử
      </button>
    `);

    return actions.join(' ');
  }

  private bindEvents(): void {
    // Tabs
    this.container.querySelectorAll<HTMLButtonElement>('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTab = btn.getAttribute('data-tab') as BookingStatus | 'all';
        this.currentPage = 1;
        this.renderScreen();
      });
    });

    // Search input
    const searchInp = this.container.querySelector('#input-search-booking') as HTMLInputElement;
    searchInp?.addEventListener('input', () => {
      this.searchKeyword = searchInp.value;
      this.currentPage = 1;
      this.renderScreen();
    });

    // Pagination
    const pagEl = this.container.querySelector('#booking-confirm-pagination') as HTMLElement;
    if (pagEl) {
      Pagination.bindEvents(pagEl, {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        totalItems: this.getFilteredList().length,
        onPageChange: newPage => {
          this.currentPage = newPage;
          this.renderScreen();
        },
        onPageSizeChange: newSize => {
          this.pageSize = newSize;
          this.currentPage = 1;
          this.renderScreen();
        },
      });
    }

    const staff = StaffSession.get();
    const staffUsername = staff?.username || 'admin';

    // Confirm booking
    this.container.querySelectorAll<HTMLButtonElement>('.btn-confirm-booking').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        try {
          const res = await this.staffCtrl.confirmBooking(id, staffUsername);
          if (res.warning) {
            Toast.warning(`Đã xác nhận đơn! Cảnh báo: ${res.warning}`);
          } else {
            Toast.success('Đã xác nhận đặt phòng thành công!');
          }
          await this.render();
        } catch (err: any) {
          Toast.error(err.message || 'Xác nhận đặt phòng thất bại.');
        }
      });
    });

    // Check-in
    this.container.querySelectorAll<HTMLButtonElement>('.btn-checkin-booking').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        try {
          await this.staffCtrl.checkIn(id, staffUsername);
          Toast.success('Khách đã hoàn tất thủ tục nhận phòng (Check-in)! Phòng đã chuyển sang trạng thái "Đang có khách".');
          await this.render();
        } catch (err: any) {
          Toast.error(err.message || 'Lỗi Check-in.');
        }
      });
    });

    // Check-out
    this.container.querySelectorAll<HTMLButtonElement>('.btn-checkout-booking').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        try {
          await this.staffCtrl.checkOut(id, staffUsername);
          Toast.success('Khách đã hoàn tất trả phòng (Check-out)! Phòng đã tự động chuyển sang trạng thái "Đang dọn dẹp".');
          await this.render();
        } catch (err: any) {
          Toast.error(err.message || 'Lỗi Check-out.');
        }
      });
    });

    // Mark No-show
    this.container.querySelectorAll<HTMLButtonElement>('.btn-noshow-booking').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        Modal.show({
          title: 'Xác nhận khách không đến (No-show)?',
          contentHtml: '<p class="text-xs text-slate-600">Đơn đặt phòng sẽ chuyển sang trạng thái No-show và phòng được giải phóng.</p>',
          confirmText: 'Đánh dấu No-show',
          confirmClass: 'bg-purple-600 hover:bg-purple-700',
          onConfirm: async () => {
            await this.staffCtrl.markNoShow(id, staffUsername);
            Toast.info('Đã đánh dấu đơn đặt phòng là No-show.');
            await this.render();
          },
        });
      });
    });

    // Cancel
    this.container.querySelectorAll<HTMLButtonElement>('.btn-cancel-booking').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        Modal.show({
          title: 'Hủy đơn đặt phòng này?',
          contentHtml: `
            <div class="space-y-3 text-xs">
              <p class="text-slate-600">Nhập lý do nhân viên hủy đơn:</p>
              <textarea id="staff-cancel-reason" rows="2" placeholder="Ví dụ: Khách gọi điện yêu cầu hủy, trùng lịch sự cố..." class="w-full px-3 py-2 rounded-xl border border-slate-300"></textarea>
            </div>
          `,
          confirmText: 'Xác nhận hủy',
          confirmClass: 'bg-rose-600 hover:bg-rose-700',
          onConfirm: async () => {
            const reason = (document.getElementById('staff-cancel-reason') as HTMLTextAreaElement)?.value || 'Nhân viên hủy';
            await this.staffCtrl.cancelBookingByStaff(id, staffUsername, reason);
            Toast.success('Đã hủy đơn đặt phòng.');
            await this.render();
          },
        });
      });
    });

    // View History Modal
    this.container.querySelectorAll<HTMLButtonElement>('.btn-view-history').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!id) return;
        const histories = await this.historyRepo.findBookingHistory(id);

        const contentHtml = `
          <div class="space-y-3 text-xs">
            ${histories.length === 0 ? '<p class="text-slate-400">Chưa có lịch sử</p>' : ''}
            ${histories
              .map(
                h => `
              <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div class="flex justify-between font-bold text-slate-800">
                  <span>${escapeHtml(h.fromStatus)} &rarr; ${escapeHtml(h.toStatus)}</span>
                  <span class="text-slate-400 font-normal">${new Date(h.changedAt).toLocaleString('vi-VN')}</span>
                </div>
                <div class="text-slate-600 mt-1">${escapeHtml(h.note || '')}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">Thực hiện bởi: ${escapeHtml(h.changedBy)}</div>
              </div>
            `
              )
              .join('')}
          </div>
        `;

        Modal.show({
          title: 'Lịch sử xử lý đơn đặt phòng',
          contentHtml,
          cancelText: 'Đóng',
        });
      });
    });
  }
}
