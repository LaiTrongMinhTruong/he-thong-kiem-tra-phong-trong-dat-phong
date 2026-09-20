/**
 * Repository thao tác với dữ liệu Nhân viên (staff)
 * Nơi duy nhất gọi apiRequest() cho thực thể Staff
 */

import { Staff } from '../entities/Staff';
import { apiRequest } from './apiConfig';

export class StaffRepository {
  public async findByUsername(username: string): Promise<Staff | null> {
    const list = await apiRequest<Staff[]>(`/staff?username=${encodeURIComponent(username.trim())}`);
    return list.length > 0 ? list[0] : null;
  }

  public async findAllStaff(): Promise<Staff[]> {
    return apiRequest<Staff[]>('/staff');
  }
}
