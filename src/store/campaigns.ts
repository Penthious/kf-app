// src/store/campaigns.ts
import type {Campaign, CampaignMember} from "@/models/campaign";
import { create } from 'zustand';
import type { KingdomState, KingdomAdventureState } from '@/models/kingdom';



type Conflict = { conflict: { existingUID: string } };

export type CampaignsState = {
    campaigns: Record<string, Campaign>;
    currentCampaignId?: string;
};

export type CampaignsActions = {
    // app navigation helpers (optional)
    openCampaign: (campaignId: string) => void;
    closeCampaign: () => void;

    // create / delete / rename
    addCampaign: (campaignId: string, name: string) => void;
    renameCampaign: (campaignId: string, name: string) => void;
    removeCampaign: (campaignId: string) => void;
    setCurrentCampaignId: (id: string) => void;

    // settings
    setFivePlayerMode: (campaignId: string, on: boolean) => void;
    setNotes: (campaignId: string, notes: string) => void;

    // roster
    addKnightToCampaign: (
        campaignId: string,
        knightUID: string,
        meta?: { catalogId: string; displayName: string }
    ) => object | Conflict;

    /** Add (or ensure) the knight exists in the campaign **as benched**. Idempotent. */
    addKnightAsBenched: (
        campaignId: string,
        knightUID: string,
        meta?: { catalogId: string; displayName: string }
    ) => void;

    /** Swap in the new knight as the active member for that catalogId. The previous active is benched. */
    replaceCatalogKnight: (
        campaignId: string,
        catalogId: string,
        newKnightUID: string,
        meta?: { displayName?: string }
    ) => void;

    /** Bench or activate an existing member by UID. */
    benchMember: (campaignId: string, knightUID: string, bench: boolean) => void;

    /** Remove a member entirely from the campaign. */
    removeMember: (campaignId: string, knightUID: string) => void;

    /** Set party leader (must be a member; will be activated if benched). */
    setPartyLeader: (campaignId: string, knightUID: string) => void;
    unsetPartyLeader: (campaignId: string) => void;

    /**
     * Record progress for a kingdom adventure.
     * - singleAttempt: when true, marks as completed (count = 1, idempotent).
     * - delta: increment amount for repeatable adventures (default 1).
     */
    setAdventureProgress: (
        campaignId: string,
        kingdomId: string,
        adventureId: string,
        opts?: { singleAttempt?: boolean; delta?: number }
    ) => void;

};

// Ensure a member exists; if adding, fill required fields.
const ensureMember = (
    members: CampaignMember[] | undefined,
    knightUID: string,
    meta?: { catalogId?: string; displayName?: string },
): CampaignMember[] => {
    const list = Array.isArray(members) ? members.map(m => ({ ...m })) : [];
    const idx = list.findIndex(m => m.knightUID === knightUID);
    if (idx >= 0) return list;
    const { catalogId = 'unknown', displayName = 'Unknown Knight' } = meta ?? {};
    return [...list, {
        knightUID, catalogId, displayName, isActive: true, isLeader: false,
        joinedAt: 0
    }];
};

export const useCampaigns = create<CampaignsState & CampaignsActions>((set, get) => ({
    campaigns: {},
    currentCampaignId: undefined,

    // ---- app nav helpers (optional, useful for tabs fallback) ----
    openCampaign: (campaignId) => set(() => ({ currentCampaignId: campaignId })),
    closeCampaign: () => set(() => ({ currentCampaignId: undefined })),

    // ---- CRUD ----
    addCampaign: (campaignId, name) =>
        set((s) => {
            const now = Date.now();
            const c: Campaign = {
                kingdoms: [],
                campaignId,
                name,
                members: [],
                settings: { fivePlayerMode: false },
                createdAt: now,
                updatedAt: now
            };
            return { campaigns: { ...s.campaigns, [campaignId]: c }, currentCampaignId: campaignId };
        }),

    renameCampaign: (campaignId, name) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: { ...c, name, updatedAt: Date.now() },
                },
            };
        }),

    removeCampaign: (campaignId) =>
        set((s) => {
            const next = { ...s.campaigns };
            delete next[campaignId];
            const currentCampaignId =
                s.currentCampaignId === campaignId ? undefined : s.currentCampaignId;
            return { campaigns: next, currentCampaignId };
        }),
    setCurrentCampaignId: (campaignId) => set({currentCampaignId: campaignId}),

    // ---- Settings ----
    setFivePlayerMode: (campaignId, on) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: {
                        ...c,
                        settings: { ...c.settings, fivePlayerMode: on },
                        updatedAt: Date.now(),
                    },
                },
            };
        }),

    setNotes: (campaignId, notes) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: {
                        ...c,
                        settings: { ...c.settings, notes },
                        updatedAt: Date.now(),
                    },
                },
            };
        }),

    // ---- Roster helpers ----
    addKnightToCampaign: (campaignId, knightUID, meta) => {
        let conflict: Conflict | object = {};
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            const { catalogId = 'unknown', displayName = 'Unknown Knight' } = meta ?? {};

            const already = c.members.find((m) => m.knightUID === knightUID);
            if (already) {
                // ensure active
                const members = c.members.map((m) =>
                    m.knightUID === knightUID ? { ...m, isActive: true } : m
                );
                return {
                    campaigns: {
                        ...s.campaigns,
                        [campaignId]: { ...c, members, updatedAt: Date.now() },
                    },
                };
            }

            // uniqueness by catalog among active members
            const activeSame = c.members.find((m) => m.isActive && m.catalogId === catalogId);
            if (activeSame) {
                conflict = { conflict: { existingUID: activeSame.knightUID } };
                return {};
            }

            const member: CampaignMember = {
                joinedAt: 0,
                knightUID,
                catalogId,
                displayName,
                isActive: true
            };
            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: { ...c, members: [...c.members, member], updatedAt: Date.now() },
                },
            };
        });
        return conflict;
    },

    addKnightAsBenched: (campaignId, knightUID, meta) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            const existing = c.members.find((m) => m.knightUID === knightUID);
            if (existing) {
                const members = c.members.map((m) =>
                    m.knightUID === knightUID ? { ...m, isActive: false } : m
                );
                return {
                    campaigns: { ...s.campaigns, [campaignId]: { ...c, members, updatedAt: Date.now() } },
                };
            }
            const { catalogId = 'unknown', displayName = 'Unknown Knight' } = meta ?? {};
            const member: CampaignMember = {joinedAt: 0, knightUID, catalogId, displayName, isActive: false };
            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: { ...c, members: [...c.members, member], updatedAt: Date.now() },
                },
            };
        }),

    replaceCatalogKnight: (campaignId, catalogId, newKnightUID, meta) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            const now = Date.now();

            const currentActiveIdx = c.members.findIndex((m) => m.isActive && m.catalogId === catalogId);
            const currentActive = currentActiveIdx >= 0 ? c.members[currentActiveIdx] : undefined;

            const existingIdx = c.members.findIndex((m) => m.knightUID === newKnightUID);
            const displayName = meta?.displayName ?? 'Unknown Knight';

            let members = [...c.members];

            if (existingIdx >= 0) {
                // Make this one active
                members[existingIdx] = { ...members[existingIdx], isActive: true, catalogId };
            } else {
                // Insert as new active
                const newMember: CampaignMember = {
                    joinedAt: 0,
                    knightUID: newKnightUID, catalogId, displayName, isActive: true };
                members.push(newMember);
            }

            if (currentActive && currentActive.knightUID !== newKnightUID) {
                // Bench the previous active
                members[currentActiveIdx] = { ...currentActive, isActive: false };
            }

            // Keep leader pointing to the new one if we replaced the former leader
            const nextLeader =
                c.partyLeaderUID && c.partyLeaderUID === currentActive?.knightUID
                    ? newKnightUID
                    : c.partyLeaderUID;

            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: { ...c, members, partyLeaderUID: nextLeader, updatedAt: now },
                },
            };
        }),

    benchMember: (campaignId, knightUID, bench) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            const idx = c.members.findIndex((m) => m.knightUID === knightUID);
            if (idx < 0) return {};
            const members = [...c.members];
            members[idx] = { ...members[idx], isActive: !bench };
            const leader = c.partyLeaderUID === knightUID && bench ? undefined : c.partyLeaderUID;
            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: { ...c, members, partyLeaderUID: leader, updatedAt: Date.now() },
                },
            };
        }),

    removeMember: (campaignId, knightUID) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            const members = c.members.filter((m) => m.knightUID !== knightUID);
            const leader = c.partyLeaderUID === knightUID ? undefined : c.partyLeaderUID;
            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: { ...c, members, partyLeaderUID: leader, updatedAt: Date.now() },
                },
            };
        }),

    setPartyLeader: (campaignId: string, knightUID: string) =>
        set((s) => {
            const c = s.campaigns?.[campaignId];
            if (!c || !knightUID) return {};

            // ensure membership (fill minimal meta if needed)
            const members1 = ensureMember(c.members, knightUID);
            // activate the leader if benched
            const members2 = members1.map((m) =>
                m.knightUID === knightUID ? { ...m, isActive: true, isLeader: true } : { ...m, isLeader: false }
            );

            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: {
                        ...c,
                        members: members2,
                        partyLeaderUID: knightUID,
                        updatedAt: Date.now(),
                    },
                },
            };
        }),

    unsetPartyLeader: (campaignId: string) =>
        set((s) => {
            const c = s.campaigns?.[campaignId];
            if (!c) return {};
            const members = (c.members ?? []).map((m) => ({ ...m, isLeader: false }));
            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: { ...c, members, partyLeaderUID: undefined, updatedAt: Date.now() },
                },
            };
        }),

    setAdventureProgress: (campaignId, kingdomId, adventureId, opts) => {
        const { singleAttempt = false, delta = 1 } = opts ?? {};
        const s = get();
        const c = s.campaigns[campaignId];
        if (!c) return;

        const kingdoms: KingdomState[] = Array.isArray(c.kingdoms) ? [...c.kingdoms] : [];

        let kIdx = kingdoms.findIndex(k => k.kingdomId === kingdomId);
        if (kIdx === -1) {
            kingdoms.push({
                kingdomId,
                name: '',
                chapter: 1,
                adventures: [],
            });
            kIdx = kingdoms.length - 1;
        }

        const ks = { ...kingdoms[kIdx] };

        const computeNext = (cur: number) =>
            singleAttempt ? (cur >= 1 ? 1 : 1) : Math.max(0, cur + delta);

        // Array shape: KingdomAdventureState[]
        if (Array.isArray(ks.adventures)) {
            const advs: KingdomAdventureState[] = [...(ks.adventures as KingdomAdventureState[])];
            const idx = advs.findIndex(a => a.id === adventureId);
            const cur = idx === -1 ? 0 : advs[idx].completedCount;
            const next = computeNext(cur);
            const updated: KingdomAdventureState = { id: adventureId, completedCount: next };
            if (idx === -1) advs.push(updated);
            else advs[idx] = updated;
            ks.adventures = advs;
        } else {
            // Record shape: Record<string, number> | Record<string, { completedCount: number }>
            const advRec: Record<string, any> = { ...(ks.adventures as Record<string, any>) };
            const curRaw = advRec[adventureId];
            const cur = typeof curRaw === 'number'
                ? curRaw
                : (curRaw && typeof curRaw === 'object' ? Number(curRaw.completedCount ?? 0) : 0);
            const next = computeNext(cur);
            // store as number for compactness
            advRec[adventureId] = next;
            ks.adventures = advRec as any;
        }

        kingdoms[kIdx] = ks;

        set({
            campaigns: {
                ...s.campaigns,
                [campaignId]: {
                    ...c,
                    kingdoms,
                    updatedAt: Date.now(),
                },
            },
        });
    },

}));