import { create } from 'zustand';

// ---- Types ----
export type CampaignMember = {
    knightUID: string;
    catalogId: string;      // stable id like 'renholder'
    displayName: string;    // friendly name like 'Renholder'
    isActive: boolean;
};

export type CampaignSettings = {
    fivePlayerMode: boolean;
    notes?: string;
};

export type Campaign = {
    campaignId: string;
    name: string;
    members: CampaignMember[];
    settings: CampaignSettings;
    partyLeaderKnightUID?: string;
    createdAt: number;
    updatedAt: number;
};

type Conflict = { conflict: { existingUID: string } };

type CampaignsState = {
    campaigns: Record<string, Campaign>;
};

type CampaignsActions = {
    // create / delete / rename
    addCampaign: (campaignId: string, name: string) => void;
    renameCampaign: (campaignId: string, name: string) => void;
    removeCampaign: (campaignId: string) => void;

    // settings
    setFivePlayerMode: (campaignId: string, on: boolean) => void;
    setNotes: (campaignId: string, notes: string) => void;

    // roster
    addKnightToCampaign: (
        campaignId: string,
        knightUID: string,
        meta?: { catalogId: string; displayName: string }
    ) => {} | Conflict;

    /** Add (or ensure) the knight exists in the campaign **as benched**. Idempotent. */
    addKnightAsBenched: (
        campaignId: string,
        knightUID: string,
        meta?: { catalogId: string; displayName: string }
    ) => void;

    /** Swap in the new knight as the active member for that catalogId. The previous active is benched. */
    replaceCatalogKnight: (campaignId: string, catalogId: string, newKnightUID: string, meta?: { displayName?: string }) => void;

    /** Bench or activate an existing member by UID. */
    benchMember: (campaignId: string, knightUID: string, bench: boolean) => void;

    /** Remove a member entirely from the campaign. */
    removeMember: (campaignId: string, knightUID: string) => void;

    /** Set party leader (must be a member; will be activated if benched). */
    setPartyLeader: (campaignId: string, knightUID: string) => void;
};

export const useCampaigns = create<CampaignsState & CampaignsActions>((set, get) => ({
    campaigns: {},

    // ---- CRUD ----
    addCampaign: (campaignId, name) =>
        set((s) => {
            const now = Date.now();
            const c: Campaign = {
                campaignId,
                name,
                members: [],
                settings: { fivePlayerMode: false },
                createdAt: now,
                updatedAt: now,
            };
            return { campaigns: { ...s.campaigns, [campaignId]: c } };
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
            return { campaigns: next };
        }),

    // ---- Settings ----
    setFivePlayerMode: (campaignId, on) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: { ...c, settings: { ...c.settings, fivePlayerMode: on }, updatedAt: Date.now() },
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
                    [campaignId]: { ...c, settings: { ...c.settings, notes }, updatedAt: Date.now() },
                },
            };
        }),

    // ---- Roster helpers ----
    addKnightToCampaign: (campaignId, knightUID, meta) => {
        let conflict: Conflict | {} = {};
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            const { catalogId = 'unknown', displayName = 'Unknown Knight' } = meta ?? {};

            const already = c.members.find((m) => m.knightUID === knightUID);
            if (already) {
                // If already a member, ensure active (if not) and return.
                already.isActive = true;
                return { campaigns: { ...s.campaigns, [campaignId]: { ...c, members: [...c.members], updatedAt: Date.now() } } };
            }

            // uniqueness by catalog among active members
            const activeSame = c.members.find((m) => m.isActive && m.catalogId === catalogId);
            if (activeSame) {
                conflict = { conflict: { existingUID: activeSame.knightUID } };
                // DO NOT add automatically; caller will decide to replace or bench.
                return {};
            }

            const member: CampaignMember = { knightUID, catalogId, displayName, isActive: true };
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
                if (existing.isActive) existing.isActive = false; // ensure benched
                return { campaigns: { ...s.campaigns, [campaignId]: { ...c, members: [...c.members], updatedAt: Date.now() } } };
            }
            const { catalogId = 'unknown', displayName = 'Unknown Knight' } = meta ?? {};
            const member: CampaignMember = { knightUID, catalogId, displayName, isActive: false };
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
                const newMember: CampaignMember = { knightUID: newKnightUID, catalogId, displayName, isActive: true };
                members.push(newMember);
            }

            if (currentActive && currentActive.knightUID !== newKnightUID) {
                // Bench the previous active
                members[currentActiveIdx] = { ...currentActive, isActive: false };
            }

            // If the party leader was the one we benched, keep leader as the new one
            const newLeader =
                c.partyLeaderKnightUID && c.partyLeaderKnightUID === currentActive?.knightUID
                    ? newKnightUID
                    : c.partyLeaderKnightUID;

            return {
                campaigns: {
                    ...s.campaigns,
                    [campaignId]: { ...c, members, partyLeaderKnightUID: newLeader, updatedAt: now },
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
            const leader = c.partyLeaderKnightUID === knightUID && bench ? undefined : c.partyLeaderKnightUID;
            return { campaigns: { ...s.campaigns, [campaignId]: { ...c, members, partyLeaderKnightUID: leader, updatedAt: Date.now() } } };
        }),

    removeMember: (campaignId, knightUID) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            const members = c.members.filter((m) => m.knightUID !== knightUID);
            const leader = c.partyLeaderKnightUID === knightUID ? undefined : c.partyLeaderKnightUID;
            return { campaigns: { ...s.campaigns, [campaignId]: { ...c, members, partyLeaderKnightUID: leader, updatedAt: Date.now() } } };
        }),

    setPartyLeader: (campaignId, knightUID) =>
        set((s) => {
            const c = s.campaigns[campaignId];
            if (!c) return {};
            const idx = c.members.findIndex((m) => m.knightUID === knightUID);
            if (idx < 0) return {};
            const members = [...c.members];
            // ensure leader is active
            members[idx] = { ...members[idx], isActive: true };
            return { campaigns: { ...s.campaigns, [campaignId]: { ...c, members, partyLeaderKnightUID: knightUID, updatedAt: Date.now() } } };
        }),
}));