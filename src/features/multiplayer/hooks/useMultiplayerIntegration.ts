import { useCampaigns } from '@/store/campaigns';
import { useGear } from '@/store/gear';
import { useKnights } from '@/store/knights';
import { useCallback, useEffect, useState } from 'react';
import { useMultiplayer } from '../multiplayerStore';
import { useMultiplayerSync } from './useMultiplayerSync';

export const useMultiplayerIntegration = () => {
  const { isConnected } = useMultiplayer();
  const {
    broadcastKnightUpdate,
    broadcastCampaignUpdate,
    broadcastGearUpdate,
    broadcastMonsterUpdate,
    isSyncing,
    lastSyncTime,
  } = useMultiplayerSync();

  // Get store actions
  const { updateKnightSheet } = useKnights();
  const { setNotes } = useCampaigns();
  const { setGearQuantity } = useGear();

  const [syncErrors, setSyncErrors] = useState<
    Array<{
      type: string;
      error: string;
      timestamp: number;
    }>
  >([]);
  const [pendingUpdates, setPendingUpdates] = useState<
    Array<{
      type: string;
      data: Record<string, unknown>;
      timestamp: number;
    }>
  >([]);

  // Update knight with sync
  const updateKnightWithSync = useCallback(
    async (knightId: string, updates: Record<string, unknown>) => {
      // Apply local updates first
      if (updates.name && typeof updates.name === 'string') {
        // For now, we'll just update the sheet name field
        // In a real implementation, you might want to add a direct name update method
        console.log('Updating knight locally:', knightId, updates);
      }

      // Broadcast updates if connected
      if (isConnected) {
        Object.entries(updates).forEach(([field, value]) => {
          broadcastKnightUpdate(knightId, field, value);
        });
      }
    },
    [isConnected, broadcastKnightUpdate]
  );

  // Update campaign with sync
  const updateCampaignWithSync = useCallback(
    async (campaignId: string, updates: Record<string, unknown>) => {
      // Apply local updates first
      if (updates.notes && typeof updates.notes === 'string') {
        setNotes(campaignId, updates.notes);
      }

      // Broadcast updates if connected
      if (isConnected) {
        Object.entries(updates).forEach(([field, value]) => {
          broadcastCampaignUpdate(campaignId, field, value);
        });
      }
    },
    [isConnected, broadcastCampaignUpdate, setNotes]
  );

  // Update gear with sync
  const updateGearWithSync = useCallback(
    async (gearId: string, field: string, value: unknown) => {
      // Apply local updates first
      if (field === 'quantity' && typeof value === 'number') {
        setGearQuantity(gearId, value);
      }

      // Broadcast updates if connected
      if (isConnected) {
        broadcastGearUpdate(gearId, field, value);
      }
    },
    [isConnected, broadcastGearUpdate, setGearQuantity]
  );

  // Update monster with sync
  const updateMonsterWithSync = useCallback(
    async (monsterId: string, updates: Record<string, unknown>) => {
      // Apply local updates first
      // Note: Monsters store is read-only, so we can't update locally
      console.log('Monster updates not supported locally:', monsterId, updates);

      // Broadcast updates if connected
      if (isConnected) {
        Object.entries(updates).forEach(([field, value]) => {
          broadcastMonsterUpdate(monsterId, field, value);
        });
      }
    },
    [isConnected, broadcastMonsterUpdate]
  );

  // Handle remote updates
  const handleRemoteUpdate = useCallback(
    (update: {
      type: string;
      data: Record<string, unknown>;
      timestamp: number;
      deviceId?: string;
    }) => {
      // Ignore updates from self
      if (update.deviceId === `device-${Date.now()}`) {
        return;
      }

      // Add to pending updates for conflict resolution
      setPendingUpdates(prev => [...prev, update]);

      // Apply the update locally
      if (update.type === 'knight_update') {
        const { knightId, field, value } = update.data;
        if (knightId && field && value) {
          updateKnightWithSync(knightId as string, { [field as string]: value });
        }
      } else if (update.type === 'campaign_update') {
        const { campaignId, field, value } = update.data;
        if (campaignId && field && value) {
          updateCampaignWithSync(campaignId as string, { [field as string]: value });
        }
      } else if (update.type === 'gear_update') {
        const { gearId, field, value } = update.data;
        if (gearId && field && value) {
          updateGearWithSync(gearId as string, field as string, value);
        }
      } else if (update.type === 'monster_update') {
        const { monsterId, field, value } = update.data;
        if (monsterId && field && value) {
          updateMonsterWithSync(monsterId as string, { [field as string]: value });
        }
      }
    },
    [updateKnightWithSync, updateCampaignWithSync, updateGearWithSync, updateMonsterWithSync]
  );

  // Retry failed syncs
  const retryFailedSync = useCallback(
    async (error: { type: string; error: string; timestamp: number }) => {
      // Remove the error
      setSyncErrors(prev => prev.filter(e => e !== error));

      // Find the corresponding pending update and retry
      const pendingUpdate = pendingUpdates.find(u => u.type === error.type);
      if (pendingUpdate) {
        try {
          // Retry the update
          if (pendingUpdate.type === 'knight_update') {
            await broadcastKnightUpdate(
              pendingUpdate.data.knightId as string,
              pendingUpdate.data.field as string,
              pendingUpdate.data.value as unknown
            );
          } else if (pendingUpdate.type === 'campaign_update') {
            await broadcastCampaignUpdate(
              pendingUpdate.data.campaignId as string,
              pendingUpdate.data.field as string,
              pendingUpdate.data.value as unknown
            );
          } else if (pendingUpdate.type === 'gear_update') {
            await broadcastGearUpdate(
              pendingUpdate.data.gearId as string,
              pendingUpdate.data.field as string,
              pendingUpdate.data.value as unknown
            );
          } else if (pendingUpdate.type === 'monster_update') {
            await broadcastMonsterUpdate(
              pendingUpdate.data.monsterId as string,
              pendingUpdate.data.field as string,
              pendingUpdate.data.value as unknown
            );
          }

          // Remove from pending updates
          setPendingUpdates(prev => prev.filter(u => u !== pendingUpdate));
        } catch (retryError) {
          // Add new error if retry fails
          const newSyncError = {
            type: error.type,
            error: retryError instanceof Error ? retryError.message : 'Retry failed',
            timestamp: Date.now(),
          };
          setSyncErrors(prev => [...prev, newSyncError]);
        }
      }
    },
    [
      pendingUpdates,
      broadcastKnightUpdate,
      broadcastCampaignUpdate,
      broadcastGearUpdate,
      broadcastMonsterUpdate,
    ]
  );

  // Restore multiplayer state
  const restoreMultiplayerState = useCallback(
    (state: {
      lastSyncTime?: number;
      pendingUpdates?: Array<{
        type: string;
        data: Record<string, unknown>;
        timestamp: number;
      }>;
      syncErrors?: Array<{
        type: string;
        error: string;
        timestamp: number;
      }>;
    }) => {
      if (state.lastSyncTime) {
        // This would update the lastSyncTime in the sync hook
        console.log('Restoring last sync time:', state.lastSyncTime);
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
    updateKnightWithSync,
    updateCampaignWithSync,
    updateGearWithSync,
    updateMonsterWithSync,
    handleRemoteUpdate,
    retryFailedSync,
    restoreMultiplayerState,
  };
};
