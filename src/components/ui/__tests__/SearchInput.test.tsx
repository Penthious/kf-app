import SearchInput from '@/components/ui/SearchInput';
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

describe('SearchInput', () => {
    it('renders with default placeholder', () => {
        const mockOnChangeText = jest.fn();
        const { getByPlaceholderText } = render(
            <SearchInput value="" onChangeText={mockOnChangeText} />
        );
        
        expect(getByPlaceholderText('Search keywords...')).toBeTruthy();
    });

    it('renders with custom placeholder', () => {
        const mockOnChangeText = jest.fn();
        const { getByPlaceholderText } = render(
            <SearchInput value="" onChangeText={mockOnChangeText} placeholder="Custom placeholder" />
        );
        
        expect(getByPlaceholderText('Custom placeholder')).toBeTruthy();
    });

    it('displays the provided value', () => {
        const mockOnChangeText = jest.fn();
        const { getByDisplayValue } = render(
            <SearchInput value="test value" onChangeText={mockOnChangeText} />
        );
        
        expect(getByDisplayValue('test value')).toBeTruthy();
    });

    it('calls onChangeText when text is entered', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <SearchInput value="" onChangeText={mockOnChangeText} testID="search-input" />
        );
        
        fireEvent.changeText(getByTestId('search-input-input'), 'new text');
        expect(mockOnChangeText).toHaveBeenCalledWith('new text');
    });

    it('renders with testID when provided', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <SearchInput value="" onChangeText={mockOnChangeText} testID="search-input" />
        );
        
        expect(getByTestId('search-input')).toBeTruthy();
        expect(getByTestId('search-input-input')).toBeTruthy();
    });

    it('renders without testID when not provided', () => {
        const mockOnChangeText = jest.fn();
        const { queryByTestId } = render(
            <SearchInput value="" onChangeText={mockOnChangeText} />
        );
        
        expect(queryByTestId('search-input')).toBeNull();
        expect(queryByTestId('search-input-input')).toBeNull();
    });

    it('handles empty value', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <SearchInput value="" onChangeText={mockOnChangeText} testID="search-input" />
        );
        
        expect(getByTestId('search-input')).toBeTruthy();
        expect(getByTestId('search-input-input')).toBeTruthy();
    });

    it('handles long text input', () => {
        const mockOnChangeText = jest.fn();
        const longText = 'This is a very long search query that should be handled properly';
        const { getByTestId } = render(
            <SearchInput value={longText} onChangeText={mockOnChangeText} testID="search-input" />
        );
        
        expect(getByTestId('search-input')).toBeTruthy();
        expect(getByTestId('search-input-input')).toBeTruthy();
    });

    it('has correct input properties', () => {
        const mockOnChangeText = jest.fn();
        const { getByTestId } = render(
            <SearchInput value="" onChangeText={mockOnChangeText} testID="search-input" />
        );
        
        const input = getByTestId('search-input-input');
        expect(input.props.autoCorrect).toBe(false);
        expect(input.props.autoCapitalize).toBe('none');
    });
});
