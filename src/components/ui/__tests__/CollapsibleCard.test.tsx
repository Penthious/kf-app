import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import CollapsibleCard from '../CollapsibleCard';

// Mock the theme provider
jest.mock('@/theme/ThemeProvider', () => ({
  useThemeTokens: () => ({
    tokens: {
      textPrimary: '#000000',
    },
  }),
}));

// Mock the Card component
jest.mock('@/components/Card', () => {
  const { View } = require('react-native');
  return function MockCard({ children }: { children: React.ReactNode }) {
    return <View testID='card'>{children}</View>;
  };
});

// Mock MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('CollapsibleCard', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title', () => {
    const { getByText } = render(
      <CollapsibleCard title='Test Card' isExpanded={false} onToggle={mockOnToggle}>
        <Text>Test content</Text>
      </CollapsibleCard>
    );

    expect(getByText('Test Card')).toBeTruthy();
  });

  it('calls onToggle when header is pressed', () => {
    const { getByText } = render(
      <CollapsibleCard title='Test Card' isExpanded={false} onToggle={mockOnToggle}>
        <Text>Test content</Text>
      </CollapsibleCard>
    );

    fireEvent.press(getByText('Test Card'));
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('shows content when isExpanded is true', () => {
    const { getByText } = render(
      <CollapsibleCard title='Test Card' isExpanded={true} onToggle={mockOnToggle}>
        <Text>Test content</Text>
      </CollapsibleCard>
    );

    expect(getByText('Test content')).toBeTruthy();
  });

  it('hides content when isExpanded is false', () => {
    const { queryByText } = render(
      <CollapsibleCard title='Test Card' isExpanded={false} onToggle={mockOnToggle}>
        <Text>Test content</Text>
      </CollapsibleCard>
    );

    expect(queryByText('Test content')).toBeNull();
  });

  it('renders with different titles', () => {
    const { getByText } = render(
      <CollapsibleCard title='Different Title' isExpanded={false} onToggle={mockOnToggle}>
        <Text>Test content</Text>
      </CollapsibleCard>
    );

    expect(getByText('Different Title')).toBeTruthy();
  });

  it('renders complex children content', () => {
    const { getByText } = render(
      <CollapsibleCard title='Test Card' isExpanded={true} onToggle={mockOnToggle}>
        <Text>First line</Text>
        <Text>Second line</Text>
      </CollapsibleCard>
    );

    expect(getByText('First line')).toBeTruthy();
    expect(getByText('Second line')).toBeTruthy();
  });

  it('handles multiple toggle interactions', () => {
    const { getByText } = render(
      <CollapsibleCard title='Test Card' isExpanded={false} onToggle={mockOnToggle}>
        <Text>Test content</Text>
      </CollapsibleCard>
    );

    fireEvent.press(getByText('Test Card'));
    fireEvent.press(getByText('Test Card'));
    fireEvent.press(getByText('Test Card'));

    expect(mockOnToggle).toHaveBeenCalledTimes(3);
  });
});
