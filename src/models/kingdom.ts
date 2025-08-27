export type KingdomMonster = { id: string; name: string };
export type BestiaryStageRow = Record<string, number | null>;

export type Bestiary = {
    monsters: KingdomMonster[];
    stages: BestiaryStageRow[];
};


/**
 * Adventure catalog entry:
 * - name: display name
 * - roll: inclusive range that triggers this adventure
 * - singleAttempt: true if it can only be attempted once (not repeatable)
 */
export type KingdomAdventureDef = {
    name: string;
    roll: RollRange;
    singleAttempt: boolean;
};

/**
 * Inclusive roll range for an adventure (e.g., 2..5 on a d6)
 */
export type RollRange = { min: number; max: number };

export type KingdomCatalog = {
    id: string;
    name: string;
    bestiary: Bestiary;
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