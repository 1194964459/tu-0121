import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency } from '@/utils/format';

describe('format utils', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01T12:00:00');
    expect(formatDate(date)).toBe('2024-01-01 12:00:00');
  });

  it('should format currency correctly', () => {
    expect(formatCurrency(99.99)).toBe('¥99.99');
  });

  it('should handle null date', () => {
    expect(formatDate(null as any)).toBe('');
  });
});
