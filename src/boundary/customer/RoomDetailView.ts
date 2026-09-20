/**
 * View hiển thị chi tiết phòng và loại phòng (Modal / Popup)
 */

import { RoomWithType } from '../../entities/Room';
import { Modal } from '../components/Modal';
import { formatMoney, calculateTotalAmount } from '../../utils/money';
import { formatDateDisplay } from '../../utils/dateUtils';
import { escapeHtml } from '../../utils/sanitize';

export class RoomDetailView {
  public static showModal(
    room: RoomWithType,
    checkInDate?: string,
    checkOutDate?: string,
    nights = 1,
    onBookClick?: () => void
  ): void {
    const rt = room.roomType;
    const priceCalc = calculateTotalAmount(nights, rt.basePricePerNight);

    const contentHtml = `
      <div class="space-y-4">
        <!-- Room Banner Info -->
        <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
              Tầng ${room.floor}
            </span>
            <h4 class="text-xl font-extrabold text-slate-900 mt-1">Phòng ${escapeHtml(room.roomNumber)}</h4>
            <p class="text-xs text-slate-500">${escapeHtml(rt.name)} &bull; Sức chứa tối đa: ${rt.capacity} người</p>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-400">Giá tiêu chuẩn</div>
            <div class="text-lg font-extrabold text-blue-600">${formatMoney(rt.basePricePerNight)}</div>
            <div class="text-[11px] text-slate-400">/ đêm (chưa VAT)</div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h5 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mô tả loại phòng</h5>
          <p class="text-sm text-slate-600 leading-relaxed">${escapeHtml(rt.description)}</p>
        </div>

        <!-- Amenities -->
        <div>
          <h5 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tiện ích trong phòng</h5>
          <div class="flex flex-wrap gap-1.5">
            ${rt.amenities.map(a => `
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                <svg class="w-3.5 h-3.5 text-blue-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                ${escapeHtml(a)}
              </span>
            `).join('')}
          </div>
        </div>

        ${checkInDate && checkOutDate ? `
          <!-- Estimated Price for selected dates -->
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div class="font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Chi phí dự tính (${nights} đêm):</span>
              <span class="font-normal text-slate-500">${formatDateDisplay(checkInDate)} &rarr; ${formatDateDisplay(checkOutDate)}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Đơn giá phòng (${nights} đêm):</span>
              <span>${formatMoney(priceCalc.subtotal)}</span>
            </div>
            <div class="flex justify-between text-slate-600">
              <span>Thuế GTGT (VAT 8%):</span>
              <span>${formatMoney(priceCalc.vat)}</span>
            </div>
            <div class="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-slate-200 text-sm">
              <span>Tổng thanh toán:</span>
              <span class="text-blue-600">${formatMoney(priceCalc.total)}</span>
            </div>
          </div>
        ` : ''}

        ${room.note ? `
          <div class="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <strong>Ghi chú phòng:</strong> ${escapeHtml(room.note)}
          </div>
        ` : ''}
      </div>
    `;

    Modal.show({
      title: `Chi tiết Phòng ${room.roomNumber}`,
      contentHtml,
      confirmText: onBookClick ? 'Đặt phòng này' : undefined,
      cancelText: 'Đóng',
      onConfirm: () => {
        onBookClick?.();
      },
    });
  }
}
