import axios from 'axios';
import Cookies from 'js-cookie';

// Tạo instance của axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api', // Base URL cho tất cả các API
  headers: {
    'Content-Type': 'application/json',
    },
    withCredentials: true, // Bật gửi cookie
});

// Interceptor để thêm token vào header của mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    console.log('Token:', token); // Log token để kiểm tra
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Interceptor để xử lý lỗi (ví dụ: token hết hạn)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const { data } = await axios.post('/api/auth/token', {}, { withCredentials: true });
        Cookies.set('token', data.token); // Lưu token mới
        error.config.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(error.config);
      } catch (err) {
        console.error('Failed to refresh token:', err);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;