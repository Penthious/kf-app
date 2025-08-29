// Define React Native globals
(global as any).__DEV__ = true;

import { jest } from '@jest/globals';

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj: any) => obj.ios || obj.default),
  },
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  Pressable: 'Pressable',
  Switch: 'Switch',
  Modal: 'Modal',
  FlatList: 'FlatList',
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  Alert: {
    alert: jest.fn(),
  },
  StyleSheet: {
    create: jest.fn(styles => styles),
    flatten: jest.fn(style => style),
  },
}));

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
}));

// Suppress deprecation warnings
const originalConsoleError = console.error;
jest.spyOn(global.console, 'error').mockImplementation((msg: any, ...rest: any[]) => {
  if (typeof msg === 'string' && msg.includes('react-test-renderer is deprecated')) return;
  // add other filters if needed
  originalConsoleError(msg, ...rest);
});

// Optional: silence noisy native warnings during tests
const originalConsoleWarn = console.warn;
jest.spyOn(global.console, 'warn').mockImplementation((msg: any, ...rest: any[]) => {
  if (typeof msg === 'string' && msg.includes('useNativeDriver')) return;
  // add other filters if needed
  originalConsoleWarn(msg, ...rest);
});
