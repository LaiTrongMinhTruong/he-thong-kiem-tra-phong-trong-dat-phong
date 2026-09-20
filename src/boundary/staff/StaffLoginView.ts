/**
 * Giao diện Đăng nhập Nhân viên (Boundary - StaffLoginView)
 */

import { StaffController } from '../../control/StaffController';
import { Toast } from '../components/Toast';
import { Navbar } from '../components/Navbar';

export class StaffLoginView {
  private container: HTMLElement;
  private staffCtrl: StaffController;
  private isLoggingIn = false;

  constructor(container: HTMLElement, staffCtrl = new StaffController()) {
    this.container = container;
    this.staffCtrl = staffCtrl;
  }

  public render(): void {
    this.container.innerHTML = `
      <div class="max-w-md mx-auto my-8 space-y-6">
        <div class="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200">
          <div class="text-center mb-8">
            <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h2 class="text-2xl font-black text-slate-900">Khu vực Nhân viên</h2>
            <p class="text-xs text-slate-500 mt-1">Đăng nhập hệ thống quản trị và kiểm duyệt đặt phòng</p>
          </div>

          <form id="staff-login-form" class="space-y-4" novalidate>
            <div>
              <label for="staff-username" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="staff-username"
                placeholder="admin hoặc receptionist"
                value="admin"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label for="staff-password" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                id="staff-password"
                placeholder="••••••"
                value="123456"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <p id="staff-login-error" class="text-xs text-rose-600 font-medium hidden"></p>

            <button
              type="submit"
              id="btn-staff-login"
              class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Đăng nhập hệ thống</span>
            </button>
          </form>

          <!-- Seed accounts hint -->
          <div class="mt-8 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
            <p class="font-bold text-slate-700">Tài khoản mẫu seed sẵn trong DB:</p>
            <p>&bull; Quản trị viên: <code class="bg-white px-1.5 py-0.5 rounded border font-mono text-slate-800">admin</code> / <code class="bg-white px-1.5 py-0.5 rounded border font-mono text-slate-800">123456</code></p>
            <p>&bull; Lễ tân: <code class="bg-white px-1.5 py-0.5 rounded border font-mono text-slate-800">receptionist</code> / <code class="bg-white px-1.5 py-0.5 rounded border font-mono text-slate-800">123456</code></p>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    const form = this.container.querySelector('#staff-login-form') as HTMLFormElement;
    const usernameInput = this.container.querySelector('#staff-username') as HTMLInputElement;
    const passwordInput = this.container.querySelector('#staff-password') as HTMLInputElement;
    const errorEl = this.container.querySelector('#staff-login-error');
    const submitBtn = this.container.querySelector('#btn-staff-login') as HTMLButtonElement;

    form?.addEventListener('submit', async e => {
      e.preventDefault();
      if (this.isLoggingIn) return;

      this.isLoggingIn = true;
      if (errorEl) errorEl.classList.add('hidden');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">&#9696;</span> Đang xác thực...';
      }

      try {
        const staff = await this.staffCtrl.login(usernameInput.value, passwordInput.value);
        Toast.success(`Chào mừng ${staff.fullName} đăng nhập thành công!`);
        Navbar.render();
        window.location.hash = '#/staff/dashboard';
      } catch (err: any) {
        if (errorEl) {
          errorEl.textContent = err.message || 'Đăng nhập thất bại.';
          errorEl.classList.remove('hidden');
        }
        Toast.error(err.message || 'Đăng nhập không thành công.');
      } finally {
        this.isLoggingIn = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Đăng nhập hệ thống</span>';
        }
      }
    });
  }
}
