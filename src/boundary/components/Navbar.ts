/**
 * Thanh điều hướng ứng dụng (Navbar)
 */

import { StaffSession } from '../../utils/session';
import { StaffController } from '../../control/StaffController';
import { Toast } from './Toast';

export class Navbar {
  private static staffCtrl = new StaffController();

  public static render(): void {
    const headerEl = document.getElementById('app-header');
    if (!headerEl) return;

    const currentHash = window.location.hash || '#/';
    const isStaff = StaffSession.isLoggedIn();
    const staff = StaffSession.get();

    headerEl.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3">
            <a href="#/" class="flex items-center gap-2.5 text-blue-600 hover:text-blue-700 transition-all font-bold text-lg">
              <span class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </span>
              <span class="text-slate-900 font-extrabold tracking-tight">LOTUS HOTEL</span>
            </a>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-1">
            <a href="#/" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentHash === '#/' || currentHash === '#/search' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
              Tìm phòng
            </a>
            <a href="#/lookup" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentHash === '#/lookup' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
              Tra cứu & Hủy phòng
            </a>

            ${isStaff ? `
              <div class="h-4 w-px bg-slate-200 mx-2"></div>
              <a href="#/staff/dashboard" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentHash === '#/staff/dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
                Tổng quan
              </a>
              <a href="#/staff/rooms" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentHash === '#/staff/rooms' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
                Quản lý phòng
              </a>
              <a href="#/staff/bookings" class="px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentHash === '#/staff/bookings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}">
                Duyệt đặt phòng
              </a>
            ` : ''}
          </nav>

          <!-- User / Staff Actions -->
          <div class="flex items-center gap-3">
            ${isStaff && staff ? `
              <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>${staff.fullName}</span>
              </div>
              <button id="logout-btn" class="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-all">
                Đăng xuất
              </button>
            ` : `
              <a href="#/staff/login" class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all border border-slate-200">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Khu vực nhân viên
              </a>
            `}
          </div>
        </div>
      </div>
    `;

    // Gắn sự kiện đăng xuất
    const logoutBtn = headerEl.querySelector('#logout-btn');
    logoutBtn?.addEventListener('click', () => {
      this.staffCtrl.logout();
      Toast.info('Đã đăng xuất khỏi hệ thống nhân viên.');
      this.render();
      window.location.hash = '#/';
    });
  }
}
