// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
    useThemeTokens: () => ({
        tokens: {
            textPrimary: '#fff',
            textMuted: '#aaa',
            surface: '#222',
            accent: '#4ade80',
        },
    }),
}));

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import AddExistingKnights from '../AddExistingKnights';

describe('AddExistingKnights', () => {
    const mockOnAddActive = jest.fn();
    const mockOnBench = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty state when no knights available', () => {
        const { getByText } = render(
            <AddExistingKnights
                list={[]}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        expect(getByText('No other knights available. Create a new one below.')).toBeTruthy();
    });

    it('renders empty state when list is null', () => {
        const { getByText } = render(
            <AddExistingKnights
                list={null}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        expect(getByText('No other knights available. Create a new one below.')).toBeTruthy();
    });

    it('renders knight list when knights are available', () => {
        const mockList = [
            { knightUID: 'knight-1', name: 'Sir Galahad', catalogId: 'galahad' },
            { knightUID: 'knight-2', name: 'Sir Lancelot', catalogId: 'lancelot' },
        ];

        const { getByText } = render(
            <AddExistingKnights
                list={mockList}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        expect(getByText('Sir Galahad')).toBeTruthy();
        expect(getByText('galahad')).toBeTruthy();
        expect(getByText('Sir Lancelot')).toBeTruthy();
        expect(getByText('lancelot')).toBeTruthy();
    });

    it('renders action buttons for each knight', () => {
        const mockList = [
            { knightUID: 'knight-1', name: 'Sir Galahad', catalogId: 'galahad' },
        ];

        const { getByText } = render(
            <AddExistingKnights
                list={mockList}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        expect(getByText('Add Active')).toBeTruthy();
        expect(getByText('Bench')).toBeTruthy();
    });

    it('calls onAddActive when Add Active button is pressed', () => {
        const mockList = [
            { knightUID: 'knight-1', name: 'Sir Galahad', catalogId: 'galahad' },
        ];

        const { getByText } = render(
            <AddExistingKnights
                list={mockList}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        fireEvent.press(getByText('Add Active'));

        expect(mockOnAddActive).toHaveBeenCalledWith('knight-1');
    });

    it('calls onBench when Bench button is pressed', () => {
        const mockList = [
            { knightUID: 'knight-1', name: 'Sir Galahad', catalogId: 'galahad' },
        ];

        const { getByText } = render(
            <AddExistingKnights
                list={mockList}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        fireEvent.press(getByText('Bench'));

        expect(mockOnBench).toHaveBeenCalledWith('knight-1');
    });

    it('handles multiple knights correctly', () => {
        const mockList = [
            { knightUID: 'knight-1', name: 'Sir Galahad', catalogId: 'galahad' },
            { knightUID: 'knight-2', name: 'Sir Lancelot', catalogId: 'lancelot' },
        ];

        const { getAllByText } = render(
            <AddExistingKnights
                list={mockList}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        // Click Add Active for first knight
        const addActiveButtons = getAllByText('Add Active');
        fireEvent.press(addActiveButtons[0]);

        // Click Bench for second knight
        const benchButtons = getAllByText('Bench');
        fireEvent.press(benchButtons[1]);

        expect(mockOnAddActive).toHaveBeenCalledWith('knight-1');
        expect(mockOnBench).toHaveBeenCalledWith('knight-2');
    });

    it('displays knight name and catalog ID correctly', () => {
        const mockList = [
            { knightUID: 'knight-1', name: 'Sir Galahad', catalogId: 'galahad' },
        ];

        const { getByText } = render(
            <AddExistingKnights
                list={mockList}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        const knightName = getByText('Sir Galahad');
        const catalogId = getByText('galahad');

        expect(knightName.props.style).toMatchObject({
            color: '#fff',
            fontWeight: '700',
        });

        expect(catalogId.props.style).toMatchObject({
            color: '#aaa',
            fontSize: 12,
        });
    });

    it('handles long knight names with numberOfLines', () => {
        const mockList = [
            { knightUID: 'knight-1', name: 'Very Long Knight Name That Should Be Truncated', catalogId: 'galahad' },
        ];

        const { getByText } = render(
            <AddExistingKnights
                list={mockList}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        const knightName = getByText('Very Long Knight Name That Should Be Truncated');
        expect(knightName.props.numberOfLines).toBe(1);
    });

    it('handles long catalog IDs with numberOfLines', () => {
        const mockList = [
            { knightUID: 'knight-1', name: 'Sir Galahad', catalogId: 'very-long-catalog-id-that-should-be-truncated' },
        ];

        const { getByText } = render(
            <AddExistingKnights
                list={mockList}
                onAddActive={mockOnAddActive}
                onBench={mockOnBench}
            />
        );

        const catalogId = getByText('very-long-catalog-id-that-should-be-truncated');
        expect(catalogId.props.numberOfLines).toBe(1);
    });
});
