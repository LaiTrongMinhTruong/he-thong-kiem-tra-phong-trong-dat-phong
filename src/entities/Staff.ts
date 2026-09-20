/**
 * Thực thể Nhân viên (Staff)
 */

export interface Staff {
  id: string;
  username: string;
  passwordHash: string;
  fullName: string;
  status: 'active' | 'inactive';
}
