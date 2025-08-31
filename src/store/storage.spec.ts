import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the AsyncStorage module
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    multiRemove: vi.fn(),
  },
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage, STORAGE_KEYS } from './storage';

describe('Storage Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('save', () => {
    it('should save data successfully', async () => {
      const testData = { test: 'value' };
      vi.mocked(AsyncStorage.setItem).mockResolvedValue(undefined);

      await storage.save('test-key', testData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(testData));
    });

    it('should handle save errors gracefully', async () => {
      const testData = { test: 'value' };
      const error = new Error('Storage error');
      vi.mocked(AsyncStorage.setItem).mockRejectedValue(error);

      // Should not throw
      await expect(storage.save('test-key', testData)).rejects.toThrow('Storage error');
    });
  });

  describe('load', () => {
    it('should load data successfully', async () => {
      const testData = { test: 'value' };
      const defaultValue = { default: 'value' };
      vi.mocked(AsyncStorage.getItem).mockResolvedValue(JSON.stringify(testData));

      const result = await storage.load('test-key', defaultValue);

      expect(result).toEqual(testData);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return default value when no data exists', async () => {
      const defaultValue = { default: 'value' };
      vi.mocked(AsyncStorage.getItem).mockResolvedValue(null);

      const result = await storage.load('test-key', defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it('should handle load errors gracefully', async () => {
      const defaultValue = { default: 'value' };
      const error = new Error('Storage error');
      vi.mocked(AsyncStorage.getItem).mockRejectedValue(error);

      const result = await storage.load('test-key', defaultValue);

      expect(result).toEqual(defaultValue);
    });
  });

  describe('remove', () => {
    it('should remove data successfully', async () => {
      vi.mocked(AsyncStorage.removeItem).mockResolvedValue(undefined);

      await storage.remove('test-key');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should handle remove errors gracefully', async () => {
      const error = new Error('Storage error');
      vi.mocked(AsyncStorage.removeItem).mockRejectedValue(error);

      await expect(storage.remove('test-key')).rejects.toThrow('Storage error');
    });
  });

  describe('clear', () => {
    it('should clear all app data', async () => {
      vi.mocked(AsyncStorage.multiRemove).mockResolvedValue(undefined);

      await storage.clear();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(Object.values(STORAGE_KEYS));
    });

    it('should handle clear errors gracefully', async () => {
      const error = new Error('Storage error');
      vi.mocked(AsyncStorage.multiRemove).mockRejectedValue(error);

      await expect(storage.clear()).rejects.toThrow('Storage error');
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have the correct keys', () => {
      expect(STORAGE_KEYS).toEqual({
        KNIGHTS: 'kf-knights',
        CAMPAIGNS: 'kf-campaigns',
        MONSTERS: 'kf-monsters',
        GEAR: 'kf-gear',
      });
    });
  });
});
