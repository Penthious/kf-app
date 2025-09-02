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
  ScrollView: 'ScrollView',
  Switch: 'Switch',
  Modal: 'Modal',
  FlatList: 'FlatList',
  Image: 'Image',
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  Alert: {
    alert: jest.fn(),
  },
  Keyboard: {
    dismiss: jest.fn(),
  },
  StyleSheet: {
    create: jest.fn(styles => styles),
    flatten: jest.fn(style => style),
  },
  Appearance: {
    getColorScheme: jest.fn(() => 'dark'),
    addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
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

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  AntDesign: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  MaterialIcons: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  FontAwesome: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  FontAwesome5: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  Feather: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  Entypo: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  EvilIcons: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  MaterialCommunityIcons: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  SimpleLineIcons: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  Octicons: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
  Zocial: ({ name, size, color, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', { ...props, testID: `icon-${name}` });
  },
}));

// Mock ImageHandler to avoid importing Expo modules in Jest environment
jest.mock('@/expo-utils/image-handler', () => {
  return {
    ImageHandler: {
      takePhoto: jest.fn(),
      pickFromGallery: jest.fn(),
      saveImageToDocuments: jest.fn(),
      shareImage: jest.fn(),
      getFileSize: jest.fn(),
    },
  };
});

// Mock react-native-safe-area-context to avoid native requires
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaView: ({ children, ...props }: any) => React.createElement('View', props, children),
    SafeAreaProvider: ({ children }: any) => React.createElement('View', null, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

// Mock expo-image-picker to avoid ESM parsing and native calls
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(async () => ({ canceled: true })),
  launchCameraAsync: jest.fn(async () => ({ canceled: true })),
  requestCameraPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
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
