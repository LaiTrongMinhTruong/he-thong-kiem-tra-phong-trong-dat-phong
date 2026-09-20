/**
 * Điểm khởi chạy chính của ứng dụng (Main Entry Point)
 * Khởi tạo Global Error Handler, NetworkBanner và Router
 */

import './style.css';
import { Router } from './utils/router';
import { NetworkBanner } from './boundary/components/NetworkBanner';
import { Toast } from './boundary/components/Toast';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo Banner cảnh báo kết nối mạng
  NetworkBanner.init();

  // 2. Thiết lập bộ bắt lỗi toàn cục (Global Error Boundary)
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled Promise Rejection:', event.reason);
    if (event.reason?.message) {
      Toast.error(event.reason.message);
    }
  });

  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global Window Error:', { message, source, lineno, colno, error });
  };

  // 3. Khởi tạo Router ứng dụng
  Router.init('app');
});
