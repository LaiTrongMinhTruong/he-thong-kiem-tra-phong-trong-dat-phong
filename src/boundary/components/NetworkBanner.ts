/**
 * Component hiển thị thông báo sự cố kết nối máy chủ (json-server hoặc mất mạng)
 */

import { onConnectionChange } from '../../repository/apiConfig';

export class NetworkBanner {
  private static bannerEl: HTMLElement | null = null;

  public static init(): void {
    this.bannerEl = document.getElementById('network-banner');

    onConnectionChange((isOnline, message) => {
      this.updateStatus(isOnline, message);
    });

    window.addEventListener('offline', () => {
      this.updateStatus(false, 'Mất kết nối Internet trên thiết bị.');
    });

    window.addEventListener('online', () => {
      this.updateStatus(true);
    });
  }

  private static updateStatus(isOnline: boolean, customMessage?: string): void {
    if (!this.bannerEl) return;

    if (isOnline) {
      this.bannerEl.innerHTML = '';
      this.bannerEl.className = '';
    } else {
      this.bannerEl.className = 'bg-rose-600 text-white px-4 py-2.5 text-center text-sm font-medium shadow-sm transition-all sticky top-0 z-50';
      this.bannerEl.innerHTML = `
        <div class="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <svg class="w-5 h-5 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <span>${customMessage || 'Không thể kết nối đến máy chủ CSDL (json-server). Vui lòng kiểm tra lại dịch vụ tại cổng 3002.'}</span>
          <button id="retry-connection-btn" class="ml-3 underline font-bold hover:text-rose-100 transition-all">Thử lại</button>
        </div>
      `;

      this.bannerEl.querySelector('#retry-connection-btn')?.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
}
