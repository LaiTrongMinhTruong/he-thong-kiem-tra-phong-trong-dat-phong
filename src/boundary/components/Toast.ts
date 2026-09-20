/**
 * Component hiển thị thông báo Toast nổi thay thế hoàn toàn alert()
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export class Toast {
  private static container: HTMLElement | null = null;

  private static getContainer(): HTMLElement {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className =
          'fixed top-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full';
        document.body.appendChild(this.container);
      }
    }
    return this.container;
  }

  public static show(type: ToastType, message: string, title?: string, duration = 4500): void {
    const container = this.getContainer();

    const toast = document.createElement('div');
    toast.className =
      'pointer-events-auto flex items-start p-4 rounded-xl shadow-lg border toast-enter transition-all duration-300 ' +
      this.getColorClasses(type);

    const iconSvg = this.getIcon(type);

    toast.innerHTML = `
      <div class="flex-shrink-0 mr-3 mt-0.5">${iconSvg}</div>
      <div class="flex-1 text-sm">
        ${title ? `<h4 class="font-semibold mb-0.5">${title}</h4>` : ''}
        <p class="leading-relaxed">${message}</p>
      </div>
      <button class="flex-shrink-0 ml-3 text-slate-400 hover:text-slate-600 focus:outline-none" aria-label="Đóng">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    `;

    const closeBtn = toast.querySelector('button');
    let timeoutId: number;

    const dismiss = () => {
      clearTimeout(timeoutId);
      toast.classList.remove('toast-enter');
      toast.classList.add('toast-leave');
      setTimeout(() => {
        toast.remove();
      }, 200);
    };

    closeBtn?.addEventListener('click', dismiss);

    timeoutId = window.setTimeout(dismiss, duration);
    container.appendChild(toast);
  }

  public static success(message: string, title = 'Thành công'): void {
    this.show('success', message, title);
  }

  public static error(message: string, title = 'Có lỗi xảy ra'): void {
    this.show('error', message, title, 6000);
  }

  public static warning(message: string, title = 'Cảnh báo'): void {
    this.show('warning', message, title, 5000);
  }

  public static info(message: string, title = 'Thông báo'): void {
    this.show('info', message, title);
  }

  private static getColorClasses(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bg-white border-emerald-200 text-slate-800 shadow-emerald-500/10';
      case 'error':
        return 'bg-white border-rose-200 text-slate-800 shadow-rose-500/10';
      case 'warning':
        return 'bg-white border-amber-200 text-slate-800 shadow-amber-500/10';
      case 'info':
      default:
        return 'bg-white border-blue-200 text-slate-800 shadow-blue-500/10';
    }
  }

  private static getIcon(type: ToastType): string {
    switch (type) {
      case 'success':
        return '<svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      case 'error':
        return '<svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      case 'warning':
        return '<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
      case 'info':
      default:
        return '<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }
  }
}
