import TextRow from '@/components/ui/TextRow';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

// ---- theme mock ----
jest.mock('@/theme/ThemeProvider', () => ({
    useThemeTokens: () => ({
        tokens: {
            bg: '#000',
            surface: '#111',
            card: '#222',
            textPrimary: '#fff',
            textMuted: '#aaa',
            accent: '#4ade80',
        },
    }),
}));

describe('TextRow', () => {
    it('renders with label and input', () => {
        const mockOnChangeText = jest.fn();
        const { getByText, getByTestId } = render(
            <TextRow 
                label="Test Label" 
                value="" 
                onChangeText={mockOnChangeText} 
                testID="text-row" 
            />
        );
        
        expect(getByText('Test Label')).toBeTruthy();
        expect(getByTestId('text-row')).toBeTruthy();
        expect(getByTestId('text-row-label')).toBeTruthy();
        expect(getByTestId('text-row-input')).toBeTruthy();
    });

    it('displays the provided value', () => {
        const mockOnChangeText = jest.fn();
        const { getByDisplayValue } = render(
            <TextRow 
                label="Test Label" 
                value="test value" 
                onChangeText={mockOnChangeText} 
            />
        );
        
        expect(getByDisplayValue('test value')).toBeTruthy();
    });

    it('calls onChangeText when text is entered', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <TextRow 
                label="Test Label" 
                value="" 
                onChangeText={mockOnChangeText} 
                testID="text-row" 
            />
        );
        
        fireEvent.changeText(getByTestId('text-row-input'), 'new text');
        expect(mockOnChangeText).toHaveBeenCalledWith('new text');
    });

    it('renders with placeholder', () => {
        const mockOnChangeText = jest.fn();
        const { getByPlaceholderText } = render(
            <TextRow 
                label="Test Label" 
                value="" 
                onChangeText={mockOnChangeText} 
                placeholder="Enter text here" 
            />
        );
        
        expect(getByPlaceholderText('Enter text here')).toBeTruthy();
    });

    it('renders as single line by default', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <TextRow 
                label="Test Label" 
                value="" 
                onChangeText={mockOnChangeText} 
                testID="text-row" 
            />
        );
        
        const input = getByTestId('text-row-input');
        expect(input.props.multiline).toBe(false);
        expect(input.props.numberOfLines).toBe(1);
    });

    it('renders as multiline when specified', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <TextRow 
                label="Test Label" 
                value="" 
                onChangeText={mockOnChangeText} 
                multiline={true}
                testID="text-row" 
            />
        );
        
        const input = getByTestId('text-row-input');
        expect(input.props.multiline).toBe(true);
        expect(input.props.numberOfLines).toBe(4);
    });

    it('renders with custom numberOfLines', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <TextRow 
                label="Test Label" 
                value="" 
                onChangeText={mockOnChangeText} 
                multiline={true}
                numberOfLines={6}
                testID="text-row" 
            />
        );
        
        const input = getByTestId('text-row-input');
        expect(input.props.numberOfLines).toBe(6);
    });

    it('renders without testID when not provided', () => {
        const mockOnChangeText = jest.fn();
        const { queryByTestId } = render(
            <TextRow 
                label="Test Label" 
                value="" 
                onChangeText={mockOnChangeText} 
            />
        );
        
        expect(queryByTestId('text-row')).toBeNull();
        expect(queryByTestId('text-row-label')).toBeNull();
        expect(queryByTestId('text-row-input')).toBeNull();
    });

    it('handles empty value', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <TextRow 
                label="Test Label" 
                value="" 
                onChangeText={mockOnChangeText} 
                testID="text-row" 
            />
        );
        
        expect(getByTestId('text-row')).toBeTruthy();
        expect(getByTestId('text-row-input')).toBeTruthy();
    });

    it('handles long text input', () => {
        const mockOnChangeText = jest.fn();
        const longText = 'This is a very long text input that should be handled properly';
        const { getByTestId } = render(
            <TextRow 
                label="Test Label" 
                value={longText} 
                onChangeText={mockOnChangeText} 
                testID="text-row" 
            />
        );
        
        expect(getByTestId('text-row')).toBeTruthy();
        expect(getByTestId('text-row-input')).toBeTruthy();
    });

    it('passes through additional TextInput props', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <TextRow 
                label="Test Label" 
                value="" 
                onChangeText={mockOnChangeText} 
                testID="text-row"
                autoCapitalize="words"
                autoCorrect={false}
            />
        );
        
        const input = getByTestId('text-row-input');
        expect(input.props.autoCapitalize).toBe('words');
        expect(input.props.autoCorrect).toBe(false);
    });
});
