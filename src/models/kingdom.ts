export type KingdomMonster = {
  id: string;
  type: 'kingdom' | 'wandering';
  expansion?: 'ttsf'; // optional expansion requirement
  stages?: (number | null)[]; // stage data for expansion monsters
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
 * Contract catalog entry:
 * - name: display name
 * - objective: what the contract requires
 * - setup: detailed setup text
 * - reward: what you get for completing it
 * - tier: difficulty tier (mob, vassal, king, devil, dragon)
 * - singleAttempt: true if it can only be attempted once (not repeatable)
 * - unlocked: true if this contract is available (for Jura contracts progression)
 */
export type KingdomContractDef = {
  name: string;
  objective: string;
  setup: string;
  reward: string;
  tier: 'mob' | 'vassal' | 'king' | 'devil' | 'dragon';
  singleAttempt: boolean;
  unlocked?: boolean; // Only used for Jura contracts
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
  contracts?: KingdomContractDef[]; // Optional for backward compatibility
  accessCondition: 'sunken-only' | 'pos-only';
};

export type KingdomCatalog = {
  id: string;
  name: string;
  type: 'main';
  bestiary: Bestiary;
  adventures: KingdomAdventureDef[];
  contracts?: KingdomContractDef[]; // Optional for backward compatibility
  districts: string[]; // District names in order for the district wheel
  subKingdoms?: SubKingdomCatalog[];
  expansions?: {
    ttsf?: {
      enabled: boolean;
      additionalMonsters: KingdomMonster[];
      additionalAdventures?: KingdomAdventureDef[];
      additionalContracts?: KingdomContractDef[];
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

    // Add expansion monsters to stages where they're naturally available
    const updatedStages = baseStages.map((stage, index) => {
      const stageWithExpansions = { ...stage };
      expansionMonsters.forEach(monster => {
        // Only add the monster if it's naturally available at this stage
        // Use the stage data directly from the monster object
        if (
          monster.stages &&
          monster.stages[index] !== null &&
          monster.stages[index] !== undefined
        ) {
          stageWithExpansions[monster.id] = monster.stages[index];
        }
      });
      return stageWithExpansions;
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
export type KingdomContractState = { id: string; completed: boolean };
export type KingdomState = {
  kingdomId: string;
  name: string;
  chapter: number;
  adventures: KingdomAdventureState[];
  contracts?: KingdomContractState[];
};
