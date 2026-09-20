/**
 * Giao diện Tìm kiếm phòng trống (Boundary - RoomSearchView)
 * Chỉ gọi RoomController, render DOM và bắt sự kiện người dùng
 */

import { RoomController, AvailableRoomResult } from '../../control/RoomController';
import { RoomDetailView } from './RoomDetailView';
import { Pagination } from '../components/Pagination';
import { Toast } from '../components/Toast';
import { formatMoney } from '../../utils/money';
import { getLocalTodayString, addDays, formatDateDisplay } from '../../utils/dateUtils';
import { validateSearchFilters } from '../../validation/searchValidator';
import { escapeHtml } from '../../utils/sanitize';

export class RoomSearchView {
  private container: HTMLElement;
  private roomCtrl: RoomController;

  // Trạng thái tìm kiếm
  private checkInDate: string;
  private checkOutDate: string;
  private roomTypeId: string;
  private guests: string;
  private minPrice: string;
  private maxPrice: string;

  // Dữ liệu kết quả & phân trang
  private allResults: AvailableRoomResult[] = [];
  private currentPage = 1;
  private pageSize = 5;
  private isSearching = false;
  private searchNights = 1;

  constructor(container: HTMLElement, roomCtrl = new RoomController()) {
    this.container = container;
    this.roomCtrl = roomCtrl;

    const today = getLocalTodayString();
    this.checkInDate = addDays(today, 1);
    this.checkOutDate = addDays(today, 3);
    this.roomTypeId = '';
    this.guests = '';
    this.minPrice = '';
    this.maxPrice = '';
  }

  public async render(): Promise<void> {
    const today = getLocalTodayString();
    const maxDate = addDays(today, 365);

    // Lấy danh sách loại phòng để hiển thị trong select
    let roomTypesHtml = '<option value="">Tất cả các loại phòng</option>';
    try {
      const roomTypes = await this.roomCtrl.getAllRoomTypes();
      roomTypesHtml += roomTypes
        .map(
          rt =>
            `<option value="${rt.id}" ${this.roomTypeId === rt.id ? 'selected' : ''}>${escapeHtml(
              rt.name
            )} (Tối đa ${rt.capacity} người - ${formatMoney(rt.basePricePerNight)}/đêm)</option>`
        )
        .join('');
    } catch {
      // Bỏ qua nếu lỗi
    }

    this.container.innerHTML = `
      <div class="space-y-8">
        <!-- Hero Section Banner -->
        <div class="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl overflow-hidden">
          <div class="relative z-10 max-w-2xl">
            <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Hệ thống đặt phòng trực tuyến
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Tìm kiếm phòng trống &amp; Đặt phòng nhanh chóng
            </h1>
            <p class="mt-3 text-blue-100 text-sm sm:text-base leading-relaxed">
              Trải nghiệm dịch vụ nghỉ dưỡng cao cấp với giá ưu đãi. Kiểm tra tình trạng phòng thực tế theo thời gian thực.
            </p>
          </div>
        </div>

        <!-- Search Bar Form Card -->
        <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h2 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Bộ lọc tìm phòng trống
          </h2>

          <form id="search-room-form" class="space-y-6" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <!-- Check-In Date -->
              <div>
                <label for="search-check-in" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ngày nhận phòng <span class="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="search-check-in"
                  min="${today}"
                  max="${maxDate}"
                  value="${this.checkInDate}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
                <p id="error-checkInDate" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>

              <!-- Check-Out Date -->
              <div>
                <label for="search-check-out" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Ngày trả phòng <span class="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  id="search-check-out"
                  min="${addDays(today, 1)}"
                  max="${maxDate}"
                  value="${this.checkOutDate}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
                <p id="error-checkOutDate" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>

              <!-- Room Type Filter -->
              <div>
                <label for="search-room-type" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Loại phòng
                </label>
                <select
                  id="search-room-type"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                >
                  ${roomTypesHtml}
                </select>
              </div>

              <!-- Guests Filter -->
              <div>
                <label for="search-guests" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Số lượng khách
                </label>
                <input
                  type="number"
                  id="search-guests"
                  placeholder="Vd: 2"
                  min="1"
                  max="20"
                  value="${this.guests}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p id="error-guests" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>
            </div>

            <!-- Price Range Filter (Accordion/Row) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2 border-t border-slate-100">
              <div>
                <label for="search-min-price" class="block text-xs font-medium text-slate-600 mb-1.5">
                  Giá tối thiểu (VNĐ / đêm)
                </label>
                <input
                  type="number"
                  id="search-min-price"
                  placeholder="Vd: 500000"
                  min="0"
                  step="100000"
                  value="${this.minPrice}"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p id="error-minPrice" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>

              <div>
                <label for="search-max-price" class="block text-xs font-medium text-slate-600 mb-1.5">
                  Giá tối đa (VNĐ / đêm)
                </label>
                <input
                  type="number"
                  id="search-max-price"
                  placeholder="Vd: 2000000"
                  min="0"
                  step="100000"
                  value="${this.maxPrice}"
                  class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <p id="error-maxPrice" class="text-xs text-rose-600 mt-1.5 hidden"></p>
              </div>

              <div class="sm:col-span-2 flex items-end justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
                <p id="error-priceRange" class="text-xs text-rose-600 self-center hidden"></p>
                <button
                  type="button"
                  id="btn-reset-filters"
                  class="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  Xóa bộ lọc
                </button>
                <button
                  type="submit"
                  id="btn-submit-search"
                  class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition-all flex items-center gap-2"
                >
                  <span>Tìm phòng trống</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Search Results Section Container -->
        <div id="search-results-container">
          <!-- Sẽ được cập nhật sau khi tìm kiếm -->
        </div>
      </div>
    `;

    this.bindEvents();
    // Tự động tìm kiếm lần đầu với tham số mặc định
    await this.executeSearch();
  }

  private bindEvents(): void {
    const form = this.container.querySelector('#search-room-form') as HTMLFormElement;
    const checkInInput = this.container.querySelector('#search-check-in') as HTMLInputElement;
    const checkOutInput = this.container.querySelector('#search-check-out') as HTMLInputElement;
    const roomTypeInput = this.container.querySelector('#search-room-type') as HTMLSelectElement;
    const guestsInput = this.container.querySelector('#search-guests') as HTMLInputElement;
    const minPriceInput = this.container.querySelector('#search-min-price') as HTMLInputElement;
    const maxPriceInput = this.container.querySelector('#search-max-price') as HTMLInputElement;
    const resetBtn = this.container.querySelector('#btn-reset-filters') as HTMLButtonElement;

    // Chặn gõ phím đặc biệt trên input number (+, -, e, .)
    [guestsInput, minPriceInput, maxPriceInput].forEach(inp => {
      inp?.addEventListener('keydown', e => {
        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
          e.preventDefault();
        }
      });
    });

    // Khi đổi ngày nhận phòng -> tự động cập nhật min của ngày trả phòng
    checkInInput?.addEventListener('change', () => {
      this.checkInDate = checkInInput.value;
      if (checkInInput.value) {
        checkOutInput.min = addDays(checkInInput.value, 1);
        if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
          checkOutInput.value = addDays(checkInInput.value, 1);
          this.checkOutDate = checkOutInput.value;
        }
      }
      this.validateInputs();
    });

    checkOutInput?.addEventListener('change', () => {
      this.checkOutDate = checkOutInput.value;
      this.validateInputs();
    });

    roomTypeInput?.addEventListener('change', () => {
      this.roomTypeId = roomTypeInput.value;
    });

    guestsInput?.addEventListener('input', () => {
      this.guests = guestsInput.value;
      this.validateInputs();
    });

    minPriceInput?.addEventListener('input', () => {
      this.minPrice = minPriceInput.value;
      this.validateInputs();
    });

    maxPriceInput?.addEventListener('input', () => {
      this.maxPrice = maxPriceInput.value;
      this.validateInputs();
    });

    resetBtn?.addEventListener('click', () => {
      const today = getLocalTodayString();
      this.checkInDate = addDays(today, 1);
      this.checkOutDate = addDays(today, 3);
      this.roomTypeId = '';
      this.guests = '';
      this.minPrice = '';
      this.maxPrice = '';
      this.render();
    });

    form?.addEventListener('submit', async e => {
      e.preventDefault();
      if (this.isSearching) return;
      await this.executeSearch();
    });
  }

  private validateInputs(): boolean {
    const checkInInput = this.container.querySelector('#search-check-in') as HTMLInputElement;
    const checkOutInput = this.container.querySelector('#search-check-out') as HTMLInputElement;
    const guestsInput = this.container.querySelector('#search-guests') as HTMLInputElement;
    const minPriceInput = this.container.querySelector('#search-min-price') as HTMLInputElement;
    const maxPriceInput = this.container.querySelector('#search-max-price') as HTMLInputElement;
    const submitBtn = this.container.querySelector('#btn-submit-search') as HTMLButtonElement;

    const validation = validateSearchFilters({
      checkInDate: checkInInput?.value || '',
      checkOutDate: checkOutInput?.value || '',
      roomTypeId: this.roomTypeId,
      guests: guestsInput?.value,
      minPrice: minPriceInput?.value,
      maxPrice: maxPriceInput?.value,
    });

    // Cập nhật inline errors
    this.displayFieldError('checkInDate', validation.errors.checkInDate);
    this.displayFieldError('checkOutDate', validation.errors.checkOutDate);
    this.displayFieldError('guests', validation.errors.guests);
    this.displayFieldError('minPrice', validation.errors.minPrice);
    this.displayFieldError('maxPrice', validation.errors.maxPrice);
    this.displayFieldError('priceRange', validation.errors.priceRange);

    if (submitBtn) {
      submitBtn.disabled = !validation.isValid;
      if (!validation.isValid) {
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    return validation.isValid;
  }

  private displayFieldError(field: string, error?: string): void {
    const errorEl = this.container.querySelector(`#error-${field}`);
    if (!errorEl) return;

    if (error) {
      errorEl.textContent = error;
      errorEl.classList.remove('hidden');
    } else {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  private async executeSearch(): Promise<void> {
    if (!this.validateInputs()) return;

    this.isSearching = true;
    const submitBtn = this.container.querySelector('#btn-submit-search') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">&#9696;</span> Đang kiểm tra...';
    }

    const resultsContainer = this.container.querySelector('#search-results-container');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="py-16 text-center text-slate-500">
          <div class="inline-block animate-spin text-3xl mb-3 text-blue-600">&#9696;</div>
          <p class="text-sm font-medium">Đang kiểm tra phòng trống và tính toán biểu phí...</p>
        </div>
      `;
    }

    try {
      const data = await this.roomCtrl.searchAvailableRooms({
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        roomTypeId: this.roomTypeId || undefined,
        guests: this.guests || undefined,
        minPrice: this.minPrice || undefined,
        maxPrice: this.maxPrice || undefined,
      });

      this.allResults = data.results;
      this.searchNights = data.nights;
      this.currentPage = 1;
      this.renderResults();
    } catch (err: any) {
      Toast.error(err.message || 'Lỗi khi tìm kiếm phòng trống.');
      if (resultsContainer) {
        resultsContainer.innerHTML = `
          <div class="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-700">
            <h3 class="font-bold text-base mb-1">Không thể tải dữ liệu phòng</h3>
            <p class="text-sm">${escapeHtml(err.message)}</p>
          </div>
        `;
      }
    } finally {
      this.isSearching = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Tìm phòng trống</span>';
      }
    }
  }

  private renderResults(): void {
    const container = this.container.querySelector('#search-results-container');
    if (!container) return;

    if (this.allResults.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto my-6">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Không tìm thấy phòng trống phù hợp</h3>
          <p class="text-slate-500 text-sm mb-6 leading-relaxed">
            Rất tiếc, các phòng trong khoảng ngày <strong>${formatDateDisplay(this.checkInDate)} &rarr; ${formatDateDisplay(this.checkOutDate)}</strong> đã kín chỗ hoặc không thỏa mãn tiêu chí lọc của bạn.
          </p>
          <div class="p-4 bg-slate-50 rounded-xl text-left text-xs text-slate-600 space-y-1.5 mb-6 border border-slate-100">
            <p class="font-semibold text-slate-700">Gợi ý để tìm được phòng:</p>
            <p>&bull; Thử thay đổi khoảng ngày nhận / trả phòng sớm hơn hoặc muộn hơn 1-2 ngày.</p>
            <p>&bull; Chọn "Tất cả các loại phòng" để xem toàn bộ phòng còn trống.</p>
            <p>&bull; Nới rộng khoảng giá tìm kiếm nếu bạn đang đặt bộ lọc giá.</p>
          </div>
          <button id="btn-empty-clear-filters" class="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm">
            Xem tất cả phòng còn trống ngày này
          </button>
        </div>
      `;

      container.querySelector('#btn-empty-clear-filters')?.addEventListener('click', () => {
        this.roomTypeId = '';
        this.guests = '';
        this.minPrice = '';
        this.maxPrice = '';
        (this.container.querySelector('#search-room-type') as HTMLSelectElement).value = '';
        (this.container.querySelector('#search-guests') as HTMLInputElement).value = '';
        (this.container.querySelector('#search-min-price') as HTMLInputElement).value = '';
        (this.container.querySelector('#search-max-price') as HTMLInputElement).value = '';
        this.executeSearch();
      });

      return;
    }

    // Phân trang
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pageItems = this.allResults.slice(startIndex, endIndex);

    const cardsHtml = pageItems
      .map(item => {
        const { room, roomType, totalAmount, depositAmount } = item;
        return `
          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">
            <!-- Room Image Placeholder / Tag -->
            <div class="md:w-64 bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
              <div>
                <span class="inline-block px-2.5 py-1 rounded-md text-xs font-extrabold bg-blue-600 text-white tracking-wider uppercase">
                  Tầng ${room.floor}
                </span>
                <div class="mt-3">
                  <span class="text-xs text-slate-500 font-medium">Số phòng:</span>
                  <h3 class="text-2xl font-black text-slate-900">${escapeHtml(room.roomNumber)}</h3>
                </div>
              </div>
              <div class="mt-4 md:mt-0 text-xs text-slate-500">
                <span class="inline-flex items-center gap-1">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Tối đa ${roomType.capacity} khách
                </span>
              </div>
            </div>

            <!-- Room Content -->
            <div class="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 class="text-lg font-bold text-slate-900">${escapeHtml(roomType.name)}</h4>
                  <div class="text-left sm:text-right">
                    <span class="text-xs text-slate-400 font-medium">Đơn giá:</span>
                    <span class="text-base font-bold text-slate-900 ml-1">${formatMoney(roomType.basePricePerNight)}</span>
                    <span class="text-xs text-slate-400">/ đêm</span>
                  </div>
                </div>

                <p class="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">${escapeHtml(roomType.description)}</p>

                <!-- Amenities tags -->
                <div class="mt-3.5 flex flex-wrap gap-1.5">
                  ${roomType.amenities.slice(0, 4).map(a => `
                    <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                      ${escapeHtml(a)}
                    </span>
                  `).join('')}
                  ${roomType.amenities.length > 4 ? `
                    <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-400">
                      +${roomType.amenities.length - 4} tiện ích
                    </span>
                  ` : ''}
                </div>
              </div>

              <!-- Price breakdown & action -->
              <div class="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="text-xs text-slate-500">
                    Tổng cộng <strong>${this.searchNights} đêm</strong> (đã gồm 8% VAT):
                  </div>
                  <div class="text-xl font-extrabold text-blue-600">${formatMoney(totalAmount)}</div>
                  <div class="text-[11px] text-emerald-600 font-medium">
                    (Có thể đặt cọc trước 30%: ${formatMoney(depositAmount)})
                  </div>
                </div>

                <div class="flex items-center gap-2.5">
                  <button
                    type="button"
                    class="btn-view-detail px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
                    data-room-id="${room.id}"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    type="button"
                    class="btn-book-room px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
                    data-room-id="${room.id}"
                  >
                    Đặt phòng này &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    const paginationHtml = Pagination.render({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      totalItems: this.allResults.length,
      onPageChange: () => {},
      onPageSizeChange: () => {},
    });

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">
            Tìm thấy <span class="text-blue-600">${this.allResults.length}</span> phòng trống phù hợp
          </h3>
          <span class="text-xs text-slate-500">
            Lưu trú: <strong>${formatDateDisplay(this.checkInDate)} &rarr; ${formatDateDisplay(this.checkOutDate)}</strong> (${this.searchNights} đêm)
          </span>
        </div>

        <div class="grid grid-cols-1 gap-4">
          ${cardsHtml}
        </div>

        <div id="results-pagination-container">
          ${paginationHtml}
        </div>
      </div>
    `;

    // Gắn sự kiện phân trang
    const pagContainer = container.querySelector('#results-pagination-container') as HTMLElement;
    if (pagContainer) {
      Pagination.bindEvents(pagContainer, {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        totalItems: this.allResults.length,
        onPageChange: (newPage: number) => {
          this.currentPage = newPage;
          this.renderResults();
          pagContainer.scrollIntoView({ behavior: 'smooth' });
        },
        onPageSizeChange: (newSize: number) => {
          this.pageSize = newSize;
          this.currentPage = 1;
          this.renderResults();
        },
      });
    }

    // Gắn sự kiện Xem chi tiết
    container.querySelectorAll<HTMLButtonElement>('.btn-view-detail').forEach(btn => {
      btn.addEventListener('click', async () => {
        const roomId = btn.getAttribute('data-room-id');
        if (!roomId) return;
        const roomDetail = await this.roomCtrl.getRoomDetail(roomId);
        if (roomDetail) {
          RoomDetailView.showModal(
            roomDetail,
            this.checkInDate,
            this.checkOutDate,
            this.searchNights,
            () => {
              this.navigateToBooking(roomId);
            }
          );
        }
      });
    });

    // Gắn sự kiện Đặt phòng
    container.querySelectorAll<HTMLButtonElement>('.btn-book-room').forEach(btn => {
      btn.addEventListener('click', () => {
        const roomId = btn.getAttribute('data-room-id');
        if (roomId) {
          this.navigateToBooking(roomId);
        }
      });
    });
  }

  private navigateToBooking(roomId: string): void {
    const url = `#/book?roomId=${encodeURIComponent(roomId)}&checkIn=${encodeURIComponent(
      this.checkInDate
    )}&checkOut=${encodeURIComponent(this.checkOutDate)}`;
    window.location.hash = url;
  }
}
