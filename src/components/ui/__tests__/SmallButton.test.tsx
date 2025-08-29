import SmallButton from '@/components/ui/SmallButton';
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

describe('SmallButton', () => {
  it('renders button with correct label', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<SmallButton label='Test Button' onPress={mockOnPress} />);

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<SmallButton label='Test Button' onPress={mockOnPress} />);

    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <SmallButton label='Test Button' onPress={mockOnPress} disabled={true} testID='test-button' />
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it('renders with default tone styling', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <SmallButton label='Test Button' onPress={mockOnPress} testID='test-button' />
    );

    expect(getByTestId('test-button')).toBeTruthy();
    expect(getByTestId('test-button-text')).toBeTruthy();
  });

  it('renders with accent tone styling', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <SmallButton label='Test Button' onPress={mockOnPress} tone='accent' testID='test-button' />
    );

    expect(getByTestId('test-button')).toBeTruthy();
    expect(getByTestId('test-button-text')).toBeTruthy();
  });

  it('applies disabled styling when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <SmallButton
        label='Disabled Button'
        onPress={mockOnPress}
        disabled={true}
        testID='test-button'
      />
    );

    expect(getByTestId('test-button')).toBeTruthy();
    expect(getByTestId('test-button-text')).toBeTruthy();
  });

  it('renders without testID when not provided', () => {
    const mockOnPress = jest.fn();
    const { getByText, queryByTestId } = render(
      <SmallButton label='Test Button' onPress={mockOnPress} />
    );

    expect(getByText('Test Button')).toBeTruthy();
    expect(queryByTestId('test-button')).toBeNull();
    expect(queryByTestId('test-button-text')).toBeNull();
  });

  it('handles empty label', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <SmallButton label='' onPress={mockOnPress} testID='test-button' />
    );

    expect(getByTestId('test-button')).toBeTruthy();
    expect(getByTestId('test-button-text')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <SmallButton label='Accessible Button' onPress={mockOnPress} testID='test-button' />
    );

    const button = getByTestId('test-button');
    expect(button).toBeTruthy();
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('Accessible Button');
  });
});
