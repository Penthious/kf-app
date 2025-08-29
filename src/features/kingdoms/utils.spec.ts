import type { BestiaryStageRow, KingdomCatalog } from '@/models/kingdom';
import { describe, expect, it } from 'vitest';
import { normalizeRow, progressKey, resolveStagesForBestiary } from './utils';

describe('progressKey', () => {
  it('returns 0 when quest is not completed and no investigations done', () => {
    expect(progressKey(false, 0)).toBe(0);
  });

  it('returns 0 when quest is completed but no investigations done', () => {
    expect(progressKey(true, 0)).toBe(0);
  });

  it('returns 1 when 1 investigation is done', () => {
    expect(progressKey(false, 1)).toBe(1);
    expect(progressKey(true, 1)).toBe(1);
  });

  it('returns 2 when 2 investigations are done', () => {
    expect(progressKey(false, 2)).toBe(2);
    expect(progressKey(true, 2)).toBe(2);
  });

  it('returns 2 when 3 investigations are done but quest is not completed', () => {
    expect(progressKey(false, 3)).toBe(2);
  });

  it('returns 3 when quest is completed and 3+ investigations are done', () => {
    expect(progressKey(true, 3)).toBe(3);
    expect(progressKey(true, 4)).toBe(3);
    expect(progressKey(true, 5)).toBe(3);
  });
});

describe('normalizeRow', () => {
  it('returns empty object when row is undefined', () => {
    const result = normalizeRow(undefined);
    expect(result).toEqual({});
  });

  it('returns empty object when row is null', () => {
    const result = normalizeRow(undefined);
    expect(result).toEqual({});
  });

  it('normalizes row with null values to 0', () => {
    const row: BestiaryStageRow = {
      'monster-1': 5,
      'monster-2': null,
      'monster-3': 10,
      'monster-4': null,
    };

    const result = normalizeRow(row);

    expect(result).toEqual({
      'monster-1': 5,
      'monster-2': 0,
      'monster-3': 10,
      'monster-4': 0,
    });
  });

  it('handles empty row', () => {
    const row: BestiaryStageRow = {};
    const result = normalizeRow(row);
    expect(result).toEqual({});
  });

  it('preserves valid numeric values', () => {
    const row: BestiaryStageRow = {
      'monster-1': 0,
      'monster-2': 1,
      'monster-3': 100,
      'monster-4': -5,
    };

    const result = normalizeRow(row);

    expect(result).toEqual({
      'monster-1': 0,
      'monster-2': 1,
      'monster-3': 100,
      'monster-4': -5,
    });
  });
});

describe('resolveStagesForBestiary', () => {
  const mockKingdom: KingdomCatalog = {
    id: 'test-kingdom',
    name: 'Test Kingdom',
    adventures: [],
    bestiary: {
      monsters: [],
      stages: [
        // Chapter 1 stages (0-3)
        { 'monster-1': 1, 'monster-2': 0 }, // Q
        { 'monster-1': 2, 'monster-2': 1 }, // I1
        { 'monster-1': 3, 'monster-2': 2 }, // I2
        { 'monster-1': 4, 'monster-2': 3 }, // I3
        // Chapter 2 stages (4-7)
        { 'monster-3': 1, 'monster-4': 0 }, // Q
        { 'monster-3': 2, 'monster-4': 1 }, // I1
        { 'monster-3': 3, 'monster-4': 2 }, // I2
        { 'monster-3': 4, 'monster-4': 3 }, // I3
      ],
    },
  } as KingdomCatalog;

  it('returns empty result when kingdom is undefined', () => {
    const result = resolveStagesForBestiary(undefined, 1, false, 0);
    expect(result).toEqual({ row: {}, hasChapter: false });
  });

  it('returns empty result when bestiary is undefined', () => {
    const kingdomWithoutBestiary: KingdomCatalog = {
      id: 'test-kingdom',
      name: 'Test Kingdom',
    } as KingdomCatalog;

    const result = resolveStagesForBestiary(kingdomWithoutBestiary, 1, false, 0);
    expect(result).toEqual({ row: {}, hasChapter: false });
  });

  it('returns empty result when stages is not an array', () => {
    const kingdomWithInvalidStages: KingdomCatalog = {
      id: 'test-kingdom',
      name: 'Test Kingdom',
      bestiary: {
        stages: 'not-an-array' as unknown as BestiaryStageRow[],
      },
    } as KingdomCatalog;

    const result = resolveStagesForBestiary(kingdomWithInvalidStages, 1, false, 0);
    expect(result).toEqual({ row: {}, hasChapter: false });
  });

  it('returns empty result when chapter is undefined', () => {
    const result = resolveStagesForBestiary(mockKingdom, undefined, false, 0);
    expect(result).toEqual({ row: {}, hasChapter: false });
  });

  it('returns empty result when chapter is 0', () => {
    const result = resolveStagesForBestiary(mockKingdom, 0, false, 0);
    expect(result).toEqual({ row: {}, hasChapter: false });
  });

  it('returns empty result when chapter is negative', () => {
    const result = resolveStagesForBestiary(mockKingdom, -1, false, 0);
    expect(result).toEqual({ row: {}, hasChapter: false });
  });

  it('returns empty result when stage index is out of bounds', () => {
    const result = resolveStagesForBestiary(mockKingdom, 3, false, 0);
    expect(result).toEqual({ row: {}, hasChapter: false });
  });

  it('correctly resolves Chapter 1, Quest stage (index 0)', () => {
    const result = resolveStagesForBestiary(mockKingdom, 1, false, 0);
    expect(result).toEqual({
      row: { 'monster-1': 1, 'monster-2': 0 },
      hasChapter: true,
    });
  });

  it('correctly resolves Chapter 1, I1 stage (index 1)', () => {
    const result = resolveStagesForBestiary(mockKingdom, 1, false, 1);
    expect(result).toEqual({
      row: { 'monster-1': 2, 'monster-2': 1 },
      hasChapter: true,
    });
  });

  it('correctly resolves Chapter 1, I2 stage (index 2)', () => {
    const result = resolveStagesForBestiary(mockKingdom, 1, false, 2);
    expect(result).toEqual({
      row: { 'monster-1': 3, 'monster-2': 2 },
      hasChapter: true,
    });
  });

  it('correctly resolves Chapter 1, I3 stage (index 3)', () => {
    const result = resolveStagesForBestiary(mockKingdom, 1, true, 3);
    expect(result).toEqual({
      row: { 'monster-1': 4, 'monster-2': 3 },
      hasChapter: true,
    });
  });

  it('correctly resolves Chapter 2, Quest stage (index 4)', () => {
    const result = resolveStagesForBestiary(mockKingdom, 2, false, 0);
    expect(result).toEqual({
      row: { 'monster-3': 1, 'monster-4': 0 },
      hasChapter: true,
    });
  });

  it('correctly resolves Chapter 2, I3 stage (index 7)', () => {
    const result = resolveStagesForBestiary(mockKingdom, 2, true, 3);
    expect(result).toEqual({
      row: { 'monster-3': 4, 'monster-4': 3 },
      hasChapter: true,
    });
  });

  it('handles stage with null values by normalizing them', () => {
    const kingdomWithNulls: KingdomCatalog = {
      id: 'test-kingdom',
      name: 'Test Kingdom',
      adventures: [],
      bestiary: {
        monsters: [],
        stages: [{ 'monster-1': 1, 'monster-2': null, 'monster-3': null }],
      },
    } as KingdomCatalog;

    const result = resolveStagesForBestiary(kingdomWithNulls, 1, false, 0);
    expect(result).toEqual({
      row: { 'monster-1': 1, 'monster-2': 0, 'monster-3': 0 },
      hasChapter: true,
    });
  });

  it('calculates correct index for different chapters and progress', () => {
    // Chapter 1: (1-1) * 4 + progressKey = 0 + progressKey
    expect(resolveStagesForBestiary(mockKingdom, 1, false, 0)).toEqual({
      row: { 'monster-1': 1, 'monster-2': 0 },
      hasChapter: true,
    });

    // Chapter 2: (2-1) * 4 + progressKey = 4 + progressKey
    expect(resolveStagesForBestiary(mockKingdom, 2, false, 0)).toEqual({
      row: { 'monster-3': 1, 'monster-4': 0 },
      hasChapter: true,
    });

    // Chapter 2, I1: 4 + 1 = index 5
    expect(resolveStagesForBestiary(mockKingdom, 2, false, 1)).toEqual({
      row: { 'monster-3': 2, 'monster-4': 1 },
      hasChapter: true,
    });
  });
});
