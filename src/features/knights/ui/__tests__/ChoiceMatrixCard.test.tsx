import type { MockCardProps } from '../../../../test-utils/types';

// Mock the Card component
jest.mock('@/components/Card', () => {
    const React = require('react');
    const { View } = require('react-native');
    
    function MockCard({ children }: MockCardProps) {
        return <View testID="card">{children}</View>;
    }
    
    return MockCard;
});

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

// Mock knights store
const mockUpdateKnightSheet = jest.fn();
jest.mock('@/store/knights', () => ({
    useKnights: () => ({
        knightsById: {
            'knight-1': {
                uid: 'knight-1',
                name: 'Sir Galahad',
                sheet: {
                    choiceMatrix: {
                        '1': true,
                        '5': true,
                        'E3': true,
                    },
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

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import ChoiceMatrixCard from '../ChoiceMatrixCard';

describe('ChoiceMatrixCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with title', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        expect(getByText('Choice Matrix')).toBeTruthy();
    });

    it('renders section headers', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        expect(getByText('1–30')).toBeTruthy();
        expect(getByText('E1–E10')).toBeTruthy();
    });

    it('renders numbered codes 1-30', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        // Check a few numbered codes
        expect(getByText('1')).toBeTruthy();
        expect(getByText('15')).toBeTruthy();
        expect(getByText('30')).toBeTruthy();
    });

    it('renders extra codes E1-E10', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        // Check a few extra codes
        expect(getByText('E1')).toBeTruthy();
        expect(getByText('E5')).toBeTruthy();
        expect(getByText('E10')).toBeTruthy();
    });

    it('shows selected codes as checked', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        // These should be checked based on the mock data
        const code1 = getByText('1');
        const code5 = getByText('5');
        const codeE3 = getByText('E3');

        expect(code1.parent?.props.style.backgroundColor).toBe('#4ade80');
        expect(code5.parent?.props.style.backgroundColor).toBe('#4ade80');
        expect(codeE3.parent?.props.style.backgroundColor).toBe('#4ade80');
    });

    it('shows unselected codes as unchecked', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        // These should be unchecked based on the mock data
        const code2 = getByText('2');
        const codeE1 = getByText('E1');

        expect(code2.parent?.props.style.backgroundColor).toBe('#222');
        expect(codeE1.parent?.props.style.backgroundColor).toBe('#222');
    });

    it('calls updateKnightSheet when code is pressed', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        fireEvent.press(getByText('2'));

        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
            choiceMatrix: {
                '1': true,
                '2': true,
                '5': true,
                'E3': true,
            },
        });
    });

    it('toggles existing selection when code is pressed', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        fireEvent.press(getByText('1')); // This should toggle from true to false

        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
            choiceMatrix: {
                '1': false,
                '5': true,
                'E3': true,
            },
        });
    });

    it('handles knight with no choiceMatrix', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-2" />
        );

        // Should still render all codes
        expect(getByText('1')).toBeTruthy();
        expect(getByText('E1')).toBeTruthy();

        // All codes should be unchecked
        const code1 = getByText('1');
        const codeE1 = getByText('E1');

        expect(code1.parent?.props.style.backgroundColor).toBe('#222');
        expect(codeE1.parent?.props.style.backgroundColor).toBe('#222');
    });



    it('handles non-existent knight', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="non-existent" />
        );

        // Should still render all codes
        expect(getByText('1')).toBeTruthy();
        expect(getByText('E1')).toBeTruthy();

        // All codes should be unchecked
        const code1 = getByText('1');
        const codeE1 = getByText('E1');

        expect(code1.parent?.props.style.backgroundColor).toBe('#222');
        expect(codeE1.parent?.props.style.backgroundColor).toBe('#222');
    });

    it('applies correct styling to checked pills', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        const checkedPill = getByText('1').parent;
        const checkedText = getByText('1');

        expect(checkedPill?.props.style).toMatchObject({
            backgroundColor: '#4ade80',
            borderWidth: 1,
            borderColor: '#0006',
            borderRadius: 16,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
        });

        expect(checkedText.props.style).toMatchObject({
            color: '#0B0B0B',
            fontWeight: '800',
        });
    });

    it('applies correct styling to unchecked pills', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        const uncheckedPill = getByText('2').parent;
        const uncheckedText = getByText('2');

        expect(uncheckedPill?.props.style).toMatchObject({
            backgroundColor: '#222',
            borderWidth: 1,
            borderColor: '#0006',
            borderRadius: 16,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
        });

        expect(uncheckedText.props.style).toMatchObject({
            color: '#fff',
            fontWeight: '800',
        });
    });

    it('has correct accessibility properties', () => {
        const { getByText } = render(
            <ChoiceMatrixCard knightUID="knight-1" />
        );

        const checkedPill = getByText('1').parent;
        const uncheckedPill = getByText('2').parent;

        expect(checkedPill?.props.accessibilityRole).toBe('button');
        expect(checkedPill?.props.accessibilityState).toEqual({ selected: true });

        expect(uncheckedPill?.props.accessibilityRole).toBe('button');
        expect(uncheckedPill?.props.accessibilityState).toEqual({ selected: false });
    });
});
