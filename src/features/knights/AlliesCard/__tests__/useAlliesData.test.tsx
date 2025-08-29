import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

// Mock allies catalog
jest.mock('@/catalogs/allies', () => ({
  saints: [
    { id: 'saint-george', name: 'Saint George' },
    { id: 'saint-michael', name: 'Saint Michael' },
    { id: 'saint-patrick', name: 'Saint Patrick' },
  ],
  mercenaries: [
    { id: 'black-knight', name: 'Black Knight' },
    { id: 'white-knight', name: 'White Knight' },
    { id: 'red-knight', name: 'Red Knight' },
  ],
}));

// Mock knights store
const mockUpdateKnightSheet = jest.fn();
jest.mock('@/store/knights', () => ({
  useKnights: () => ({
    knightsById: {
      'knight-1': {
        uid: 'knight-1',
        name: 'Sir Galahad',
        sheet: {
          saints: ['Saint George', 'Saint Michael'],
          mercenaries: ['Black Knight'],
        },
      },
      'knight-2': {
        uid: 'knight-2',
        name: 'Sir Lancelot',
        sheet: {},
      },
      'knight-3': {
        uid: 'knight-3',
        name: 'Sir Gawain',
        sheet: {
          saints: null,
          mercenaries: undefined,
        },
      },
    },
    updateKnightSheet: mockUpdateKnightSheet,
  }),
}));

import { useAlliesData } from '../useAlliesData';

describe('useAlliesData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct data for knight with allies', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    expect(result.current.saints.selected).toEqual(['Saint George', 'Saint Michael']);
    expect(result.current.mercenaries.selected).toEqual(['Black Knight']);
    expect(result.current.saints.options).toHaveLength(3);
    expect(result.current.mercenaries.options).toHaveLength(3);
  });

  it('returns empty arrays for knight without allies', () => {
    const { result } = renderHook(() => useAlliesData('knight-2'));

    expect(result.current.saints.selected).toEqual([]);
    expect(result.current.mercenaries.selected).toEqual([]);
    expect(result.current.saints.options).toHaveLength(3);
    expect(result.current.mercenaries.options).toHaveLength(3);
  });

  it('handles null and undefined values', () => {
    const { result } = renderHook(() => useAlliesData('knight-3'));

    expect(result.current.saints.selected).toEqual([]);
    expect(result.current.mercenaries.selected).toEqual([]);
  });

  it('adds saint ally correctly', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    result.current.addAlly('saints', { id: 'saint-patrick', name: 'Saint Patrick' });

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      saints: ['Saint George', 'Saint Michael', 'Saint Patrick'],
    });
  });

  it('adds mercenary ally correctly', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    result.current.addAlly('mercs', { id: 'white-knight', name: 'White Knight' });

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      mercenaries: ['Black Knight', 'White Knight'],
    });
  });

  it('prevents duplicate saints when adding', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    result.current.addAlly('saints', { id: 'saint-george', name: 'Saint George' });

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      saints: ['Saint George', 'Saint Michael'],
    });
  });

  it('prevents duplicate mercenaries when adding', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    result.current.addAlly('mercs', { id: 'black-knight', name: 'Black Knight' });

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      mercenaries: ['Black Knight'],
    });
  });

  it('removes saint ally correctly', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    result.current.removeAlly('saints', 'Saint George');

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      saints: ['Saint Michael'],
    });
  });

  it('removes mercenary ally correctly', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    result.current.removeAlly('mercs', 'Black Knight');

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      mercenaries: [],
    });
  });

  it('handles removing non-existent saint', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    result.current.removeAlly('saints', 'Non-existent Saint');

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      saints: ['Saint George', 'Saint Michael'],
    });
  });

  it('handles removing non-existent mercenary', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    result.current.removeAlly('mercs', 'Non-existent Mercenary');

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      mercenaries: ['Black Knight'],
    });
  });

  it('returns correct options from catalog', () => {
    const { result } = renderHook(() => useAlliesData('knight-1'));

    expect(result.current.saints.options).toEqual([
      { id: 'saint-george', name: 'Saint George' },
      { id: 'saint-michael', name: 'Saint Michael' },
      { id: 'saint-patrick', name: 'Saint Patrick' },
    ]);

    expect(result.current.mercenaries.options).toEqual([
      { id: 'black-knight', name: 'Black Knight' },
      { id: 'white-knight', name: 'White Knight' },
      { id: 'red-knight', name: 'Red Knight' },
    ]);
  });

  it('handles non-existent knight', () => {
    const { result } = renderHook(() => useAlliesData('non-existent'));

    expect(result.current.saints.selected).toEqual([]);
    expect(result.current.mercenaries.selected).toEqual([]);
    expect(result.current.saints.options).toHaveLength(3);
    expect(result.current.mercenaries.options).toHaveLength(3);
  });
});
