import type { Campaign, CampaignMember } from '@/models/campaign';
import type { Knight } from '@/models/knight';

export type KnightsById = Record<string, Knight>;

export type MemberSets = {
    active: CampaignMember[];
    benched: CampaignMember[];
    byUID: Set<string>;
    activeCatalogIds: Set<string>;
};

export function getMemberSets(c?: Campaign): MemberSets {
    const members = c?.members ?? [];
    const active = members.filter(m => m.isActive);
    const benched = members.filter(m => !m.isActive);

    return {
        active,
        benched,
        byUID: new Set(members.map(m => m.knightUID)),
        activeCatalogIds: new Set(active.map(m => m.catalogId)),
    };
}

export type AddExistingKnightsProps = {
    list: Array<{ knightUID: string; name: string; catalogId: string }>;
    onAddActive: (knightUID: string) => void;
    onBench: (knightUID: string) => void;
};

export type BenchedListProps = {
    list: Array<{ knightUID: string; name: string; catalogId: string }>;
    activeCatalogIds: Set<string>;
    onActivate: (knightUID: string) => void;
    onRemove: (knightUID: string) => void;
    onEdit: (knightUID: string) => void;
};

export type ActiveLineupProps = {
    list: Array<{ knightUID: string; name: string; isLeader?: boolean }>;
    maxSlots: number;
    onSetLeader: (knightUID: string) => void;
    onBench: (knightUID: string) => void;
    onEdit: (knightUID: string) => void;
};