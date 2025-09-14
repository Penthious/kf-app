import { renderHook, act } from '@testing-library/react-native';
import { useChoiceMatrixNotes } from '../useChoiceMatrixNotes';
import { useKnights } from '@/store/knights';

// Mock the useKnights hook
jest.mock('@/store/knights');
const mockUseKnights = useKnights as jest.MockedFunction<typeof useKnights>;

describe('useChoiceMatrixNotes', () => {
  const mockUpdateKnightSheet = jest.fn();
  const knightUID = 'test-knight-1';

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseKnights.mockReturnValue({
      knightsById: {
        [knightUID]: {
          knightUID,
          ownerUserId: 'user-1',
          catalogId: 'knight-1',
          name: 'Test Knight',
          sheet: {
            virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
            vices: {
              cowardice: 0,
              dishonor: 0,
              duplicity: 0,
              disregard: 0,
              cruelty: 0,
              treachery: 0,
            },
            bane: 0,
            sighOfGraal: 0,
            gold: 0,
            leads: 0,
            clues: 0,
            chapter: 1,
            chapters: {},
            prologueDone: false,
            postgameDone: false,
            firstDeath: false,
            choiceMatrix: {},
            choiceMatrixNotes: {
              '1': 'Test note for choice 1',
              '5': 'Another note for choice 5',
            },
            saints: [],
            mercenaries: [],
            armory: [],
            notes: [],
            cipher: 0,
          },
          version: 1,
          updatedAt: Date.now(),
          rapport: [],
        },
      },
      updateKnightSheet: mockUpdateKnightSheet,
    } as any);
  });

  it('should return notes from knight sheet', () => {
    const { result } = renderHook(() => useChoiceMatrixNotes(knightUID));

    expect(result.current.notes).toEqual({
      '1': 'Test note for choice 1',
      '5': 'Another note for choice 5',
    });
  });

  it('should return empty object when no notes exist', () => {
    mockUseKnights.mockReturnValue({
      knightsById: {
        [knightUID]: {
          knightUID,
          ownerUserId: 'user-1',
          catalogId: 'knight-1',
          name: 'Test Knight',
          sheet: {
            virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
            vices: {
              cowardice: 0,
              dishonor: 0,
              duplicity: 0,
              disregard: 0,
              cruelty: 0,
              treachery: 0,
            },
            bane: 0,
            sighOfGraal: 0,
            gold: 0,
            leads: 0,
            clues: 0,
            chapter: 1,
            chapters: {},
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
          },
          version: 1,
          updatedAt: Date.now(),
          rapport: [],
        },
      },
      updateKnightSheet: mockUpdateKnightSheet,
    } as any);

    const { result } = renderHook(() => useChoiceMatrixNotes(knightUID));

    expect(result.current.notes).toEqual({});
  });

  it('should get note for specific code', () => {
    const { result } = renderHook(() => useChoiceMatrixNotes(knightUID));

    expect(result.current.getNote('1')).toBe('Test note for choice 1');
    expect(result.current.getNote('5')).toBe('Another note for choice 5');
    expect(result.current.getNote('10')).toBe('');
  });

  it('should check if note exists for code', () => {
    const { result } = renderHook(() => useChoiceMatrixNotes(knightUID));

    expect(result.current.hasNote('1')).toBe(true);
    expect(result.current.hasNote('5')).toBe(true);
    expect(result.current.hasNote('10')).toBe(false);
  });

  it('should set note for code', () => {
    const { result } = renderHook(() => useChoiceMatrixNotes(knightUID));

    act(() => {
      result.current.setNote('10', 'New note for choice 10');
    });

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith(knightUID, {
      choiceMatrixNotes: {
        '1': 'Test note for choice 1',
        '5': 'Another note for choice 5',
        '10': 'New note for choice 10',
      },
    });
  });

  it('should remove note when setting empty text', () => {
    const { result } = renderHook(() => useChoiceMatrixNotes(knightUID));

    act(() => {
      result.current.setNote('1', '');
    });

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith(knightUID, {
      choiceMatrixNotes: {
        '5': 'Another note for choice 5',
      },
    });
  });

  it('should delete note for code', () => {
    const { result } = renderHook(() => useChoiceMatrixNotes(knightUID));

    act(() => {
      result.current.deleteNote('1');
    });

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith(knightUID, {
      choiceMatrixNotes: {
        '5': 'Another note for choice 5',
      },
    });
  });

  it('should get all notes sorted by code', () => {
    const { result } = renderHook(() => useChoiceMatrixNotes(knightUID));

    const allNotes = result.current.getAllNotes();

    expect(allNotes).toEqual([
      { code: '1', text: 'Test note for choice 1' },
      { code: '5', text: 'Another note for choice 5' },
    ]);
  });

  it('should filter out empty notes from getAllNotes', () => {
    mockUseKnights.mockReturnValue({
      knightsById: {
        [knightUID]: {
          knightUID,
          ownerUserId: 'user-1',
          catalogId: 'knight-1',
          name: 'Test Knight',
          sheet: {
            virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
            vices: {
              cowardice: 0,
              dishonor: 0,
              duplicity: 0,
              disregard: 0,
              cruelty: 0,
              treachery: 0,
            },
            bane: 0,
            sighOfGraal: 0,
            gold: 0,
            leads: 0,
            clues: 0,
            chapter: 1,
            chapters: {},
            prologueDone: false,
            postgameDone: false,
            firstDeath: false,
            choiceMatrix: {},
            choiceMatrixNotes: {
              '1': 'Test note for choice 1',
              '5': '',
              '10': '   ', // whitespace only
              '15': 'Valid note',
            },
            saints: [],
            mercenaries: [],
            armory: [],
            notes: [],
            cipher: 0,
          },
          version: 1,
          updatedAt: Date.now(),
          rapport: [],
        },
      },
      updateKnightSheet: mockUpdateKnightSheet,
    } as any);

    const { result } = renderHook(() => useChoiceMatrixNotes(knightUID));

    const allNotes = result.current.getAllNotes();

    expect(allNotes).toEqual([
      { code: '1', text: 'Test note for choice 1' },
      { code: '15', text: 'Valid note' },
    ]);
  });
});
