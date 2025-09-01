import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import MultiplayerScreen from '../ui/MultiplayerScreen';

// Mock the multiplayer store
jest.mock('../multiplayerStore', () => ({
  useMultiplayer: () => ({
    isConnected: false,
    isHost: false,
    sessionId: null,
    sessionName: null,
    connectionStatus: 'disconnected',
    connectedDevices: [],
    createSession: jest.fn(),
    joinSession: jest.fn(),
    leaveSession: jest.fn(),
    sendUpdate: jest.fn(),
    lastError: null,
    retryConnection: jest.fn(),
  }),
}));

// Mock expo-linking
jest.mock('expo-linking', () => ({
  createURL: jest.fn(path => `exp://localhost:8081${path}`),
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

// Mock the QR code component
jest.mock('react-native-qrcode-svg', () => 'QRCode');

describe('MultiplayerScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should render disconnected state correctly', () => {
      const { getByText, getByTestId } = render(<MultiplayerScreen />);

      expect(getByText('Multiplayer')).toBeTruthy();
      expect(getByText('Not Connected')).toBeTruthy();
      expect(
        getByText('Create or join a multiplayer session to sync your game state across devices.')
      ).toBeTruthy();

      expect(getByTestId('create-session-button')).toBeTruthy();
      expect(getByTestId('join-session-button')).toBeTruthy();
    });

    it('should not show session info when disconnected', () => {
      const { queryByTestId } = render(<MultiplayerScreen />);

      expect(queryByTestId('session-info')).toBeNull();
      expect(queryByTestId('qr-code-container')).toBeNull();
      expect(queryByTestId('connected-devices')).toBeNull();
    });
  });

  describe('Session Creation', () => {
    it('should show create session form when create button is pressed', () => {
      const { getByTestId, getByText } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('create-session-button'));

      expect(getByText('Create Session')).toBeTruthy();
      expect(getByTestId('session-name-input')).toBeTruthy();
      expect(getByTestId('create-session-submit')).toBeTruthy();
    });

    it('should create session with valid name', async () => {
      const mockCreateSession = jest.fn();
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: false,
          isHost: false,
          sessionId: null,
          sessionName: null,
          connectionStatus: 'disconnected',
          connectedDevices: [],
          createSession: mockCreateSession,
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByTestId, getByText } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('create-session-button'));

      const nameInput = getByTestId('session-name-input');
      fireEvent.changeText(nameInput, 'Test Campaign');

      fireEvent.press(getByTestId('create-session-submit'));

      await waitFor(() => {
        expect(mockCreateSession).toHaveBeenCalledWith('Test Campaign');
      });
    });

    it('should show error for empty session name', () => {
      const { getByTestId, getByText } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('create-session-button'));

      fireEvent.press(getByTestId('create-session-submit'));

      expect(getByText('Session name is required')).toBeTruthy();
    });

    it('should close create session form when cancel is pressed', () => {
      const { getByTestId, queryByText } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('create-session-button'));
      expect(queryByText('Create Session')).toBeTruthy();

      fireEvent.press(getByTestId('cancel-button'));
      expect(queryByText('Create Session')).toBeNull();
    });
  });

  describe('Session Joining', () => {
    it('should show join session form when join button is pressed', () => {
      const { getByTestId, getByText } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('join-session-button'));

      expect(getByText('Join Session')).toBeTruthy();
      expect(getByTestId('session-id-input')).toBeTruthy();
      expect(getByTestId('join-session-submit')).toBeTruthy();
    });

    it('should join session with valid session ID', async () => {
      const mockJoinSession = jest.fn();
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: false,
          isHost: false,
          sessionId: null,
          sessionName: null,
          connectionStatus: 'disconnected',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: mockJoinSession,
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByTestId, getByText } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('join-session-button'));

      const sessionIdInput = getByTestId('session-id-input');
      fireEvent.changeText(sessionIdInput, 'test-session-123');

      fireEvent.press(getByTestId('join-session-submit'));

      await waitFor(() => {
        expect(mockJoinSession).toHaveBeenCalledWith('test-session-123');
      });
    });

    it('should show error for empty session ID', () => {
      const { getByTestId, getByText } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('join-session-button'));

      fireEvent.press(getByTestId('join-session-submit'));

      expect(getByText('Session ID is required')).toBeTruthy();
    });

    it('should close join session form when cancel is pressed', () => {
      const { getByTestId, queryByText } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('join-session-button'));
      expect(queryByText('Join Session')).toBeTruthy();

      fireEvent.press(getByTestId('cancel-button'));
      expect(queryByText('Join Session')).toBeNull();
    });
  });

  describe('Connected State', () => {
    it('should show session info when connected', () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          isHost: true,
          sessionId: 'test-session-123',
          sessionName: 'Test Campaign',
          connectionStatus: 'connected',
          connectedDevices: [
            { id: 'device-1', name: 'Host Device', isHost: true, lastSeen: Date.now() },
          ],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByText, getByTestId } = render(<MultiplayerScreen />);

      expect(getByText('Connected')).toBeTruthy();
      expect(getByText('Test Campaign')).toBeTruthy();
      expect(getByText('Session ID: test-session-123')).toBeTruthy();
      expect(getByText('Host Device (Host)')).toBeTruthy();

      expect(getByTestId('session-info')).toBeTruthy();
      expect(getByTestId('qr-code-container')).toBeTruthy();
      expect(getByTestId('connected-devices')).toBeTruthy();
    });

    it('should show QR code for session joining', () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          isHost: true,
          sessionId: 'test-session-123',
          sessionName: 'Test Campaign',
          connectionStatus: 'connected',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByTestId, getByText } = render(<MultiplayerScreen />);

      expect(getByTestId('qr-code-container')).toBeTruthy();
      expect(getByText('Scan this QR code to join the session')).toBeTruthy();
      expect(getByText('Or share this link:')).toBeTruthy();
    });

    it('should show connected devices list', () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          isHost: true,
          sessionId: 'test-session-123',
          sessionName: 'Test Campaign',
          connectionStatus: 'connected',
          connectedDevices: [
            { id: 'device-1', name: 'Host Device', isHost: true, lastSeen: Date.now() },
            { id: 'device-2', name: 'Player 2', isHost: false, lastSeen: Date.now() },
            { id: 'device-3', name: 'Player 3', isHost: false, lastSeen: Date.now() },
          ],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByText, getAllByTestId } = render(<MultiplayerScreen />);

      expect(getByText('Connected Devices (3)')).toBeTruthy();
      expect(getByText('Host Device (Host)')).toBeTruthy();
      expect(getByText('Player 2')).toBeTruthy();
      expect(getByText('Player 3')).toBeTruthy();

      const deviceItems = getAllByTestId('device-item');
      expect(deviceItems).toHaveLength(3);
    });

    it('should show leave session button when connected', () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          isHost: false,
          sessionId: 'test-session-123',
          sessionName: 'Test Campaign',
          connectionStatus: 'connected',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByTestId } = render(<MultiplayerScreen />);

      expect(getByTestId('leave-session-button')).toBeTruthy();
    });
  });

  describe('Session Actions', () => {
    it('should leave session when leave button is pressed', async () => {
      const mockLeaveSession = jest.fn();
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          isHost: false,
          sessionId: 'test-session-123',
          sessionName: 'Test Campaign',
          connectionStatus: 'connected',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: mockLeaveSession,
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByTestId } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('leave-session-button'));

      await waitFor(() => {
        expect(mockLeaveSession).toHaveBeenCalled();
      });
    });

    it('should show confirmation dialog before leaving session', () => {
      const mockLeaveSession = jest.fn();
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          isHost: false,
          sessionId: 'test-session-123',
          sessionName: 'Test Campaign',
          connectionStatus: 'connected',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: mockLeaveSession,
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByTestId } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('leave-session-button'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Leave Session?',
        'Are you sure you want to leave this multiplayer session?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
          expect.objectContaining({ text: 'Leave', style: 'destructive' }),
        ])
      );
    });

    it('should copy session ID to clipboard', async () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          isHost: true,
          sessionId: 'test-session-123',
          sessionName: 'Test Campaign',
          connectionStatus: 'connected',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByTestId } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('copy-session-id-button'));

      // This would test the actual clipboard functionality
      // For now, we just verify the button exists and is pressable
      expect(getByTestId('copy-session-id-button')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should show error message when connection fails', () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: false,
          isHost: false,
          sessionId: null,
          sessionName: null,
          connectionStatus: 'error',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: 'Connection failed',
          retryConnection: jest.fn(),
        }),
      }));

      const { getByText, getByTestId } = render(<MultiplayerScreen />);

      expect(getByText('Connection Error')).toBeTruthy();
      expect(getByText('Connection failed')).toBeTruthy();
      expect(getByTestId('retry-connection-button')).toBeTruthy();
    });

    it('should retry connection when retry button is pressed', async () => {
      const mockRetryConnection = jest.fn();
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: false,
          isHost: false,
          sessionId: null,
          sessionName: null,
          connectionStatus: 'error',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: 'Connection failed',
          retryConnection: mockRetryConnection,
        }),
      }));

      const { getByTestId } = render(<MultiplayerScreen />);

      fireEvent.press(getByTestId('retry-connection-button'));

      await waitFor(() => {
        expect(mockRetryConnection).toHaveBeenCalled();
      });
    });
  });

  describe('Connection Status', () => {
    it('should show connecting status', () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: false,
          isHost: false,
          sessionId: null,
          sessionName: null,
          connectionStatus: 'connecting',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByText, getByTestId } = render(<MultiplayerScreen />);

      expect(getByText('Connecting...')).toBeTruthy();
      expect(getByTestId('connection-spinner')).toBeTruthy();
    });

    it('should show reconnecting status', () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: false,
          isHost: false,
          sessionId: 'test-session-123',
          sessionName: 'Test Campaign',
          connectionStatus: 'reconnecting',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByText, getByTestId } = render(<MultiplayerScreen />);

      expect(getByText('Reconnecting...')).toBeTruthy();
      expect(getByTestId('connection-spinner')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByLabelText } = render(<MultiplayerScreen />);

      expect(getByLabelText('Create new multiplayer session')).toBeTruthy();
      expect(getByLabelText('Join existing multiplayer session')).toBeTruthy();
    });

    it('should announce connection status changes', () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          isHost: true,
          sessionId: 'test-session-123',
          sessionName: 'Test Campaign',
          connectionStatus: 'connected',
          connectedDevices: [],
          createSession: jest.fn(),
          joinSession: jest.fn(),
          leaveSession: jest.fn(),
          sendUpdate: jest.fn(),
          lastError: null,
          retryConnection: jest.fn(),
        }),
      }));

      const { getByTestId } = render(<MultiplayerScreen />);

      expect(getByTestId('connection-status-announcement')).toBeTruthy();
    });
  });
});
