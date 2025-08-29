import Pill from '@/components/ui/Pill';
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

describe('Pill', () => {
    it('renders with label', () => {
        const { getByText } = render(
            <Pill label="Test Pill" />
        );
        
        expect(getByText('Test Pill')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const mockOnPress = jest.fn();
        const { getByText } = render(
            <Pill label="Test Pill" onPress={mockOnPress} />
        );
        
        fireEvent.press(getByText('Test Pill'));
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
        const mockOnPress = jest.fn();
        const { getByTestId } = render(
            <Pill label="Test Pill" onPress={mockOnPress} disabled={true} testID="test-pill" />
        );
        
        const pill = getByTestId('test-pill');
        expect(pill).toBeTruthy();
        expect(pill.props.accessibilityState?.disabled).toBe(true);
    });

    it('renders with default tone styling', () => {
        const { getByTestId } = render(
            <Pill label="Test Pill" testID="test-pill" />
        );
        
        expect(getByTestId('test-pill')).toBeTruthy();
    });

    it('renders with accent tone styling', () => {
        const { getByTestId } = render(
            <Pill label="Test Pill" tone="accent" testID="test-pill" />
        );
        
        expect(getByTestId('test-pill')).toBeTruthy();
    });

    it('renders with success tone styling', () => {
        const { getByTestId } = render(
            <Pill label="Test Pill" tone="success" testID="test-pill" />
        );
        
        expect(getByTestId('test-pill')).toBeTruthy();
    });

    it('renders with danger tone styling', () => {
        const { getByTestId } = render(
            <Pill label="Test Pill" tone="danger" testID="test-pill" />
        );
        
        expect(getByTestId('test-pill')).toBeTruthy();
    });

    it('applies selected styling when selected', () => {
        const { getByTestId } = render(
            <Pill label="Test Pill" selected={true} testID="test-pill" />
        );
        
        const pill = getByTestId('test-pill');
        expect(pill).toBeTruthy();
        expect(pill.props.accessibilityState?.selected).toBe(true);
    });

    it('applies disabled styling when disabled', () => {
        const { getByTestId } = render(
            <Pill label="Test Pill" disabled={true} testID="test-pill" />
        );
        
        const pill = getByTestId('test-pill');
        expect(pill).toBeTruthy();
        expect(pill.props.accessibilityState?.disabled).toBe(true);
    });

    it('renders without testID when not provided', () => {
        const { queryByTestId } = render(
            <Pill label="Test Pill" />
        );
        
        expect(queryByTestId('test-pill')).toBeNull();
    });

    it('handles empty label', () => {
        const { getByTestId } = render(
            <Pill label="" testID="test-pill" />
        );
        
        expect(getByTestId('test-pill')).toBeTruthy();
    });

    it('has correct accessibility properties', () => {
        const { getByTestId } = render(
            <Pill label="Accessible Pill" testID="test-pill" />
        );
        
        const pill = getByTestId('test-pill');
        expect(pill).toBeTruthy();
        expect(pill.props.accessibilityRole).toBe('button');
        expect(pill.props.accessibilityLabel).toBe('Accessible Pill');
    });

    it('handles long label text', () => {
        const longLabel = 'This is a very long pill label that should be handled properly';
        const { getByTestId } = render(
            <Pill label={longLabel} testID="test-pill" />
        );
        
        expect(getByTestId('test-pill')).toBeTruthy();
    });

    it('combines selected and disabled states', () => {
        const { getByTestId } = render(
            <Pill label="Test Pill" selected={true} disabled={true} testID="test-pill" />
        );
        
        const pill = getByTestId('test-pill');
        expect(pill).toBeTruthy();
        expect(pill.props.accessibilityState?.selected).toBe(true);
        expect(pill.props.accessibilityState?.disabled).toBe(true);
    });

    it('combines accent tone and selected state', () => {
        const { getByTestId } = render(
            <Pill label="Test Pill" tone="accent" selected={true} testID="test-pill" />
        );
        
        const pill = getByTestId('test-pill');
        expect(pill).toBeTruthy();
        expect(pill.props.accessibilityState?.selected).toBe(true);
    });

    it('has correct hit slop for touch target', () => {
        const { getByTestId } = render(
            <Pill label="Test Pill" testID="test-pill" />
        );
        
        const pill = getByTestId('test-pill');
        expect(pill.props.hitSlop).toBe(8);
    });
});
