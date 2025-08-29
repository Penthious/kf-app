import type { Campaign } from '@/models/campaign';
import type { KingdomCatalog } from '@/models/kingdom';
import { describe, expect, it } from 'vitest';
import { buildKingdomView } from './kingdomView';

describe('buildKingdomView', () => {
  const mockKingdomCatalog: KingdomCatalog = {
    id: 'test-kingdom',
    name: 'Test Kingdom',
    adventures: [
      {
        name: 'First Adventure',
        singleAttempt: true,
        roll: { min: 1, max: 6 },
      },
      {
        name: 'Second Adventure',
        singleAttempt: false,
        roll: { min: 2, max: 10 },
      },
      {
        name: 'Third Adventure',
        singleAttempt: true,
        roll: { min: 3, max: 12 },
      },
    ],
    bestiary: {
      monsters: [],
      stages: [
        { 'monster-1': 1, 'monster-2': 0 },
        { 'monster-1': 2, 'monster-2': 1 },
      ],
    },
  } as KingdomCatalog;

  const mockCampaign: Campaign = {
    campaignId: 'campaign-1',
    name: 'Test Campaign',
    createdAt: 1234567890,
    updatedAt: 1234567890,
    settings: { fivePlayerMode: false },
    members: [],
    kingdoms: [
      {
        kingdomId: 'test-kingdom',
        name: 'Test Kingdom',
        chapter: 1,
        adventures: [
          { id: 'test-kingdom:first-adventure', completedCount: 1 },
          { id: 'test-kingdom:second-adventure', completedCount: 3 },
          { id: 'test-kingdom:third-adventure', completedCount: 0 },
        ],
      },
    ],
  } as Campaign;

  it('returns undefined when kingdom catalog is not found', () => {
    const result = buildKingdomView('non-existent-kingdom', mockCampaign, [mockKingdomCatalog]);
    expect(result).toBeUndefined();
  });

  it('returns undefined when catalogs array is empty', () => {
    const result = buildKingdomView('test-kingdom', mockCampaign, []);
    expect(result).toBeUndefined();
  });

  it('builds kingdom view with correct structure', () => {
    const result = buildKingdomView('test-kingdom', mockCampaign, [mockKingdomCatalog]);

    expect(result).toEqual({
      id: 'test-kingdom',
      name: 'Test Kingdom',
      adventures: [
        {
          name: 'First Adventure',
          singleAttempt: true,
          roll: { min: 1, max: 6 },
          id: 'test-kingdom:first-adventure',
          completedCount: 1,
          completed: true,
        },
        {
          name: 'Second Adventure',
          singleAttempt: false,
          roll: { min: 2, max: 10 },
          id: 'test-kingdom:second-adventure',
          completedCount: 3,
          completed: false,
        },
        {
          name: 'Third Adventure',
          singleAttempt: true,
          roll: { min: 3, max: 12 },
          id: 'test-kingdom:third-adventure',
          completedCount: 0,
          completed: false,
        },
      ],
      bestiary: mockKingdomCatalog.bestiary,
    });
  });

  it('handles campaign with no kingdoms', () => {
    const campaignWithoutKingdoms: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [],
      kingdoms: [],
    } as Campaign;

    const result = buildKingdomView('test-kingdom', campaignWithoutKingdoms, [mockKingdomCatalog]);

    expect(result?.adventures).toEqual([
      {
        name: 'First Adventure',
        singleAttempt: true,
        roll: { min: 1, max: 6 },
        id: 'test-kingdom:first-adventure',
        completedCount: 0,
        completed: false,
      },
      {
        name: 'Second Adventure',
        singleAttempt: false,
        roll: { min: 2, max: 10 },
        id: 'test-kingdom:second-adventure',
        completedCount: 0,
        completed: false,
      },
      {
        name: 'Third Adventure',
        singleAttempt: true,
        roll: { min: 3, max: 12 },
        id: 'test-kingdom:third-adventure',
        completedCount: 0,
        completed: false,
      },
    ]);
  });

  it('handles undefined campaign', () => {
    const result = buildKingdomView('test-kingdom', undefined, [mockKingdomCatalog]);

    expect(result?.adventures).toEqual([
      {
        name: 'First Adventure',
        singleAttempt: true,
        roll: { min: 1, max: 6 },
        id: 'test-kingdom:first-adventure',
        completedCount: 0,
        completed: false,
      },
      {
        name: 'Second Adventure',
        singleAttempt: false,
        roll: { min: 2, max: 10 },
        id: 'test-kingdom:second-adventure',
        completedCount: 0,
        completed: false,
      },
      {
        name: 'Third Adventure',
        singleAttempt: true,
        roll: { min: 3, max: 12 },
        id: 'test-kingdom:third-adventure',
        completedCount: 0,
        completed: false,
      },
    ]);
  });

  it('correctly determines completed status for single attempt adventures', () => {
    const campaignWithSingleAttempt: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [],
      kingdoms: [
        {
          kingdomId: 'test-kingdom',
          name: 'Test Kingdom',
          chapter: 1,
          adventures: [
            { id: 'test-kingdom:first-adventure', completedCount: 1 }, // completed
            { id: 'test-kingdom:third-adventure', completedCount: 0 }, // not completed
          ],
        },
      ],
    } as Campaign;

    const result = buildKingdomView('test-kingdom', campaignWithSingleAttempt, [
      mockKingdomCatalog,
    ]);

    expect(result?.adventures[0].completed).toBe(true); // singleAttempt: true, completedCount: 1
    expect(result?.adventures[2].completed).toBe(false); // singleAttempt: true, completedCount: 0
  });

  it('always sets completed to false for non-single attempt adventures', () => {
    const campaignWithMultipleAttempts: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [],
      kingdoms: [
        {
          kingdomId: 'test-kingdom',
          name: 'Test Kingdom',
          chapter: 1,
          adventures: [
            { id: 'test-kingdom:second-adventure', completedCount: 5 }, // multiple attempts
          ],
        },
      ],
    } as Campaign;

    const result = buildKingdomView('test-kingdom', campaignWithMultipleAttempts, [
      mockKingdomCatalog,
    ]);

    expect(result?.adventures[1].completed).toBe(false); // singleAttempt: false, so always false
  });

  it('handles adventures with special characters in names', () => {
    const kingdomWithSpecialChars: KingdomCatalog = {
      id: 'test-kingdom',
      name: 'Test Kingdom',
      adventures: [
        {
          name: 'Adventure with Spaces & Symbols!',
          singleAttempt: true,
          roll: { min: 1, max: 6 },
        },
      ],
    } as KingdomCatalog;

    const result = buildKingdomView('test-kingdom', mockCampaign, [kingdomWithSpecialChars]);

    expect(result?.adventures[0].id).toBe('test-kingdom:adventure-with-spaces-symbols');
  });

  it('handles kingdom state with record-like adventures', () => {
    const campaignWithRecordState: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [],
      kingdoms: [
        {
          kingdomId: 'test-kingdom',
          name: 'Test Kingdom',
          chapter: 1,
          adventures: {
            'test-kingdom:first-adventure': 2,
            'test-kingdom:second-adventure': { completedCount: 5 },
          } as any,
        },
      ],
    } as Campaign;

    const result = buildKingdomView('test-kingdom', campaignWithRecordState, [mockKingdomCatalog]);

    expect(result?.adventures[0].completedCount).toBe(2);
    expect(result?.adventures[1].completedCount).toBe(5);
    expect(result?.adventures[2].completedCount).toBe(0); // not in state
  });

  it('handles kingdom state with mixed adventure formats', () => {
    const campaignWithMixedState: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [],
      kingdoms: [
        {
          kingdomId: 'test-kingdom',
          name: 'Test Kingdom',
          chapter: 1,
          adventures: [
            { id: 'test-kingdom:first-adventure', completedCount: 1 },
            { id: 'test-kingdom:second-adventure', completedCount: 3 },
          ],
        },
      ],
    } as Campaign;

    const result = buildKingdomView('test-kingdom', campaignWithMixedState, [mockKingdomCatalog]);

    expect(result?.adventures[0].completedCount).toBe(1);
    expect(result?.adventures[1].completedCount).toBe(3);
    expect(result?.adventures[2].completedCount).toBe(0); // not in state
  });

  it('handles undefined kingdom state', () => {
    const campaignWithUndefinedState: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [],
      kingdoms: [
        {
          kingdomId: 'test-kingdom',
          name: 'Test Kingdom',
          chapter: 1,
          adventures: [],
        },
      ],
    } as Campaign;

    const result = buildKingdomView('test-kingdom', campaignWithUndefinedState, [
      mockKingdomCatalog,
    ]);

    expect(result?.adventures.every(adv => adv.completedCount === 0)).toBe(true);
  });

  it('handles kingdom without bestiary', () => {
    const kingdomWithoutBestiary: KingdomCatalog = {
      id: 'test-kingdom',
      name: 'Test Kingdom',
      adventures: [
        {
          name: 'First Adventure',
          singleAttempt: true,
          roll: { min: 1, max: 6 },
        },
      ],
    } as KingdomCatalog;

    const result = buildKingdomView('test-kingdom', mockCampaign, [kingdomWithoutBestiary]);

    expect(result?.bestiary).toBeUndefined();
  });

  it('generates correct adventure IDs with slugification', () => {
    const kingdomWithComplexNames: KingdomCatalog = {
      id: 'test-kingdom',
      name: 'Test Kingdom',
      adventures: [
        { name: 'Simple Name', singleAttempt: true, roll: { min: 1, max: 6 } },
        { name: 'Complex Name with Spaces!', singleAttempt: true, roll: { min: 1, max: 6 } },
        { name: 'UPPERCASE NAME', singleAttempt: true, roll: { min: 1, max: 6 } },
        { name: 'Name with Numbers 123', singleAttempt: true, roll: { min: 1, max: 6 } },
        { name: '---Name with Dashes---', singleAttempt: true, roll: { min: 1, max: 6 } },
      ],
    } as KingdomCatalog;

    const result = buildKingdomView('test-kingdom', mockCampaign, [kingdomWithComplexNames]);

    expect(result?.adventures.map(adv => adv.id)).toEqual([
      'test-kingdom:simple-name',
      'test-kingdom:complex-name-with-spaces',
      'test-kingdom:uppercase-name',
      'test-kingdom:name-with-numbers-123',
      'test-kingdom:name-with-dashes',
    ]);
  });
});
