import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useGearImageHandling } from '../useGearImageHandling';

// Mock the gear store
jest.mock('@/store/gear', () => ({
  useGear: () => ({
    setGearImage: jest.fn(),
    removeGearImage: jest.fn(),
  }),
}));

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'images',
  },
}));

// Mock ImageHandler
jest.mock('@/expo-utils/image-handler', () => ({
  ImageHandler: {
    saveImageToDocuments: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('useGearImageHandling', () => {
  const mockGear = {
    id: 'test-gear-id',
    name: 'Test Gear',
    type: 'kingdom' as const,
    kingdomId: 'test-kingdom',
    rarity: 'common' as const,
    stats: {},
    keywords: [],
    quantity: 1,
    description: 'Test gear description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the expected functions', () => {
    const { result } = renderHook(() => useGearImageHandling());

    expect(result.current.handleGearCamera).toBeDefined();
    expect(result.current.handleGearGallery).toBeDefined();
    expect(result.current.handleGearDelete).toBeDefined();
  });

  it('should handle gear delete correctly', () => {
    const { result } = renderHook(() => useGearImageHandling());
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    result.current.handleGearDelete(mockGear);

    expect(consoleSpy).toHaveBeenCalledWith('Image deleted for', mockGear.name);
    consoleSpy.mockRestore();
  });

  it('should handle camera permission denied', async () => {
    const { result } = renderHook(() => useGearImageHandling());
    const { requestCameraPermissionsAsync } = require('expo-image-picker');

    requestCameraPermissionsAsync.mockResolvedValue({ status: 'denied' });

    await result.current.handleGearCamera(mockGear);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Camera Permission Required',
      'Please grant camera permission to take photos of your gear.'
    );
  });

  it('should handle gallery picker canceled', async () => {
    const { result } = renderHook(() => useGearImageHandling());
    const { launchImageLibraryAsync } = require('expo-image-picker');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    launchImageLibraryAsync.mockResolvedValue({ canceled: true });

    await result.current.handleGearGallery(mockGear);

    expect(consoleSpy).toHaveBeenCalledWith('No image selected or picker was canceled');
    consoleSpy.mockRestore();
  });

  it('should handle camera capture canceled', async () => {
    const { result } = renderHook(() => useGearImageHandling());
    const { requestCameraPermissionsAsync, launchCameraAsync } = require('expo-image-picker');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    requestCameraPermissionsAsync.mockResolvedValue({ status: 'granted' });
    launchCameraAsync.mockResolvedValue({ canceled: true });

    await result.current.handleGearCamera(mockGear);

    expect(consoleSpy).toHaveBeenCalledWith('No photo taken or camera was canceled');
    consoleSpy.mockRestore();
  });
});
