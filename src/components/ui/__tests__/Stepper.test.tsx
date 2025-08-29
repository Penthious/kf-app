import Stepper from '@/components/ui/Stepper';
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

describe('Stepper', () => {
  it('renders with default value', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<Stepper value={5} onChange={mockOnChange} testID='stepper' />);

    expect(getByTestId('stepper')).toBeTruthy();
    expect(getByTestId('stepper-value')).toBeTruthy();
    expect(getByTestId('stepper-decrease')).toBeTruthy();
    expect(getByTestId('stepper-increase')).toBeTruthy();
  });

  it('displays the current value', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<Stepper value={10} onChange={mockOnChange} testID='stepper' />);

    expect(getByTestId('stepper-value').props.children).toBe('10');
  });

  it('increments value when increase button is pressed', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<Stepper value={5} onChange={mockOnChange} testID='stepper' />);

    fireEvent.press(getByTestId('stepper-increase'));
    expect(mockOnChange).toHaveBeenCalledWith(6);
  });

  it('decrements value when decrease button is pressed', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<Stepper value={5} onChange={mockOnChange} testID='stepper' />);

    fireEvent.press(getByTestId('stepper-decrease'));
    expect(mockOnChange).toHaveBeenCalledWith(4);
  });

  it('respects minimum value constraint', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Stepper value={0} onChange={mockOnChange} min={0} testID='stepper' />
    );

    // Try to decrease below minimum
    fireEvent.press(getByTestId('stepper-decrease'));
    expect(mockOnChange).not.toHaveBeenCalled();

    // Decrease button should be disabled
    expect(getByTestId('stepper-decrease').props.accessibilityState?.disabled).toBe(true);
  });

  it('respects maximum value constraint', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Stepper value={10} onChange={mockOnChange} max={10} testID='stepper' />
    );

    // Try to increase above maximum
    fireEvent.press(getByTestId('stepper-increase'));
    expect(mockOnChange).not.toHaveBeenCalled();

    // Increase button should be disabled
    expect(getByTestId('stepper-increase').props.accessibilityState?.disabled).toBe(true);
  });

  it('uses custom step value', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Stepper value={5} onChange={mockOnChange} step={2} testID='stepper' />
    );

    fireEvent.press(getByTestId('stepper-increase'));
    expect(mockOnChange).toHaveBeenCalledWith(7);

    fireEvent.press(getByTestId('stepper-decrease'));
    expect(mockOnChange).toHaveBeenCalledWith(3);
  });

  it('disables buttons when component is disabled', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Stepper value={5} onChange={mockOnChange} disabled={true} testID='stepper' />
    );

    expect(getByTestId('stepper-decrease').props.accessibilityState?.disabled).toBe(true);
    expect(getByTestId('stepper-increase').props.accessibilityState?.disabled).toBe(true);
  });

  it('renders in editable mode when specified', () => {
    const mockOnChange = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <Stepper value={5} onChange={mockOnChange} editable={true} testID='stepper' />
    );

    expect(getByTestId('stepper-input')).toBeTruthy();
    expect(queryByTestId('stepper-display')).toBeNull();
    expect(queryByTestId('stepper-value')).toBeNull();
  });

  it('renders in display mode when not editable', () => {
    const mockOnChange = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <Stepper value={5} onChange={mockOnChange} editable={false} testID='stepper' />
    );

    expect(getByTestId('stepper-display')).toBeTruthy();
    expect(getByTestId('stepper-value')).toBeTruthy();
    expect(queryByTestId('stepper-input')).toBeNull();
  });

  it('handles text input in editable mode', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Stepper value={5} onChange={mockOnChange} editable={true} testID='stepper' />
    );

    const input = getByTestId('stepper-input');
    fireEvent.changeText(input, '10');
    fireEvent(input, 'blur');

    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it('clamps input values to min/max range', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Stepper
        value={5}
        onChange={mockOnChange}
        min={0}
        max={10}
        editable={true}
        testID='stepper'
      />
    );

    const input = getByTestId('stepper-input');
    fireEvent.changeText(input, '15');
    fireEvent(input, 'blur');

    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it('uses custom format function when provided', () => {
    const mockOnChange = jest.fn();
    const formatValue = (value: number) => `$${value}`;
    const { getByTestId } = render(
      <Stepper value={5} onChange={mockOnChange} formatValue={formatValue} testID='stepper' />
    );

    expect(getByTestId('stepper-value').props.children).toBe('$5');
  });

  it('uses custom parse function when provided', () => {
    const mockOnChange = jest.fn();
    const parseValue = (text: string) => parseInt(text.replace('$', ''), 10);
    const { getByTestId } = render(
      <Stepper
        value={5}
        onChange={mockOnChange}
        parseValue={parseValue}
        editable={true}
        testID='stepper'
      />
    );

    const input = getByTestId('stepper-input');
    fireEvent.changeText(input, '$10');
    fireEvent(input, 'blur');

    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it('renders without testID when not provided', () => {
    const mockOnChange = jest.fn();
    const { queryByTestId } = render(<Stepper value={5} onChange={mockOnChange} />);

    expect(queryByTestId('stepper')).toBeNull();
    expect(queryByTestId('stepper-decrease')).toBeNull();
    expect(queryByTestId('stepper-increase')).toBeNull();
  });

  it('handles negative values', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<Stepper value={-5} onChange={mockOnChange} testID='stepper' />);

    expect(getByTestId('stepper-value').props.children).toBe('-5');
  });

  it('handles zero value', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(<Stepper value={0} onChange={mockOnChange} testID='stepper' />);

    expect(getByTestId('stepper-value').props.children).toBe('0');
  });

  it('handles large values', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Stepper value={999999} onChange={mockOnChange} testID='stepper' />
    );

    expect(getByTestId('stepper-value').props.children).toBe('999999');
  });

  it('passes through input props in editable mode', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Stepper
        value={5}
        onChange={mockOnChange}
        editable={true}
        inputProps={{ placeholder: 'Custom placeholder' }}
        testID='stepper'
      />
    );

    const input = getByTestId('stepper-input');
    expect(input.props.placeholder).toBe('Custom placeholder');
  });
});
