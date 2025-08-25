// Typed loader + helpers for Kingdom catalogs (KEYED stages).
// Import JSON catalogs explicitly.
// Add more imports here as you create files under src/catalogs/kingdoms/
import pos from './principality-of-stone.json';
import ttsf from './ten-thousand-succulent-fears.json'

export type MonsterTier = 1 | 2 | 3 | 4;
export type MonsterId =
    | 'ratwolves' | 'winged-nightmare' | 'paleblood-worms' | 'pumpkinhead-monstrosities'
    | 'knight-of-the-fen' | 'ironcast-dead' | 'eggknight'
    | 'puppet-king-edelhardt' | 'devil-of-the-smelted-fears' | 'panzerdragon-veldr';

export type Monster = { id: MonsterId | string; name: string };

// Each row is an object keyed by monsterId; values are 1..4 or null
export type StageRow = Record<string, MonsterTier | null>;

export type Kingdom = {
    id: string;
    name: string;
    bestiary: {
        monsters: Monster[];    // column metadata (order for display only)
        stages: StageRow[];     // rows: keyed by monster id
    };
    adventures?: Array<{ id: string; name: string; repeatable: boolean; note?: string }>;
};

const REGISTRY_ARRAY = [pos, ttsf] as unknown as Kingdom[];

// Build a registry map and validate at load time (dev only)
export const KINGDOMS: Record<string, Kingdom> = Object.fromEntries(
    REGISTRY_ARRAY.map((k) => [k.id, k])
);

export function validateKingdom(kg: Kingdom) {
    const ids = new Set(kg.bestiary.monsters.map((m) => m.id));
    kg.bestiary.stages.forEach((row, rIdx) => {
        // Warn if unknown keys or missing known keys
        Object.keys(row).forEach((key) => {
            if (!ids.has(key)) {
                // eslint-disable-next-line no-console
                console.warn(`[${kg.id}] stages[${rIdx}] has unknown monsterId '${key}'`);
            }
        });
        kg.bestiary.monsters.forEach((m) => {
            const v = row[m.id as string];
            if (
                v !== null &&
                v !== 1 && v !== 2 && v !== 3 && v !== 4 &&
                v !== undefined // allow undefined while you finish rows
            ) {
                throw new Error(`[${kg.id}] stages[${rIdx}]['${m.id}'] must be null | 1..4, got ${String(v)}`);
            }
        });
    });
}

if (__DEV__) {
    Object.values(KINGDOMS).forEach((kg) => {
        try { validateKingdom(kg); } catch (e) { console.warn(String(e)); }
    });
}

// Helper: compute unlocked monsters for a stage index (returns name + tier)
export function getUnlockedMonsters(kg: Kingdom, stageIndex: number) {
    const row = kg.bestiary.stages[stageIndex];
    if (!row) return [];
    return kg.bestiary.monsters
        .map((m) => {
            const tier = (row[m.id as string] ?? null) as MonsterTier | null;
            return tier === null ? null : { monster: m, tier };
        })
        .filter(Boolean) as Array<{ monster: Monster; tier: MonsterTier }>;
}