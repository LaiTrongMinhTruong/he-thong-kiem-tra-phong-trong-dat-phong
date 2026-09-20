/**
 * Giao diện Quản lý Phòng của Nhân viên (Boundary - RoomManageView)
 * Chỉ gọi RoomController, kiểm tra chặt chẽ các ràng buộc CRUD và State Machine
 */

import { RoomController } from '../../control/RoomController';
import { RoomWithType, RoomStatus, RoomStatusLabels, RoomStatusColors } from '../../entities/Room';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { escapeHtml } from '../../utils/sanitize';
import { StaffSession } from '../../utils/session';

export class RoomManageView {
  private container: HTMLElement;
  private roomCtrl: RoomController;

  private allRooms: RoomWithType[] = [];
  private filteredRooms: RoomWithType[] = [];
  private statusFilter = '';
  private searchKeyword = '';
  private currentPage = 1;
  private pageSize = 10;

  constructor(container: HTMLElement, roomCtrl = new RoomController()) {
    this.container = container;
    this.roomCtrl = roomCtrl;
  }

  public async render(): Promise<void> {
    this.container.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <div class="inline-block animate-spin text-3xl mb-3 text-indigo-600">&#9696;</div>
        <p class="text-sm">Đang tải danh sách phòng...</p>
      </div>
    `;

    try {
      this.allRooms = await this.roomCtrl.getAllRoomsWithTypes();
      this.filterData();
      this.renderTableScreen();
    } catch (err: any) {
      Toast.error(err.message || 'Lỗi khi tải danh sách phòng.');
    }
  }

  private filterData(): void {
    let list = this.allRooms;

    if (this.statusFilter) {
      list = list.filter(r => r.status === this.statusFilter);
    }

    if (this.searchKeyword) {
      const kw = this.searchKeyword.toLowerCase();
      list = list.filter(
        r => r.roomNumber.toLowerCase().includes(kw) || r.roomType.name.toLowerCase().includes(kw)
      );
    }

    this.filteredRooms = list;
  }

  private renderTableScreen(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pageRooms = this.filteredRooms.slice(startIndex, endIndex);

    const rowsHtml = pageRooms.length === 0
      ? `<tr><td colspan="6" class="px-6 py-12 text-center text-slate-400 text-sm">Không tìm thấy phòng nào phù hợp</td></tr>`
      : pageRooms.map(r => {
          const color = RoomStatusColors[r.status] || { badge: 'bg-slate-100 text-slate-700' };
          return `
            <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 text-xs">
              <td class="px-6 py-4 font-black font-mono text-slate-900 text-sm">
                ${escapeHtml(r.roomNumber)}
              </td>
              <td class="px-6 py-4 font-medium text-slate-600">
                Tầng ${r.floor}
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-slate-800">${escapeHtml(r.roomType.name)}</div>
                <div class="text-[11px] text-slate-400">Tối đa ${r.roomType.capacity} khách</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${color.badge}">
                  ${RoomStatusLabels[r.status]}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-500 max-w-xs truncate">
                ${escapeHtml(r.note || '—')}
              </td>
              <td class="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                <button
                  type="button"
                  class="btn-change-status px-2.5 py-1.5 rounded-lg border border-slate-200 text-indigo-600 hover:bg-indigo-50 font-bold transition-all"
                  data-room-id="${r.id}"
                >
                  Đổi trạng thái
                </button>
                <button
                  type="button"
                  class="btn-edit-room px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold transition-all"
                  data-room-id="${r.id}"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  class="btn-delete-room px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-all"
                  data-room-id="${r.id}"
                >
                  Xóa
                </button>
              </td>
            </tr>
          `;
        }).join('');

    const paginationHtml = Pagination.render({
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      totalItems: this.filteredRooms.length,
      onPageChange: () => {},
      onPageSizeChange: () => {},
    });

    this.container.innerHTML = `
      <div class="space-y-6">
        <!-- Page Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900">Quản lý Phòng Khách sạn</h1>
            <p class="text-xs text-slate-500 mt-1">
              Thực hiện thêm, sửa, xóa phòng và điều chỉnh trạng thái vận hành phòng
            </p>
          </div>
          <button
            type="button"
            id="btn-add-new-room"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>Thêm phòng mới</span>
          </button>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              id="input-search-room"
              placeholder="Tìm theo số phòng, tên loại..."
              value="${escapeHtml(this.searchKeyword)}"
              class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-full sm:w-64 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label class="text-xs font-bold text-slate-500 whitespace-nowrap">Trạng thái:</label>
            <select
              id="select-room-status-filter"
              class="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" ${this.statusFilter === '' ? 'selected' : ''}>Tất cả trạng thái</option>
              <option value="available" ${this.statusFilter === 'available' ? 'selected' : ''}>Sẵn sàng đón khách</option>
              <option value="occupied" ${this.statusFilter === 'occupied' ? 'selected' : ''}>Đang có khách</option>
              <option value="cleaning" ${this.statusFilter === 'cleaning' ? 'selected' : ''}>Đang dọn dẹp</option>
              <option value="maintenance" ${this.statusFilter === 'maintenance' ? 'selected' : ''}>Bảo dưỡng sửa chữa</option>
            </select>
          </div>
        </div>

        <!-- Table Container -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th class="px-6 py-3.5">Số phòng</th>
                  <th class="px-6 py-3.5">Tầng</th>
                  <th class="px-6 py-3.5">Loại phòng</th>
                  <th class="px-6 py-3.5">Trạng thái</th>
                  <th class="px-6 py-3.5">Ghi chú</th>
                  <th class="px-6 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>

          <div id="room-manage-pagination" class="px-4 pb-2">
            ${paginationHtml}
          </div>
        </div>
      </div>
    `;

    this.bindTableEvents();
  }

  private bindTableEvents(): void {
    // Search input
    const searchInp = this.container.querySelector('#input-search-room') as HTMLInputElement;
    searchInp?.addEventListener('input', () => {
      this.searchKeyword = searchInp.value;
      this.currentPage = 1;
      this.filterData();
      this.renderTableScreen();
    });

    // Status filter
    const statusSelect = this.container.querySelector('#select-room-status-filter') as HTMLSelectElement;
    statusSelect?.addEventListener('change', () => {
      this.statusFilter = statusSelect.value;
      this.currentPage = 1;
      this.filterData();
      this.renderTableScreen();
    });

    // Pagination
    const pagEl = this.container.querySelector('#room-manage-pagination') as HTMLElement;
    if (pagEl) {
      Pagination.bindEvents(pagEl, {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        totalItems: this.filteredRooms.length,
        onPageChange: newPage => {
          this.currentPage = newPage;
          this.renderTableScreen();
        },
        onPageSizeChange: newSize => {
          this.pageSize = newSize;
          this.currentPage = 1;
          this.renderTableScreen();
        },
      });
    }

    // Add room button
    this.container.querySelector('#btn-add-new-room')?.addEventListener('click', () => {
      this.showAddRoomModal();
    });

    // Edit buttons
    this.container.querySelectorAll<HTMLButtonElement>('.btn-edit-room').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-room-id');
        const r = this.allRooms.find(x => x.id === id);
        if (r) this.showEditRoomModal(r);
      });
    });

    // Delete buttons
    this.container.querySelectorAll<HTMLButtonElement>('.btn-delete-room').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-room-id');
        const r = this.allRooms.find(x => x.id === id);
        if (r) this.confirmDeleteRoom(r);
      });
    });

    // Change status buttons
    this.container.querySelectorAll<HTMLButtonElement>('.btn-change-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-room-id');
        const r = this.allRooms.find(x => x.id === id);
        if (r) this.showChangeStatusModal(r);
      });
    });
  }

  /**
   * Modal Thêm phòng mới
   */
  private async showAddRoomModal(): Promise<void> {
    const roomTypes = await this.roomCtrl.getAllRoomTypes();
    const typeOptions = roomTypes
      .map(rt => `<option value="${rt.id}">${escapeHtml(rt.name)} (Tối đa ${rt.capacity} người)</option>`)
      .join('');

    const contentHtml = `
      <form id="form-modal-add-room" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số phòng *</label>
          <input type="text" id="modal-add-room-number" placeholder="Ví dụ: 203, 305" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" required />
          <p id="err-modal-roomNumber" class="text-xs text-rose-600 mt-1 hidden"></p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tầng *</label>
            <input type="number" id="modal-add-floor" min="1" max="100" value="1" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" required />
            <p id="err-modal-floor" class="text-xs text-rose-600 mt-1 hidden"></p>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Loại phòng *</label>
            <select id="modal-add-room-type" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white" required>
              ${typeOptions}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ghi chú phòng</label>
          <textarea id="modal-add-note" rows="2" placeholder="Ghi chú về vị trí, hướng phòng..." class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"></textarea>
        </div>
      </form>
    `;

    Modal.show({
      title: 'Thêm phòng mới',
      contentHtml,
      confirmText: 'Lưu phòng',
      confirmClass: 'bg-indigo-600 hover:bg-indigo-700',
      onConfirm: async () => {
        const roomNumber = (document.getElementById('modal-add-room-number') as HTMLInputElement)?.value;
        const floor = parseInt((document.getElementById('modal-add-floor') as HTMLInputElement)?.value || '1', 10);
        const roomTypeId = (document.getElementById('modal-add-room-type') as HTMLSelectElement)?.value;
        const note = (document.getElementById('modal-add-note') as HTMLTextAreaElement)?.value;

        try {
          await this.roomCtrl.createRoom({
            roomNumber,
            floor,
            roomTypeId,
            note,
          });
          Toast.success(`Đã thêm mới phòng ${roomNumber} thành công!`);
          await this.render();
        } catch (err: any) {
          Toast.error(err.message || 'Thêm phòng thất bại.');
          throw err;
        }
      },
    });
  }

  /**
   * Modal Sửa phòng
   */
  private async showEditRoomModal(room: RoomWithType): Promise<void> {
    const roomTypes = await this.roomCtrl.getAllRoomTypes();
    const typeOptions = roomTypes
      .map(
        rt =>
          `<option value="${rt.id}" ${rt.id === room.roomTypeId ? 'selected' : ''}>${escapeHtml(
            rt.name
          )}</option>`
      )
      .join('');

    const contentHtml = `
      <form class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Số phòng *</label>
          <input type="text" id="modal-edit-room-number" value="${escapeHtml(room.roomNumber)}" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" required />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tầng *</label>
            <input type="number" id="modal-edit-floor" min="1" max="100" value="${room.floor}" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" required />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Loại phòng *</label>
            <select id="modal-edit-room-type" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white" required>
              ${typeOptions}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Ghi chú</label>
          <textarea id="modal-edit-note" rows="2" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm">${escapeHtml(room.note || '')}</textarea>
        </div>
      </form>
    `;

    Modal.show({
      title: `Chỉnh sửa thông tin Phòng ${room.roomNumber}`,
      contentHtml,
      confirmText: 'Lưu thay đổi',
      confirmClass: 'bg-indigo-600 hover:bg-indigo-700',
      onConfirm: async () => {
        const roomNumber = (document.getElementById('modal-edit-room-number') as HTMLInputElement)?.value;
        const floor = parseInt((document.getElementById('modal-edit-floor') as HTMLInputElement)?.value || '1', 10);
        const roomTypeId = (document.getElementById('modal-edit-room-type') as HTMLSelectElement)?.value;
        const note = (document.getElementById('modal-edit-note') as HTMLTextAreaElement)?.value;

        try {
          await this.roomCtrl.updateRoom(room.id, { roomNumber, floor, roomTypeId, note });
          Toast.success(`Cập nhật phòng ${roomNumber} thành công!`);
          await this.render();
        } catch (err: any) {
          Toast.error(err.message || 'Cập nhật thất bại.');
          throw err;
        }
      },
    });
  }

  /**
   * Xác nhận xóa phòng (Ràng buộc: CHẶN XOÁ nếu phòng đang có booking pending/confirmed/checked_in)
   */
  private confirmDeleteRoom(room: RoomWithType): void {
    Modal.show({
      title: `Xác nhận xóa Phòng ${room.roomNumber}?`,
      contentHtml: `
        <p class="text-sm text-slate-600">
          Bạn có chắc chắn muốn xóa phòng <strong>${escapeHtml(room.roomNumber)}</strong> khỏi hệ thống không?
        </p>
        <p class="text-xs text-rose-600 mt-2">
          * Quy tắc: Hệ thống sẽ từ chối xóa nếu phòng này đang có đơn đặt phòng chờ duyệt, đã xác nhận hoặc đang có khách lưu trú.
        </p>
      `,
      confirmText: 'Xóa phòng này',
      confirmClass: 'bg-rose-600 hover:bg-rose-700',
      onConfirm: async () => {
        try {
          await this.roomCtrl.deleteRoom(room.id);
          Toast.success(`Đã xóa phòng ${room.roomNumber} thành công!`);
          await this.render();
        } catch (err: any) {
          Toast.error(err.message || 'Không thể xóa phòng.');
          throw err;
        }
      },
    });
  }

  /**
   * Modal Đổi trạng thái phòng (State Machine & Cảnh báo bảo dưỡng 7 ngày)
   */
  private showChangeStatusModal(room: RoomWithType): void {
    const statuses: RoomStatus[] = ['available', 'occupied', 'cleaning', 'maintenance'];
    const optionsHtml = statuses
      .map(
        s =>
          `<option value="${s}" ${s === room.status ? 'selected' : ''}>${RoomStatusLabels[s]}</option>`
      )
      .join('');

    const contentHtml = `
      <form class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 uppercase mb-1">Trạng thái hiện tại:</label>
          <span class="font-semibold text-slate-900">${RoomStatusLabels[room.status]}</span>
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase mb-1">Chuyển sang trạng thái mới:</label>
          <select id="modal-change-status-select" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white">
            ${optionsHtml}
          </select>
        </div>
        <div>
          <label class="block font-bold text-slate-700 uppercase mb-1">Lý do thay đổi / Ghi chú</label>
          <textarea id="modal-change-status-note" rows="2" placeholder="Ví dụ: Đã dọn phòng xong, bảo dưỡng điều hòa..." class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"></textarea>
        </div>
        <p class="text-[11px] text-slate-400">
          * Chuyển trạng thái tuân theo State Machine. Phòng đang có khách ở không thể chuyển trực tiếp về "Sẵn sàng đón khách".
        </p>
      </form>
    `;

    Modal.show({
      title: `Cập nhật trạng thái Phòng ${room.roomNumber}`,
      contentHtml,
      confirmText: 'Cập nhật trạng thái',
      confirmClass: 'bg-indigo-600 hover:bg-indigo-700',
      onConfirm: async () => {
        const newStatus = (document.getElementById('modal-change-status-select') as HTMLSelectElement)?.value as RoomStatus;
        const note = (document.getElementById('modal-change-status-note') as HTMLTextAreaElement)?.value;
        const staff = StaffSession.get();
        const staffUsername = staff?.username || 'admin';

        try {
          const result = await this.roomCtrl.updateRoomStatus(
            room.id,
            newStatus,
            staffUsername,
            note
          );

          // Nếu có cảnh báo (ví dụ có booking trong 7 ngày tới) -> hiển thị modal hỏi xác nhận lần 2
          if (result.warning) {
            Modal.show({
              title: 'Cảnh báo lịch đặt phòng!',
              contentHtml: `
                <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  ${escapeHtml(result.warning)}
                </div>
              `,
              confirmText: 'Vẫn tiếp tục chuyển bảo dưỡng',
              confirmClass: 'bg-amber-600 hover:bg-amber-700',
              onConfirm: async () => {
                await this.roomCtrl.updateRoomStatus(
                  room.id,
                  newStatus,
                  staffUsername,
                  note,
                  true // forceConfirm
                );
                Toast.success(`Đã chuyển phòng ${room.roomNumber} sang ${RoomStatusLabels[newStatus]}`);
                await this.render();
              },
            });
            return;
          }

          Toast.success(`Đã chuyển phòng ${room.roomNumber} sang ${RoomStatusLabels[newStatus]}`);
          await this.render();
        } catch (err: any) {
          Toast.error(err.message || 'Cập nhật trạng thái thất bại.');
          throw err;
        }
      },
    });
  }
}
