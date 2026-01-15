export interface MockConfig {
  enabled: boolean;
  delay: number;
  modules: string[];
}

export const mockConfig: MockConfig = {
  enabled: import.meta.env.VITE_USE_MOCK === 'true',
  delay: Number(import.meta.env.VITE_MOCK_DELAY) || 300,
  modules: ['user', 'product', 'order']
};
