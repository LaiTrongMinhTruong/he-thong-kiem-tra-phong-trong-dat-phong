/**
 * Client-Side Router quản lý điều hướng URL Hash và Route Guard cho phân hệ nhân viên
 */

import { StaffSession } from './session';
import { Toast } from '../boundary/components/Toast';
import { Navbar } from '../boundary/components/Navbar';
import { RoomSearchView } from '../boundary/customer/RoomSearchView';
import { BookingFormView } from '../boundary/customer/BookingFormView';
import { PaymentView } from '../boundary/customer/PaymentView';
import { BookingSuccessView } from '../boundary/customer/BookingSuccessView';
import { BookingLookupView } from '../boundary/customer/BookingLookupView';
import { StaffLoginView } from '../boundary/staff/StaffLoginView';
import { StaffDashboardView } from '../boundary/staff/StaffDashboardView';
import { RoomManageView } from '../boundary/staff/RoomManageView';
import { BookingConfirmView } from '../boundary/staff/BookingConfirmView';

export class Router {
  private static appContainer: HTMLElement;

  public static init(containerId = 'app'): void {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} không tồn tại.`);
    this.appContainer = el;

    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();
  }

  public static async handleRouting(): Promise<void> {
    Navbar.render();

    const rawHash = window.location.hash || '#/';
    const [path, queryString] = rawHash.split('?');
    const params = new URLSearchParams(queryString || '');

    // ROUTE GUARD: Bảo vệ phân hệ /staff
    if (path.startsWith('#/staff') && path !== '#/staff/login') {
      if (!StaffSession.isLoggedIn()) {
        Toast.warning('Bạn cần đăng nhập tài khoản nhân viên để truy cập khu vực này.');
        window.location.hash = '#/staff/login';
        return;
      }
    }

    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'instant' });

    switch (path) {
      case '#/':
      case '#/search': {
        const searchView = new RoomSearchView(this.appContainer);
        await searchView.render();
        break;
      }

      case '#/book': {
        const roomId = params.get('roomId') || '';
        const checkInDate = params.get('checkIn') || '';
        const checkOutDate = params.get('checkOut') || '';

        if (!roomId || !checkInDate || !checkOutDate) {
          Toast.warning('Vui lòng chọn phòng và khoảng ngày hợp lệ trước khi đặt.');
          window.location.hash = '#/';
          return;
        }

        const bookView = new BookingFormView(this.appContainer, {
          roomId,
          checkInDate,
          checkOutDate,
        });
        await bookView.render();
        break;
      }

      case '#/payment': {
        const bookingId = params.get('bookingId') || '';
        if (!bookingId) {
          window.location.hash = '#/';
          return;
        }
        const payView = new PaymentView(this.appContainer, bookingId);
        await payView.render();
        break;
      }

      case '#/booking-success': {
        const code = params.get('code') || '';
        const phone = params.get('phone') || '';
        const successView = new BookingSuccessView(this.appContainer, code, phone);
        await successView.render();
        break;
      }

      case '#/lookup': {
        const code = params.get('code') || '';
        const phone = params.get('phone') || '';
        const lookupView = new BookingLookupView(this.appContainer, { code, phone });
        await lookupView.render();
        break;
      }

      case '#/staff':
      case '#/staff/login': {
        if (StaffSession.isLoggedIn()) {
          window.location.hash = '#/staff/dashboard';
          return;
        }
        const loginView = new StaffLoginView(this.appContainer);
        loginView.render();
        break;
      }

      case '#/staff/dashboard': {
        const dashView = new StaffDashboardView(this.appContainer);
        await dashView.render();
        break;
      }

      case '#/staff/rooms': {
        const roomView = new RoomManageView(this.appContainer);
        await roomView.render();
        break;
      }

      case '#/staff/bookings': {
        const confirmView = new BookingConfirmView(this.appContainer);
        await confirmView.render();
        break;
      }

      default: {
        this.appContainer.innerHTML = `
          <div class="max-w-md mx-auto my-16 bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm">
            <h2 class="text-3xl font-black text-slate-800 mb-2">404</h2>
            <p class="text-sm text-slate-500 mb-6">Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
            <a href="#/" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
              Về trang tìm phòng
            </a>
          </div>
        `;
        break;
      }
    }
  }
}
