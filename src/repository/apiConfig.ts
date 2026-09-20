/**
 * Cấu hình kết nối API tới json-server (cổng 3002)
 * Bọc toàn bộ fetch(), xử lý lỗi mạng và phát tín hiệu tới NetworkBanner
 */

import { AppError } from '../entities/AppError';

export const API_BASE_URL = 'http://localhost:3002';

// Quản lý trạng thái kết nối máy chủ
let isServerOnline = true;
const connectionListeners: Array<(online: boolean, message?: string) => void> = [];

export function onConnectionChange(listener: (online: boolean, message?: string) => void) {
  connectionListeners.push(listener);
}

function notifyConnectionChange(online: boolean, message?: string) {
  if (isServerOnline !== online) {
    isServerOnline = online;
    connectionListeners.forEach(listener => listener(online, message));
  }
}

/**
 * Hàm gọi API chung bọc try/catch an toàn
 */
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = null;
      }

      throw new AppError({
        code: `HTTP_${response.status}`,
        message: errorData?.message || `Yêu cầu máy chủ thất bại (HTTP ${response.status}: ${response.statusText}).`,
        details: errorData,
      });
    }

    notifyConnectionChange(true);
    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err instanceof AppError) {
      throw err;
    }

    // Lỗi mạng hoặc json-server chưa bật / bị sập
    const networkMsg = 'Không thể kết nối đến máy chủ CSDL (json-server tại http://localhost:3002). Vui lòng kiểm tra lệnh npm run server!';
    notifyConnectionChange(false, networkMsg);

    throw new AppError({
      code: 'NETWORK_ERROR',
      message: networkMsg,
      details: err,
    });
  }
}
