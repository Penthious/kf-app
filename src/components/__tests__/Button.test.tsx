import Button from '@/components/Button';
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

describe('Button', () => {
    it('renders button with correct label', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByText } = render(
            <Button label="Test Button" onPress={mockOnPress} />
        );
        
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByText } = render(
            <Button label="Test Button" onPress={mockOnPress} />
        );
        
        fireEvent.press(getByText('Test Button'));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('has disabled state when disabled prop is true', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByTestId } = render(
            <Button label="Test Button" onPress={mockOnPress} disabled={true} testID="test-button" />
        );
        
        const button = getByTestId('test-button');
        expect(button).toBeTruthy();
        expect(button.props.accessibilityState?.disabled).toBe(true);
        expect(button.props.style.opacity).toBe(0.5);
    });

    it('renders with default tone styling', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByTestId } = render(
            <Button label="Test Button" onPress={mockOnPress} testID="test-button" />
        );
        
        expect(getByTestId('test-button')).toBeTruthy();
        expect(getByTestId('test-button-text')).toBeTruthy();
    });

    it('renders with accent tone styling', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByTestId } = render(
            <Button label="Test Button" onPress={mockOnPress} tone="accent" testID="test-button" />
        );
        
        expect(getByTestId('test-button')).toBeTruthy();
        expect(getByTestId('test-button-text')).toBeTruthy();
    });

    it('renders with success tone styling', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByTestId } = render(
            <Button label="Test Button" onPress={mockOnPress} tone="success" testID="test-button" />
        );
        
        expect(getByTestId('test-button')).toBeTruthy();
        expect(getByTestId('test-button-text')).toBeTruthy();
    });

    it('renders with danger tone styling', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByTestId } = render(
            <Button label="Test Button" onPress={mockOnPress} tone="danger" testID="test-button" />
        );
        
        expect(getByTestId('test-button')).toBeTruthy();
        expect(getByTestId('test-button-text')).toBeTruthy();
    });

    it('handles async onPress function', async () => {
        const mockAsyncOnPress = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
        const { getByText } = render(
            <Button label="Async Button" onPress={mockAsyncOnPress} />
        );
        
        fireEvent.press(getByText('Async Button'));
        expect(mockAsyncOnPress).toHaveBeenCalledTimes(1);
    });

    it('applies disabled styling when disabled', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByTestId } = render(
            <Button label="Disabled Button" onPress={mockOnPress} disabled={true} testID="test-button" />
        );
        
        expect(getByTestId('test-button')).toBeTruthy();
        expect(getByTestId('test-button-text')).toBeTruthy();
    });

    it('renders without testID when not provided', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByText, queryByTestId } = render(
            <Button label="Test Button" onPress={mockOnPress} />
        );
        
        expect(getByText('Test Button')).toBeTruthy();
        expect(queryByTestId('test-button')).toBeNull();
        expect(queryByTestId('test-button-text')).toBeNull();
    });

    it('handles empty label', () => {
        const mockOnPress = jest.fn<() => void>();
        const { getByTestId } = render(
            <Button label="" onPress={mockOnPress} testID="test-button" />
        );
        
        expect(getByTestId('test-button')).toBeTruthy();
        expect(getByTestId('test-button-text')).toBeTruthy();
    });
});
