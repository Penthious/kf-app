export type MonsterTier = 0 | 1 | 2 | 3 | 4; // 0 = locked

export type KingdomMonster = { id: string; name: string };

export type RuleWhen = {
    // pick ONE of: exact or range; omit a field to ignore it
    q?: number;         // exact quests
    qMin?: number;      // inclusive
    qMax?: number;      // inclusive
    inv?: number;       // exact investigations
    invMin?: number;    // inclusive
    invMax?: number;    // inclusive
};

export type KingdomProgressRule = {
    order?: number; // optional explicit priority (higher wins)
    when: RuleWhen;
    // explicit mapping per monsterId; unspecified ids default to 0 (locked)
    tiersByMonster: Record<string, MonsterTier>;
};

export type KingdomAdventureDef = { id: string; name: string; repeatable: boolean };

export type KingdomCatalog = {
    kingdomId: string;
    name: string;
    monsters: KingdomMonster[];         // catalog order (UI only; logic uses ids)
    states: KingdomProgressRule[];      // rules keyed by (q, inv) conditions
    chapterAdvance?: { when: RuleWhen; toChapter: number };
    adventures: KingdomAdventureDef[];
};

// persisted in Campaign
export type KingdomAdventureState = { id: string; completedCount: number };
export type KingdomState = {
    kingdomId: string;
    name: string;
    chapter: number;
    adventures: KingdomAdventureState[];
};