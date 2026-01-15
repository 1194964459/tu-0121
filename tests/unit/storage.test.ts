import { describe, it, expect } from 'vitest';
import { storage } from '@/utils/storage';

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should set and get value', () => {
    storage.set('test', 'value');
    expect(storage.get('test')).toBe('value');
  });

  it('should set and get object', () => {
    const obj = { name: 'test', value: 123 };
    storage.set('obj', obj);
    expect(storage.get('obj')).toEqual(obj);
  });

  it('should remove value', () => {
    storage.set('test', 'value');
    storage.remove('test');
    expect(storage.get('test')).toBeNull();
  });

  it('should clear all values', () => {
    storage.set('test1', 'value1');
    storage.set('test2', 'value2');
    storage.clear();
    expect(storage.get('test1')).toBeNull();
    expect(storage.get('test2')).toBeNull();
  });
});
