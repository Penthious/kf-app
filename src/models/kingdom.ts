export type KingdomMonster = {
  id: string;
  type: 'kingdom' | 'wandering';
  expansion?: 'ttsf'; // optional expansion requirement
};

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

export type SubKingdomCatalog = {
  id: string;
  name: string;
  parentKingdomId: string;
  bestiary: Bestiary;
  adventures: KingdomAdventureDef[];
  accessCondition: 'sunken-only' | 'pos-only';
};

export type KingdomCatalog = {
  id: string;
  name: string;
  type: 'main';
  bestiary: Bestiary;
  adventures: KingdomAdventureDef[];
  districts: string[]; // District names in order for the district wheel
  subKingdoms?: SubKingdomCatalog[];
  expansions?: {
    ttsf?: {
      enabled: boolean;
      additionalMonsters: KingdomMonster[];
      additionalAdventures?: KingdomAdventureDef[];
    };
  };
};

// Utility function to generate stage rows from monster stage arrays
export function createStageRows(
  stageArrays: Array<Record<string, (number | null)[]>>,
  stageCount: number = 20
): BestiaryStageRow[] {
  return Array.from({ length: stageCount }, (_, index) => {
    const stageRow: BestiaryStageRow = {};
    for (const stageArray of stageArrays) {
      for (const [monsterId, stages] of Object.entries(stageArray)) {
        stageRow[monsterId] = stages[index];
      }
    }
    return stageRow;
  });
}

// Utility function to create stages by merging kingdom-specific stages with shared wandering stages
export function createSubKingdomStages(
  kingdomStages: Array<Record<string, number | null>>,
  wanderingStages: BestiaryStageRow[]
): BestiaryStageRow[] {
  return kingdomStages.map((kingdomStage, index) => ({
    ...kingdomStage,
    ...wanderingStages[index],
  }));
}

// Utility function to get the complete bestiary including expansion monsters
export function getBestiaryWithExpansions(
  kingdom: KingdomCatalog,
  campaignExpansions?: { ttsf?: { enabled: boolean } }
): Bestiary {
  // Handle kingdoms without bestiary
  if (!kingdom.bestiary) {
    return { monsters: [], stages: [] };
  }

  const baseMonsters = kingdom.bestiary.monsters;
  const baseStages = kingdom.bestiary.stages;

  // If TTSF is enabled in campaign settings, add expansion monsters
  if (campaignExpansions?.ttsf?.enabled && kingdom.expansions?.ttsf?.additionalMonsters) {
    const expansionMonsters = kingdom.expansions.ttsf.additionalMonsters;
    const allMonsters = [...baseMonsters, ...expansionMonsters];

    // Add expansion monsters to stage 0 (first stage)
    const updatedStages = baseStages.map((stage, index) => {
      if (index === 0) {
        // Stage 0 - add expansion monsters
        const stageWithExpansions = { ...stage };
        expansionMonsters.forEach(monster => {
          stageWithExpansions[monster.id] = 1; // Add to stage 0
        });
        return stageWithExpansions;
      }
      return stage;
    });

    return {
      monsters: allMonsters,
      stages: updatedStages,
    };
  }

  return kingdom.bestiary;
}

// persisted in Campaign
export type KingdomAdventureState = { id: string; completedCount: number };
export type KingdomState = {
  kingdomId: string;
  name: string;
  chapter: number;
  adventures: KingdomAdventureState[];
};
