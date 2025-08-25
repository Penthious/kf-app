// src/store/campaigns.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Campaign } from '@/models/campaign';
import { useKnights } from '@/store/knights';
import type { KingdomCatalog, MonsterTier } from '@/models/kingdom';
import { allKingdomCatalogs } from '@/catalogs/kingdoms';

type CampaignsState = {
    campaigns: Record<string, Campaign>;

    // campaign meta
    addCampaign: (name: string, id?: string) => Campaign;
    renameCampaign: (id: string, name: string) => void;
    removeCampaign: (id: string) => void;

    // settings
    setFivePlayerMode: (id: string, on: boolean) => void;
    setNotes: (id: string, notes: string) => void;

    // roster (the ones you lost)
    addKnightToCampaign: (id: string, knightUID: string) => { conflict?: { existingUID: string } } | {};
    replaceCatalogKnight: (id: string, catalogId: string, newKnightUID: string) => void;
    benchMember: (id: string, knightUID: string, benched: boolean) => void;
    removeMember: (id: string, knightUID: string) => void;

    // leader + selected kingdom
    setPartyLeader: (id: string, knightUID: string) => void;
    setSelectedKingdom: (id: string, kingdomId: string) => void;

    // adventures
    toggleAdventure: (id: string, kingdomId: string, adventureId: string) => void;
    setAdventureCount: (id: string, kingdomId: string, adventureId: string, count: number) => void;

    // selector
    selectKingdomRosterForLeader: (campaignId: string, catalog: KingdomCatalog) =>
        { id: string; name: string; tier: MonsterTier }[];
};

export const useCampaigns = create<CampaignsState>()(
    persist(
        (set, get) => ({
            campaigns: {},

            // ---------- Campaign meta ----------
            addCampaign: (name, id) => {
                const campaignId = id ?? Math.random().toString(36).slice(2);
                const now = Date.now();

                // Precreate adventures for ALL known kingdoms (always available)
                const kingdoms = allKingdomCatalogs.map((kc) => ({
                    kingdomId: kc.kingdomId,
                    name: kc.name,
                    chapter: 1,
                    adventures: (kc.adventures ?? []).map((a) => ({ id: a.id, completedCount: 0 })),
                }));

                const c: Campaign = {
                    campaignId,
                    name,
                    createdAt: now,
                    updatedAt: now,
                    settings: { fivePlayerMode: false, notes: '' },
                    members: [],
                    kingdoms,
                    partyLeaderKnightUID: undefined,
                    selectedKingdomId: allKingdomCatalogs[0]?.kingdomId,
                };

                set((s) => ({ campaigns: { ...s.campaigns, [campaignId]: c } }));
                return c;
            },

            renameCampaign: (id, name) =>
                set((s) => {
                    const c = s.campaigns[id];
                    if (!c) return {};
                    return {
                        campaigns: { ...s.campaigns, [id]: { ...c, name, updatedAt: Date.now() } },
                    };
                }),

            removeCampaign: (id) =>
                set((s) => {
                    const copy = { ...s.campaigns };
                    delete copy[id];
                    return { campaigns: copy };
                }),

            // ---------- Settings ----------
            setFivePlayerMode: (id, on) =>
                set((s) => {
                    const c = s.campaigns[id];
                    if (!c) return {};
                    return {
                        campaigns: {
                            ...s.campaigns,
                            [id]: { ...c, settings: { ...c.settings, fivePlayerMode: on }, updatedAt: Date.now() },
                        },
                    };
                }),

            setNotes: (id, notes) =>
                set((s) => {
                    const c = s.campaigns[id];
                    if (!c) return {};
                    return {
                        campaigns: {
                            ...s.campaigns,
                            [id]: { ...c, settings: { ...c.settings, notes }, updatedAt: Date.now() },
                        },
                    };
                }),

            // ---------- Roster ----------
            addKnightToCampaign: (id, knightUID) => {
                const s = get();
                const c = s.campaigns[id];
                if (!c) return {};
                const k = useKnights.getState().knightsById[knightUID];
                if (!k) return {};

                // Enforce unique catalogId among ACTIVE members
                const existing = c.members.find((m) => m.isActive && m.catalogId === k.catalogId);
                if (existing) {
                    return { conflict: { existingUID: existing.knightUID } };
                }

                const member = {
                    knightUID,
                    displayName: k.name,
                    catalogId: k.catalogId,
                    isActive: true,
                    joinedAt: Date.now(),
                };

                const updated: Campaign = {
                    ...c,
                    members: [...c.members, member],
                    updatedAt: Date.now(),
                };

                set({ campaigns: { ...s.campaigns, [id]: updated } });
                return {};
            },

            replaceCatalogKnight: (id, catalogId, newKnightUID) => {
                const s = get();
                const c = s.campaigns[id];
                if (!c) return;
                const k = useKnights.getState().knightsById[newKnightUID];
                if (!k) return;

                // Bench any active member with the same catalogId
                const membersBenched = c.members.map((m) =>
                    m.catalogId === catalogId && m.isActive ? { ...m, isActive: false } : m
                );

                // Activate the new one (or add if not present)
                const already = membersBenched.find((m) => m.knightUID === newKnightUID);
                const nextMembers = already
                    ? membersBenched.map((m) =>
                        m.knightUID === newKnightUID ? { ...m, isActive: true } : m
                    )
                    : [
                        ...membersBenched,
                        {
                            knightUID: newKnightUID,
                            displayName: k.name,
                            catalogId: k.catalogId,
                            isActive: true,
                            joinedAt: Date.now(),
                        },
                    ];

                set({
                    campaigns: {
                        ...s.campaigns,
                        [id]: { ...c, members: nextMembers, updatedAt: Date.now() },
                    },
                });
            },

            benchMember: (id, knightUID, benched) =>
                set((s) => {
                    const c = s.campaigns[id];
                    if (!c) return {};
                    return {
                        campaigns: {
                            ...s.campaigns,
                            [id]: {
                                ...c,
                                members: c.members.map((m) =>
                                    m.knightUID === knightUID ? { ...m, isActive: !benched } : m
                                ),
                                updatedAt: Date.now(),
                            },
                        },
                    };
                }),

            removeMember: (id, knightUID) =>
                set((s) => {
                    const c = s.campaigns[id];
                    if (!c) return {};
                    return {
                        campaigns: {
                            ...s.campaigns,
                            [id]: {
                                ...c,
                                members: c.members.filter((m) => m.knightUID !== knightUID),
                                updatedAt: Date.now(),
                            },
                        },
                    };
                }),

            // ---------- Leader & Selected Kingdom ----------
            setPartyLeader: (id, knightUID) =>
                set((s) => {
                    const c = s.campaigns[id];
                    if (!c) return {};
                    return {
                        campaigns: {
                            ...s.campaigns,
                            [id]: { ...c, partyLeaderKnightUID: knightUID, updatedAt: Date.now() },
                        },
                    };
                }),

            setSelectedKingdom: (id, kingdomId) =>
                set((s) => {
                    const c = s.campaigns[id];
                    if (!c) return {};
                    return {
                        campaigns: {
                            ...s.campaigns,
                            [id]: { ...c, selectedKingdomId: kingdomId, updatedAt: Date.now() },
                        },
                    };
                }),

            // ---------- Adventures ----------
            toggleAdventure: (id, kingdomId, adventureId) =>
                set((s) => {
                    const c = s.campaigns[id];
                    if (!c) return {};
                    const idx = c.kingdoms.findIndex((k) => k.kingdomId === kingdomId);
                    if (idx < 0) return {};
                    const ks = c.kingdoms[idx];
                    const adv = ks.adventures.find((a) => a.id === adventureId);
                    if (!adv) return {};
                    const next = { ...adv, completedCount: adv.completedCount ? 0 : 1 };
                    const kingdoms = [...c.kingdoms];
                    kingdoms[idx] = {
                        ...ks,
                        adventures: ks.adventures.map((a) => (a.id === adventureId ? next : a)),
                    };
                    return {
                        campaigns: { ...s.campaigns, [id]: { ...c, kingdoms, updatedAt: Date.now() } },
                    };
                }),

            setAdventureCount: (id, kingdomId, adventureId, count) =>
                set((s) => {
                    const c = s.campaigns[id];
                    if (!c) return {};
                    const idx = c.kingdoms.findIndex((k) => k.kingdomId === kingdomId);
                    if (idx < 0) return {};
                    const ks = c.kingdoms[idx];
                    const kingdoms = [...c.kingdoms];
                    kingdoms[idx] = {
                        ...ks,
                        adventures: ks.adventures.map((a) =>
                            a.id === adventureId ? { ...a, completedCount: Math.max(0, count) } : a
                        ),
                    };
                    return {
                        campaigns: { ...s.campaigns, [id]: { ...c, kingdoms, updatedAt: Date.now() } },
                    };
                }),

            // ---------- Selector: Leader-driven roster from id-keyed rules ----------
            selectKingdomRosterForLeader: (campaignId, catalog) => {
                const { campaigns } = get();
                const camp = campaigns[campaignId];
                if (!camp) return [];

                // derive q/inv from leader's current chapter
                let q: 0 | 1 | 2 | 3 | 4 = 0;
                let inv: 0 | 1 | 2 | 3 | 4 = 0;
                const leaderId = camp.partyLeaderKnightUID;
                if (leaderId) {
                    const k = useKnights.getState().knightsById[leaderId];
                    if (k) {
                        const ch = Math.max(0, Math.min(4, k.sheet.chapter ?? 0));
                        const chData = (k.sheet.investigations?.[ch] as any) ?? { attempts: [], completed: [] };
                        q = chData.questCompleted ? 1 : 0;
                        inv = Math.min(4, (chData.completed ?? []).length) as 0 | 1 | 2 | 3 | 4;
                    }
                }

                // rule matcher
                const matches = (when: any) => {
                    const qOk =
                        (when.q === undefined || q === when.q) &&
                        (when.qMin === undefined || q >= when.qMin) &&
                        (when.qMax === undefined || q <= when.qMax);
                    const invOk =
                        (when.inv === undefined || inv === when.inv) &&
                        (when.invMin === undefined || inv >= when.invMin) &&
                        (when.invMax === undefined || inv <= when.invMax);
                    return qOk && invOk;
                };

                // choose single best rule: highest order, then highest inv, then highest q
                const candidates = (catalog.states || []).filter((r) => matches(r.when));
                candidates.sort((a, b) => {
                    const ao = a.order ?? 0,
                        bo = b.order ?? 0;
                    if (ao !== bo) return bo - ao;
                    const ai = (a.when.inv ?? a.when.invMax ?? a.when.invMin ?? 0);
                    const bi = (b.when.inv ?? b.when.invMax ?? b.when.invMin ?? 0);
                    if (ai !== bi) return bi - ai;
                    const aq = (a.when.q ?? a.when.qMax ?? a.when.qMin ?? 0);
                    const bq = (b.when.q ?? b.when.qMax ?? b.when.qMin ?? 0);
                    return bq - aq;
                });

                const chosen = candidates[0];
                const tiersById: Record<string, MonsterTier> = chosen?.tiersByMonster ?? {};

                // return array aligned to catalog.monsters for UI
                return catalog.monsters.map((m) => ({
                    id: m.id,
                    name: m.name,
                    tier: (tiersById[m.id] ?? 0) as MonsterTier,
                }));
            },
        }),
        { name: 'campaigns-store' }
    )
);