import type { CampaignsState } from '@/models/campaign';
import type { MonsterStats } from '@/models/monster';
import type { KnightsState } from './knights';
import type { MonstersState } from './monsters';

// Campaign Selectors
export const selectCampaignById = (campaignId: string) => (state: CampaignsState) =>
  state.campaigns[campaignId];

export const selectCurrentCampaign = (state: CampaignsState) =>
  state.currentCampaignId ? state.campaigns[state.currentCampaignId] : undefined;

export const selectCampaignMembers = (campaignId: string) => (state: CampaignsState) =>
  state.campaigns[campaignId]?.members ?? [];

export const selectActiveMembers = (campaignId: string) => (state: CampaignsState) =>
  state.campaigns[campaignId]?.members.filter(m => m.isActive) ?? [];

export const selectBenchedMembers = (campaignId: string) => (state: CampaignsState) =>
  state.campaigns[campaignId]?.members.filter(m => !m.isActive) ?? [];

export const selectPartyLeader = (campaignId: string) => (state: CampaignsState) =>
  state.campaigns[campaignId]?.members.find(m => m.isLeader);

export const selectMemberByKnightUID =
  (campaignId: string, knightUID: string) => (state: CampaignsState) =>
    state.campaigns[campaignId]?.members.find(m => m.knightUID === knightUID);

export const selectCampaignKingdoms = (campaignId: string) => (state: CampaignsState) =>
  state.campaigns[campaignId]?.kingdoms ?? [];

export const selectCampaignAdventures =
  (campaignId: string, kingdomId: string) => (state: CampaignsState) =>
    state.campaigns[campaignId]?.kingdoms.find(k => k.kingdomId === kingdomId)?.adventures ?? [];

// Knight Selectors
export const selectKnightById = (knightUID: string) => (state: KnightsState) =>
  state.knightsById[knightUID];

export const selectKnightSheet = (knightUID: string) => (state: KnightsState) =>
  state.knightsById[knightUID]?.sheet;

export const selectKnightChapter = (knightUID: string, chapter: number) => (state: KnightsState) =>
  state.knightsById[knightUID]?.sheet.chapters[chapter];

export const selectKnightVirtues = (knightUID: string) => (state: KnightsState) =>
  state.knightsById[knightUID]?.sheet.virtues;

export const selectKnightVices = (knightUID: string) => (state: KnightsState) =>
  state.knightsById[knightUID]?.sheet.vices;

export const selectKnightAllies = (knightUID: string) => (state: KnightsState) => ({
  saints: state.knightsById[knightUID]?.sheet.saints ?? [],
  mercenaries: state.knightsById[knightUID]?.sheet.mercenaries ?? [],
});

export const selectKnightNotes = (knightUID: string) => (state: KnightsState) =>
  state.knightsById[knightUID]?.sheet.notes ?? [];

export const selectAllKnights = (state: KnightsState) => Object.values(state.knightsById);

export const selectKnightsByCatalogId = (catalogId: string) => (state: KnightsState) =>
  Object.values(state.knightsById).filter(k => k.catalogId === catalogId);

// Monster Selectors
export const selectMonsterById = (id?: string) => (state: MonstersState) =>
  (id ? state.byId[id] : undefined) as MonsterStats | undefined;

export const selectMonsterName = (id?: string) => (state: MonstersState) =>
  (id && state.byId[id]?.name) || id || 'Unknown';

export const selectAllMonsters = (state: MonstersState) => state.all;

export const selectMonstersByLevel = (level: number) => (state: MonstersState) =>
  state.all.filter(m => m.level === level);

// Combined Selectors
export const selectKnightWithMemberInfo =
  (campaignId: string, knightUID: string) =>
  (campaignsState: CampaignsState, knightsState: KnightsState) => {
    const member = selectMemberByKnightUID(campaignId, knightUID)(campaignsState);
    const knight = selectKnightById(knightUID)(knightsState);
    return { member, knight };
  };

export const selectActiveKnightMembers =
  (campaignId: string) => (campaignsState: CampaignsState, knightsState: KnightsState) => {
    const members = selectActiveMembers(campaignId)(campaignsState);
    return members
      .map(member => ({
        member,
        knight: selectKnightById(member.knightUID)(knightsState),
      }))
      .filter(item => item.knight);
  };

export const selectCampaignWithMembers =
  (campaignId: string) => (campaignsState: CampaignsState, knightsState: KnightsState) => {
    const campaign = selectCampaignById(campaignId)(campaignsState);
    if (!campaign) return undefined;

    const membersWithKnights = campaign.members
      .map(member => ({
        member,
        knight: selectKnightById(member.knightUID)(knightsState),
      }))
      .filter(item => item.knight);

    return {
      ...campaign,
      membersWithKnights,
    };
  };
