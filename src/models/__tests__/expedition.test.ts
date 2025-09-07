import { describe, expect, it } from '@jest/globals';
import type {
  Campaign,
  Clue,
  Contract,
  DelveProgress,
  ExpeditionPhase,
  ExpeditionState,
  KnightExpeditionChoice,
  Objective,
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

  describe('Delve Progress Types', () => {
    describe('Clue', () => {
      it('should create valid clue', () => {
        const clue: Clue = {
          id: 'clue-1',
          type: 'swords',
          discoveredAt: 1700000000000,
          discoveredBy: 'knight-1',
        };

        expect(clue.id).toBe('clue-1');
        expect(clue.type).toBe('swords');
        expect(clue.discoveredAt).toBe(1700000000000);
        expect(clue.discoveredBy).toBe('knight-1');
      });
    });

    describe('Objective', () => {
      it('should create valid active objective', () => {
        const objective: Objective = {
          id: 'obj-1',
          name: 'Sample Objective',
          description: 'Complete this objective to progress in your expedition.',
          status: 'active',
        };

        expect(objective.id).toBe('obj-1');
        expect(objective.name).toBe('Sample Objective');
        expect(objective.description).toBe(
          'Complete this objective to progress in your expedition.'
        );
        expect(objective.status).toBe('active');
        expect(objective.completedAt).toBeUndefined();
        expect(objective.completedBy).toBeUndefined();
      });

      it('should create valid completed objective', () => {
        const objective: Objective = {
          id: 'obj-2',
          name: 'Completed Objective',
          description: 'This objective has been completed.',
          status: 'completed',
          completedAt: 1700000000000,
          completedBy: 'knight-1',
        };

        expect(objective.status).toBe('completed');
        expect(objective.completedAt).toBe(1700000000000);
        expect(objective.completedBy).toBe('knight-1');
      });
    });

    describe('Contract', () => {
      it('should create valid available contract', () => {
        const contract: Contract = {
          id: 'contract-1',
          name: 'Sample Contract',
          description: 'Accept this contract to earn rewards.',
          status: 'available',
        };

        expect(contract.id).toBe('contract-1');
        expect(contract.name).toBe('Sample Contract');
        expect(contract.description).toBe('Accept this contract to earn rewards.');
        expect(contract.status).toBe('available');
        expect(contract.acceptedAt).toBeUndefined();
        expect(contract.acceptedBy).toBeUndefined();
        expect(contract.completedAt).toBeUndefined();
        expect(contract.completedBy).toBeUndefined();
      });

      it('should create valid accepted contract', () => {
        const contract: Contract = {
          id: 'contract-2',
          name: 'Accepted Contract',
          description: 'This contract has been accepted.',
          status: 'accepted',
          acceptedAt: 1700000000000,
          acceptedBy: 'knight-1',
        };

        expect(contract.status).toBe('accepted');
        expect(contract.acceptedAt).toBe(1700000000000);
        expect(contract.acceptedBy).toBe('knight-1');
      });

      it('should create valid completed contract', () => {
        const contract: Contract = {
          id: 'contract-3',
          name: 'Completed Contract',
          description: 'This contract has been completed.',
          status: 'completed',
          acceptedAt: 1700000000000,
          acceptedBy: 'knight-1',
          completedAt: 1700000001000,
          completedBy: 'knight-1',
        };

        expect(contract.status).toBe('completed');
        expect(contract.acceptedAt).toBe(1700000000000);
        expect(contract.acceptedBy).toBe('knight-1');
        expect(contract.completedAt).toBe(1700000001000);
        expect(contract.completedBy).toBe('knight-1');
      });
    });

    describe('DelveProgress', () => {
      it('should create valid delve progress', () => {
        const delveProgress: DelveProgress = {
          clues: [
            {
              id: 'clue-1',
              type: 'swords',
              discoveredAt: 1700000000000,
              discoveredBy: 'knight-1',
            },
          ],
          objectives: [
            {
              id: 'obj-1',
              name: 'Sample Objective',
              description: 'Complete this objective.',
              status: 'active',
            },
          ],
          contracts: [
            {
              id: 'contract-1',
              name: 'Sample Contract',
              description: 'Accept this contract.',
              status: 'available',
            },
          ],
          exploredLocations: ['location-1', 'location-2'],
          currentLocation: 'location-2',
          threatTrack: {
            currentPosition: 0,
            maxPosition: 9,
          },
          timeTrack: {
            currentPosition: 1,
            maxPosition: 16,
          },
        };

        expect(delveProgress.clues).toHaveLength(1);
        expect(delveProgress.objectives).toHaveLength(1);
        expect(delveProgress.contracts).toHaveLength(1);
        expect(delveProgress.exploredLocations).toHaveLength(2);
        expect(delveProgress.currentLocation).toBe('location-2');
      });

      it('should create empty delve progress', () => {
        const delveProgress: DelveProgress = {
          clues: [],
          objectives: [],
          contracts: [],
          exploredLocations: [],
          threatTrack: {
            currentPosition: 0,
            maxPosition: 9,
          },
          timeTrack: {
            currentPosition: 1,
            maxPosition: 16,
          },
        };

        expect(delveProgress.clues).toEqual([]);
        expect(delveProgress.objectives).toEqual([]);
        expect(delveProgress.contracts).toEqual([]);
        expect(delveProgress.exploredLocations).toEqual([]);
        expect(delveProgress.currentLocation).toBeUndefined();
        expect(delveProgress.threatTrack.currentPosition).toBe(0);
        expect(delveProgress.threatTrack.maxPosition).toBe(9);
        expect(delveProgress.timeTrack.currentPosition).toBe(1);
        expect(delveProgress.timeTrack.maxPosition).toBe(16);
      });
    });
  });

  describe('ExpeditionState with DelveProgress', () => {
    it('should create expedition state with delve progress', () => {
      const expeditionState: ExpeditionState = {
        currentPhase: 'delve',
        knightChoices: [],
        phaseStartedAt: 1700000000000,
        delveProgress: {
          clues: [],
          objectives: [],
          contracts: [],
          exploredLocations: [],
          threatTrack: {
            currentPosition: 0,
            maxPosition: 9,
          },
          timeTrack: {
            currentPosition: 1,
            maxPosition: 16,
          },
        },
      };

      expect(expeditionState.currentPhase).toBe('delve');
      expect(expeditionState.delveProgress).toBeTruthy();
      expect(expeditionState.delveProgress?.clues).toEqual([]);
    });

    it('should handle expedition state without delve progress', () => {
      const expeditionState: ExpeditionState = {
        currentPhase: 'vision',
        knightChoices: [],
        phaseStartedAt: 1700000000000,
      };

      expect(expeditionState.delveProgress).toBeUndefined();
    });
  });
});
