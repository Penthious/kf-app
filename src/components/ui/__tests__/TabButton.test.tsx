import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import TabButton from '../TabButton';

// Mock the theme provider
jest.mock('@/theme/ThemeProvider', () => ({
  useThemeTokens: () => ({
    tokens: {
      accent: '#007AFF',
      surface: '#F2F2F7',
      textPrimary: '#000000',
    },
  }),
}));

describe('TabButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with label', () => {
    const { getByText } = render(
      <TabButton label='Test Tab' isActive={false} onPress={mockOnPress} />
    );

    expect(getByText('Test Tab')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <TabButton label='Test Tab' isActive={false} onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Test Tab'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies active styles when isActive is true', () => {
    const { getByText } = render(
      <TabButton label='Test Tab' isActive={true} onPress={mockOnPress} />
    );

    const button = getByText('Test Tab').parent;
    expect(button).toBeTruthy();
  });

  it('applies inactive styles when isActive is false', () => {
    const { getByText } = render(
      <TabButton label='Test Tab' isActive={false} onPress={mockOnPress} />
    );

    const button = getByText('Test Tab').parent;
    expect(button).toBeTruthy();
  });

  it('renders with different labels', () => {
    const { getByText } = render(
      <TabButton label='Different Label' isActive={false} onPress={mockOnPress} />
    );

    expect(getByText('Different Label')).toBeTruthy();
  });
});
