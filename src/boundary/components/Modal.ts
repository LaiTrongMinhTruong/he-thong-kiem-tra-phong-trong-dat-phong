/**
 * Component hiển thị cửa sổ hộp thoại Modal (Xác nhận 2 bước, chi tiết)
 */

export interface ModalOptions {
  title: string;
  contentHtml: string;
  confirmText?: string;
  cancelText?: string;
  confirmClass?: string;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
}

export class Modal {
  private static activeModal: HTMLElement | null = null;

  public static show(options: ModalOptions): void {
    this.close();

    const container = document.getElementById('modal-container') || document.body;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 overflow-y-auto';

    modal.innerHTML = `
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" data-action="backdrop"></div>

        <!-- Modal panel -->
        <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100">
          <div class="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-bold text-slate-900 mb-3">${options.title}</h3>
            <div class="text-sm text-slate-600 space-y-3">${options.contentHtml}</div>
          </div>
          <div class="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-slate-100">
            ${options.confirmText ? `
              <button type="button" id="modal-confirm-btn" class="inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none ${options.confirmClass || 'bg-blue-600 hover:bg-blue-700'}">
                ${options.confirmText}
              </button>
            ` : ''}
            <button type="button" id="modal-cancel-btn" class="inline-flex justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all">
              ${options.cancelText || 'Đóng'}
            </button>
          </div>
        </div>
      </div>
    `;

    const closeSelf = () => {
      modal.remove();
      this.activeModal = null;
    };

    const confirmBtn = modal.querySelector('#modal-confirm-btn') as HTMLButtonElement | null;
    const cancelBtn = modal.querySelector('#modal-cancel-btn') as HTMLButtonElement | null;
    const backdrop = modal.querySelector('[data-action="backdrop"]');

    if (confirmBtn && options.onConfirm) {
      confirmBtn.addEventListener('click', async () => {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span class="inline-block animate-spin mr-2">&#9696;</span> Đang xử lý...';
        try {
          await options.onConfirm?.();
          closeSelf();
        } catch {
          confirmBtn.disabled = false;
          confirmBtn.textContent = options.confirmText || 'Xác nhận';
        }
      });
    }

    cancelBtn?.addEventListener('click', () => {
      options.onCancel?.();
      closeSelf();
    });

    backdrop?.addEventListener('click', () => {
      options.onCancel?.();
      closeSelf();
    });

    container.appendChild(modal);
    this.activeModal = modal;
  }

  public static close(): void {
    if (this.activeModal) {
      this.activeModal.remove();
      this.activeModal = null;
    }
  }
}
