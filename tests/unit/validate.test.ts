import { describe, it, expect } from 'vitest';
import { isEmail, isPhone } from '@/utils/validate';

describe('validate utils', () => {
  it('should validate email correctly', () => {
    expect(isEmail('test@example.com')).toBe(true);
    expect(isEmail('invalid-email')).toBe(false);
  });

  it('should validate phone correctly', () => {
    expect(isPhone('13800138000')).toBe(true);
    expect(isPhone('12345')).toBe(false);
  });
});
