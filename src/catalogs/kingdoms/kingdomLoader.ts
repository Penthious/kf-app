import pos from './principality-of-stone.json';
import ttsf from './ten-thousand-succulent-fears.json';

export type MonsterRef = { id: string; name: string };
export type StageRow = Record<string, number>;
export type ChapterStages = {
    stages?: { Q?: StageRow; I1?: StageRow; I2?: StageRow; I3?: StageRow };
    _rows?: Array<{ progress: 'Q' | 'I1' | 'I2' | 'I3'; rows: StageRow }>;
};
export type Adventure = { id: string; name: string; repeatable?: boolean; note?: string };

export type KingdomCatalog = {
    id: string;
    name: string;
    monsters: MonsterRef[];
    chapters: Record<string, ChapterStages>;
    adventures?: Adventure[];
};

// ✅ Canonical array export
export const allKingdomsCatalog: KingdomCatalog[] = [
    pos as unknown as KingdomCatalog,
    ttsf as unknown as KingdomCatalog,
];

// Helpful accessors (optional)
export const kingdomsById: Record<string, KingdomCatalog> = Object.fromEntries(
    allKingdomsCatalog.map(k => [k.id, k])
);

export function getAllKingdomsCatalog(): KingdomCatalog[] {
    return allKingdomsCatalog;
}