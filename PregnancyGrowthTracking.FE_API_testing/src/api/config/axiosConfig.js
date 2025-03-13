import axios from "axios";
import { API_BASE_URL } from "../constants/apiEndpoints";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Xử lý FormData
    if (config.data instanceof FormData) {
      // Để trình duyệt tự động thêm boundary
      config.headers['Content-Type'] = 'multipart/form-data';
      // Không transform data khi là FormData
      config.transformRequest = [(data) => data];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Thêm xử lý lỗi server
    if (error.response?.status === 500) {
      return Promise.reject({
        message: "Lỗi server, vui lòng thử lại sau",
        ...error
      });
    }

    // Thêm xử lý timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: "Yêu cầu đã hết thời gian, vui lòng thử lại",
        ...error
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 