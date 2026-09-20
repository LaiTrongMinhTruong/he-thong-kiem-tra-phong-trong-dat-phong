/**
 * Tiện ích giới hạn tần suất thử sai (Rate Limiting)
 * Giới hạn 5 lần thử sai trong 60 giây (dùng cho Tra cứu mã đặt phòng & Đăng nhập nhân viên)
 */

interface RateLimitRecord {
  attempts: number[]; // Mảng chứa timestamps của các lần thử thất bại
}

export class RateLimiter {
  private keyPrefix: string;
  private maxAttempts: number;
  private windowSeconds: number;

  constructor(keyPrefix: string, maxAttempts = 5, windowSeconds = 60) {
    this.keyPrefix = `ratelimit_${keyPrefix}`;
    this.maxAttempts = maxAttempts;
    this.windowSeconds = windowSeconds;
  }

  private getRecord(): RateLimitRecord {
    try {
      const data = sessionStorage.getItem(this.keyPrefix);
      if (!data) return { attempts: [] };
      return JSON.parse(data);
    } catch {
      return { attempts: [] };
    }
  }

  private saveRecord(record: RateLimitRecord): void {
    try {
      sessionStorage.setItem(this.keyPrefix, JSON.stringify(record));
    } catch {
      // Bỏ qua lỗi lưu storage nếu có
    }
  }

  /**
   * Kiểm tra xem hành động có được phép thực hiện không
   */
  public check(): { allowed: boolean; remainingAttempts: number; waitSeconds: number } {
    const now = Date.now();
    const windowMs = this.windowSeconds * 1000;
    const record = this.getRecord();

    // Lọc bỏ những lần thử quá hạn (ngoài cửa sổ 60s)
    const validAttempts = record.attempts.filter(t => now - t < windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      const oldestValid = validAttempts[0];
      const waitSeconds = Math.ceil((oldestValid + windowMs - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        waitSeconds: Math.max(1, waitSeconds),
      };
    }

    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - validAttempts.length,
      waitSeconds: 0,
    };
  }

  /**
   * Ghi nhận 1 lần thử thất bại
   */
  public recordFailure(): void {
    const now = Date.now();
    const windowMs = this.windowSeconds * 1000;
    const record = this.getRecord();
    const validAttempts = record.attempts.filter(t => now - t < windowMs);
    validAttempts.push(now);
    this.saveRecord({ attempts: validAttempts });
  }

  /**
   * Đặt lại (reset) khi thành công
   */
  public reset(): void {
    try {
      sessionStorage.removeItem(this.keyPrefix);
    } catch {
      // Bỏ qua
    }
  }
}
