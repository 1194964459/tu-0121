import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { message } from 'ant-design-vue';
import { mockAdapter } from './mockAdapter';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

// 生产环境如果没有配置 API 地址，使用相对路径（适配 GitHub Pages）
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

  // 生产环境：使用相对路径适配 GitHub Pages
  return './api';
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
    // 如果响应数据已经是标准格式 { code, message, data }，直接返回
    // 否则返回 response.data（兼容其他格式）
    if (response.data && typeof response.data === 'object' && 'code' in response.data) {
      return response.data;
    }
    return response.data;
  },
  async (error: AxiosError) => {
    // 添加调试日志
    console.log('[Request] 错误拦截器触发:', {
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE,
      hasApiBaseUrl: !!import.meta.env.VITE_API_BASE_URL,
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      errorCode: error.code,
      errorMessage: error.message,
      hasResponse: !!error.response,
      status: error.response?.status,
      hasConfig: !!error.config,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });

    // 生产环境：尝试使用Mock数据作为fallback
    // 条件：1. 不是开发环境 2. 没有配置真实API地址
    const shouldUseMock = !import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL;

    if (shouldUseMock) {
      console.log('[Request] 满足生产环境Mock条件，调用mockAdapter');
      const mockResponse = await mockAdapter(error);
      if (mockResponse) {
        // 返回Mock数据
        // mockResponse 是 AxiosResponse 格式 { data: {...}, status: 200, ... }
        // mockResponse.data 已经是 { code: 200, message: '获取成功', data: {...} } 格式
        console.log('[Request] Mock数据返回成功:', mockResponse.data);
        // 直接返回数据，模拟成功响应（会经过响应拦截器的成功处理）
        return Promise.resolve(mockResponse.data);
      }
      // 如果没有Mock数据，静默处理
      console.warn('[Request] Mock数据未找到，请求失败:', error.config?.url);
      return Promise.reject(error);
    } else {
      console.log('[Request] 不满足生产环境Mock条件:', {
        isDev: import.meta.env.DEV,
        hasApiBaseUrl: !!import.meta.env.VITE_API_BASE_URL,
        shouldUseMock
      });
    }

    // 开发环境：如果Mock启用但请求失败，也尝试使用Mock数据
    if (import.meta.env.DEV && useMock) {
      const mockResponse = await mockAdapter(error);
      if (mockResponse) {
        return Promise.resolve(mockResponse);
      }
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
          message.error((data as any)?.message || '请求失败');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

export default instance;
