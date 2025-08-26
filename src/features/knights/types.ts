import type { Knight } from '@/models/knight';

export type KnightsById = Record<string, Knight>;

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

// ---- shared types for UI lists ----
export type LineupItem = {
    knightUID: string;
    name: string;
    catalogId: string;
    isLeader?: boolean;
};

export type AvailableKnight = {
    knightUID: string;
    name: string;
    catalogId: string;
};

export type MemberSets = {
    /** Active lineup, decorated for UI. */
    active: LineupItem[];
    /** Benched members, decorated for UI. */
    benched: LineupItem[];
    /** Knights you could add (in this profile) but aren’t in the campaign yet. */
    available: AvailableKnight[];
    /** Fast lookups for membership & uniqueness checks. */
    byUID: Set<string>;
    activeCatalogIds: Set<string>;
};
