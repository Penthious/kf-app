import type { MockCardProps } from '../../../../test-utils/types';

// Mock the Card component
jest.mock('@/components/Card', () => {
    const React = require('react');
    const { View } = require('react-native');
    return function MockCard({ children }: MockCardProps) {
        return <View testID="card">{children}</View>;
    };
});

// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
    useThemeTokens: () => ({
        tokens: {
            textPrimary: '#fff',
            accent: '#4ade80',
            surface: '#222',
        },
    }),
}));

// Mock knights store
const mockUpdateKnightSheet = jest.fn();
jest.mock('@/store/knights', () => ({
    useKnights: () => ({
        knightsById: {
            'knight-1': {
                sheet: {
                    vices: {
                        cowardice: 2,
                        dishonor: 0,
                        duplicity: 3,
                        disregard: 1,
                        cruelty: 4,
                        treachery: 0,
                    },
                },
            },
        },
        updateKnightSheet: mockUpdateKnightSheet,
    }),
}));

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import VicesCard from '../VicesCard';

describe('VicesCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all vice rows', () => {
        const { getByText } = render(
            <VicesCard knightUID="knight-1" />
        );

        expect(getByText('Vices')).toBeTruthy();
        expect(getByText('Cowardice (vs Bravery)')).toBeTruthy();
        expect(getByText('Dishonor (vs Tenacity)')).toBeTruthy();
        expect(getByText('Duplicity (vs Sagacity)')).toBeTruthy();
        expect(getByText('Disregard (vs Fortitude)')).toBeTruthy();
        expect(getByText('Cruelty (vs Might)')).toBeTruthy();
        expect(getByText('Treachery (vs Insight)')).toBeTruthy();
    });

    it('displays correct tick marks for vice levels', () => {
        const { getAllByText } = render(
            <VicesCard knightUID="knight-1" />
        );

        // Should show checkmarks for vices with levels > 0
        const checkmarks = getAllByText('✓');
        expect(checkmarks.length).toBeGreaterThan(0);
    });

    it('calls updateKnightSheet when tick is pressed', () => {
        const { getAllByText } = render(
            <VicesCard knightUID="knight-1" />
        );

        // Find and click a tick
        const ticks = getAllByText(' ');
        fireEvent.press(ticks[0]);

        expect(mockUpdateKnightSheet).toHaveBeenCalled();
    });

    it('renders with correct styling', () => {
        const { getByText } = render(
            <VicesCard knightUID="knight-1" />
        );

        const vicesTitle = getByText('Vices');
        expect(vicesTitle.props.style).toMatchObject({
            color: '#fff',
            fontWeight: '800',
            marginBottom: 8,
        });
    });

    it('handles vice with zero level', () => {
        const { getAllByText } = render(
            <VicesCard knightUID="knight-1" />
        );

        // Should show empty ticks for vices with level 0
        const emptyTicks = getAllByText(' ');
        expect(emptyTicks.length).toBeGreaterThan(0);
    });
});
