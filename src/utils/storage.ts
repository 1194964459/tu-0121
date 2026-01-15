export const storage = {
  get<T = any>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value as T;
    }
  },

  set(key: string, value: any): void {
    const data = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, data);
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  }
};
