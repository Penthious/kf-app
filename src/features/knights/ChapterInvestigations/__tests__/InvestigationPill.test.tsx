// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
    useThemeTokens: () => ({
        tokens: {
            textPrimary: '#fff',
            surface: '#222',
            accent: '#4ade80',
        },
    }),
}));

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { InvestigationPill } from '../InvestigationPill';

describe('InvestigationPill', () => {
    const mockOnPress = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders completed normal investigation with success tone', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-1',
                    isCompleted: true,
                    lastResult: 'pass',
                    via: 'normal',
                }}
                onPress={mockOnPress}
            />
        );

        expect(getByText('I1-1 • Pass')).toBeTruthy();
    });

    it('renders completed lead investigation with info tone', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-2',
                    isCompleted: true,
                    lastResult: 'pass',
                    via: 'lead',
                }}
                onPress={mockOnPress}
            />
        );

        expect(getByText('I1-2 • Lead')).toBeTruthy();
    });

    it('renders failed investigation with danger tone', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-3',
                    isCompleted: false,
                    lastResult: 'fail',
                    via: 'normal',
                }}
                onPress={mockOnPress}
            />
        );

        expect(getByText('I1-3 • Fail')).toBeTruthy();
    });

    it('renders incomplete investigation with default tone', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-4',
                    isCompleted: false,
                    lastResult: undefined,
                    via: 'normal',
                }}
                onPress={mockOnPress}
            />
        );

        expect(getByText('I1-4')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-1',
                    isCompleted: false,
                    lastResult: undefined,
                    via: 'normal',
                }}
                onPress={mockOnPress}
            />
        );

        fireEvent.press(getByText('I1-1'));

        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('applies correct styling for completed normal investigation', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-1',
                    isCompleted: true,
                    lastResult: 'pass',
                    via: 'normal',
                }}
                onPress={mockOnPress}
            />
        );

        const pill = getByText('I1-1 • Pass').parent;

        expect(pill?.props.style).toMatchObject({
            paddingHorizontal: 12,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2b6b3f', // success color
            borderWidth: 1,
            borderColor: '#0006',
        });
    });

    it('applies correct styling for completed lead investigation', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-2',
                    isCompleted: true,
                    lastResult: 'pass',
                    via: 'lead',
                }}
                onPress={mockOnPress}
            />
        );

        const pill = getByText('I1-2 • Lead').parent;

        expect(pill?.props.style).toMatchObject({
            backgroundColor: '#2f6f95', // info color
        });
    });

    it('applies correct styling for failed investigation', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-3',
                    isCompleted: false,
                    lastResult: 'fail',
                    via: 'normal',
                }}
                onPress={mockOnPress}
            />
        );

        const pill = getByText('I1-3 • Fail').parent;

        expect(pill?.props.style).toMatchObject({
            backgroundColor: '#7a2d2d', // danger color
        });
    });

    it('applies correct styling for incomplete investigation', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-4',
                    isCompleted: false,
                    lastResult: undefined,
                    via: 'normal',
                }}
                onPress={mockOnPress}
            />
        );

        const pill = getByText('I1-4').parent;

        expect(pill?.props.style).toMatchObject({
            backgroundColor: '#222', // surface color
        });
    });

    it('handles different investigation codes', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I5-3',
                    isCompleted: false,
                    lastResult: undefined,
                    via: 'normal',
                }}
                onPress={mockOnPress}
            />
        );

        expect(getByText('I5-3')).toBeTruthy();
    });

    it('handles edge case with undefined lastResult', () => {
        const { getByText } = render(
            <InvestigationPill
                entry={{
                    code: 'I1-5',
                    isCompleted: false,
                    lastResult: undefined,
                    via: 'normal',
                }}
                onPress={mockOnPress}
            />
        );

        expect(getByText('I1-5')).toBeTruthy();
    });
});
