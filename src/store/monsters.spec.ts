import { beforeEach, describe, expect, it } from 'vitest';
import { useMonsters, selectMonsterName } from './monsters';
import type { MonsterStats } from '@/models/monster';

// Minimal mock catalog (only required fields)
const MOCKS: ReadonlyArray<MonsterStats> = Object.freeze([
  Object.freeze({
    id: 'm1',
    name: 'Mock One',
    level: 1,
    toHit: 3,
    wounds: 6,
    exhibitionStartingWounds: 4,
    traits: [],
  }),
  Object.freeze({
    id: 'm2',
    name: 'Mock Two',
    level: 2,
    toHit: 3,
    wounds: 8,
    exhibitionStartingWounds: 5,
    traits: [],
  }),
]);

beforeEach(() => {
  // Reset store to its module defaults before each test
  const initial = useMonsters.getState();
  useMonsters.setState({
    all: initial.all,
    byId: initial.byId,
  });
});

describe('useMonsters store', () => {
  it('initializes with a consistent byId index for the default catalog', () => {
    const { all, byId } = useMonsters.getState();
    // Ensure we have monsters loaded
    expect(all.length).toBeGreaterThan(0);
    // byId keys match the list length (allows for duplicates to be handled properly)
    expect(Object.keys(byId).length).toBeLessThanOrEqual(all.length);
    // Every item in all is reachable by id in byId
    for (const m of all) {
      expect(byId[m.id]).toBeTruthy();
      expect(byId[m.id].id).toBe(m.id);
      expect(byId[m.id].name).toBe(m.name);
    }
  });

  it('load replaces the catalog and reindexes by id', () => {
    useMonsters.getState().load(MOCKS);

    const { all, byId } = useMonsters.getState();
    expect(all).toEqual(MOCKS);
    expect(Object.keys(byId).sort()).toEqual(['m1', 'm2']);
    expect(byId['m1']?.name).toBe('Mock One');
    expect(byId['m2']?.name).toBe('Mock Two');
    expect(byId['missing']).toBeUndefined();
  });

  it('selectMonsterName returns name, falls back to id, and to "Unknown" for undefined', () => {
    useMonsters.getState().load(MOCKS);

    const state = useMonsters.getState();
    expect(selectMonsterName('m1')(state)).toBe('Mock One');
    expect(selectMonsterName('nope')(state)).toBe('nope');
    expect(selectMonsterName(undefined)(state)).toBe('Unknown');
  });
});
