import { useCampaigns } from '@/store/campaigns';
import { useGear } from '@/store/gear';
import { useKnights } from '@/store/knights';
import { useCallback, useEffect, useState } from 'react';
import { MultiplayerUpdate, useMultiplayer } from '../multiplayerStore';

export type SyncError = {
  type: string;
  error: string;
  timestamp: number;
};

export type PendingUpdate = {
  type: 'knight_update' | 'campaign_update' | 'gear_update' | 'monster_update';
  data: Record<string, unknown>;
  timestamp: number;
};

export const useMultiplayerSync = () => {
  const { isConnected, sendUpdate, onUpdate, offUpdate } = useMultiplayer();

  // Get store actions
  const { updateKnightSheet } = useKnights();
  const { setNotes } = useCampaigns();
  const { setGearQuantity } = useGear();

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [syncErrors, setSyncErrors] = useState<SyncError[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<PendingUpdate[]>([]);

  // Handle incoming updates
  const handleUpdate = useCallback(
    (update: MultiplayerUpdate) => {
      // Add to pending updates for conflict resolution
      setPendingUpdates(prev => [...prev, update]);

      // Update last sync time
      setLastSyncTime(Date.now());

      // Apply the update locally based on type
      if (update.type === 'knight_update') {
        const { knightId, field, value } = update.data;
        if (knightId && field && value) {
          // For knight updates, we need to update the sheet
          if (field === 'name' && typeof value === 'string') {
            // Note: This is a simplified approach - in a real app you might want a direct name update method
            console.log('Would update knight name:', knightId, value);
          }
        }
      } else if (update.type === 'campaign_update') {
        const { campaignId, field, value } = update.data;
        if (campaignId && field && value) {
          if (field === 'notes' && typeof value === 'string') {
            setNotes(campaignId as string, value);
          }
        }
      } else if (update.type === 'gear_update') {
        const { gearId, field, value } = update.data;
        if (gearId && field && value) {
          if (field === 'quantity' && typeof value === 'number') {
            setGearQuantity(gearId as string, value);
          }
        }
      } else if (update.type === 'monster_update') {
        // Monsters store is read-only, so we can't update locally
        console.log('Monster updates not supported locally:', update);
      }
    },
    [setNotes, setGearQuantity]
  );

  // Set up event listeners when connected
  useEffect(() => {
    if (isConnected) {
      onUpdate(handleUpdate);

      return () => {
        offUpdate(handleUpdate);
      };
    }
  }, [isConnected, handleUpdate, onUpdate, offUpdate]);

  // Broadcast knight updates
  const broadcastKnightUpdate = useCallback(
    async (knightId: string, field: string, value: unknown) => {
      if (!isConnected) return;

      setIsSyncing(true);
      try {
        const update: MultiplayerUpdate = {
          type: 'knight_update',
          data: { knightId, field, value },
          timestamp: Date.now(),
        };

        await sendUpdate(update);
        setLastSyncTime(Date.now());
      } catch (error) {
        const syncError: SyncError = {
          type: 'knight_update',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        };
        setSyncErrors(prev => [...prev, syncError]);
      } finally {
        setIsSyncing(false);
      }
    },
    [isConnected, sendUpdate]
  );

  // Broadcast campaign updates
  const broadcastCampaignUpdate = useCallback(
    async (campaignId: string, field: string, value: unknown) => {
      if (!isConnected) return;

      setIsSyncing(true);
      try {
        const update: MultiplayerUpdate = {
          type: 'campaign_update',
          data: { campaignId, field, value },
          timestamp: Date.now(),
        };

        await sendUpdate(update);
        setLastSyncTime(Date.now());
      } catch (error) {
        const syncError: SyncError = {
          type: 'campaign_update',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        };
        setSyncErrors(prev => [...prev, syncError]);
      } finally {
        setIsSyncing(false);
      }
    },
    [isConnected, sendUpdate]
  );

  // Broadcast gear updates
  const broadcastGearUpdate = useCallback(
    async (gearId: string, field: string, value: unknown) => {
      if (!isConnected) return;

      setIsSyncing(true);
      try {
        const update: MultiplayerUpdate = {
          type: 'gear_update',
          data: { gearId, field, value },
          timestamp: Date.now(),
        };

        await sendUpdate(update);
        setLastSyncTime(Date.now());
      } catch (error) {
        const syncError: SyncError = {
          type: 'gear_update',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        };
        setSyncErrors(prev => [...prev, syncError]);
      } finally {
        setIsSyncing(false);
      }
    },
    [isConnected, sendUpdate]
  );

  // Broadcast monster updates
  const broadcastMonsterUpdate = useCallback(
    async (monsterId: string, field: string, value: unknown) => {
      if (!isConnected) return;

      setIsSyncing(true);
      try {
        const update: MultiplayerUpdate = {
          type: 'monster_update',
          data: { monsterId, field, value },
          timestamp: Date.now(),
        };

        await sendUpdate(update);
        setLastSyncTime(Date.now());
      } catch (error) {
        const syncError: SyncError = {
          type: 'monster_update',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        };
        setSyncErrors(prev => [...prev, syncError]);
      } finally {
        setIsSyncing(false);
      }
    },
    [isConnected, sendUpdate]
  );

  // Retry failed updates
  const retryFailedUpdate = useCallback(
    async (error: SyncError) => {
      // Remove the error
      setSyncErrors(prev => prev.filter(e => e !== error));

      // Find the corresponding pending update and retry
      const pendingUpdate = pendingUpdates.find(u => u.type === error.type);
      if (pendingUpdate) {
        try {
          await sendUpdate(pendingUpdate);
          setLastSyncTime(Date.now());

          // Remove from pending updates
          setPendingUpdates(prev => prev.filter(u => u !== pendingUpdate));
        } catch (retryError) {
          // Add new error if retry fails
          const newSyncError: SyncError = {
            type: error.type,
            error: retryError instanceof Error ? retryError.message : 'Retry failed',
            timestamp: Date.now(),
          };
          setSyncErrors(prev => [...prev, newSyncError]);
        }
      }
    },
    [pendingUpdates, sendUpdate]
  );

  // Restore sync state
  const restoreSyncState = useCallback(
    (state: {
      lastSyncTime?: number;
      pendingUpdates?: PendingUpdate[];
      syncErrors?: SyncError[];
    }) => {
      if (state.lastSyncTime) {
        setLastSyncTime(state.lastSyncTime);
      }
      if (state.pendingUpdates) {
        setPendingUpdates(state.pendingUpdates);
      }
      if (state.syncErrors) {
        setSyncErrors(state.syncErrors);
      }
    },
    []
  );

  // Clear errors
  const clearErrors = useCallback(() => {
    setSyncErrors([]);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      setSyncErrors([]);
      setPendingUpdates([]);
    };
  }, []);

  return {
    // State
    isSyncing,
    lastSyncTime,
    syncErrors,
    pendingUpdates,

    // Actions
    broadcastKnightUpdate,
    broadcastCampaignUpdate,
    broadcastGearUpdate,
    broadcastMonsterUpdate,
    handleUpdate,
    retryFailedUpdate,
    restoreSyncState,
    clearErrors,
  };
};
