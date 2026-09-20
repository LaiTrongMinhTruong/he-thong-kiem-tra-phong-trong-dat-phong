/**
 * Định nghĩa chuẩn AppError dùng chung trong toàn hệ thống
 */

export interface AppErrorPayload {
  code: string;
  message: string;
  field?: string;
  details?: unknown;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly field?: string;
  public readonly details?: unknown;

  constructor(payload: AppErrorPayload) {
    super(payload.message);
    this.name = 'AppError';
    this.code = payload.code;
    this.field = payload.field;
    this.details = payload.details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
