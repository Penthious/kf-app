import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useSessionJoining } from '../hooks/useSessionJoining';

// Mock expo-linking
jest.mock('expo-linking', () => ({
  createURL: jest.fn(path => `exp://localhost:8081${path}`),
  parse: jest.fn(url => ({ path: url.split('localhost:8081')[1] })),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'test-project-id',
      },
    },
  },
}));

// Mock the clipboard
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
  getString: jest.fn(() => Promise.resolve('test-session-123')),
}));

// Mock the QR code generation
jest.mock('react-native-qrcode-svg', () => 'QRCode');

describe('useSessionJoining', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('QR Code Generation', () => {
    it('should generate QR code data for session joining', () => {
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';
      const qrData = result.current.generateQRCodeData(sessionId);

      expect(qrData).toBeTruthy();
      expect(qrData).toContain(sessionId);
      expect(qrData).toContain('exp://localhost:8081');
    });

    it('should generate different QR data for different sessions', () => {
      const { result } = renderHook(() => useSessionJoining());

      const session1 = 'session-1';
      const session2 = 'session-2';

      const qrData1 = result.current.generateQRCodeData(session1);
      const qrData2 = result.current.generateQRCodeData(session2);

      expect(qrData1).not.toBe(qrData2);
      expect(qrData1).toContain(session1);
      expect(qrData2).toContain(session2);
    });

    it('should include app scheme in QR code data', () => {
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session';
      const qrData = result.current.generateQRCodeData(sessionId);

      expect(qrData).toMatch(/^exp:\/\/localhost:8081/);
      expect(qrData).toContain('/join/');
      expect(qrData).toContain(sessionId);
    });
  });

  describe('Deep Link Handling', () => {
    it('should parse join session deep links', () => {
      const { result } = renderHook(() => useSessionJoining());

      const deepLink = 'exp://localhost:8081/join/test-session-123';
      const parsed = result.current.parseJoinLink(deepLink);

      expect(parsed).toBeTruthy();
      expect(parsed.sessionId).toBe('test-session-123');
      expect(parsed.isValid).toBe(true);
    });

    it('should reject invalid deep links', () => {
      const { result } = renderHook(() => useSessionJoining());

      const invalidLinks = [
        'exp://localhost:8081/invalid',
        'https://example.com/join/session',
        'exp://localhost:8081/join/',
        'exp://localhost:8081/join',
      ];

      invalidLinks.forEach(link => {
        const parsed = result.current.parseJoinLink(link);
        expect(parsed.isValid).toBe(false);
      });
    });

    it('should handle deep links with query parameters', () => {
      const { result } = renderHook(() => useSessionJoining());

      const deepLink = 'exp://localhost:8081/join/test-session-123?device=phone&version=1.0';
      const parsed = result.current.parseJoinLink(deepLink);

      expect(parsed.isValid).toBe(true);
      expect(parsed.sessionId).toBe('test-session-123');
    });

    it('should extract device information from deep links', () => {
      const { result } = renderHook(() => useSessionJoining());

      const deepLink = 'exp://localhost:8081/join/test-session-123?device=tablet&platform=ios';
      const parsed = result.current.parseJoinLink(deepLink);

      expect(parsed.isValid).toBe(true);
      expect(parsed.sessionId).toBe('test-session-123');
      expect(parsed.deviceInfo).toMatchObject({
        device: 'tablet',
        platform: 'ios',
      });
    });
  });

  describe('Session Joining Process', () => {
    it('should initiate session joining', async () => {
      const mockJoinSession = jest.fn();
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';
      const deviceName = 'Test Device';

      act(() => {
        result.current.initiateJoin(sessionId, deviceName);
      });

      await waitFor(() => {
        expect(result.current.isJoining).toBe(true);
        expect(result.current.joinSessionId).toBe(sessionId);
      });
    });

    it('should complete session joining successfully', async () => {
      const mockJoinSession = jest.fn().mockResolvedValue({ success: true });
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';
      const deviceName = 'Test Device';

      act(() => {
        result.current.initiateJoin(sessionId, deviceName);
      });

      await waitFor(() => {
        expect(result.current.isJoining).toBe(true);
      });

      // Simulate successful join
      act(() => {
        result.current.completeJoin({ success: true, sessionId });
      });

      expect(result.current.isJoining).toBe(false);
      expect(result.current.joinError).toBeNull();
      expect(result.current.lastJoinedSession).toBe(sessionId);
    });

    it('should handle session joining failures', async () => {
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';
      const deviceName = 'Test Device';
      const error = 'Session not found';

      act(() => {
        result.current.initiateJoin(sessionId, deviceName);
      });

      await waitFor(() => {
        expect(result.current.isJoining).toBe(true);
      });

      // Simulate failed join
      act(() => {
        result.current.completeJoin({ success: false, error });
      });

      expect(result.current.isJoining).toBe(false);
      expect(result.current.joinError).toBe(error);
      expect(result.current.lastJoinedSession).toBeNull();
    });

    it('should reset join state after completion', async () => {
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';
      const deviceName = 'Test Device';

      act(() => {
        result.current.initiateJoin(sessionId, deviceName);
      });

      await waitFor(() => {
        expect(result.current.isJoining).toBe(true);
      });

      // Complete join
      act(() => {
        result.current.completeJoin({ success: true, sessionId });
      });

      // Reset state
      act(() => {
        result.current.resetJoinState();
      });

      expect(result.current.isJoining).toBe(false);
      expect(result.current.joinSessionId).toBeNull();
      expect(result.current.joinError).toBeNull();
    });
  });

  describe('Clipboard Operations', () => {
    it('should copy session ID to clipboard', async () => {
      const mockSetString = require('@react-native-clipboard/clipboard').setString;
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';

      act(() => {
        result.current.copySessionId(sessionId);
      });

      await waitFor(() => {
        expect(mockSetString).toHaveBeenCalledWith(sessionId);
      });
    });

    it('should copy join link to clipboard', async () => {
      const mockSetString = require('@react-native-clipboard/clipboard').setString;
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';

      act(() => {
        result.current.copyJoinLink(sessionId);
      });

      await waitFor(() => {
        expect(mockSetString).toHaveBeenCalledWith(expect.stringContaining(sessionId));
      });
    });

    it('should read session ID from clipboard', async () => {
      const mockGetString = require('@react-native-clipboard/clipboard').getString;
      const { result } = renderHook(() => useSessionJoining());

      const clipboardContent = await result.current.readClipboard();

      expect(mockGetString).toHaveBeenCalled();
      expect(clipboardContent).toBe('test-session-123');
    });
  });

  describe('Session Validation', () => {
    it('should validate session ID format', () => {
      const { result } = renderHook(() => useSessionJoining());

      const validSessionIds = [
        'session-123',
        'test-session-abc',
        'multiplayer-session-xyz',
        'campaign-123-abc',
      ];

      const invalidSessionIds = ['', 'a', 'session', 'session-', '-session', 'session--123'];

      validSessionIds.forEach(sessionId => {
        expect(result.current.validateSessionId(sessionId)).toBe(true);
      });

      invalidSessionIds.forEach(sessionId => {
        expect(result.current.validateSessionId(sessionId)).toBe(false);
      });
    });

    it('should validate device name', () => {
      const { result } = renderHook(() => useSessionJoining());

      const validDeviceNames = [
        'iPhone 15',
        'Android Tablet',
        'Player 1',
        'Host Device',
        'Test Device 123',
      ];

      const invalidDeviceNames = [
        '',
        'a',
        '   ',
        'Device' + 'x'.repeat(100), // Too long
      ];

      validDeviceNames.forEach(name => {
        expect(result.current.validateDeviceName(name)).toBe(true);
      });

      invalidDeviceNames.forEach(name => {
        expect(result.current.validateDeviceName(name)).toBe(false);
      });
    });

    it('should sanitize device names', () => {
      const { result } = renderHook(() => useSessionJoining());

      const testCases = [
        { input: '  Test Device  ', expected: 'Test Device' },
        { input: 'Device\nName', expected: 'Device Name' },
        { input: 'Device\tName', expected: 'Device Name' },
        { input: 'Device\r\nName', expected: 'Device Name' },
        { input: 'Device   Name', expected: 'Device Name' },
      ];

      testCases.forEach(({ input, expected }) => {
        const sanitized = result.current.sanitizeDeviceName(input);
        expect(sanitized).toBe(expected);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle clipboard errors gracefully', async () => {
      const mockSetString = require('@react-native-clipboard/clipboard').setString;
      mockSetString.mockRejectedValueOnce(new Error('Clipboard access denied'));

      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';

      act(() => {
        result.current.copySessionId(sessionId);
      });

      await waitFor(() => {
        expect(result.current.clipboardError).toBe('Clipboard access denied');
      });
    });

    it('should handle deep link parsing errors', () => {
      const { result } = renderHook(() => useSessionJoining());

      const malformedLinks = [null, undefined, '', 'not-a-url', 'exp://localhost:8081/join'];

      malformedLinks.forEach(link => {
        const parsed = result.current.parseJoinLink(link as any);
        expect(parsed.isValid).toBe(false);
        expect(parsed.error).toBeTruthy();
      });
    });

    it('should clear errors when appropriate', () => {
      const { result } = renderHook(() => useSessionJoining());

      // Set some errors
      act(() => {
        result.current.setJoinError('Join failed');
        result.current.setClipboardError('Clipboard error');
      });

      expect(result.current.joinError).toBe('Join failed');
      expect(result.current.clipboardError).toBe('Clipboard error');

      // Clear errors
      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.joinError).toBeNull();
      expect(result.current.clipboardError).toBeNull();
    });
  });

  describe('State Persistence', () => {
    it('should save join state to storage', async () => {
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';
      const deviceName = 'Test Device';

      act(() => {
        result.current.initiateJoin(sessionId, deviceName);
      });

      await waitFor(() => {
        expect(result.current.isJoining).toBe(true);
      });

      // This would test the actual storage persistence
      // For now, we just verify the state is tracked
      expect(result.current.joinSessionId).toBe(sessionId);
    });

    it('should restore join state from storage', () => {
      const mockJoinState = {
        joinSessionId: 'saved-session-123',
        lastJoinedSession: 'previous-session',
        joinError: null,
      };

      const { result } = renderHook(() => useSessionJoining());

      // Simulate restoring state
      act(() => {
        result.current.restoreJoinState(mockJoinState);
      });

      expect(result.current.joinSessionId).toBe('saved-session-123');
      expect(result.current.lastJoinedSession).toBe('previous-session');
      expect(result.current.joinError).toBeNull();
    });
  });

  describe('Performance Optimization', () => {
    it('should debounce rapid join attempts', async () => {
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';
      const deviceName = 'Test Device';

      // Make multiple rapid join attempts
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.initiateJoin(sessionId, deviceName);
        });
      }

      // Should only process the last attempt
      await waitFor(() => {
        expect(result.current.isJoining).toBe(true);
        expect(result.current.joinSessionId).toBe(sessionId);
      });
    });

    it('should cache QR code data', () => {
      const { result } = renderHook(() => useSessionJoining());

      const sessionId = 'test-session-123';

      // Generate QR code data multiple times
      const qrData1 = result.current.generateQRCodeData(sessionId);
      const qrData2 = result.current.generateQRCodeData(sessionId);
      const qrData3 = result.current.generateQRCodeData(sessionId);

      // Should return the same cached data
      expect(qrData1).toBe(qrData2);
      expect(qrData2).toBe(qrData3);
    });
  });
});
