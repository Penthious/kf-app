import type { KnightSheet } from '@/models/knight';
import { Tier } from '@/catalogs/tier';

/**
 * Calculate a knight's tier based on their quest and investigation progress.
 *
 * Progression:
 * - Mob (starting tier)
 * - Vassal (1 quest + 3 investigations completed)
 * - King (2 quests + 6 investigations completed)
 * - Devil (3 quests + 9 investigations completed)
 * - Dragon (4 quests + 12 investigations completed)
 * - Legendary (5 quests + 15 investigations completed)
 */
export function calculateKnightTier(knightSheet: KnightSheet): Tier {
  const chapters = Object.values(knightSheet.chapters || {});

  // Count completed quests
  const completedQuests = chapters.filter(chapter => chapter.quest?.completed).length;

  // Count completed investigations
  const completedInvestigations = chapters.reduce((total, chapter) => {
    return total + (chapter.completed?.length || 0);
  }, 0);

  // Determine tier based on progression
  if (completedQuests >= 5 && completedInvestigations >= 15) {
    return Tier.legendary;
  } else if (completedQuests >= 4 && completedInvestigations >= 12) {
    return Tier.dragon;
  } else if (completedQuests >= 3 && completedInvestigations >= 9) {
    return Tier.devil;
  } else if (completedQuests >= 2 && completedInvestigations >= 6) {
    return Tier.king;
  } else if (completedQuests >= 1 && completedInvestigations >= 3) {
    return Tier.vassal;
  } else {
    return Tier.mob;
  }
}

/**
 * Get all contract tiers that a knight can select based on their current tier.
 * Knights can select contracts up to and including their current tier.
 */
export function getAvailableContractTiers(knightTier: Tier): Tier[] {
  const allTiers = [Tier.mob, Tier.vassal, Tier.king, Tier.devil, Tier.dragon, Tier.legendary];
  const currentTierIndex = allTiers.indexOf(knightTier);

  // Return all tiers up to and including the current tier
  return allTiers.slice(0, currentTierIndex + 1);
}
