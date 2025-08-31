import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys for different stores
export const STORAGE_KEYS = {
  KNIGHTS: 'kf-knights',
  CAMPAIGNS: 'kf-campaigns',
  MONSTERS: 'kf-monsters',
  GEAR: 'kf-gear',
} as const;

// Generic storage functions
export const storage = {
  // Save data to AsyncStorage
  async save<T>(key: string, data: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
      throw error;
    }
  },

  // Load data from AsyncStorage
  async load<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        return JSON.parse(jsonValue) as T;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Failed to load data for key ${key}:`, error);
      return defaultValue;
    }
  },

  // Remove data from AsyncStorage
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove data for key ${key}:`, error);
      throw error;
    }
  },

  // Clear all app data
  async clear(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  },
};

// Zustand persistence middleware
export const createPersistedStore = <T extends Record<string, unknown>>(
  key: string,
  defaultValue: T
) => {
  return {
    // Load initial state from storage
    getInitialState: async (): Promise<T> => {
      return await storage.load(key, defaultValue);
    },

    // Save state to storage
    saveState: async (state: T): Promise<void> => {
      await storage.save(key, state);
    },
  };
};
