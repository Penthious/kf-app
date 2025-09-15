import { describe, expect, it } from '@jest/globals';
import { Tier } from '@/catalogs/tier';
import { calculateKnightTier, getAvailableContractTiers } from './knight-tier';
import type { KnightSheet } from '@/models/knight';

describe('knight-tier', () => {
  describe('calculateKnightTier', () => {
    const createKnightSheet = (chapters: Record<string, any> = {}): KnightSheet => ({
      virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
      vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
      bane: 0,
      sighOfGraal: 0,
      gold: 0,
      leads: 0,
      clues: 0,
      chapter: 1,
      chapters,
      prologueDone: false,
      postgameDone: false,
      firstDeath: false,
      choiceMatrix: {},
      choiceMatrixNotes: {},
      saints: [],
      mercenaries: [],
      armory: [],
      notes: [],
      cipher: 0,
    });

    const createChapter = (
      questCompleted = false,
      attempts: any[] = [],
      completed: string[] = []
    ) => ({
      quest: questCompleted ? { completed: true, outcome: 'pass' as const } : undefined,
      attempts,
      completed,
    });

    const createAttempt = (code: string, result: 'pass' | 'fail', lead = false) => ({
      code,
      result,
      lead,
      at: Date.now(),
    });

    it('returns mob tier for new knight with no progress', () => {
      const knightSheet = createKnightSheet();
      expect(calculateKnightTier(knightSheet)).toBe(Tier.mob);
    });

    it('returns mob tier for knight with 0 quests and 0 investigations', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(false, [], []),
      });
      expect(calculateKnightTier(knightSheet)).toBe(Tier.mob);
    });

    it('returns mob tier for knight with 1 quest but only 2 investigations', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(
          true,
          [createAttempt('I1-1', 'pass'), createAttempt('I1-2', 'fail')],
          ['I1-1']
        ),
      });
      expect(calculateKnightTier(knightSheet)).toBe(Tier.mob);
    });

    it('returns vassal tier for knight with 1 quest and 3 investigations', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(
          true,
          [
            createAttempt('I1-1', 'pass'),
            createAttempt('I1-2', 'fail'),
            createAttempt('I1-3', 'pass', true),
          ],
          ['I1-1']
        ),
      });
      expect(calculateKnightTier(knightSheet)).toBe(Tier.vassal);
    });

    it('returns vassal tier for knight with 1 quest and more than 3 investigations (capped at 3 per chapter)', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(
          true,
          [
            createAttempt('I1-1', 'pass'),
            createAttempt('I1-2', 'fail'),
            createAttempt('I1-3', 'pass', true),
            createAttempt('I1-4', 'pass'),
            createAttempt('I1-5', 'fail'),
          ],
          ['I1-1', 'I1-4']
        ),
      });
      expect(calculateKnightTier(knightSheet)).toBe(Tier.vassal);
    });

    it('returns king tier for knight with 2 quests and 6 investigations', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(
          true,
          [
            createAttempt('I1-1', 'pass'),
            createAttempt('I1-2', 'fail'),
            createAttempt('I1-3', 'pass', true),
          ],
          ['I1-1']
        ),
        '2': createChapter(
          true,
          [
            createAttempt('I2-1', 'pass'),
            createAttempt('I2-2', 'fail'),
            createAttempt('I2-3', 'pass', true),
          ],
          ['I2-1']
        ),
      });
      expect(calculateKnightTier(knightSheet)).toBe(Tier.king);
    });

    it('returns devil tier for knight with 3 quests and 9 investigations', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(
          true,
          [
            createAttempt('I1-1', 'pass'),
            createAttempt('I1-2', 'fail'),
            createAttempt('I1-3', 'pass', true),
          ],
          ['I1-1']
        ),
        '2': createChapter(
          true,
          [
            createAttempt('I2-1', 'pass'),
            createAttempt('I2-2', 'fail'),
            createAttempt('I2-3', 'pass', true),
          ],
          ['I2-1']
        ),
        '3': createChapter(
          true,
          [
            createAttempt('I3-1', 'pass'),
            createAttempt('I3-2', 'fail'),
            createAttempt('I3-3', 'pass', true),
          ],
          ['I3-1']
        ),
      });
      expect(calculateKnightTier(knightSheet)).toBe(Tier.devil);
    });

    it('returns dragon tier for knight with 4 quests and 12 investigations', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(
          true,
          [
            createAttempt('I1-1', 'pass'),
            createAttempt('I1-2', 'fail'),
            createAttempt('I1-3', 'pass', true),
          ],
          ['I1-1']
        ),
        '2': createChapter(
          true,
          [
            createAttempt('I2-1', 'pass'),
            createAttempt('I2-2', 'fail'),
            createAttempt('I2-3', 'pass', true),
          ],
          ['I2-1']
        ),
        '3': createChapter(
          true,
          [
            createAttempt('I3-1', 'pass'),
            createAttempt('I3-2', 'fail'),
            createAttempt('I3-3', 'pass', true),
          ],
          ['I3-1']
        ),
        '4': createChapter(
          true,
          [
            createAttempt('I4-1', 'pass'),
            createAttempt('I4-2', 'fail'),
            createAttempt('I4-3', 'pass', true),
          ],
          ['I4-1']
        ),
      });
      expect(calculateKnightTier(knightSheet)).toBe(Tier.dragon);
    });

    it('returns legendary tier for knight with 5 quests and 15 investigations', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(
          true,
          [
            createAttempt('I1-1', 'pass'),
            createAttempt('I1-2', 'fail'),
            createAttempt('I1-3', 'pass', true),
          ],
          ['I1-1']
        ),
        '2': createChapter(
          true,
          [
            createAttempt('I2-1', 'pass'),
            createAttempt('I2-2', 'fail'),
            createAttempt('I2-3', 'pass', true),
          ],
          ['I2-1']
        ),
        '3': createChapter(
          true,
          [
            createAttempt('I3-1', 'pass'),
            createAttempt('I3-2', 'fail'),
            createAttempt('I3-3', 'pass', true),
          ],
          ['I3-1']
        ),
        '4': createChapter(
          true,
          [
            createAttempt('I4-1', 'pass'),
            createAttempt('I4-2', 'fail'),
            createAttempt('I4-3', 'pass', true),
          ],
          ['I4-1']
        ),
        '5': createChapter(
          true,
          [
            createAttempt('I5-1', 'pass'),
            createAttempt('I5-2', 'fail'),
            createAttempt('I5-3', 'pass', true),
          ],
          ['I5-1']
        ),
      });
      expect(calculateKnightTier(knightSheet)).toBe(Tier.legendary);
    });

    it('handles duplicate investigation codes correctly (counts unique attempts)', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(
          true,
          [
            createAttempt('I1-1', 'pass'),
            createAttempt('I1-1', 'fail'), // Duplicate code
            createAttempt('I1-2', 'pass', true),
          ],
          ['I1-1']
        ),
      });
      // Should count 2 unique investigations (I1-1 and I1-2), not 3 total attempts
      expect(calculateKnightTier(knightSheet)).toBe(Tier.mob);
    });

    it('handles empty attempts array', () => {
      const knightSheet = createKnightSheet({
        '1': createChapter(true, [], []),
      });
      expect(calculateKnightTier(knightSheet)).toBe(Tier.mob);
    });

    it('handles undefined chapters', () => {
      const knightSheet = createKnightSheet(undefined);
      expect(calculateKnightTier(knightSheet)).toBe(Tier.mob);
    });
  });

  describe('getAvailableContractTiers', () => {
    it('returns only mob tier for mob knight', () => {
      expect(getAvailableContractTiers(Tier.mob)).toEqual([Tier.mob]);
    });

    it('returns mob and vassal tiers for vassal knight', () => {
      expect(getAvailableContractTiers(Tier.vassal)).toEqual([Tier.mob, Tier.vassal]);
    });

    it('returns mob, vassal, and king tiers for king knight', () => {
      expect(getAvailableContractTiers(Tier.king)).toEqual([Tier.mob, Tier.vassal, Tier.king]);
    });

    it('returns mob through devil tiers for devil knight', () => {
      expect(getAvailableContractTiers(Tier.devil)).toEqual([
        Tier.mob,
        Tier.vassal,
        Tier.king,
        Tier.devil,
      ]);
    });

    it('returns mob through dragon tiers for dragon knight', () => {
      expect(getAvailableContractTiers(Tier.dragon)).toEqual([
        Tier.mob,
        Tier.vassal,
        Tier.king,
        Tier.devil,
        Tier.dragon,
      ]);
    });

    it('returns all tiers for legendary knight', () => {
      expect(getAvailableContractTiers(Tier.legendary)).toEqual([
        Tier.mob,
        Tier.vassal,
        Tier.king,
        Tier.devil,
        Tier.dragon,
        Tier.legendary,
      ]);
    });
  });
});
