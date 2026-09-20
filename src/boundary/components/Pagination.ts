/**
 * Component Phân trang (Pagination)
 * Quản lý: page >= 1, pageSize ∈ {5, 10, 20}, chặn page vượt tổng số trang
 */

export interface PaginationOptions {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
}

export class Pagination {
  public static render(options: PaginationOptions): string {
    const { currentPage, pageSize, totalItems } = options;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const endItem = Math.min(safePage * pageSize, totalItems);

    return `
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 bg-white rounded-xl border border-slate-100 mt-6 text-sm text-slate-600">
        <div class="flex items-center gap-3">
          <span>Hiển thị <strong>${startItem} - ${endItem}</strong> trên tổng số <strong>${totalItems}</strong> mục</span>
          ${options.onPageSizeChange ? `
            <div class="flex items-center gap-1.5 ml-2">
              <label for="pagination-page-size" class="text-xs text-slate-500">Mỗi trang:</label>
              <select id="pagination-page-size" class="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-blue-500">
                <option value="5" ${pageSize === 5 ? 'selected' : ''}>5</option>
                <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
                <option value="20" ${pageSize === 20 ? 'selected' : ''}>20</option>
              </select>
            </div>
          ` : ''}
        </div>

        <div class="flex items-center gap-1.5">
          <button
            type="button"
            data-page="${safePage - 1}"
            class="pagination-btn px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
            ${safePage <= 1 ? 'disabled' : ''}
          >
            &laquo; Trước
          </button>

          <div class="flex items-center gap-1 px-1">
            <span class="font-medium text-slate-900">${safePage}</span>
            <span class="text-slate-400">/</span>
            <span>${totalPages}</span>
          </div>

          <button
            type="button"
            data-page="${safePage + 1}"
            class="pagination-btn px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all"
            ${safePage >= totalPages ? 'disabled' : ''}
          >
            Sau &raquo;
          </button>
        </div>
      </div>
    `;
  }

  public static bindEvents(container: HTMLElement, options: PaginationOptions): void {
    const btns = container.querySelectorAll<HTMLButtonElement>('.pagination-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.getAttribute('data-page') || '1', 10);
        const totalPages = Math.max(1, Math.ceil(options.totalItems / options.pageSize));
        if (page >= 1 && page <= totalPages && page !== options.currentPage) {
          options.onPageChange(page);
        }
      });
    });

    const sizeSelect = container.querySelector<HTMLSelectElement>('#pagination-page-size');
    if (sizeSelect && options.onPageSizeChange) {
      sizeSelect.addEventListener('change', () => {
        const newSize = parseInt(sizeSelect.value, 10);
        if ([5, 10, 20].includes(newSize)) {
          options.onPageSizeChange?.(newSize);
        }
      });
    }
  }
}
