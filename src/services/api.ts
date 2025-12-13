import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'bypass-tunnel-reminder': 'true',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      if (error.response.status === 429) {
        console.warn('⚠️ Server đang quá tải, vui lòng chờ chút!');
      }

      if (error.response.status === 401) {
      }
    }
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
