export type MonsterRef = { id: string; name: string };
export type StageRowRaw = Record<string, number | null>;
export type Bestiary = { monsters: MonsterRef[]; stages: StageRowRaw[] };
export type Adventure = { id: string; name: string; repeatable?: boolean; note?: string };

export type KingdomCatalog = {
    id: string;
    name: string;
    bestiary?: Bestiary;
    adventures?: Adventure[];
};

// --- helpers ---
export function progressKey(questCompleted: boolean, invsDone: number): 0 | 1 | 2 | 3 {
    if (questCompleted && invsDone >= 3) return 3; // I3
    if (invsDone >= 2) return 2;                   // I2
    if (invsDone >= 1) return 1;                   // I1
    return 0;                                      // Q
}

export function normalizeRow(row?: StageRowRaw): Record<string, number> {
    const out: Record<string, number> = {};
    if (!row) return out;
    for (const [k, v] of Object.entries(row)) out[k] = v ?? 0;
    return out;
}

/** Resolve the “current stage row” for a bestiary with flat stages:
 * index = (chapter-1)*4 + progressKey(Q/I1/I2/I3)
 */
export function resolveStagesForBestiary(
    kingdom: KingdomCatalog | undefined,
    chapter: number | undefined,
    questCompleted: boolean,
    invsDone: number
): { row: Record<string, number>; hasChapter: boolean } {
    const b = kingdom?.bestiary;
    if (!b || !Array.isArray(b.stages) || !chapter || chapter <= 0) return { row: {}, hasChapter: false };
    const idx = (chapter - 1) * 4 + progressKey(questCompleted, invsDone);
    const row = b.stages[idx];
    return row ? { row: normalizeRow(row), hasChapter: true } : { row: {}, hasChapter: false };
}