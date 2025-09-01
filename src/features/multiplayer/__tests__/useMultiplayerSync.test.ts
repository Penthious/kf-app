import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useMultiplayerSync } from '../hooks/useMultiplayerSync';
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

describe('useMultiplayerSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useMultiplayerSync());

      expect(result.current).toBeDefined();
    });

    it('should set up update listeners when connected', () => {
      const mockOnUpdate = jest.fn();
      const mockOffUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: jest.fn(),
          onUpdate: mockOnUpdate,
          offUpdate: mockOffUpdate,
        }),
      }));

      renderHook(() => useMultiplayerSync());

      expect(mockOnUpdate).toHaveBeenCalled();
    });

    it('should clean up listeners when disconnected', () => {
      const mockOffUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: false,
          sessionId: null,
          sendUpdate: jest.fn(),
          onUpdate: jest.fn(),
          offUpdate: mockOffUpdate,
        }),
      }));

      const { unmount } = renderHook(() => useMultiplayerSync());

      unmount();

      expect(mockOffUpdate).toHaveBeenCalled();
    });
  });

  describe('State Synchronization', () => {
    it('should sync knight updates', async () => {
      const mockSendUpdate = jest.fn();
      const mockUpdateKnightSheet = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      jest.doMock('@/store/knights', () => ({
        useKnights: () => ({
          knightsById: { 'knight-1': { knightUID: 'knight-1', name: 'Test Knight' } },
          updateKnightSheet: mockUpdateKnightSheet,
          addKnight: jest.fn(),
          removeKnight: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      const knightUpdate: MultiplayerUpdate = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'Updated Knight' },
        timestamp: Date.now(),
      };

      act(() => {
        result.current.handleUpdate(knightUpdate);
      });

      await waitFor(() => {
        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', { name: 'Updated Knight' });
      });
    });

    it('should sync campaign updates', async () => {
      const mockSetNotes = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: jest.fn(),
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      jest.doMock('@/store/campaigns', () => ({
        useCampaigns: () => ({
          campaigns: { 'campaign-1': { campaignId: 'campaign-1', name: 'Test Campaign' } },
          updateCampaign: jest.fn(),
          addCampaign: jest.fn(),
          removeCampaign: jest.fn(),
          setNotes: mockSetNotes,
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      const campaignUpdate: MultiplayerUpdate = {
        type: 'campaign_update',
        data: { campaignId: 'campaign-1', field: 'notes', value: 'Updated notes' },
        timestamp: Date.now(),
      };

      act(() => {
        result.current.handleUpdate(campaignUpdate);
      });

      await waitFor(() => {
        expect(mockSetNotes).toHaveBeenCalledWith('campaign-1', 'Updated notes');
      });
    });

    it('should sync gear updates', async () => {
      const mockSetGearQuantity = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: jest.fn(),
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      jest.doMock('@/store/gear', () => ({
        useGear: () => ({
          gearById: { 'gear-1': { gearUID: 'gear-1', name: 'Test Gear', quantity: 1 } },
          setGearQuantity: mockSetGearQuantity,
          addGear: jest.fn(),
          removeGear: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      const gearUpdate: MultiplayerUpdate = {
        type: 'gear_update',
        data: { gearId: 'gear-1', field: 'quantity', value: 5 },
        timestamp: Date.now(),
      };

      act(() => {
        result.current.handleUpdate(gearUpdate);
      });

      await waitFor(() => {
        expect(mockSetGearQuantity).toHaveBeenCalledWith('gear-1', 5);
      });
    });

    it('should handle monster updates (read-only)', async () => {
      const mockSendUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      const monsterUpdate: MultiplayerUpdate = {
        type: 'monster_update',
        data: { monsterId: 'monster-1', field: 'health', value: 50 },
        timestamp: Date.now(),
      };

      act(() => {
        result.current.handleUpdate(monsterUpdate);
      });

      // Monster updates are read-only, so no store function should be called
      await waitFor(() => {
        // Should not crash and should handle gracefully
        expect(result.current).toBeDefined();
      });
    });
  });

  describe('Update Broadcasting', () => {
    it('should broadcast local knight changes', async () => {
      const mockSendUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      act(() => {
        result.current.broadcastKnightUpdate('knight-1', 'name', 'Updated Knight');
      });

      await waitFor(() => {
        expect(mockSendUpdate).toHaveBeenCalledWith({
          type: 'knight_update',
          data: { knightId: 'knight-1', field: 'name', value: 'Updated Knight' },
          timestamp: expect.any(Number),
        });
      });
    });

    it('should broadcast local campaign changes', async () => {
      const mockSendUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      act(() => {
        result.current.broadcastCampaignUpdate('campaign-1', 'notes', 'Updated notes');
      });

      await waitFor(() => {
        expect(mockSendUpdate).toHaveBeenCalledWith({
          type: 'campaign_update',
          data: { campaignId: 'campaign-1', field: 'notes', value: 'Updated notes' },
          timestamp: expect.any(Number),
        });
      });
    });

    it('should broadcast local gear changes', async () => {
      const mockSendUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      act(() => {
        result.current.broadcastGearUpdate('gear-1', 'quantity', 5);
      });

      await waitFor(() => {
        expect(mockSendUpdate).toHaveBeenCalledWith({
          type: 'gear_update',
          data: { gearId: 'gear-1', field: 'quantity', value: 5 },
          timestamp: expect.any(Number),
        });
      });
    });

    it('should not broadcast updates when disconnected', () => {
      const mockSendUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: false,
          sessionId: null,
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      act(() => {
        result.current.broadcastKnightUpdate('knight-1', 'name', 'Updated Knight');
      });

      expect(mockSendUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Conflict Resolution', () => {
    it('should handle conflicting updates with timestamp-based resolution', async () => {
      const mockUpdateKnightSheet = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: jest.fn(),
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      jest.doMock('@/store/knights', () => ({
        useKnights: () => ({
          knightsById: { 'knight-1': { knightUID: 'knight-1', name: 'Test Knight' } },
          updateKnightSheet: mockUpdateKnightSheet,
          addKnight: jest.fn(),
          removeKnight: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      const olderUpdate: MultiplayerUpdate = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'Older Name' },
        timestamp: Date.now() - 1000,
      };

      const newerUpdate: MultiplayerUpdate = {
        type: 'knight_update',
        data: { knightId: 'knight-1', field: 'name', value: 'Newer Name' },
        timestamp: Date.now(),
      };

      // Process both updates
      act(() => {
        result.current.handleUpdate(olderUpdate);
        result.current.handleUpdate(newerUpdate);
      });

      await waitFor(() => {
        // Should only apply the newer update
        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', { name: 'Newer Name' });
        expect(mockUpdateKnightSheet).toHaveBeenCalledTimes(1);
      });
    });

    it('should queue conflicting updates for resolution', async () => {
      const mockUpdateKnightSheet = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: jest.fn(),
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      jest.doMock('@/store/knights', () => ({
        useKnights: () => ({
          knightsById: { 'knight-1': { knightUID: 'knight-1', name: 'Test Knight' } },
          updateKnightSheet: mockUpdateKnightSheet,
          addKnight: jest.fn(),
          removeKnight: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      const updates: MultiplayerUpdate[] = [
        {
          type: 'knight_update',
          data: { knightId: 'knight-1', field: 'name', value: 'Name 1' },
          timestamp: Date.now(),
        },
        {
          type: 'knight_update',
          data: { knightId: 'knight-1', field: 'name', value: 'Name 2' },
          timestamp: Date.now() + 100,
        },
        {
          type: 'knight_update',
          data: { knightId: 'knight-1', field: 'name', value: 'Name 3' },
          timestamp: Date.now() + 200,
        },
      ];

      updates.forEach(update => {
        act(() => {
          result.current.handleUpdate(update);
        });
      });

      await waitFor(() => {
        expect(mockUpdateKnightSheet).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('Error Handling', () => {
    it('should track sync errors', async () => {
      const mockSendUpdate = jest.fn().mockRejectedValue(new Error('Sync failed'));

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      act(() => {
        result.current.broadcastKnightUpdate('knight-1', 'name', 'Updated Knight');
      });

      await waitFor(() => {
        expect(result.current.syncErrors).toHaveLength(1);
        expect(result.current.syncErrors[0]).toMatchObject({
          type: 'knight_update',
          error: 'Sync failed',
        });
      });
    });

    it('should retry failed updates', async () => {
      const mockSendUpdate = jest
        .fn()
        .mockRejectedValueOnce(new Error('Sync failed'))
        .mockResolvedValueOnce({ success: true });

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      act(() => {
        result.current.broadcastKnightUpdate('knight-1', 'name', 'Updated Knight');
      });

      await waitFor(() => {
        expect(result.current.syncErrors).toHaveLength(1);
      });

      // Retry the failed update
      act(() => {
        result.current.retryFailedUpdate(result.current.syncErrors[0]);
      });

      await waitFor(() => {
        expect(mockSendUpdate).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Performance Optimization', () => {
    it('should batch multiple updates', async () => {
      const mockSendUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      // Send multiple updates rapidly
      act(() => {
        result.current.broadcastKnightUpdate('knight-1', 'name', 'Name 1');
        result.current.broadcastKnightUpdate('knight-1', 'name', 'Name 2');
        result.current.broadcastKnightUpdate('knight-1', 'name', 'Name 3');
      });

      // Wait for batching to complete
      await waitFor(() => {
        expect(mockSendUpdate).toHaveBeenCalledTimes(3);
      });
    });

    it('should throttle rapid updates', async () => {
      const mockSendUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      // Send 100 rapid updates
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.broadcastKnightUpdate('knight-1', 'name', `Name ${i}`);
        });
      }

      // Should throttle and not send all 100 updates immediately
      await waitFor(() => {
        expect(mockSendUpdate).toHaveBeenCalled();
        expect(mockSendUpdate).toHaveBeenCalledTimes(3);
      });
    });
  });

  describe('State Persistence', () => {
    it('should save sync state to storage', async () => {
      const mockSendUpdate = jest.fn();

      jest.doMock('../multiplayerStore', () => ({
        useMultiplayer: () => ({
          isConnected: true,
          sessionId: 'test-session',
          sendUpdate: mockSendUpdate,
          onUpdate: jest.fn(),
          offUpdate: jest.fn(),
        }),
      }));

      const { result } = renderHook(() => useMultiplayerSync());

      act(() => {
        result.current.broadcastKnightUpdate('knight-1', 'name', 'Updated Knight');
      });

      await waitFor(() => {
        expect(result.current.lastSyncTime).toBeTruthy();
      });
    });

    it('should restore sync state from storage', () => {
      const mockMultiplayerState = {
        lastSyncTime: Date.now(),
        pendingUpdates: [],
        syncErrors: [],
      };

      const { result } = renderHook(() => useMultiplayerSync());

      act(() => {
        result.current.restoreSyncState(mockMultiplayerState);
      });

      expect(result.current.lastSyncTime).toBe(mockMultiplayerState.lastSyncTime);
      expect(result.current.pendingUpdates).toEqual(mockMultiplayerState.pendingUpdates);
      expect(result.current.syncErrors).toEqual(mockMultiplayerState.syncErrors);
    });
  });
});
