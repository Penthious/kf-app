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

// Mock AllyChip component
jest.mock('../AllyChip', () => {
    const React = require('react');
    const { Text, Pressable } = require('react-native');
    
    function MockAllyChip({ label, onRemove }: any) {
        return (
            <Pressable onPress={onRemove} testID={`chip-${label}`}>
                <Text>{label}</Text>
                <Text>✕</Text>
            </Pressable>
        );
    }
    
    return { AllyChip: MockAllyChip };
});

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { AllySection } from '../AllySection';

describe('AllySection', () => {
    const mockOnAdd = jest.fn();
    const mockOnRemove = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the section title', () => {
        const { getByText } = render(
            <AllySection
                title="Saints"
                allies={[]}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(getByText('Saints')).toBeTruthy();
    });

    it('renders the add button', () => {
        const { getByText } = render(
            <AllySection
                title="Saints"
                allies={[]}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(getByText('Add')).toBeTruthy();
    });

    it('calls onAdd when add button is pressed', () => {
        const { getByText } = render(
            <AllySection
                title="Saints"
                allies={[]}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        fireEvent.press(getByText('Add'));

        expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });

    it('shows "None" when no allies are present', () => {
        const { getByText } = render(
            <AllySection
                title="Saints"
                allies={[]}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(getByText('None')).toBeTruthy();
    });

    it('renders ally chips when allies are present', () => {
        const { getByTestId } = render(
            <AllySection
                title="Saints"
                allies={['Saint George', 'Saint Michael']}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(getByTestId('chip-Saint George')).toBeTruthy();
        expect(getByTestId('chip-Saint Michael')).toBeTruthy();
    });

    it('calls onRemove when ally chip remove button is pressed', () => {
        const { getByTestId } = render(
            <AllySection
                title="Saints"
                allies={['Saint George']}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        fireEvent.press(getByTestId('chip-Saint George'));

        expect(mockOnRemove).toHaveBeenCalledWith('Saint George');
    });

    it('handles multiple allies', () => {
        const { getByTestId, getByText } = render(
            <AllySection
                title="Mercenaries"
                allies={['Black Knight', 'White Knight', 'Red Knight']}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(getByText('Mercenaries')).toBeTruthy();
        expect(getByTestId('chip-Black Knight')).toBeTruthy();
        expect(getByTestId('chip-White Knight')).toBeTruthy();
        expect(getByTestId('chip-Red Knight')).toBeTruthy();
    });

    it('applies correct styling to the section header', () => {
        const { getByText } = render(
            <AllySection
                title="Saints"
                allies={[]}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        const titleText = getByText('Saints');
        const addButton = getByText('Add');

        expect(titleText.props.style).toMatchObject({
            color: '#fff',
            fontWeight: '700',
        });

        expect(addButton.props.style).toMatchObject({
            color: '#0B0B0B',
            fontWeight: '800',
        });
    });

    it('handles empty title', () => {
        const { getByText } = render(
            <AllySection
                title=""
                allies={[]}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(getByText('')).toBeTruthy();
    });

    it('handles special characters in title', () => {
        const { getByText } = render(
            <AllySection
                title="Saints & Mercenaries"
                allies={[]}
                onAdd={mockOnAdd}
                onRemove={mockOnRemove}
            />
        );

        expect(getByText('Saints & Mercenaries')).toBeTruthy();
    });
});
