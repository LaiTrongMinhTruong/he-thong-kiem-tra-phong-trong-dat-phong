/**
 * Quản lý phiên đăng nhập của Nhân viên (Staff Session)
 */

export interface StaffSessionData {
  id: string;
  username: string;
  fullName: string;
  status: string;
  loginAt: number;
}

const SESSION_KEY = 'hotel_staff_session';

export const StaffSession = {
  get(): StaffSessionData | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  set(staff: Omit<StaffSessionData, 'loginAt'>): void {
    const session: StaffSessionData = {
      ...staff,
      loginAt: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  clear(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  isLoggedIn(): boolean {
    const session = this.get();
    return !!(session && session.id && session.username);
  },
};
