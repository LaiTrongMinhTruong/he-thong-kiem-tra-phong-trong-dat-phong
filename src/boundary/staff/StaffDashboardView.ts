/**
 * Màn hình Tổng quan phân hệ Nhân viên (Boundary - StaffDashboardView)
 */

import { StaffController } from '../../control/StaffController';
import { Toast } from '../components/Toast';

export class StaffDashboardView {
  private container: HTMLElement;
  private staffCtrl: StaffController;

  constructor(container: HTMLElement, staffCtrl = new StaffController()) {
    this.container = container;
    this.staffCtrl = staffCtrl;
  }

  public async render(): Promise<void> {
    this.container.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <div class="inline-block animate-spin text-3xl mb-3 text-indigo-600">&#9696;</div>
        <p class="text-sm">Đang tải số liệu thống kê tổng quan...</p>
      </div>
    `;

    try {
      const stats = await this.staffCtrl.getDashboardStats();
      const currentStaff = this.staffCtrl.getCurrentStaff();

      this.container.innerHTML = `
        <div class="space-y-8">
          <!-- Welcome header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Bảng điều khiển quản trị
              </span>
              <h1 class="text-2xl font-black text-slate-900 mt-2">
                Xin chào, ${currentStaff?.fullName || 'Nhân viên'}!
              </h1>
              <p class="text-xs text-slate-500 mt-1">
                Tài khoản: <strong class="font-mono text-slate-700">${currentStaff?.username}</strong> &bull; Trạng thái hệ thống hoạt động ổn định
              </p>
            </div>

            <div class="flex items-center gap-2.5">
              <a
                href="#/staff/bookings"
                class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                <span>Duyệt đơn đặt (${stats.pendingBookings})</span>
              </a>
              <a
                href="#/staff/rooms"
                class="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 transition-all"
              >
                Quản lý danh sách phòng
              </a>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total rooms -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between text-slate-400">
                <span class="text-xs font-bold uppercase tracking-wider">Tổng số phòng</span>
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <div class="text-3xl font-black text-slate-900 mt-2">${stats.totalRooms}</div>
              <span class="text-[11px] text-slate-400 mt-1 block">Quy mô hiện tại của khách sạn</span>
            </div>

            <!-- Available rooms -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between text-emerald-500">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Sẵn sàng đón khách</span>
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div class="text-3xl font-black text-emerald-600 mt-2">${stats.availableRooms}</div>
              <span class="text-[11px] text-slate-400 mt-1 block">Phòng sạch trống có thể đặt</span>
            </div>

            <!-- Occupied / Cleaning -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div class="flex items-center justify-between text-blue-500">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Đang có khách / Dọn</span>
                <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              </div>
              <div class="text-3xl font-black text-blue-600 mt-2">${stats.occupiedRooms + stats.cleaningRooms}</div>
              <span class="text-[11px] text-slate-400 mt-1 block">${stats.occupiedRooms} đang ở, ${stats.cleaningRooms} đang dọn dẹp</span>
            </div>

            <!-- Pending Bookings Alert -->
            <div class="bg-white p-5 rounded-2xl border ${stats.pendingBookings > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'} shadow-sm">
              <div class="flex items-center justify-between text-amber-500">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Đơn chờ duyệt</span>
                ${stats.pendingBookings > 0 ? '<span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>' : ''}
              </div>
              <div class="text-3xl font-black text-amber-600 mt-2">${stats.pendingBookings}</div>
              <span class="text-[11px] text-amber-700 mt-1 block font-medium">Cần nhân viên kiểm tra &amp; xác nhận</span>
            </div>
          </div>

          <!-- Quick Navigation Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <a href="#/staff/bookings" class="block p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group">
              <div class="flex items-center justify-between">
                <h3 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Kiểm duyệt &amp; Xác nhận Đặt phòng &rarr;
                </h3>
                <span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                  ${stats.pendingBookings} đơn chờ
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                Xem toàn bộ đơn đặt phòng của khách hàng, kiểm tra tình trạng thanh toán, phê duyệt xác nhận đơn, thực hiện Check-in / Check-out cho khách.
              </p>
            </a>

            <a href="#/staff/rooms" class="block p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group">
              <div class="flex items-center justify-between">
                <h3 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Quản lý Danh mục Phòng &amp; Trạng thái &rarr;
                </h3>
                <span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                  ${stats.totalRooms} phòng
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                Thêm mới phòng, cập nhật thông tin phòng, chuyển đổi trạng thái phòng (Sẵn sàng &harr; Đang dọn &harr; Bảo dưỡng).
              </p>
            </a>
          </div>
        </div>
      `;
    } catch (err: any) {
      Toast.error(err.message || 'Lỗi khi tải thông tin Dashboard.');
    }
  }
}
