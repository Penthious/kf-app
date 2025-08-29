import { describe, expect, it } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
import { useKnightQuickEdit } from '../useKnightQuickEdit';

describe('useKnightQuickEdit', () => {
    const mockKnight = {
        knightUID: 'test-knight-1',
        name: 'Sir Galahad',
        sheet: {
            chapter: 3,
            investigations: {
                3: {
                    questCompleted: true,
                    completed: ['investigation-1', 'investigation-2']
                }
            },
            prologueDone: true,
            postgameDone: false,
            firstDeath: true
        }
    };

    it('initializes with knight data', () => {
        const { result } = renderHook(() => useKnightQuickEdit(mockKnight));

        expect(result.current.name).toBe('Sir Galahad');
        expect(result.current.chapter).toBe(3);
        expect(result.current.questCompleted).toBe(true);
        expect(result.current.completedCount).toBe(2);
        expect(result.current.prologueDone).toBe(true);
        expect(result.current.postgameDone).toBe(false);
        expect(result.current.firstDeath).toBe(true);
        expect(result.current.canSave).toBe(true);
    });

    it('initializes with default values when no knight provided', () => {
        const { result } = renderHook(() => useKnightQuickEdit(undefined));

        expect(result.current.name).toBe('');
        expect(result.current.chapter).toBe(1);
        expect(result.current.questCompleted).toBe(false);
        expect(result.current.completedCount).toBe(0);
        expect(result.current.prologueDone).toBe(false);
        expect(result.current.postgameDone).toBe(false);
        expect(result.current.firstDeath).toBe(false);
        expect(result.current.canSave).toBe(false);
    });

    it('updates state when knight changes', () => {
        const { result, rerender } = renderHook(
            (props: { knight: any }) => useKnightQuickEdit(props.knight),
            { initialProps: { knight: undefined } }
        );

        expect(result.current.name).toBe('');

        act(() => {
            rerender({ knight: mockKnight });
        });

        expect(result.current.name).toBe('Sir Galahad');
        expect(result.current.chapter).toBe(3);
        expect(result.current.canSave).toBe(true);
    });

    it('handles knight with missing investigations data', () => {
        const knightWithoutInvestigations = {
            ...mockKnight,
            sheet: {
                ...mockKnight.sheet,
                investigations: undefined
            }
        };

        const { result } = renderHook(() => useKnightQuickEdit(knightWithoutInvestigations));

        expect(result.current.questCompleted).toBe(false);
        expect(result.current.completedCount).toBe(0);
    });

    it('handles knight with non-array completed investigations', () => {
        const knightWithInvalidCompleted = {
            ...mockKnight,
            sheet: {
                ...mockKnight.sheet,
                investigations: {
                    3: {
                        questCompleted: true,
                        completed: 'not-an-array' as unknown as string[]
                    }
                }
            }
        };

        const { result } = renderHook(() => useKnightQuickEdit(knightWithInvalidCompleted));

        expect(result.current.completedCount).toBe(0);
    });

    it('creates correct patch data', () => {
        const { result } = renderHook(() => useKnightQuickEdit(mockKnight));

        const patch = result.current.createPatch();

        expect(patch).toEqual({
            name: 'Sir Galahad',
            sheet: {
                prologueDone: true,
                postgameDone: false,
                firstDeath: true
            },
            investigationsPatch: {
                chapter: 3,
                questCompleted: true,
                completedCount: 2
            }
        });
    });

    it('canSave is false when name is empty', () => {
        const { result } = renderHook(() => useKnightQuickEdit(mockKnight));

        act(() => {
            result.current.setName('');
        });

        expect(result.current.canSave).toBe(false);
    });

    it('canSave is false when name is only whitespace', () => {
        const { result } = renderHook(() => useKnightQuickEdit(mockKnight));

        act(() => {
            result.current.setName('   ');
        });

        expect(result.current.canSave).toBe(false);
    });

    it('canSave is true when name has content', () => {
        const { result } = renderHook(() => useKnightQuickEdit(mockKnight));

        act(() => {
            result.current.setName('New Knight Name');
        });

        expect(result.current.canSave).toBe(true);
    });

    it('trims name in createPatch', () => {
        const { result } = renderHook(() => useKnightQuickEdit(mockKnight));

        act(() => {
            result.current.setName('  Trimmed Name  ');
        });

        const patch = result.current.createPatch();
        expect(patch.name).toBe('Trimmed Name');
    });
});
