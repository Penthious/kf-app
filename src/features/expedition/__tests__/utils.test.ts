import type { Campaign } from '@/models/campaign';
import { hasExpeditionStarted, isPartyLeaderLocked } from '../utils';

describe('expedition utils', () => {
  describe('hasExpeditionStarted', () => {
    it('should return false when campaign is undefined', () => {
      expect(hasExpeditionStarted(undefined)).toBe(false);
    });

    it('should return false when expedition is undefined', () => {
      const campaign = {
        campaignId: 'test',
        name: 'Test Campaign',
        members: [],
        settings: { fivePlayerMode: false, expansions: {} },
        kingdoms: [],
        partyLeaderUID: undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Campaign;

      expect(hasExpeditionStarted(campaign)).toBe(false);
    });

    it('should return false when currentPhase is undefined', () => {
      const campaign = {
        campaignId: 'test',
        name: 'Test Campaign',
        members: [],
        settings: { fivePlayerMode: false, expansions: {} },
        kingdoms: [],
        partyLeaderUID: undefined,
        expedition: {
          currentPhase: undefined as any,
          knightChoices: [],
          phaseStartedAt: Date.now(),
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Campaign;

      expect(hasExpeditionStarted(campaign)).toBe(false);
    });

    it('should return true when currentPhase is defined', () => {
      const campaign = {
        campaignId: 'test',
        name: 'Test Campaign',
        members: [],
        settings: { fivePlayerMode: false, expansions: {} },
        kingdoms: [],
        partyLeaderUID: undefined,
        expedition: {
          currentPhase: 'vision',
          knightChoices: [],
          phaseStartedAt: Date.now(),
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Campaign;

      expect(hasExpeditionStarted(campaign)).toBe(true);
    });

    it('should return true for any expedition phase', () => {
      const phases = [
        'vision',
        'outpost',
        'delve',
        'clash',
        'rest',
        'second-delve',
        'second-clash',
        'spoils',
      ] as const;

      phases.forEach(phase => {
        const campaign = {
          campaignId: 'test',
          name: 'Test Campaign',
          members: [],
          settings: { fivePlayerMode: false, expansions: {} },
          kingdoms: [],
          partyLeaderUID: undefined,
          expedition: {
            currentPhase: phase,
            knightChoices: [],
            phaseStartedAt: Date.now(),
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        } as Campaign;

        expect(hasExpeditionStarted(campaign)).toBe(true);
      });
    });
  });

  describe('isPartyLeaderLocked', () => {
    it('should return false when campaign is undefined', () => {
      expect(isPartyLeaderLocked(undefined)).toBe(false);
    });

    it('should return false when expedition has not started', () => {
      const campaign = {
        campaignId: 'test',
        name: 'Test Campaign',
        members: [],
        settings: { fivePlayerMode: false, expansions: {} },
        kingdoms: [],
        partyLeaderUID: undefined,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Campaign;

      expect(isPartyLeaderLocked(campaign)).toBe(false);
    });

    it('should return true when expedition has started', () => {
      const campaign = {
        campaignId: 'test',
        name: 'Test Campaign',
        members: [],
        settings: { fivePlayerMode: false, expansions: {} },
        kingdoms: [],
        partyLeaderUID: undefined,
        expedition: {
          currentPhase: 'vision',
          knightChoices: [],
          phaseStartedAt: Date.now(),
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      } as Campaign;

      expect(isPartyLeaderLocked(campaign)).toBe(true);
    });

    it('should return true for any expedition phase', () => {
      const phases = [
        'vision',
        'outpost',
        'delve',
        'clash',
        'rest',
        'second-delve',
        'second-clash',
        'spoils',
      ] as const;

      phases.forEach(phase => {
        const campaign = {
          campaignId: 'test',
          name: 'Test Campaign',
          members: [],
          settings: { fivePlayerMode: false, expansions: {} },
          kingdoms: [],
          partyLeaderUID: undefined,
          expedition: {
            currentPhase: phase,
            knightChoices: [],
            phaseStartedAt: Date.now(),
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        } as Campaign;

        expect(isPartyLeaderLocked(campaign)).toBe(true);
      });
    });
  });
});
