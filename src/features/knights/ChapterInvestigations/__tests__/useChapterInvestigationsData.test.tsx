import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

// Mock knight models
jest.mock('@/models/knight', () => ({
  ensureSheet: jest.fn(sheet => sheet || {}),
  ensureChapter: jest.fn((sheet, chapter) => ({
    attempts: [
      { code: 'I1-1', result: 'pass', lead: false },
      { code: 'I1-2', result: 'fail', lead: false },
      { code: 'I1-3', result: 'pass', lead: true },
    ],
    completed: ['I1-1', 'I1-3'],
  })),
  countNormalDisplay: jest.fn(() => 1),
  countTotalDisplay: jest.fn(() => 2),
}));

// Mock knights store
const mockAddNormalInvestigation = jest.fn();
const mockAddLeadCompletion = jest.fn();
const mockIsNormalLocked = jest.fn(() => false);

jest.mock('@/store/knights', () => ({
  useKnights: () => ({
    knightsById: {
      'knight-1': {
        uid: 'knight-1',
        name: 'Sir Galahad',
        sheet: {
          chapters: {
            1: {
              attempts: [
                { code: 'I1-1', result: 'pass', lead: false },
                { code: 'I1-2', result: 'fail', lead: false },
                { code: 'I1-3', result: 'pass', lead: true },
              ],
              completed: ['I1-1', 'I1-3'],
            },
          },
        },
      },
      'knight-2': {
        uid: 'knight-2',
        name: 'Sir Lancelot',
        sheet: {},
      },
    },
    addNormalInvestigation: mockAddNormalInvestigation,
    addLeadCompletion: mockAddLeadCompletion,
    isNormalLocked: mockIsNormalLocked,
  }),
}));

import { useChapterInvestigationsData } from '../useChapterInvestigationsData';

describe('useChapterInvestigationsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct data for knight with investigations', () => {
    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', 1));

    expect(result.current.entries).toHaveLength(5);
    expect(result.current.normalDone).toBe(1);
    expect(result.current.totalDone).toBe(2);
    expect(result.current.locked).toBe(false);
  });

  it('returns correct entries with proper investigation states', () => {
    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', 1));

    const entries = result.current.entries;

    // I1-1: completed via normal
    expect(entries[0]).toEqual({
      code: 'I1-1',
      isCompleted: true,
      lastResult: 'pass',
      via: 'normal',
    });

    // I1-2: failed but not completed
    expect(entries[1]).toEqual({
      code: 'I1-2',
      isCompleted: false,
      lastResult: 'fail',
      via: 'normal',
    });

    // I1-3: completed via lead
    expect(entries[2]).toEqual({
      code: 'I1-3',
      isCompleted: true,
      lastResult: 'pass',
      via: 'lead',
    });
  });

  it('handles knight without investigations', () => {
    const { result } = renderHook(() => useChapterInvestigationsData('knight-2', 1));

    expect(result.current.entries).toHaveLength(5);
    expect(result.current.normalDone).toBe(1);
    expect(result.current.totalDone).toBe(2);
    expect(result.current.locked).toBe(false);
  });

  it('handles locked investigations', () => {
    mockIsNormalLocked.mockReturnValue(true);

    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', 1));

    expect(result.current.locked).toBe(true);
  });

  it('generates correct investigation codes for different chapters', () => {
    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', 3));

    const codes = result.current.entries.map(e => e.code);
    expect(codes).toEqual(['I3-1', 'I3-2', 'I3-3', 'I3-4', 'I3-5']);
  });

  it('handles chapter 0 by defaulting to chapter 1', () => {
    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', 0));

    const codes = result.current.entries.map(e => e.code);
    expect(codes).toEqual(['I1-1', 'I1-2', 'I1-3', 'I1-4', 'I1-5']);
  });

  it('handles negative chapter by defaulting to chapter 1', () => {
    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', -1));

    const codes = result.current.entries.map(e => e.code);
    expect(codes).toEqual(['I1-1', 'I1-2', 'I1-3', 'I1-4', 'I1-5']);
  });

  it('handles large chapter numbers by clamping to 5', () => {
    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', 10));

    const codes = result.current.entries.map(e => e.code);
    expect(codes).toEqual(['I5-1', 'I5-2', 'I5-3', 'I5-4', 'I5-5']);
  });

  it('calls addNormalInvestigation correctly', async () => {
    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', 1));

    await result.current.addNormalInvestigation('I1-4', 'pass');

    expect(mockAddNormalInvestigation).toHaveBeenCalledWith('knight-1', 1, 'I1-4', 'pass');
  });

  it('calls addLeadCompletion correctly', async () => {
    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', 1));

    await result.current.addLeadCompletion('I1-4');

    expect(mockAddLeadCompletion).toHaveBeenCalledWith('knight-1', 1, 'I1-4');
  });

  it('handles non-existent knight', () => {
    // Reset the mock to return false for non-existent knight
    mockIsNormalLocked.mockReturnValue(false);

    const { result } = renderHook(() => useChapterInvestigationsData('non-existent', 1));

    expect(result.current.entries).toHaveLength(5);
    expect(result.current.normalDone).toBe(1);
    expect(result.current.totalDone).toBe(2);
    expect(result.current.locked).toBe(false);
  });

  it('handles empty attempts and completed arrays', () => {
    // Mock ensureChapter to return empty arrays
    const { ensureChapter } = require('@/models/knight');
    ensureChapter.mockReturnValue({
      attempts: [],
      completed: [],
    });

    const { result } = renderHook(() => useChapterInvestigationsData('knight-1', 1));

    expect(result.current.entries).toHaveLength(5);
    result.current.entries.forEach(entry => {
      expect(entry.isCompleted).toBe(false);
      expect(entry.lastResult).toBeUndefined();
      expect(entry.via).toBe('normal');
    });
  });
});
