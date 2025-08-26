import { shallow } from 'zustand/shallow';
import { useMemo } from 'react';
import {getMemberSets} from "@/features/knights/types";
import { useCampaigns, type CampaignsState, type CampaignsActions } from '@/store/campaigns';
import { useKnights, type KnightsState, type KnightsActions } from '@/store/knights';

// ---- Campaign state selectors ----
export const useCampaignMap = () =>
  useCampaigns((s: CampaignsState) => s.campaigns);

export const useCurrentCampaignId = () =>
  useCampaigns((s: any) => s.currentCampaignId);

// ---- Campaign actions (grab once, no subscription) ----
export const useCampaignActions = () => {
  const api = useCampaigns; // bound store fn
  // Return a stable object; actions don't need reactivity
  const s = api.getState() as CampaignsActions;
  return {
    benchMember: s.benchMember,
    removeMember: s.removeMember,
    setPartyLeader: s.setPartyLeader,
    addKnightToCampaign: s.addKnightToCampaign,
    replaceCatalogKnight: s.replaceCatalogKnight,
    addKnightAsBenched: s.addKnightAsBenched,
  };
};

// ---- Knights state selectors ----
export const useKnightsMap = () =>
  useKnights((s: KnightsState) => s.knightsById);

// ---- Knights actions (grab once, no subscription) ----
export const useKnightActions = () => {
  const api = useKnights;
  const s = api.getState() as KnightsActions;
  return { addKnight: s.addKnight };
};


export const useKnightsLists = (campaignId?: string) => {
    const campaigns = useCampaignMap();
    const knightsById = useKnightsMap();

    const c = campaignId ? campaigns[campaignId] : undefined;
    const activeSlots = c?.settings.fivePlayerMode ? 5 : 4;

    const base = useMemo(() => getMemberSets(c), [c]);
    const { active, benched, byUID, activeCatalogIds } = base;

    const availableKnights = useMemo(
        () => Object.values(knightsById).filter(k => !byUID.has(k.knightUID)),
        [knightsById, byUID]
    );

    // UI-ready lists
    const lineupItems = useMemo(
        () => active.map(m => ({
            knightUID: m.knightUID,
            name: knightsById[m.knightUID]?.name ?? m.displayName,
            isLeader: c?.partyLeaderUID === m.knightUID,
        })),
        [active, knightsById, c?.partyLeaderUID]
    );

    const benchedItems = useMemo(
        () => benched.map(m => ({
            knightUID: m.knightUID,
            name: knightsById[m.knightUID]?.name ?? m.displayName,
            catalogId: m.catalogId,
        })),
        [benched, knightsById]
    );

    const availableItems = useMemo(
        () => availableKnights.map(k => ({
            knightUID: k.knightUID,
            name: k.name,
            catalogId: k.catalogId,
        })),
        [availableKnights]
    );

    return {
        campaign: c,
        activeSlots,
        activeCatalogIds,
        // raw sets if you need them
        active, benched, availableKnights,
        // UI lists
        lineupItems, benchedItems, availableItems,
    };
};