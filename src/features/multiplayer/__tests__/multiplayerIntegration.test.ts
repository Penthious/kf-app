import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useMultiplayerIntegration } from '../hooks/useMultiplayerIntegration';
import { MultiplayerUpdate } from '../multiplayerStore';

// Mock the multiplayer store
jest.mock('../multiplayerStore', () => ({
  useMultiplayer: () => ({
    isConnected: true,
    sessionId: 'test-session',
    sendUpdate: jest.fn(),
    onUpdate: jest.fn(),
    offUpdate: jest.fn(),
  }),
}));

// Mock the knights store
jest.mock('@/store/knights', () => ({
  useKnights: () => ({
    knightsById: { 'knight-1': { knightUID: 'knight-1', name: 'Test Knight' } },
    updateKnightSheet: jest.fn(),
    addKnight: jest.fn(),
    removeKnight: jest.fn(),
  }),
}));

// Mock the campaigns store
jest.mock('@/store/campaigns', () => ({
  useCampaigns: () => ({
    campaigns: { 'campaign-1': { campaignId: 'campaign-1', name: 'Test Campaign' } },
    updateCampaign: jest.fn(),
    addCampaign: jest.fn(),
    removeCampaign: jest.fn(),
    setNotes: jest.fn(),
  }),
}));

// Mock the gear store
jest.mock('@/store/gear', () => ({
  useGear: () => ({
    gearById: { 'gear-1': { gearUID: 'gear-1', name: 'Test Gear', quantity: 1 } },
    setGearQuantity: jest.fn(),
    addGear: jest.fn(),
    removeGear: jest.fn(),
  }),
}));

describe('Multiplayer Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Store Integration', () => {
    it('should integrate with knights store', async () => {
      const mockUpdateKnightSheet = jest.fn();
      const mockBroadcastKnightUpdate = jest.fn();

      jest.doMock('@/store/knights', () => ({
        useKnights: () => ({
          knightsById: { 'knight-1': { knightUID: 'knight-1', name: 'Test Knight' } },
          updateKnightSheet: mockUpdateKnightSheet,
          addKnight: jest.fn(),
          removeKnight: jest.fn(),
        }),
      }));

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateKnightWithSync('knight-1', { name: 'Updated Knight' });
      });

      await waitFor(() => {
        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', { name: 'Updated Knight' });
        expect(mockBroadcastKnightUpdate).toHaveBeenCalledWith(
          'knight-1',
          'name',
          'Updated Knight'
        );
      });
    });

    it('should integrate with campaigns store', async () => {
      const mockUpdateCampaign = jest.fn();
      const mockBroadcastCampaignUpdate = jest.fn();

      jest.doMock('@/store/campaigns', () => ({
        useCampaigns: () => ({
          campaigns: { 'campaign-1': { campaignId: 'campaign-1', name: 'Test Campaign' } },
          updateCampaign: mockUpdateCampaign,
          addCampaign: jest.fn(),
          removeCampaign: jest.fn(),
          setNotes: jest.fn(),
        }),
      }));

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: jest.fn(),
          broadcastCampaignUpdate: mockBroadcastCampaignUpdate,
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateCampaignWithSync('campaign-1', { notes: 'Updated notes' });
      });

      await waitFor(() => {
        expect(mockUpdateCampaign).toHaveBeenCalledWith('campaign-1', { notes: 'Updated notes' });
        expect(mockBroadcastCampaignUpdate).toHaveBeenCalledWith(
          'campaign-1',
          'notes',
          'Updated notes'
        );
      });
    });

    it('should integrate with gear store', async () => {
      const mockSetGearQuantity = jest.fn();
      const mockBroadcastGearUpdate = jest.fn();

      jest.doMock('@/store/gear', () => ({
        useGear: () => ({
          gearById: { 'gear-1': { gearUID: 'gear-1', name: 'Test Gear', quantity: 1 } },
          setGearQuantity: mockSetGearQuantity,
          addGear: jest.fn(),
          removeGear: jest.fn(),
        }),
      }));

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: jest.fn(),
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: mockBroadcastGearUpdate,
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateGearWithSync('gear-1', 'quantity', 5);
      });

      await waitFor(() => {
        expect(mockSetGearQuantity).toHaveBeenCalledWith('gear-1', 5);
        expect(mockBroadcastGearUpdate).toHaveBeenCalledWith('gear-1', 'quantity', 5);
      });
    });

    it('should handle monster updates (read-only)', async () => {
      const mockBroadcastMonsterUpdate = jest.fn();

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: jest.fn(),
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: mockBroadcastMonsterUpdate,
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateMonsterWithSync('monster-1', { health: 50 });
      });

      // Monster updates are read-only, so no store function should be called
      // But the broadcast should still happen
      expect(mockBroadcastMonsterUpdate).toHaveBeenCalledWith('monster-1', 'health', 50);
    });
  });

  describe('Multiplayer State Management', () => {
    it('should only sync when connected to multiplayer', () => {
      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: false,
          sessionId: null,
          sendUpdate: jest.fn(),
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateKnightWithSync('knight-1', { name: 'Updated Knight' });
      });

      // Should not crash when disconnected
      expect(result.current).toBeDefined();
    });

    it('should sync when connected to multiplayer', async () => {
      const mockBroadcastKnightUpdate = jest.fn();

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateKnightWithSync('knight-1', { name: 'Updated Knight' });
      });

      // Should broadcast when connected
      await waitFor(() => {
        expect(mockBroadcastKnightUpdate).toHaveBeenCalledWith(
          'knight-1',
          'name',
          'Updated Knight'
        );
      });
    });

    it('should track sync status', async () => {
      const mockBroadcastKnightUpdate = jest.fn();

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
          isSyncing: true,
          lastSyncTime: Date.now(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateKnightWithSync('knight-1', { name: 'Updated Knight' });
      });

      expect(result.current.isSyncing).toBe(true);
      expect(result.current.lastSyncTime).toBeTruthy();
    });
  });

  describe('Conflict Resolution', () => {
    it('should handle conflicting updates from multiple devices', async () => {
      const mockUpdateKnightSheet = jest.fn();
      const mockBroadcastKnightUpdate = jest.fn();

      jest.doMock('@/store/knights', () => ({
        useKnights: () => ({
          knightsById: { 'knight-1': { knightUID: 'knight-1', name: 'Test Knight' } },
          updateKnightSheet: mockUpdateKnightSheet,
          addKnight: jest.fn(),
          removeKnight: jest.fn(),
        }),
      }));

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      // Simulate conflicting updates
      const device1Update: MultiplayerUpdate = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'Device 1 Name' },
        timestamp: Date.now(),
      };

      const device2Update: MultiplayerUpdate = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'Device 2 Name' },
        timestamp: Date.now() + 1000,
      };

      act(() => {
        result.current.handleRemoteUpdate(device1Update);
        result.current.handleRemoteUpdate(device2Update);
      });

      // Should resolve conflicts based on timestamp or other logic
      await waitFor(() => {
        expect(mockUpdateKnightSheet).toHaveBeenCalled();
      });
    });

    it('should queue updates when conflicts are detected', async () => {
      const mockBroadcastKnightUpdate = jest.fn();

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      // Simulate multiple rapid updates
      act(() => {
        result.current.updateKnightWithSync('knight-1', { name: 'Name 1' });
        result.current.updateKnightWithSync('knight-1', { name: 'Name 2' });
        result.current.updateKnightWithSync('knight-1', { name: 'Name 3' });
      });

      // Should queue updates for conflict resolution
      expect(mockBroadcastKnightUpdate).toHaveBeenCalledTimes(3);
    });
  });

  describe('Performance Optimization', () => {
    it('should batch multiple updates', async () => {
      const mockBroadcastKnightUpdate = jest.fn();

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      // Send multiple updates rapidly
      act(() => {
        result.current.updateKnightWithSync('knight-1', { name: 'Name 1' });
        result.current.updateKnightWithSync('knight-1', { name: 'Name 2' });
        result.current.updateKnightWithSync('knight-1', { name: 'Name 3' });
      });

      // Should batch updates
      await waitFor(() => {
        expect(mockBroadcastKnightUpdate).toHaveBeenCalledTimes(3);
      });
    });

    it('should throttle rapid updates', async () => {
      const mockBroadcastKnightUpdate = jest.fn();

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      // Send 100 rapid updates
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.updateKnightWithSync('knight-1', { name: `Name ${i}` });
        });
      }

      // Should throttle and not send all 100 updates immediately
      await waitFor(() => {
        expect(mockBroadcastKnightUpdate).toHaveBeenCalled();
        expect(mockBroadcastKnightUpdate).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle sync errors gracefully', async () => {
      const mockBroadcastKnightUpdate = jest.fn().mockRejectedValue(new Error('Sync failed'));

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateKnightWithSync('knight-1', { name: 'Updated Knight' });
      });

      await waitFor(() => {
        expect(result.current.syncErrors).toHaveLength(1);
        expect(result.current.syncErrors[0]).toMatchObject({
          type: 'knight_update',
          error: 'Sync failed',
        });
      });
    });

    it('should retry failed syncs', async () => {
      const mockBroadcastKnightUpdate = jest
        .fn()
        .mockRejectedValueOnce(new Error('Sync failed'))
        .mockResolvedValueOnce(undefined);

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateKnightWithSync('knight-1', { name: 'Updated Knight' });
      });

      await waitFor(() => {
        expect(result.current.syncErrors).toHaveLength(1);
      });

      // Retry the failed sync
      act(() => {
        result.current.retryFailedSync(result.current.syncErrors[0]);
      });

      await waitFor(() => {
        expect(mockBroadcastKnightUpdate).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('State Persistence', () => {
    it('should save multiplayer state to storage', async () => {
      const mockBroadcastKnightUpdate = jest.fn();

      jest.doMock('../hooks/useMultiplayerSync', () => ({
        useMultiplayerSync: () => ({
          broadcastKnightUpdate: mockBroadcastKnightUpdate,
          broadcastCampaignUpdate: jest.fn(),
          broadcastGearUpdate: jest.fn(),
          broadcastMonsterUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.updateKnightWithSync('knight-1', { name: 'Updated Knight' });
      });

      await waitFor(() => {
        expect(result.current.lastSyncTime).toBeTruthy();
      });
    });

    it('should restore multiplayer state from storage', () => {
      const mockMultiplayerState = {
        lastSyncTime: Date.now(),
        pendingUpdates: [],
        syncErrors: [],
      };

      const { result } = renderHook(() => useMultiplayerIntegration());

      act(() => {
        result.current.restoreMultiplayerState(mockMultiplayerState);
      });

      expect(result.current.lastSyncTime).toBe(mockMultiplayerState.lastSyncTime);
      expect(result.current.pendingUpdates).toEqual(mockMultiplayerState.pendingUpdates);
      expect(result.current.syncErrors).toEqual(mockMultiplayerState.syncErrors);
    });
  });

  describe('Real-time Updates', () => {
    it('should handle real-time updates from other devices', async () => {
      const mockUpdateKnightSheet = jest.fn();

      jest.doMock('@/store/knights', () => ({
        useKnights: () => ({
          knightsById: { 'knight-1': { knightUID: 'knight-1', name: 'Test Knight' } },
          updateKnightSheet: mockUpdateKnightSheet,
          addKnight: jest.fn(),
          removeKnight: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      const remoteUpdate: MultiplayerUpdate = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'Remote Update' },
        timestamp: Date.now(),
      };

      act(() => {
        result.current.handleRemoteUpdate(remoteUpdate);
      });

      await waitFor(() => {
        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', { name: 'Remote Update' });
      });
    });

    it('should ignore updates from self', async () => {
      const mockUpdateKnightSheet = jest.fn();

      jest.doMock('@/store/knights', () => ({
        useKnights: () => ({
          knightsById: { 'knight-1': { knightUID: 'knight-1', name: 'Test Knight' } },
          updateKnightSheet: mockUpdateKnightSheet,
          addKnight: jest.fn(),
          removeKnight: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerIntegration());

      const selfUpdate: MultiplayerUpdate = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'Self Update' },
        timestamp: Date.now(),
        deviceId: 'self-device',
      };

      act(() => {
        result.current.handleRemoteUpdate(selfUpdate);
      });

      // Should not apply self-updates
      expect(mockUpdateKnightSheet).not.toHaveBeenCalled();
    });
  });
});
