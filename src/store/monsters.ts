import { MONSTERS } from '@/catalogs/monsters';
import type { MonsterStats } from '@/models/monster';
import { create } from 'zustand';

export type MonstersState = {
    all: ReadonlyArray<MonsterStats>;
    byId: Readonly<Record<string, MonsterStats>>;
};

type MonstersActions = {
    // In case catalogs change at runtime or get fetched later
    load: (list: ReadonlyArray<MonsterStats>) => void;
};

function indexById(list: ReadonlyArray<MonsterStats>): Readonly<Record<string, MonsterStats>> {
    const map: Record<string, MonsterStats> = {};
    for (const m of list) map[m.id] = m;
    return Object.freeze(map);
}

export const useMonsters = create<MonstersState & MonstersActions>((set) => ({
    all: MONSTERS,
    byId: indexById(MONSTERS),
    load: (list) => set({ all: Object.freeze([...list]), byId: indexById(list) }),
}));

// Convenience selectors
export const selectMonsterById = (id?: string) => (s: MonstersState) =>
    (id ? s.byId[id] : undefined) as MonsterStats | undefined;

export const selectMonsterName = (id?: string) => (s: MonstersState) =>
    (id && s.byId[id]?.name) || id || 'Unknown';