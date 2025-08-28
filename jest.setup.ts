// Define React Native globals
(global as any).__DEV__ = true;

import { jest } from "@jest/globals";

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj: any) => obj.ios || obj.default),
  },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((style) => style),
  },
}));

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

// Suppress deprecation warnings
jest.spyOn(global.console, 'error').mockImplementation((msg: any, ...rest: any[]) => {
    if (typeof msg === 'string' && msg.includes('react-test-renderer is deprecated')) return;
    // add other filters if needed
    console.error(msg, ...rest);
});

// Optional: silence noisy native warnings during tests
jest.spyOn(global.console, 'warn').mockImplementation((msg: any, ...rest: any[]) => {
    if (typeof msg === 'string' && msg.includes('useNativeDriver')) return;
    // add other filters if needed
    console.warn(msg, ...rest);
});