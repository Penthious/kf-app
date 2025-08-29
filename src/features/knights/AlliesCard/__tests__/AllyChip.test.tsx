// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
  useThemeTokens: () => ({
    tokens: {
      textPrimary: '#fff',
      textMuted: '#aaa',
      surface: '#222',
    },
  }),
}));

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import { AllyChip } from '../AllyChip';

describe('AllyChip', () => {
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the ally label', () => {
    const { getByText } = render(<AllyChip label='Saint George' onRemove={mockOnRemove} />);

    expect(getByText('Saint George')).toBeTruthy();
  });

  it('renders the remove button', () => {
    const { getByText } = render(<AllyChip label='Saint George' onRemove={mockOnRemove} />);

    expect(getByText('✕')).toBeTruthy();
  });

  it('calls onRemove when remove button is pressed', () => {
    const { getByText } = render(<AllyChip label='Saint George' onRemove={mockOnRemove} />);

    fireEvent.press(getByText('✕'));

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it('applies correct styling to the chip container', () => {
    const { getByText } = render(<AllyChip label='Saint George' onRemove={mockOnRemove} />);

    const chipContainer = getByText('Saint George').parent;

    expect(chipContainer?.props.style).toMatchObject({
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
      marginBottom: 8,
      backgroundColor: '#222',
      borderWidth: 1,
      borderColor: '#0006',
      borderRadius: 16,
      paddingHorizontal: 10,
      height: 32,
    });
  });

  it('applies correct styling to the label text', () => {
    const { getByText } = render(<AllyChip label='Saint George' onRemove={mockOnRemove} />);

    const labelText = getByText('Saint George');

    expect(labelText.props.style).toMatchObject({
      color: '#fff',
      fontWeight: '700',
    });
  });

  it('applies correct styling to the remove button', () => {
    const { getByText } = render(<AllyChip label='Saint George' onRemove={mockOnRemove} />);

    const removeButton = getByText('✕');

    expect(removeButton.props.style).toMatchObject({
      color: '#aaa',
    });
  });

  it('handles long ally names', () => {
    const longName = 'Very Long Saint Name That Might Overflow';
    const { getByText } = render(<AllyChip label={longName} onRemove={mockOnRemove} />);

    expect(getByText(longName)).toBeTruthy();
  });

  it('handles special characters in ally names', () => {
    const specialName = 'Saint-George & Michael';
    const { getByText } = render(<AllyChip label={specialName} onRemove={mockOnRemove} />);

    expect(getByText(specialName)).toBeTruthy();
  });

  it('handles empty label', () => {
    const { getByText } = render(<AllyChip label='' onRemove={mockOnRemove} />);

    expect(getByText('')).toBeTruthy();
  });
});
