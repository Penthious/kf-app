import { storage, STORAGE_KEYS } from '@/store/storage';
import { create } from 'zustand';
import { multiplayerService } from './multiplayerService';

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';

export type ConnectedDevice = {
  id: string;
  name: string;
  ip: string;
  port: number;
  isHost: boolean;
  lastSeen: number;
};

export type MultiplayerUpdate = {
  type: 'knight_update' | 'campaign_update' | 'gear_update' | 'monster_update';
  data: Record<string, unknown>;
  timestamp: number;
  deviceId?: string;
};

export type MultiplayerState = {
  // Connection state
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  sessionId: string | null;
  sessionName: string | null;
  isHost: boolean;

  // Connected devices
  connectedDevices: ConnectedDevice[];

  // Update tracking
  lastSentUpdate: MultiplayerUpdate | null;
  lastReceivedUpdate: MultiplayerUpdate | null;
  updateHistory: MultiplayerUpdate[];

  // Error handling
  lastError: string | null;
};

export type MultiplayerActions = {
  // Session management
  createSession: (name: string) => void;
  joinSession: (sessionId: string) => void;
  leaveSession: () => void;

  // Device management
  addDevice: (device: ConnectedDevice) => void;
  removeDevice: (deviceId: string) => void;
  syncConnectedDevices: () => void;

  // Update handling
  sendUpdate: (update: MultiplayerUpdate) => void;
  receiveUpdate: (update: MultiplayerUpdate) => void;
  onUpdate: (handler: (update: MultiplayerUpdate) => void) => void;
  offUpdate: (handler: (update: MultiplayerUpdate) => void) => void;

  // State management
  restoreSession: (session: Partial<MultiplayerState>) => void;
  handleConnectionError: (error: string) => void;
  retryConnection: () => void;

  // Utility
  generateSessionId: () => string;
};

// Store for update handlers
const updateHandlers: Set<(update: MultiplayerUpdate) => void> = new Set();

export const useMultiplayer = create<MultiplayerState & MultiplayerActions>((set, get) => ({
  // Initial state
  isConnected: false,
  connectionStatus: 'disconnected',
  sessionId: null,
  sessionName: null,
  isHost: false,
  connectedDevices: [],
  lastSentUpdate: null,
  lastReceivedUpdate: null,
  updateHistory: [],
  lastError: null,

  // Session management
  createSession: async (name: string) => {
    const sessionId = get().generateSessionId();

    try {
      const result = await multiplayerService.connect(sessionId, name);

      if (result.success) {
        const device: ConnectedDevice = {
          id: multiplayerService.getDeviceId()!,
          name: name,
          ip: '127.0.0.1',
          port: 8082,
          isHost: true,
          lastSeen: Date.now(),
        };

        set({
          isConnected: true,
          connectionStatus: 'connected',
          sessionId,
          sessionName: name,
          isHost: true,
          connectedDevices: [device],
          lastError: null,
        });

        // Save to AsyncStorage
        storage
          .save(STORAGE_KEYS.MULTIPLAYER, {
            sessionId,
            sessionName: name,
            isHost: true,
            connectedDevices: [device],
          })
          .catch(console.error);
      } else {
        set({
          connectionStatus: 'error',
          lastError: result.error || 'Failed to create session',
        });
      }
    } catch (error) {
      set({
        connectionStatus: 'error',
        lastError: error instanceof Error ? error.message : 'Failed to create session',
      });
    }
  },

  joinSession: async (sessionId: string) => {
    try {
      const result = await multiplayerService.connect(sessionId, 'Player Device');

      if (result.success) {
        const device: ConnectedDevice = {
          id: multiplayerService.getDeviceId()!,
          name: 'Player Device',
          ip: '127.0.0.1',
          port: 8082,
          isHost: false,
          lastSeen: Date.now(),
        };

        set({
          isConnected: true,
          connectionStatus: 'connected',
          sessionId,
          sessionName: null, // Will be set by host
          isHost: false,
          connectedDevices: [device],
          lastError: null,
        });

        // Save to AsyncStorage
        storage
          .save(STORAGE_KEYS.MULTIPLAYER, {
            sessionId,
            sessionName: null,
            isHost: false,
            connectedDevices: [device],
          })
          .catch(console.error);
      } else {
        set({
          connectionStatus: 'error',
          lastError: result.error || 'Failed to join session',
        });
      }
    } catch (error) {
      set({
        connectionStatus: 'error',
        lastError: error instanceof Error ? error.message : 'Failed to join session',
      });
    }
  },

  leaveSession: () => {
    // Disconnect from the service
    multiplayerService.disconnect();

    set({
      isConnected: false,
      connectionStatus: 'disconnected',
      sessionId: null,
      sessionName: null,
      isHost: false,
      connectedDevices: [],
      lastSentUpdate: null,
      lastReceivedUpdate: null,
      updateHistory: [],
      lastError: null,
    });

    // Clear from AsyncStorage
    storage.remove(STORAGE_KEYS.MULTIPLAYER).catch(console.error);
  },

  // Device management
  addDevice: (device: ConnectedDevice) => {
    set(state => ({
      connectedDevices: [...state.connectedDevices, device],
    }));
  },

  syncConnectedDevices: () => {
    const devices = multiplayerService.getConnectedDevices();
    const connectedDevices: ConnectedDevice[] = devices.map(device => ({
      id: device.id,
      name: device.name,
      ip: device.ip,
      port: device.port,
      isHost: device.isHost,
      lastSeen: device.lastSeen,
    }));

    set({ connectedDevices });
  },

  removeDevice: (deviceId: string) => {
    set(state => ({
      connectedDevices: state.connectedDevices.filter(d => d.id !== deviceId),
    }));
  },

  // Update handling
  sendUpdate: async (update: MultiplayerUpdate) => {
    try {
      const result = await multiplayerService.sendMessage(update);

      if (result.success) {
        set({
          lastSentUpdate: update,
          updateHistory: [...get().updateHistory, update],
        });
      } else {
        set({
          lastError: result.error || 'Failed to send update',
        });
      }
    } catch (error) {
      set({
        lastError: error instanceof Error ? error.message : 'Failed to send update',
      });
    }
  },

  receiveUpdate: (update: MultiplayerUpdate) => {
    set({
      lastReceivedUpdate: update,
      updateHistory: [...get().updateHistory, update],
    });

    // Notify all registered handlers
    updateHandlers.forEach(handler => {
      try {
        handler(update);
      } catch (error) {
        console.error('Error in update handler:', error);
      }
    });
  },

  onUpdate: (handler: (update: MultiplayerUpdate) => void) => {
    updateHandlers.add(handler);
  },

  offUpdate: (handler: (update: MultiplayerUpdate) => void) => {
    updateHandlers.delete(handler);
  },

  // State management
  restoreSession: (session: Partial<MultiplayerState>) => {
    if (session.sessionId) {
      set({
        isConnected: true,
        connectionStatus: 'connected',
        sessionId: session.sessionId,
        sessionName: session.sessionName || null,
        isHost: session.isHost || false,
        connectedDevices: session.connectedDevices || [],
      });
    }
  },

  handleConnectionError: (error: string) => {
    set({
      isConnected: false,
      connectionStatus: 'error',
      lastError: error,
    });
  },

  retryConnection: () => {
    set({
      connectionStatus: 'connecting',
      lastError: null,
    });
  },

  // Utility
  generateSessionId: () => {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
}));

// Initialize store with data from AsyncStorage
storage
  .load(STORAGE_KEYS.MULTIPLAYER, {
    isConnected: false,
    connectionStatus: 'disconnected' as ConnectionStatus,
    sessionId: null,
    sessionName: null,
    isHost: false,
    connectedDevices: [],
    lastSentUpdate: null,
    lastReceivedUpdate: null,
    updateHistory: [],
    lastError: null,
  })
  .then(state => {
    useMultiplayer.setState(state);
  })
  .catch(console.error);
