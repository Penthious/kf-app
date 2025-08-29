import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

// Mock uuid
jest.mock('react-native-uuid', () => ({
    v4: jest.fn(() => 'test-uuid'),
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
                    notes: [
                        { id: '1', text: 'First note', at: 1000 },
                        { id: '2', text: 'Second note', at: 2000 },
                        { id: '3', text: 'Third note', at: 3000 },
                    ],
                },
            },
            'knight-2': {
                uid: 'knight-2',
                name: 'Sir Lancelot',
                sheet: {},
            },
        },
        updateKnightSheet: mockUpdateKnightSheet,
    }),
}));

import { useNotesData } from '../useNotesData';

describe('useNotesData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns notes sorted by timestamp (newest first)', () => {
        const { result } = renderHook(() => useNotesData('knight-1'));

        expect(result.current.notes).toHaveLength(3);
        expect(result.current.notes[0].at).toBe(3000); // newest first
        expect(result.current.notes[1].at).toBe(2000);
        expect(result.current.notes[2].at).toBe(1000);
    });

    it('returns empty array for knight without notes', () => {
        const { result } = renderHook(() => useNotesData('knight-2'));

        expect(result.current.notes).toHaveLength(0);
    });

    it('adds a new note correctly', () => {
        const { result } = renderHook(() => useNotesData('knight-1'));

        result.current.addNote('New test note');

        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
            notes: [
                { id: '1', text: 'First note', at: 1000 },
                { id: '2', text: 'Second note', at: 2000 },
                { id: '3', text: 'Third note', at: 3000 },
                { id: 'test-uuid', text: 'New test note', at: expect.any(Number) },
            ],
        });
    });

    it('does not add empty or whitespace-only notes', () => {
        const { result } = renderHook(() => useNotesData('knight-1'));

        result.current.addNote('');
        result.current.addNote('   ');

        expect(mockUpdateKnightSheet).not.toHaveBeenCalled();
    });

    it('trims whitespace when adding notes', () => {
        const { result } = renderHook(() => useNotesData('knight-1'));

        result.current.addNote('  Trimmed note  ');

        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
            notes: [
                { id: '1', text: 'First note', at: 1000 },
                { id: '2', text: 'Second note', at: 2000 },
                { id: '3', text: 'Third note', at: 3000 },
                { id: 'test-uuid', text: 'Trimmed note', at: expect.any(Number) },
            ],
        });
    });

    it('updates an existing note correctly', () => {
        const { result } = renderHook(() => useNotesData('knight-1'));

        result.current.updateNote('2', 'Updated note text');

        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
            notes: [
                { id: '1', text: 'First note', at: 1000 },
                { id: '2', text: 'Updated note text', at: expect.any(Number) },
                { id: '3', text: 'Third note', at: 3000 },
            ],
        });
    });

    it('does not update note with empty or whitespace-only text', () => {
        const { result } = renderHook(() => useNotesData('knight-1'));

        result.current.updateNote('2', '');
        result.current.updateNote('2', '   ');

        expect(mockUpdateKnightSheet).not.toHaveBeenCalled();
    });

    it('trims whitespace when updating notes', () => {
        const { result } = renderHook(() => useNotesData('knight-1'));

        result.current.updateNote('2', '  Updated trimmed note  ');

        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
            notes: [
                { id: '1', text: 'First note', at: 1000 },
                { id: '2', text: 'Updated trimmed note', at: expect.any(Number) },
                { id: '3', text: 'Third note', at: 3000 },
            ],
        });
    });

    it('deletes a note correctly', () => {
        const { result } = renderHook(() => useNotesData('knight-1'));

        result.current.deleteNote('2');

        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
            notes: [
                { id: '1', text: 'First note', at: 1000 },
                { id: '3', text: 'Third note', at: 3000 },
            ],
        });
    });

    it('handles non-existent note deletion gracefully', () => {
        const { result } = renderHook(() => useNotesData('knight-1'));

        result.current.deleteNote('non-existent');

        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
            notes: [
                { id: '1', text: 'First note', at: 1000 },
                { id: '2', text: 'Second note', at: 2000 },
                { id: '3', text: 'Third note', at: 3000 },
            ],
        });
    });

    it('handles knight with undefined notes', () => {
        // Mock knight with undefined notes
        jest.doMock('@/store/knights', () => ({
            useKnights: () => ({
                knightsById: {
                    'knight-3': {
                        uid: 'knight-3',
                        name: 'Sir Unknown',
                        sheet: {},
                    },
                },
                updateKnightSheet: mockUpdateKnightSheet,
            }),
        }));

        const { result } = renderHook(() => useNotesData('knight-3'));

        expect(result.current.notes).toHaveLength(0);
    });

    it('handles knight with null notes', () => {
        // Mock knight with null notes
        jest.doMock('@/store/knights', () => ({
            useKnights: () => ({
                knightsById: {
                    'knight-4': {
                        uid: 'knight-4',
                        name: 'Sir Null',
                        sheet: { notes: null },
                    },
                },
                updateKnightSheet: mockUpdateKnightSheet,
            }),
        }));

        const { result } = renderHook(() => useNotesData('knight-4'));

        expect(result.current.notes).toHaveLength(0);
    });
});
