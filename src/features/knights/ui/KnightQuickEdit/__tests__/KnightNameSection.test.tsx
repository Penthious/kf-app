import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { KnightNameSection } from '../KnightNameSection';

// Mock the TextRow component
jest.mock('@/components/ui/TextRow', () => {
    const React = require('react');
    const { View, Text, TextInput } = require('react-native');
    
    return function MockTextRow({ label, value, onChangeText, placeholder, testID }: { label?: string; value?: string; onChangeText?: (text: string) => void; placeholder?: string; testID?: string }) {
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

describe('KnightNameSection', () => {
    const mockSetName = jest.fn<() => void>();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with name input', () => {
        const { getByTestId, getByText } = render(
            <KnightNameSection
                name="Test Knight"
                setName={mockSetName}
                testID="name-section"
            />
        );

        expect(getByTestId('name-section-name-input')).toBeTruthy();
        expect(getByText('Name')).toBeTruthy();
        expect(getByTestId('name-section-name-input-input')).toBeTruthy();
    });

    it('displays the provided name', () => {
        const { getByTestId } = render(
            <KnightNameSection
                name="Sir Galahad"
                setName={mockSetName}
                testID="name-section"
            />
        );

        const input = getByTestId('name-section-name-input-input');
        expect(input.props.value).toBe('Sir Galahad');
    });

    it('calls setName when text changes', () => {
        const { getByTestId } = render(
            <KnightNameSection
                name=""
                setName={mockSetName}
                testID="name-section"
            />
        );

        const input = getByTestId('name-section-name-input-input');
        fireEvent.changeText(input, 'New Knight Name');

        expect(mockSetName).toHaveBeenCalledWith('New Knight Name');
    });

    it('renders without testID when not provided', () => {
        const { queryByTestId } = render(
            <KnightNameSection
                name="Test Knight"
                setName={mockSetName}
            />
        );

        expect(queryByTestId('name-section-name-input')).toBeNull();
        expect(queryByTestId('name-section-name-input-input')).toBeNull();
    });

    it('handles empty name', () => {
        const { getByTestId } = render(
            <KnightNameSection
                name=""
                setName={mockSetName}
                testID="name-section"
            />
        );

        const input = getByTestId('name-section-name-input-input');
        expect(input.props.value).toBe('');
    });
});
