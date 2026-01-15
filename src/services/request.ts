import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const isProduction = import.meta.env.MODE === 'production';
const basePath = isProduction ? '/tu-0121' : '';

// 生产环境如果没有配置 API 地址，使用相对路径（适配 GitHub Pages）
// 注意：Mock 数据只在开发环境的 Vite 服务器中工作，生产环境需要真实后端
const getBaseURL = () => {
  // 开发环境使用 Mock
  if (useMock && import.meta.env.DEV) {
    return '/api';
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  // 如果是示例地址，在生产环境中忽略它，使用相对路径
  if (apiBaseUrl && !apiBaseUrl.includes('example.com')) {
    return apiBaseUrl;
  }

  // 生产环境：使用 basePath 适配 GitHub Pages
  // 由于生产环境没有 Mock，这里只是占位，实际需要后端 API
  return basePath ? `${basePath}/api` : '/api';
};

const instance: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    // 生产环境静默处理所有错误（GitHub Pages 没有后端，404是预期的）
    if (!import.meta.env.DEV) {
      console.debug('API request failed (expected in production without backend):', error.message || error);
      return Promise.reject(error);
    }

    // 开发环境显示错误提示
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 401:
          message.error('未授权，请重新登录');
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(data.message || '请求失败');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

export default instance;
