import { act, renderHook } from '@testing-library/react-native';
import { MultiplayerUpdate, useMultiplayer } from '../multiplayerStore';

// Mock the real-time communication layer
jest.mock('../multiplayerService', () => ({
  createSession: jest.fn(),
  joinSession: jest.fn(),
  leaveSession: jest.fn(),
  sendUpdate: jest.fn(),
  onUpdate: jest.fn(),
}));

describe('Multiplayer Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the store to initial state
    const { result } = renderHook(() => useMultiplayer());
    act(() => {
      result.current.leaveSession();
    });
  });

  describe('Session Management', () => {
    it('should create a new multiplayer session', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Test Campaign');
      });

      expect(result.current.isHost).toBe(true);
      expect(result.current.sessionId).toBeTruthy();
      expect(result.current.sessionName).toBe('Test Campaign');
      expect(result.current.connectedDevices).toHaveLength(1);
    });

    it('should join an existing session', () => {
      const { result } = renderHook(() => useMultiplayer());
      const testSessionId = 'test-session-123';

      act(() => {
        result.current.joinSession(testSessionId);
      });

      expect(result.current.isHost).toBe(false);
      expect(result.current.sessionId).toBe(testSessionId);
      expect(result.current.isConnected).toBe(true);
    });

    it('should leave a session', () => {
      const { result } = renderHook(() => useMultiplayer());

      // First create a session
      act(() => {
        result.current.createSession('Test Campaign');
      });

      expect(result.current.isConnected).toBe(true);

      // Then leave it
      act(() => {
        result.current.leaveSession();
      });

      expect(result.current.isConnected).toBe(false);
      expect(result.current.sessionId).toBeNull();
      expect(result.current.isHost).toBe(false);
    });

    it('should generate a unique session ID for each new session', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Session 1');
      });
      const sessionId1 = result.current.sessionId;

      act(() => {
        result.current.leaveSession();
        result.current.createSession('Session 2');
      });
      const sessionId2 = result.current.sessionId;

      expect(sessionId1).not.toBe(sessionId2);
      expect(sessionId1).toBeTruthy();
      expect(sessionId2).toBeTruthy();
    });
  });

  describe('Connection State', () => {
    it('should track connection status', () => {
      const { result } = renderHook(() => useMultiplayer());

      expect(result.current.isConnected).toBe(false);
      expect(result.current.connectionStatus).toBe('disconnected');

      act(() => {
        result.current.createSession('Test Campaign');
      });

      expect(result.current.isConnected).toBe(true);
      expect(result.current.connectionStatus).toBe('connected');
    });

    it('should track connected devices', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Test Campaign');
      });

      expect(result.current.connectedDevices).toHaveLength(1);
      expect(result.current.connectedDevices[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        isHost: true,
        lastSeen: expect.any(Number),
      });
    });

    it('should update device list when devices join/leave', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Test Campaign');
      });

      expect(result.current.connectedDevices).toHaveLength(1);

      // Simulate another device joining
      act(() => {
        result.current.addDevice({
          id: 'device-2',
          name: 'Player 2',
          ip: '192.168.1.102',
          port: 8082,
          isHost: false,
          lastSeen: Date.now(),
        });
      });

      expect(result.current.connectedDevices).toHaveLength(2);
      expect(result.current.connectedDevices[1]).toMatchObject({
        id: 'device-2',
        name: 'Player 2',
        isHost: false,
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should send updates to connected devices', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Test Campaign');
      });

      const mockUpdate: MultiplayerUpdate = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'New Name' },
        timestamp: Date.now(),
      };

      act(() => {
        result.current.sendUpdate(mockUpdate);
      });

      // This would test the actual sending mechanism
      expect(result.current.lastSentUpdate).toEqual(mockUpdate);
    });

    it('should receive updates from other devices', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Test Campaign');
      });

      const mockUpdate: MultiplayerUpdate = {
        type: 'gear_update',
        data: { gearId: 'gear-1', field: 'quantity', value: 5 },
        timestamp: Date.now(),
      };

      act(() => {
        result.current.receiveUpdate(mockUpdate);
      });

      expect(result.current.lastReceivedUpdate).toEqual(mockUpdate);
      expect(result.current.updateHistory).toContain(mockUpdate);
    });

    it('should maintain update history', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Test Campaign');
      });

      const updates: MultiplayerUpdate[] = [
        {
          type: 'knight_update',
          data: { knightId: 'knight-1', field: 'name', value: 'Name 1' },
          timestamp: Date.now(),
        },
        {
          type: 'gear_update',
          data: { gearId: 'gear-1', field: 'quantity', value: 3 },
          timestamp: Date.now(),
        },
        {
          type: 'campaign_update',
          data: { campaignId: 'campaign-1', field: 'notes', value: 'New note' },
          timestamp: Date.now(),
        },
      ];

      updates.forEach(update => {
        act(() => {
          result.current.receiveUpdate(update);
        });
      });

      expect(result.current.updateHistory).toHaveLength(3);
      expect(result.current.updateHistory).toEqual(expect.arrayContaining(updates));
    });
  });

  describe('Session Persistence', () => {
    it('should restore session state on app restart', () => {
      const { result } = renderHook(() => useMultiplayer());

      // Simulate restoring from storage
      const savedSession = {
        sessionId: 'saved-session-123',
        sessionName: 'Saved Campaign',
        isHost: true,
        connectedDevices: [
          {
            id: 'device-1',
            name: 'Host',
            ip: '127.0.0.1',
            port: 8082,
            isHost: true,
            lastSeen: Date.now(),
          },
        ],
      };

      act(() => {
        result.current.restoreSession(savedSession);
      });

      expect(result.current.sessionId).toBe('saved-session-123');
      expect(result.current.sessionName).toBe('Saved Campaign');
      expect(result.current.isHost).toBe(true);
      expect(result.current.isConnected).toBe(true);
    });

    it('should clear session data when leaving', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Test Campaign');
      });

      expect(result.current.sessionId).toBeTruthy();
      expect(result.current.sessionName).toBeTruthy();

      act(() => {
        result.current.leaveSession();
      });

      expect(result.current.sessionId).toBeNull();
      expect(result.current.sessionName).toBeNull();
      expect(result.current.connectedDevices).toHaveLength(0);
      expect(result.current.updateHistory).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection failures gracefully', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Test Campaign');
      });

      expect(result.current.isConnected).toBe(true);

      // Simulate connection failure
      act(() => {
        result.current.handleConnectionError('Connection lost');
      });

      expect(result.current.isConnected).toBe(false);
      expect(result.current.connectionStatus).toBe('error');
      expect(result.current.lastError).toBe('Connection lost');
    });

    it('should retry connection on failure', () => {
      const { result } = renderHook(() => useMultiplayer());

      act(() => {
        result.current.createSession('Test Campaign');
      });

      // Simulate connection failure
      act(() => {
        result.current.handleConnectionError('Connection lost');
      });

      expect(result.current.connectionStatus).toBe('error');

      // Attempt to reconnect
      act(() => {
        result.current.retryConnection();
      });

      expect(result.current.connectionStatus).toBe('connecting');
    });
  });
});
