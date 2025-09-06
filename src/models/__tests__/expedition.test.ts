import { describe, expect, it } from '@jest/globals';
import type {
  ExpeditionPhase,
  KnightExpeditionChoice,
  ExpeditionState,
  Campaign,
} from '../campaign';

describe('Expedition Types', () => {
  describe('ExpeditionPhase', () => {
    it('should accept valid expedition phases', () => {
      const validPhases: ExpeditionPhase[] = [
        'vision',
        'outpost',
        'delve',
        'clash',
        'rest',
        'second-delve',
        'second-clash',
        'spoils',
      ];

      validPhases.forEach(phase => {
        expect(phase).toBeTruthy();
        expect(typeof phase).toBe('string');
      });
    });
  });

  describe('KnightExpeditionChoice', () => {
    it('should create valid quest choice', () => {
      const choice: KnightExpeditionChoice = {
        knightUID: 'knight-1',
        choice: 'quest',
        questId: 'quest-123',
        status: 'in-progress',
      };

      expect(choice.knightUID).toBe('knight-1');
      expect(choice.choice).toBe('quest');
      expect(choice.questId).toBe('quest-123');
      expect(choice.status).toBe('in-progress');
    });

    it('should create valid investigation choice', () => {
      const choice: KnightExpeditionChoice = {
        knightUID: 'knight-2',
        choice: 'investigation',
        investigationId: 'investigation-456',
        status: 'completed',
      };

      expect(choice.knightUID).toBe('knight-2');
      expect(choice.choice).toBe('investigation');
      expect(choice.investigationId).toBe('investigation-456');
      expect(choice.status).toBe('completed');
    });

    it('should create valid free-roam choice', () => {
      const choice: KnightExpeditionChoice = {
        knightUID: 'knight-3',
        choice: 'free-roam',
        status: 'in-progress',
      };

      expect(choice.knightUID).toBe('knight-3');
      expect(choice.choice).toBe('free-roam');
      expect(choice.status).toBe('in-progress');
    });
  });

  describe('ExpeditionState', () => {
    it('should create valid expedition state', () => {
      const expeditionState: ExpeditionState = {
        currentPhase: 'vision',
        knightChoices: [
          {
            knightUID: 'knight-1',
            choice: 'quest',
            questId: 'quest-123',
            status: 'in-progress',
          },
          {
            knightUID: 'knight-2',
            choice: 'investigation',
            investigationId: 'investigation-456',
            status: 'in-progress',
          },
        ],
        phaseStartedAt: 1700000000000,
      };

      expect(expeditionState.currentPhase).toBe('vision');
      expect(expeditionState.knightChoices).toHaveLength(2);
      expect(expeditionState.phaseStartedAt).toBe(1700000000000);
    });

    it('should handle empty knight choices', () => {
      const expeditionState: ExpeditionState = {
        currentPhase: 'outpost',
        knightChoices: [],
        phaseStartedAt: 1700000000000,
      };

      expect(expeditionState.knightChoices).toEqual([]);
    });
  });

  describe('Campaign with Expedition', () => {
    it('should create campaign with expedition state', () => {
      const campaign: Campaign = {
        campaignId: 'test-campaign',
        name: 'Test Campaign',
        createdAt: 1700000000000,
        updatedAt: 1700000000000,
        settings: {
          fivePlayerMode: false,
        },
        members: [
          {
            knightUID: 'knight-1',
            displayName: 'Knight One',
            catalogId: 'catalog-1',
            isActive: true,
            joinedAt: 1700000000000,
            isLeader: true,
          },
        ],
        partyLeaderUID: 'knight-1',
        kingdoms: [],
        expedition: {
          currentPhase: 'vision',
          knightChoices: [
            {
              knightUID: 'knight-1',
              choice: 'quest',
              questId: 'quest-123',
              status: 'in-progress',
            },
          ],
          phaseStartedAt: 1700000000000,
        },
      };

      expect(campaign.expedition).toBeTruthy();
      expect(campaign.expedition!.currentPhase).toBe('vision');
      expect(campaign.partyLeaderUID).toBe('knight-1');
    });

    it('should handle campaign without expedition', () => {
      const campaign: Campaign = {
        campaignId: 'test-campaign',
        name: 'Test Campaign',
        createdAt: 1700000000000,
        updatedAt: 1700000000000,
        settings: {
          fivePlayerMode: false,
        },
        members: [],
        kingdoms: [],
      };

      expect(campaign.expedition).toBeUndefined();
    });
  });

  describe('CampaignMember with isLeader', () => {
    it('should create campaign member with leader flag', () => {
      const member = {
        knightUID: 'knight-1',
        displayName: 'Knight One',
        catalogId: 'catalog-1',
        isActive: true,
        joinedAt: 1700000000000,
        isLeader: true,
      };

      expect(member.isLeader).toBe(true);
    });

    it('should create campaign member without leader flag', () => {
      const member = {
        knightUID: 'knight-2',
        displayName: 'Knight Two',
        catalogId: 'catalog-2',
        isActive: true,
        joinedAt: 1700000000000,
      };

      expect('isLeader' in member).toBe(false);
    });
  });
});
