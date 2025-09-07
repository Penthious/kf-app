// --- helpers ---
import type { KnightExpeditionChoice } from '@/models/campaign';
import { BestiaryStageRow, KingdomCatalog } from '@/models/kingdom';

export function progressKey(questCompleted: boolean, invsDone: number): 0 | 1 | 2 | 3 {
  if (questCompleted && invsDone >= 3) return 3; // I3
  if (invsDone >= 2) return 2; // I2
  if (invsDone >= 1) return 1; // I1
  return 0; // Q
}

export function normalizeRow(row?: BestiaryStageRow): Record<string, number> {
  const out: Record<string, number> = {};
  if (!row) return out;
  for (const [k, v] of Object.entries(row)) out[k] = v ?? 0;
  return out;
}

/** Resolve the "current stage row" for a bestiary with flat stages:
 * index = (chapter-1)*4 + progressKey(Q/I1/I2/I3)
 */
export function resolveStagesForBestiary(
  kingdom: KingdomCatalog | undefined,
  chapter: number | undefined,
  questCompleted: boolean,
  invsDone: number
): { row: Record<string, number>; hasChapter: boolean } {
  const b = kingdom?.bestiary;
  if (!b || !Array.isArray(b.stages) || !chapter || chapter <= 0)
    return { row: {}, hasChapter: false };
  const idx = (chapter - 1) * 4 + progressKey(questCompleted, invsDone);
  const row = b.stages[idx];
  return row ? { row: normalizeRow(row), hasChapter: true } : { row: {}, hasChapter: false };
}

/**
 * Calculate the monster stage index based on expedition choices.
 * This is used during expeditions to determine which monster stage to use
 * based on the party leader's selected quest/investigation choice.
 *
 * Logic:
 * - Quest (first time): index 0
 * - First investigation: index 1
 * - Quest (after 1 investigation): index 1
 * - Second investigation: index 2
 * - Quest (after 2 investigations): index 2
 * - Third investigation: index 3
 * - Quest (after 3 investigations): index 3
 * - Chapter 2 starts at index 4, etc.
 */
export function calculateExpeditionMonsterStage(
  partyLeaderChoice: KnightExpeditionChoice | undefined,
  partyLeaderChapter: number,
  allKnightChoices: KnightExpeditionChoice[]
): number {
  if (!partyLeaderChoice || partyLeaderChoice.choice === 'free-roam') {
    return 0; // Default to first stage for free-roam
  }

  // Count how many investigations the party leader has attempted in their current chapter
  const partyLeaderInvestigationsAttempted = allKnightChoices
    .filter(choice => choice.knightUID === partyLeaderChoice.knightUID)
    .filter(choice => choice.choice === 'investigation').length;

  let stageIndex = 0;

  if (partyLeaderChoice.choice === 'quest') {
    // For quest, use the number of investigations attempted
    stageIndex = partyLeaderInvestigationsAttempted;
  } else if (partyLeaderChoice.choice === 'investigation') {
    // For investigation, use investigations attempted + 1
    stageIndex = partyLeaderInvestigationsAttempted + 1;
  }

  // Add chapter offset: each chapter has 4 stages (0-3, 4-7, 8-11, etc.)
  const chapterOffset = (partyLeaderChapter - 1) * 4;

  return chapterOffset + stageIndex;
}

/**
 * Resolve the monster stage row for an expedition based on party leader's choices.
 * This is the expedition-specific version of resolveStagesForBestiary.
 */
export function resolveExpeditionStagesForBestiary(
  kingdom: KingdomCatalog | undefined,
  partyLeaderChoice: KnightExpeditionChoice | undefined,
  partyLeaderChapter: number,
  allKnightChoices: KnightExpeditionChoice[]
): { row: Record<string, number>; hasChapter: boolean; stageIndex: number } {
  const b = kingdom?.bestiary;
  if (!b || !Array.isArray(b.stages) || !partyLeaderChapter || partyLeaderChapter <= 0)
    return { row: {}, hasChapter: false, stageIndex: 0 };

  const stageIndex = calculateExpeditionMonsterStage(
    partyLeaderChoice,
    partyLeaderChapter,
    allKnightChoices
  );

  const row = b.stages[stageIndex];
  return row
    ? { row: normalizeRow(row), hasChapter: true, stageIndex }
    : { row: {}, hasChapter: false, stageIndex };
}
