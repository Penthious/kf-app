import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { KnightFlagsSection } from '../KnightFlagsSection';

// Mock the SwitchRow component
jest.mock('@/components/ui/SwitchRow', () => {
    const React = require('react');
    const { View, Text, Switch } = require('react-native');
    
    return function MockSwitchRow({ label, value, onValueChange, testID }: any) {
        return (
            <View testID={testID}>
                <Text>{label}</Text>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    testID={testID ? `${testID}-switch` : undefined}
                />
            </View>
        );
    };
});

describe('KnightFlagsSection', () => {
    const mockSetPrologue = jest.fn<() => void>();
    const mockSetPostgame = jest.fn<() => void>();
    const mockSetFirstDeath = jest.fn<() => void>();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all flag switches', () => {
        const { getByText, getByTestId } = render(
            <KnightFlagsSection
                prologueDone={false}
                setPrologue={mockSetPrologue}
                postgameDone={true}
                setPostgame={mockSetPostgame}
                firstDeath={false}
                setFirstDeath={mockSetFirstDeath}
                testID="flags-section"
            />
        );

        expect(getByText('Prologue Completed')).toBeTruthy();
        expect(getByText('Postgame Completed')).toBeTruthy();
        expect(getByText('First Death')).toBeTruthy();

        expect(getByTestId('flags-section-prologue-done')).toBeTruthy();
        expect(getByTestId('flags-section-postgame-done')).toBeTruthy();
        expect(getByTestId('flags-section-first-death')).toBeTruthy();
    });

    it('displays correct switch values', () => {
        const { getByTestId } = render(
            <KnightFlagsSection
                prologueDone={true}
                setPrologue={mockSetPrologue}
                postgameDone={false}
                setPostgame={mockSetPostgame}
                firstDeath={true}
                setFirstDeath={mockSetFirstDeath}
                testID="flags-section"
            />
        );

        const prologueSwitch = getByTestId('flags-section-prologue-done-switch');
        const postgameSwitch = getByTestId('flags-section-postgame-done-switch');
        const firstDeathSwitch = getByTestId('flags-section-first-death-switch');

        expect(prologueSwitch.props.value).toBe(true);
        expect(postgameSwitch.props.value).toBe(false);
        expect(firstDeathSwitch.props.value).toBe(true);
    });

    it('calls setPrologue when prologue switch changes', () => {
        const { getByTestId } = render(
            <KnightFlagsSection
                prologueDone={false}
                setPrologue={mockSetPrologue}
                postgameDone={false}
                setPostgame={mockSetPostgame}
                firstDeath={false}
                setFirstDeath={mockSetFirstDeath}
                testID="flags-section"
            />
        );

        const prologueSwitch = getByTestId('flags-section-prologue-done-switch');
        fireEvent(prologueSwitch, 'valueChange', true);

        expect(mockSetPrologue).toHaveBeenCalledWith(true);
    });

    it('calls setPostgame when postgame switch changes', () => {
        const { getByTestId } = render(
            <KnightFlagsSection
                prologueDone={false}
                setPrologue={mockSetPrologue}
                postgameDone={false}
                setPostgame={mockSetPostgame}
                firstDeath={false}
                setFirstDeath={mockSetFirstDeath}
                testID="flags-section"
            />
        );

        const postgameSwitch = getByTestId('flags-section-postgame-done-switch');
        fireEvent(postgameSwitch, 'valueChange', true);

        expect(mockSetPostgame).toHaveBeenCalledWith(true);
    });

    it('calls setFirstDeath when first death switch changes', () => {
        const { getByTestId } = render(
            <KnightFlagsSection
                prologueDone={false}
                setPrologue={mockSetPrologue}
                postgameDone={false}
                setPostgame={mockSetPostgame}
                firstDeath={false}
                setFirstDeath={mockSetFirstDeath}
                testID="flags-section"
            />
        );

        const firstDeathSwitch = getByTestId('flags-section-first-death-switch');
        fireEvent(firstDeathSwitch, 'valueChange', true);

        expect(mockSetFirstDeath).toHaveBeenCalledWith(true);
    });

    it('renders without testID when not provided', () => {
        const { queryByTestId } = render(
            <KnightFlagsSection
                prologueDone={false}
                setPrologue={mockSetPrologue}
                postgameDone={false}
                setPostgame={mockSetPostgame}
                firstDeath={false}
                setFirstDeath={mockSetFirstDeath}
            />
        );

        expect(queryByTestId('flags-section-prologue-done')).toBeNull();
        expect(queryByTestId('flags-section-postgame-done')).toBeNull();
        expect(queryByTestId('flags-section-first-death')).toBeNull();
    });
});
