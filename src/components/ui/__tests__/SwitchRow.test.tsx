import SwitchRow from '@/components/ui/SwitchRow';
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

describe('SwitchRow', () => {
  it('renders with label and switch', () => {
    const mockOnValueChange = jest.fn();
    const { getByText, getByTestId } = render(
      <SwitchRow
        label='Test Switch'
        value={false}
        onValueChange={mockOnValueChange}
        testID='switch-row'
      />
    );

    expect(getByText('Test Switch')).toBeTruthy();
    expect(getByTestId('switch-row')).toBeTruthy();
    expect(getByTestId('switch-row-label')).toBeTruthy();
    expect(getByTestId('switch-row-switch')).toBeTruthy();
  });

  it('displays switch in off state when value is false', () => {
    const mockOnValueChange = jest.fn();
    const { getByTestId } = render(
      <SwitchRow
        label='Test Switch'
        value={false}
        onValueChange={mockOnValueChange}
        testID='switch-row'
      />
    );

    const switchComponent = getByTestId('switch-row-switch');
    expect(switchComponent.props.value).toBe(false);
  });

  it('displays switch in on state when value is true', () => {
    const mockOnValueChange = jest.fn();
    const { getByTestId } = render(
      <SwitchRow
        label='Test Switch'
        value={true}
        onValueChange={mockOnValueChange}
        testID='switch-row'
      />
    );

    const switchComponent = getByTestId('switch-row-switch');
    expect(switchComponent.props.value).toBe(true);
  });

  it('calls onValueChange when switch is toggled', () => {
    const mockOnValueChange = jest.fn();
    const { getByTestId } = render(
      <SwitchRow
        label='Test Switch'
        value={false}
        onValueChange={mockOnValueChange}
        testID='switch-row'
      />
    );

    fireEvent(getByTestId('switch-row-switch'), 'valueChange', true);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('renders without testID when not provided', () => {
    const mockOnValueChange = jest.fn();
    const { queryByTestId } = render(
      <SwitchRow label='Test Switch' value={false} onValueChange={mockOnValueChange} />
    );

    expect(queryByTestId('switch-row')).toBeNull();
    expect(queryByTestId('switch-row-label')).toBeNull();
    expect(queryByTestId('switch-row-switch')).toBeNull();
  });

  it('handles empty label', () => {
    const mockOnValueChange = jest.fn();
    const { getByTestId } = render(
      <SwitchRow label='' value={false} onValueChange={mockOnValueChange} testID='switch-row' />
    );

    expect(getByTestId('switch-row')).toBeTruthy();
    expect(getByTestId('switch-row-switch')).toBeTruthy();
  });

  it('has correct switch styling properties', () => {
    const mockOnValueChange = jest.fn();
    const { getByTestId } = render(
      <SwitchRow
        label='Test Switch'
        value={false}
        onValueChange={mockOnValueChange}
        testID='switch-row'
      />
    );

    const switchComponent = getByTestId('switch-row-switch');
    expect(switchComponent.props.trackColor).toEqual({ true: '#4ade80', false: '#444' });
    expect(switchComponent.props.thumbColor).toBe('#0B0B0B');
  });

  it('handles long label text', () => {
    const mockOnValueChange = jest.fn();
    const longLabel = 'This is a very long switch label that should be handled properly';
    const { getByTestId } = render(
      <SwitchRow
        label={longLabel}
        value={false}
        onValueChange={mockOnValueChange}
        testID='switch-row'
      />
    );

    expect(getByTestId('switch-row')).toBeTruthy();
    expect(getByTestId('switch-row-switch')).toBeTruthy();
  });

  it('toggles from false to true', () => {
    const mockOnValueChange = jest.fn();
    const { getByTestId } = render(
      <SwitchRow
        label='Test Switch'
        value={false}
        onValueChange={mockOnValueChange}
        testID='switch-row'
      />
    );

    fireEvent(getByTestId('switch-row-switch'), 'valueChange', true);
    expect(mockOnValueChange).toHaveBeenCalledWith(true);
  });

  it('toggles from true to false', () => {
    const mockOnValueChange = jest.fn();
    const { getByTestId } = render(
      <SwitchRow
        label='Test Switch'
        value={true}
        onValueChange={mockOnValueChange}
        testID='switch-row'
      />
    );

    fireEvent(getByTestId('switch-row-switch'), 'valueChange', false);
    expect(mockOnValueChange).toHaveBeenCalledWith(false);
  });
});
