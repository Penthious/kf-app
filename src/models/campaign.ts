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
  status: 'in-progress' | 'completed';
};

export type ExpeditionState = {
  currentPhase: ExpeditionPhase;
  knightChoices: KnightExpeditionChoice[];
  phaseStartedAt: number;
};

export type CampaignSettings = {
  fivePlayerMode: boolean;
  notes?: string;
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
