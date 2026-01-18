export interface AppConfig {
  title: string;
  apiBaseUrl: string;
  useMock: boolean;
  mockDelay: number;
  amapKey: string;
}

export const appConfig: AppConfig = {
  title: import.meta.env.VITE_APP_TITLE || '中国数联',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
  mockDelay: Number(import.meta.env.VITE_MOCK_DELAY) || 300,
  amapKey: import.meta.env.VITE_AMAP_KEY || ''
};
