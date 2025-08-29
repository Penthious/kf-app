import type { KnightsById } from '@/features/knights/types';
import type { Campaign } from '@/models/campaign';
import type { Knight } from '@/models/knight';
import { describe, expect, it } from 'vitest';
import { getMemberSets } from './selectors';

describe('getMemberSets', () => {
  const mockKnightsById: KnightsById = {
    'knight-1': {
      knightUID: 'knight-1',
      name: 'Sir Galahad',
      catalogId: 'galahad',
    } as Knight,
    'knight-2': {
      knightUID: 'knight-2',
      name: 'Sir Lancelot',
      catalogId: 'lancelot',
    } as Knight,
    'knight-3': {
      knightUID: 'knight-3',
      name: 'Sir Gawain',
      catalogId: 'gawain',
    } as Knight,
    'knight-4': {
      knightUID: 'knight-4',
      name: 'Sir Percival',
      catalogId: 'percival',
    } as Knight,
  };

  it('returns empty sets when campaign is undefined', () => {
    const result = getMemberSets(undefined, mockKnightsById);

    expect(result.active).toEqual([]);
    expect(result.benched).toEqual([]);
    expect(result.available).toEqual([]); // Empty when no campaign
    expect(result.byUID).toEqual(new Set());
    expect(result.activeCatalogIds).toEqual(new Set());
  });

  it('returns empty sets when campaign has no members', () => {
    const campaign: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [],
      kingdoms: [],
    } as Campaign;

    const result = getMemberSets(campaign, mockKnightsById);

    expect(result.active).toEqual([]);
    expect(result.benched).toEqual([]);
    expect(result.available).toHaveLength(4); // All knights are available when campaign exists
    expect(result.byUID).toEqual(new Set());
    expect(result.activeCatalogIds).toEqual(new Set());
  });

  it('correctly categorizes active and benched members', () => {
    const campaign: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      partyLeaderUID: 'knight-1',
      members: [
        {
          knightUID: 'knight-1',
          isActive: true,
          displayName: 'Galahad',
          catalogId: 'galahad',
          joinedAt: 1234567890,
        },
        {
          knightUID: 'knight-2',
          isActive: true,
          displayName: 'Lancelot',
          catalogId: 'lancelot',
          joinedAt: 1234567890,
        },
        {
          knightUID: 'knight-3',
          isActive: false,
          displayName: 'Gawain',
          catalogId: 'gawain',
          joinedAt: 1234567890,
        },
      ],
      kingdoms: [],
    } as Campaign;

    const result = getMemberSets(campaign, mockKnightsById);

    expect(result.active).toHaveLength(2);
    expect(result.benched).toHaveLength(1);
    expect(result.available).toHaveLength(1); // Only knight-4 is available

    // Check active members
    expect(result.active[0]).toEqual({
      knightUID: 'knight-1',
      name: 'Sir Galahad',
      catalogId: 'galahad',
      isLeader: true,
    });
    expect(result.active[1]).toEqual({
      knightUID: 'knight-2',
      name: 'Sir Lancelot',
      catalogId: 'lancelot',
      isLeader: false,
    });

    // Check benched member
    expect(result.benched[0]).toEqual({
      knightUID: 'knight-3',
      name: 'Sir Gawain',
      catalogId: 'gawain',
      isLeader: false,
    });

    // Check available member
    expect(result.available[0]).toEqual({
      knightUID: 'knight-4',
      name: 'Sir Percival',
      catalogId: 'percival',
    });

    // Check sets
    expect(result.byUID).toEqual(new Set(['knight-1', 'knight-2', 'knight-3']));
    expect(result.activeCatalogIds).toEqual(new Set(['galahad', 'lancelot']));
  });

  it('uses displayName when knight is not found in knightsById', () => {
    const campaign: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [
        {
          knightUID: 'unknown-knight',
          isActive: true,
          displayName: 'Unknown Knight',
          catalogId: 'unknown',
          joinedAt: 1234567890,
        },
      ],
      kingdoms: [],
    } as Campaign;

    const result = getMemberSets(campaign, mockKnightsById);

    expect(result.active[0]).toEqual({
      knightUID: 'unknown-knight',
      name: 'Unknown Knight',
      catalogId: 'unknown',
      isLeader: false,
    });
  });

  it('falls back to "Unknown Knight" when neither knight nor displayName is available', () => {
    const campaign: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [
        {
          knightUID: 'unknown-knight',
          isActive: true,
          displayName: 'Unknown Knight',
          catalogId: 'unknown',
          joinedAt: 1234567890,
        },
      ],
      kingdoms: [],
    } as Campaign;

    const result = getMemberSets(campaign, mockKnightsById);

    expect(result.active[0]).toEqual({
      knightUID: 'unknown-knight',
      name: 'Unknown Knight',
      catalogId: 'unknown',
      isLeader: false,
    });
  });

  it('uses catalogId from member when knight catalogId is not available', () => {
    const campaign: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [
        {
          knightUID: 'unknown-knight',
          isActive: true,
          displayName: 'Test Knight',
          catalogId: 'test-catalog',
          joinedAt: 1234567890,
        },
      ],
      kingdoms: [],
    } as Campaign;

    const result = getMemberSets(campaign, mockKnightsById);

    expect(result.active[0].catalogId).toBe('test-catalog');
  });

  it('correctly identifies party leader', () => {
    const campaign: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      partyLeaderUID: 'knight-2',
      members: [
        {
          knightUID: 'knight-1',
          isActive: true,
          displayName: 'Sir Galahad',
          catalogId: 'galahad',
          joinedAt: 1234567890,
        },
        {
          knightUID: 'knight-2',
          isActive: true,
          displayName: 'Sir Lancelot',
          catalogId: 'lancelot',
          joinedAt: 1234567890,
        },
      ],
      kingdoms: [],
    } as Campaign;

    const result = getMemberSets(campaign, mockKnightsById);

    expect(result.active[0].isLeader).toBe(false);
    expect(result.active[1].isLeader).toBe(true);
  });

  it('handles campaign with undefined members', () => {
    const campaign: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [],
      kingdoms: [],
    } as Campaign;

    const result = getMemberSets(campaign, mockKnightsById);

    expect(result.active).toEqual([]);
    expect(result.benched).toEqual([]);
    expect(result.available).toHaveLength(4); // All knights are available when campaign exists
    expect(result.byUID).toEqual(new Set());
    expect(result.activeCatalogIds).toEqual(new Set());
  });

  it('filters out null/undefined knights from available list', () => {
    const knightsWithNulls: KnightsById = {
      'knight-1': mockKnightsById['knight-1'],
      'knight-2': null as unknown as Knight,
      'knight-3': undefined as unknown as Knight,
      'knight-4': mockKnightsById['knight-4'],
    };

    const campaign: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [],
      kingdoms: [],
    } as Campaign;

    const result = getMemberSets(campaign, knightsWithNulls);

    expect(result.available).toHaveLength(2);
    expect(result.available.map(k => k.knightUID)).toEqual(['knight-1', 'knight-4']);
  });

  it('sorts active and benched members in order of appearance', () => {
    const campaign: Campaign = {
      campaignId: 'campaign-1',
      name: 'Test Campaign',
      createdAt: 1234567890,
      updatedAt: 1234567890,
      settings: { fivePlayerMode: false },
      members: [
        {
          knightUID: 'knight-3',
          isActive: false,
          displayName: 'Sir Gawain',
          catalogId: 'gawain',
          joinedAt: 1234567890,
        },
        {
          knightUID: 'knight-1',
          isActive: true,
          displayName: 'Sir Galahad',
          catalogId: 'galahad',
          joinedAt: 1234567890,
        },
        {
          knightUID: 'knight-2',
          isActive: true,
          displayName: 'Sir Lancelot',
          catalogId: 'lancelot',
          joinedAt: 1234567890,
        },
        {
          knightUID: 'knight-4',
          isActive: false,
          displayName: 'Sir Percival',
          catalogId: 'percival',
          joinedAt: 1234567890,
        },
      ],
      kingdoms: [],
    } as Campaign;

    const result = getMemberSets(campaign, mockKnightsById);

    expect(result.active.map(k => k.knightUID)).toEqual(['knight-1', 'knight-2']);
    expect(result.benched.map(k => k.knightUID)).toEqual(['knight-3', 'knight-4']);
  });
});
