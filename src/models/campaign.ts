import type { KingdomState } from '@/models/kingdom';

export type CampaignMember = {
    knightUID: string;
    displayName: string;
    catalogId: string;
    isActive: boolean;
    joinedAt: number;
    isLeader?: boolean
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
};

export type CampaignsState = {
    campaigns: Record<string, Campaign>;
    currentCampaignId?: string;
};
