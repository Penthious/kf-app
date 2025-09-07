import { useKnights } from '../knights';
import { storage } from '../storage';

// Mock storage
jest.mock('../storage', () => ({
  storage: {
    save: jest.fn().mockResolvedValue(undefined),
    load: jest.fn().mockResolvedValue({}),
  },
  STORAGE_KEYS: {
    KNIGHTS: 'knights',
  },
}));

// Mock campaigns store
jest.mock('../campaigns', () => ({
  useCampaigns: {
    getState: jest.fn().mockReturnValue({
      campaigns: {},
    }),
    setState: jest.fn(),
  },
}));

describe('advanceChapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    useKnights.setState({ knightsById: {} });
  });

  it('should advance chapter when quest is completed and 3 normal investigations attempted', () => {
    const knightUID = 'test-knight-1';

    // Create a knight with completed quest and 3 normal investigations attempted
    const knight = {
      knightUID,
      name: 'Test Knight',
      catalogId: 'catalog-1',
      ownerUserId: 'user-1',
      sheet: {
        chapter: 1,
        chapters: {
          '1': {
            quest: { completed: true, outcome: 'pass' as 'pass' | 'fail' },
            attempts: [
              { code: 'I1-1', result: 'pass' as 'pass' | 'fail', at: Date.now() },
              { code: 'I1-2', result: 'fail' as 'pass' | 'fail', at: Date.now() },
              { code: 'I1-3', result: 'pass' as 'pass' | 'fail', at: Date.now() },
            ],
            completed: ['I1-1', 'I1-3'],
          },
        },
        virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
        vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
        bane: 0,
        sighOfGraal: 0 as 0 | 1,
        gold: 0,
        leads: 0,
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
        cipher: 0,
      },
      version: 1,
      updatedAt: Date.now(),
      rapport: [],
    };

    useKnights.setState({ knightsById: { [knightUID]: knight } });

    const result = useKnights.getState().advanceChapter(knightUID);

    expect(result.ok).toBe(true);
    expect(result.error).toBeUndefined();

    const updatedKnight = useKnights.getState().knightsById[knightUID];
    expect(updatedKnight.sheet.chapter).toBe(2);
    expect(storage.save).toHaveBeenCalled();
  });

  it('should not advance chapter when quest is not completed', () => {
    const knightUID = 'test-knight-2';

    const knight = {
      knightUID,
      name: 'Test Knight',
      catalogId: 'catalog-1',
      ownerUserId: 'user-1',
      sheet: {
        chapter: 1,
        chapters: {
          '1': {
            quest: { completed: false },
            attempts: [
              { code: 'I1-1', result: 'pass' as 'pass' | 'fail', at: Date.now() },
              { code: 'I1-2', result: 'fail' as 'pass' | 'fail', at: Date.now() },
              { code: 'I1-3', result: 'pass' as 'pass' | 'fail', at: Date.now() },
            ],
            completed: ['I1-1', 'I1-3'],
          },
        },
        virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
        vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
        bane: 0,
        sighOfGraal: 0 as 0 | 1,
        gold: 0,
        leads: 0,
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
        cipher: 0,
      },
      version: 1,
      updatedAt: Date.now(),
      rapport: [],
    };

    useKnights.setState({ knightsById: { [knightUID]: knight } });

    const result = useKnights.getState().advanceChapter(knightUID);

    expect(result.ok).toBe(false);
    expect(result.error).toBe('Quest must be completed before advancing chapter');

    const updatedKnight = useKnights.getState().knightsById[knightUID];
    expect(updatedKnight.sheet.chapter).toBe(1); // Should remain unchanged
  });

  it('should not advance chapter when less than 3 normal investigations attempted', () => {
    const knightUID = 'test-knight-3';

    const knight = {
      knightUID,
      name: 'Test Knight',
      catalogId: 'catalog-1',
      ownerUserId: 'user-1',
      sheet: {
        chapter: 1,
        chapters: {
          '1': {
            quest: { completed: true, outcome: 'pass' as 'pass' | 'fail' },
            attempts: [
              { code: 'I1-1', result: 'pass' as 'pass' | 'fail', at: Date.now() },
              { code: 'I1-2', result: 'fail' as 'pass' | 'fail', at: Date.now() },
            ],
            completed: ['I1-1'],
          },
        },
        virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
        vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
        bane: 0,
        sighOfGraal: 0 as 0 | 1,
        gold: 0,
        leads: 0,
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
        cipher: 0,
      },
      version: 1,
      updatedAt: Date.now(),
      rapport: [],
    };

    useKnights.setState({ knightsById: { [knightUID]: knight } });

    const result = useKnights.getState().advanceChapter(knightUID);

    expect(result.ok).toBe(false);
    expect(result.error).toBe('Must attempt 3 normal investigations before advancing chapter');

    const updatedKnight = useKnights.getState().knightsById[knightUID];
    expect(updatedKnight.sheet.chapter).toBe(1); // Should remain unchanged
  });

  it('should not advance chapter when already at maximum chapter', () => {
    const knightUID = 'test-knight-4';

    const knight = {
      knightUID,
      name: 'Test Knight',
      catalogId: 'catalog-1',
      ownerUserId: 'user-1',
      sheet: {
        chapter: 5,
        chapters: {
          '5': {
            quest: { completed: true, outcome: 'pass' as 'pass' | 'fail' },
            attempts: [
              { code: 'I5-1', result: 'pass' as 'pass' | 'fail', at: Date.now() },
              { code: 'I5-2', result: 'fail' as 'pass' | 'fail', at: Date.now() },
              { code: 'I5-3', result: 'pass' as 'pass' | 'fail', at: Date.now() },
            ],
            completed: ['I5-1', 'I5-3'],
          },
        },
        virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
        vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
        bane: 0,
        sighOfGraal: 0 as 0 | 1,
        gold: 0,
        leads: 0,
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
        cipher: 0,
      },
      version: 1,
      updatedAt: Date.now(),
      rapport: [],
    };

    useKnights.setState({ knightsById: { [knightUID]: knight } });

    const result = useKnights.getState().advanceChapter(knightUID);

    expect(result.ok).toBe(false);
    expect(result.error).toBe('Already at maximum chapter');

    const updatedKnight = useKnights.getState().knightsById[knightUID];
    expect(updatedKnight.sheet.chapter).toBe(5); // Should remain unchanged
  });

  it('should return error when knight is not found', () => {
    const result = useKnights.getState().advanceChapter('non-existent-knight');

    expect(result.ok).toBe(false);
    expect(result.error).toBe('Knight not found');
  });

  it('should count lead investigations as normal investigations for advancement', () => {
    const knightUID = 'test-knight-5';

    const knight = {
      knightUID,
      name: 'Test Knight',
      catalogId: 'catalog-1',
      ownerUserId: 'user-1',
      sheet: {
        chapter: 1,
        chapters: {
          '1': {
            quest: { completed: true, outcome: 'pass' as 'pass' | 'fail' },
            attempts: [
              { code: 'I1-1', result: 'pass' as 'pass' | 'fail', at: Date.now(), lead: true },
              { code: 'I1-2', result: 'pass' as 'pass' | 'fail', at: Date.now(), lead: true },
              { code: 'I1-3', result: 'pass' as 'pass' | 'fail', at: Date.now(), lead: true },
            ],
            completed: ['I1-1', 'I1-2', 'I1-3'],
          },
        },
        virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
        vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
        bane: 0,
        sighOfGraal: 0 as 0 | 1,
        gold: 0,
        leads: 0,
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
        cipher: 0,
      },
      version: 1,
      updatedAt: Date.now(),
      rapport: [],
    };

    useKnights.setState({ knightsById: { [knightUID]: knight } });

    const result = useKnights.getState().advanceChapter(knightUID);

    expect(result.ok).toBe(true);
    expect(result.error).toBeUndefined();

    const updatedKnight = useKnights.getState().knightsById[knightUID];
    expect(updatedKnight.sheet.chapter).toBe(2);
  });
});
