// FILE: src/services/api.ts
import axios, { AxiosError } from 'axios';

// Thay đổi URL này bằng link Ngrok của bạn hoặc IP máy tính (VD: http://192.168.1.5:3002)
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    // Header quan trọng để bypass màn hình warning của Ngrok
    'ngrok-skip-browser-warning': 'true',
    'bypass-tunnel-reminder': 'true',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Interceptor: Giúp lấy dữ liệu gọn gàng hơn và xử lý lỗi
api.interceptors.response.use(
  (response) => {
    return response.data; // Trả về thẳng body response
  },
  (error: AxiosError) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
