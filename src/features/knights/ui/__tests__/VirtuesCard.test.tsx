import type { MockCardProps, MockStepperProps } from '../../../../test-utils/types';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import VirtuesCard from '../VirtuesCard';

// Mock the Card component
jest.mock('@/components/Card', () => {
    const React = require('react');
    const { View } = require('react-native');
    return function MockCard({ children }: MockCardProps) {
        return <View testID="card">{children}</View>;
    };
});

// Mock the Stepper component
jest.mock('@/components/ui/Stepper', () => {
    const React = require('react');
    const { View, Pressable, Text } = require('react-native');
    return function MockStepper({ value, min, max, onChange, testID }: MockStepperProps) {
        return (
            <View testID={testID}>
                <Text>{value}</Text>
                <Pressable
                    onPress={() => onChange?.(Math.min(max || 100, (value || 0) + 1))}
                    testID={testID ? `${testID}-increment` : undefined}
                >
                    <Text>+</Text>
                </Pressable>
                <Pressable
                    onPress={() => onChange?.(Math.max(min || 0, (value || 0) - 1))}
                    testID={testID ? `${testID}-decrement` : undefined}
                >
                    <Text>-</Text>
                </Pressable>
            </View>
        );
    };
});

// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
    useThemeTokens: () => ({
        tokens: {
            textPrimary: '#fff',
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
                    virtues: {
                        bravery: 5,
                        tenacity: 3,
                        sagacity: 7,
                        fortitude: 4,
                        might: 6,
                        insight: 2,
                    },
                },
            },
        },
        updateKnightSheet: mockUpdateKnightSheet,
    }),
}));

describe('VirtuesCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all virtue steppers', () => {
        const { getByText, getByTestId } = render(
            <VirtuesCard knightUID="knight-1" />
        );

        expect(getByText('Virtues')).toBeTruthy();
        expect(getByText('Bravery')).toBeTruthy();
        expect(getByText('Tenacity')).toBeTruthy();
        expect(getByText('Sagacity')).toBeTruthy();
        expect(getByText('Fortitude')).toBeTruthy();
        expect(getByText('Might')).toBeTruthy();
        expect(getByText('Insight')).toBeTruthy();
    });

    it('displays current virtue values', () => {
        const { getByText } = render(
            <VirtuesCard knightUID="knight-1" />
        );

        expect(getByText('5')).toBeTruthy(); // Bravery
        expect(getByText('3')).toBeTruthy(); // Tenacity
        expect(getByText('7')).toBeTruthy(); // Sagacity
        expect(getByText('4')).toBeTruthy(); // Fortitude
        expect(getByText('6')).toBeTruthy(); // Might
        expect(getByText('2')).toBeTruthy(); // Insight
    });

    it('calls updateKnightSheet when virtue value changes', () => {
        const { getAllByText } = render(
            <VirtuesCard knightUID="knight-1" />
        );

        // Find and click the increment button for Bravery
        const incrementButtons = getAllByText('+');
        fireEvent.press(incrementButtons[0]);

        expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
            virtues: {
                bravery: 6,
                tenacity: 3,
                sagacity: 7,
                fortitude: 4,
                might: 6,
                insight: 2,
            },
        });
    });

    it('calls updateKnightSheet when increment button is pressed', () => {
        const { getAllByText } = render(
            <VirtuesCard knightUID="knight-1" />
        );

        const incrementButtons = getAllByText('+');
        fireEvent.press(incrementButtons[0]);

        expect(mockUpdateKnightSheet).toHaveBeenCalled();
    });

    it('renders with correct styling', () => {
        const { getByText } = render(
            <VirtuesCard knightUID="knight-1" />
        );

        const virtuesTitle = getByText('Virtues');
        expect(virtuesTitle.props.style).toMatchObject({
            color: '#fff',
            fontWeight: '800',
            marginBottom: 8,
        });
    });
});
