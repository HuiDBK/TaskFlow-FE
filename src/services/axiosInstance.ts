import axios from 'axios';
import { getUserToken } from './api';
import { message } from 'antd';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getUserToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.code !== '000-0000') {
      message.error(response.data.message || '请求失败');
      return Promise.reject(response.data);
    }
    return response.data;
  },
  (error) => {
    let errorMessage = '服务器错误';
    
    if (error.response) {
      errorMessage = error.response.data.message;
    } else if (error.request) {
      errorMessage = '网络错误，请检查网络连接';
    } else {
      errorMessage = error.message;
    }

    message.error(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosInstance; 