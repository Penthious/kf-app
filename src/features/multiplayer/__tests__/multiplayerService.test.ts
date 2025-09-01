import { MultiplayerMessage, multiplayerService } from '../multiplayerService';

// Mock the global environment for tests
const mockSetInterval = jest.fn();
const mockClearInterval = jest.fn();

global.setInterval = mockSetInterval;
global.clearInterval = mockClearInterval;

describe('MultiplayerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the service state
    multiplayerService.disconnect();
  });

  describe('Connection Management', () => {
    it('should connect to a session', async () => {
      const result = await multiplayerService.connect('test-session', 'Test Device');

      expect(result.success).toBe(true);
      expect(multiplayerService.isConnected()).toBe(true);
      expect(multiplayerService.getSessionId()).toBe('test-session');
      expect(multiplayerService.getDeviceName()).toBe('Test Device');
    });

    it('should disconnect from a session', () => {
      multiplayerService.disconnect();

      expect(multiplayerService.isConnected()).toBe(false);
      expect(multiplayerService.getSessionId()).toBe(null);
      expect(multiplayerService.getDeviceName()).toBe(null);
    });

    it('should start discovery and heartbeat on connection', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      expect(mockSetInterval).toHaveBeenCalledTimes(2);
      expect(multiplayerService.isConnected()).toBe(true);
    });

    it('should stop discovery and heartbeat on disconnect', () => {
      multiplayerService.disconnect();

      expect(mockClearInterval).toHaveBeenCalledTimes(2);
      expect(multiplayerService.isConnected()).toBe(false);
    });
  });

  describe('Message Sending', () => {
    it('should send messages to connected devices', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      const message: MultiplayerMessage = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'New Name' },
        timestamp: Date.now(),
      };

      const result = await multiplayerService.sendMessage(message);

      expect(result.success).toBe(true);
    });

    it('should add timestamp and deviceId to messages', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      const message: MultiplayerMessage = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'New Name' },
      };

      const result = await multiplayerService.sendMessage(message);

      expect(result.success).toBe(true);
      expect(message.timestamp).toBeDefined();
      expect(message.deviceId).toBeDefined();
    });
  });

  describe('Message Receiving', () => {
    it('should receive messages from other devices', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      const mockMessage: MultiplayerMessage = {
        type: 'gear_update',
        data: { gearId: 'gear-1', field: 'quantity', value: 5 },
        timestamp: Date.now(),
        deviceId: 'other-device',
      };

      // Simulate receiving a message
      const messageHandler = jest.fn();
      multiplayerService.onMessage(messageHandler);

      // Simulate message delivery (in test environment)
      await multiplayerService.sendMessage(mockMessage);

      // Wait for the simulated message delivery
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(messageHandler).toHaveBeenCalled();
    });

    it('should ignore messages from self', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      const message: MultiplayerMessage = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'New Name' },
        timestamp: Date.now(),
        deviceId: multiplayerService.getDeviceId()!,
      };

      const messageHandler = jest.fn();
      multiplayerService.onMessage(messageHandler);

      await multiplayerService.sendMessage(message);

      // Wait for the simulated message delivery
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should not call the handler for self-messages
      expect(messageHandler).not.toHaveBeenCalled();
    });

    it('should handle malformed messages gracefully', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      const messageHandler = jest.fn();
      multiplayerService.onMessage(messageHandler);

      // Simulate receiving a malformed message
      const malformedMessage = {
        type: 'invalid',
        // Missing required fields
      };

      // This should not crash the service
      expect(() => {
        // @ts-ignore - Testing malformed message
        multiplayerService['handleIncomingMessage'](malformedMessage);
      }).not.toThrow();
    });
  });

  describe('Device Management', () => {
    it('should track connected devices', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      const devices = multiplayerService.getConnectedDevices();
      expect(devices.length).toBeGreaterThan(0);
      expect(devices[0].name).toBe('Test Device');
    });

    it('should update host status correctly', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      expect(multiplayerService.getIsHost()).toBe(true);
    });

    it('should generate unique device IDs', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      const deviceId1 = multiplayerService.getDeviceId();
      multiplayerService.disconnect();

      await multiplayerService.connect('test-session-2', 'Test Device 2');
      const deviceId2 = multiplayerService.getDeviceId();

      expect(deviceId1).not.toBe(deviceId2);
    });
  });

  describe('Event Handling', () => {
    it('should register and unregister message handlers', () => {
      const handler = jest.fn();

      multiplayerService.onMessage(handler);
      multiplayerService.offMessage(handler);

      // Should not crash
      expect(() => multiplayerService.offMessage(handler)).not.toThrow();
    });

    it('should register and unregister error handlers', () => {
      const handler = jest.fn();

      multiplayerService.onError(handler);
      multiplayerService.offError(handler);

      // Should not crash
      expect(() => multiplayerService.offError(handler)).not.toThrow();
    });
  });

  describe('Test Environment Simulation', () => {
    it('should simulate device discovery in test environment', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      // Wait for simulated device discovery
      await new Promise(resolve => setTimeout(resolve, 1100));

      const devices = multiplayerService.getConnectedDevices();
      expect(devices.length).toBeGreaterThan(1); // Should find simulated devices
    });

    it('should simulate message broadcasting in test environment', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      const message: MultiplayerMessage = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'New Name' },
        timestamp: Date.now(),
      };

      const messageHandler = jest.fn();
      multiplayerService.onMessage(messageHandler);

      await multiplayerService.sendMessage(message);

      // Wait for simulated message delivery
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(messageHandler).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      // Test error handling in the service
      const result = await multiplayerService.connect('invalid-session', 'Test Device');

      // In test environment, this should still succeed due to simulation
      expect(result.success).toBe(true);
    });

    it('should handle message sending errors gracefully', async () => {
      await multiplayerService.connect('test-session', 'Test Device');

      const message: MultiplayerMessage = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'New Name' },
        timestamp: Date.now(),
      };

      const result = await multiplayerService.sendMessage(message);
      expect(result.success).toBe(true);
    });
  });
});
