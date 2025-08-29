import type { MockCardProps, MockCardTitleProps, MockPillProps, MockTextRowProps } from '../../../../test-utils/types';

// Mock the Card component
jest.mock('@/components/Card', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    
    function MockCard({ children }: MockCardProps) {
        return <View testID="card">{children}</View>;
    }
    
    MockCard.Title = function MockCardTitle({ children }: MockCardTitleProps) {
        return <Text testID="card-title">{children}</Text>;
    };
    
    return MockCard;
});

// Mock the TextRow component
jest.mock('@/components/ui/TextRow', () => {
    const React = require('react');
    const { View, Text, TextInput } = require('react-native');
    return function MockTextRow({ label, value, onChangeText, placeholder, testID }: MockTextRowProps) {
        return (
            <View testID={testID}>
                <Text>{label}</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    testID={testID ? `${testID}-input` : undefined}
                />
            </View>
        );
    };
});

// Mock the Pill component
jest.mock('@/components/ui/Pill', () => {
    const React = require('react');
    const { Pressable, Text } = require('react-native');
    return function MockPill({ label, selected, onPress, testID }: MockPillProps) {
        return (
            <Pressable
                onPress={onPress}
                testID={testID}
                style={{ backgroundColor: selected ? '#4ade80' : '#222' }}
            >
                <Text style={{ color: selected ? '#0B0B0B' : '#fff' }}>{label}</Text>
            </Pressable>
        );
    };
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

// Mock knight catalog
jest.mock('@/catalogs/knights', () => [
    { id: 'knight-1', name: 'Sir Galahad' },
    { id: 'knight-2', name: 'Sir Lancelot' },
    { id: 'knight-3', name: 'Sir Percival' },
]);

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import QuickCreateKnight from '../QuickCreateKnight';

describe('QuickCreateKnight', () => {
    const mockOnCreate = jest.fn<() => void>();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with title', () => {
        const { getByText, getByTestId } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        expect(getByText('Quick-Create Knight')).toBeTruthy();
        expect(getByTestId('card-title')).toBeTruthy();
    });

    it('renders name input field', () => {
        const { getByText, getByTestId } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        expect(getByText('Name')).toBeTruthy();
        expect(getByTestId('card')).toBeTruthy();
    });

    it('renders catalog knight selection', () => {
        const { getByText } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        expect(getByText('Catalog Knight')).toBeTruthy();
        expect(getByText('Sir Galahad')).toBeTruthy();
        expect(getByText('Sir Lancelot')).toBeTruthy();
        expect(getByText('Sir Percival')).toBeTruthy();
    });

    it('renders create buttons', () => {
        const { getByText } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        expect(getByText('Create as Benched')).toBeTruthy();
        expect(getByText('Create & Activate')).toBeTruthy();
    });

    it('disables create buttons when form is incomplete', () => {
        const { getByText } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        const benchedButton = getByText('Create as Benched').parent;
        const activateButton = getByText('Create & Activate').parent;

        expect(benchedButton.props.style.opacity).toBe(0.5);
        expect(activateButton.props.style.opacity).toBe(0.5);
    });

    it('enables create buttons when form is complete', () => {
        const { getByText, getAllByText } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        // Fill in the form
        const nameInput = getByText('Name').parent;
        fireEvent.changeText(nameInput, 'Test Knight');

        // Select a catalog knight
        const catalogPills = getAllByText('Sir Galahad');
        fireEvent.press(catalogPills[0]);

        const benchedButton = getByText('Create as Benched').parent;
        const activateButton = getByText('Create & Activate').parent;

        expect(benchedButton.props.style.opacity).toBe(1);
        expect(activateButton.props.style.opacity).toBe(1);
    });

    it('calls onCreate with correct data when creating as benched', () => {
        const { getByText, getAllByText } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        // Fill in the form
        const nameInput = getByText('Name').parent;
        fireEvent.changeText(nameInput, 'Test Knight');

        // Select a catalog knight
        const catalogPills = getAllByText('Sir Galahad');
        fireEvent.press(catalogPills[0]);

        // Click create as benched
        fireEvent.press(getByText('Create as Benched'));

        expect(mockOnCreate).toHaveBeenCalledWith({
            name: 'Test Knight',
            catalogId: 'knight-1',
            asActive: false,
        });
    });

    it('calls onCreate with correct data when creating and activating', () => {
        const { getByText, getAllByText } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        // Fill in the form
        const nameInput = getByText('Name').parent;
        fireEvent.changeText(nameInput, 'Test Knight');

        // Select a catalog knight
        const catalogPills = getAllByText('Sir Galahad');
        fireEvent.press(catalogPills[0]);

        // Click create and activate
        fireEvent.press(getByText('Create & Activate'));

        expect(mockOnCreate).toHaveBeenCalledWith({
            name: 'Test Knight',
            catalogId: 'knight-1',
            asActive: true,
        });
    });

    it('clears form after creating knight', () => {
        const { getByText, getAllByText } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        // Fill in the form
        const nameInput = getByText('Name').parent;
        fireEvent.changeText(nameInput, 'Test Knight');

        // Select a catalog knight
        const catalogPills = getAllByText('Sir Galahad');
        fireEvent.press(catalogPills[0]);

        // Click create
        fireEvent.press(getByText('Create as Benched'));

        // Form should be cleared
        expect(nameInput.props.children[1].props.value).toBe('');
    });

    it('trims whitespace from knight name', () => {
        const { getByText, getAllByText } = render(
            <QuickCreateKnight onCreate={mockOnCreate} />
        );

        // Fill in the form with whitespace
        const nameInput = getByText('Name').parent;
        fireEvent.changeText(nameInput, '  Test Knight  ');

        // Select a catalog knight
        const catalogPills = getAllByText('Sir Galahad');
        fireEvent.press(catalogPills[0]);

        // Click create
        fireEvent.press(getByText('Create as Benched'));

        expect(mockOnCreate).toHaveBeenCalledWith({
            name: 'Test Knight',
            catalogId: 'knight-1',
            asActive: false,
        });
    });
});
