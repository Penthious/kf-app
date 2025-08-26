import type { Campaign } from '@/models/campaign';
import type { Knight } from '@/models/knight';
import {KnightsById, MemberSets, LineupItem, AvailableKnight} from "@/features/knights/types";

/**
 * Derive UI-friendly sets from a campaign and the full knights dictionary.
 * Pure, no store access and no mutation.
 */
export function getMemberSets(campaign: Campaign | undefined, knightsById: KnightsById): MemberSets {
    const empty: MemberSets = {
        active: [],
        benched: [],
        available: [],
        byUID: new Set(),
        activeCatalogIds: new Set(),
    };
    if (!campaign) return empty;

    const byUID = new Set<string>();
    const activeCatalogIds = new Set<string>();

    const active: LineupItem[] = [];
    const benched: LineupItem[] = [];

    for (const m of campaign.members ?? []) {
        byUID.add(m.knightUID);
        const k = knightsById[m.knightUID];
        const name = k?.name ?? m.displayName ?? 'Unknown Knight';
        const catalogId = k?.catalogId ?? m.catalogId ?? 'unknown';
        const isLeader = campaign.partyLeaderUID === m.knightUID;

        const item: LineupItem = { knightUID: m.knightUID, name, catalogId, isLeader };

        if (m.isActive) {
            active.push(item);
            activeCatalogIds.add(catalogId);
        } else {
            benched.push(item);
        }
    }

    // Any knights not in campaign are "available" to add
    const available: AvailableKnight[] = Object.values(knightsById)
        .filter((k): k is Knight => !!k)
        .filter(k => !byUID.has(k.knightUID))
        .map(k => ({ knightUID: k.knightUID, name: k.name, catalogId: k.catalogId }));

    return { active, benched, available, byUID, activeCatalogIds };
}