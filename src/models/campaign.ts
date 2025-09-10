import type { DistrictWheel } from '@/models/district';
import type { KingdomState } from '@/models/kingdom';

export type CampaignMember = {
  knightUID: string;
  displayName: string;
  catalogId: string;
  isActive: boolean;
  joinedAt: number;
  isLeader?: boolean;
};

export type ExpeditionPhase =
  | 'vision'
  | 'outpost'
  | 'delve'
  | 'clash'
  | 'rest'
  | 'second-delve'
  | 'second-clash'
  | 'spoils';

export type KnightExpeditionChoice = {
  knightUID: string;
  choice: 'quest' | 'investigation' | 'free-roam';
  questId?: string; // if choice is 'quest'
  investigationId?: string; // if choice is 'investigation'
  status: 'in-progress' | 'completed' | 'failed';
  completedAt?: number;
  failedAt?: number;
  successDetails?: string; // details about how it was completed
  failureDetails?: string; // details about why it failed
};

export type ClueType = 'swords' | 'faces' | 'eye' | 'book';

export type Clue = {
  id: string;
  type: ClueType;
  discoveredAt: number;
  discoveredBy: string; // knightUID
};

export type Objective = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed';
  completedAt?: number;
  completedBy?: string; // knightUID
};

export type Contract = {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'accepted' | 'completed';
  acceptedAt?: number;
  acceptedBy?: string; // knightUID
  completedAt?: number;
  completedBy?: string; // knightUID
};

export type DelveProgress = {
  clues: Clue[];
  objectives: Objective[];
  contracts: Contract[];
  exploredLocations: string[]; // location IDs
  currentLocation?: string; // current location ID
  threatTrack: {
    currentPosition: number;
    maxPosition: number;
  };
  timeTrack: {
    currentPosition: number;
    maxPosition: number;
  };
  curseTracker: {
    currentPosition: number;
    maxPosition: number;
  };
};

export type ClashResult = {
  type: 'exhibition' | 'full';
  outcome: 'victory' | 'defeat';
  completedAt: number;
  woundsDealt: number;
  woundsReceived: number;
  specialEffects?: string[]; // any special effects from the clash
};

export type RestPhaseProgress = {
  restAbilitiesUsed: string[]; // technique cards with Rest keyword
  resourceTokensDiscarded: number;
  monsterRotationPerformed: boolean;
  campfireTaleResolved?: {
    taleId: string;
    rapportBonus: number;
    result: string;
  };
};

export type LootCard = {
  id: string;
  type: 'kingdom-gear' | 'upgrade' | 'consumable-gear' | 'exhibition-clash' | 'full-clash';
  source: string; // where it was obtained
  obtainedAt: number;
  obtainedBy: string; // knightUID
  exchangedFor?: 'gold' | 'gear';
  exchangedAt?: number;
  gearCardId?: string; // if exchanged for gear
};

export type SpoilsProgress = {
  lootDeck: LootCard[];
  goldEarned: number;
  gearAcquired: string[]; // gear card IDs
  questCompletions: {
    knightUID: string;
    choice: KnightExpeditionChoice;
    completionStatus: 'success' | 'failure';
    rewards?: string[]; // any special rewards
  }[];
};

export type ExpeditionState = {
  currentPhase: ExpeditionPhase;
  knightChoices: KnightExpeditionChoice[];
  phaseStartedAt: number;
  districtWheel?: DistrictWheel;
  delveProgress?: DelveProgress;
  clashResults?: ClashResult[];
  restProgress?: RestPhaseProgress;
  spoilsProgress?: SpoilsProgress;
};

export type CampaignSettings = {
  fivePlayerMode: boolean;
  notes?: string;
  expansions?: {
    ttsf?: {
      enabled: boolean;
    };
    tbbh?: {
      enabled: boolean;
    };
    trkoe?: {
      enabled: boolean;
    };
    'absolute-bastard'?: {
      enabled: boolean;
    };
    'ser-gallant'?: {
      enabled: boolean;
    };
  };
};

export type Campaign = {
  campaignId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  settings: CampaignSettings;
  members: CampaignMember[];

  partyLeaderUID?: string;

  selectedKingdomId?: string;

  kingdoms: KingdomState[];

  expedition?: ExpeditionState;
};

export type CampaignsState = {
  campaigns: Record<string, Campaign>;
  currentCampaignId?: string;
};
