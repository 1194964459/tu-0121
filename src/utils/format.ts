import dayjs from 'dayjs';

export function formatDate(date: Date | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return '';
  return dayjs(date).format(format);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}
