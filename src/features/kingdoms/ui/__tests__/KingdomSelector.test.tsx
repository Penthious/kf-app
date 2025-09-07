import type { MockCardProps } from '../../../../test-utils/types';

// Mock the Card component
jest.mock('@/components/Card', () => {
  const React = require('react');
  const { View } = require('react-native');

  function MockCard({ children }: MockCardProps) {
    return <View testID='card'>{children}</View>;
  }

  return MockCard;
});

// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
  useThemeTokens: () => ({
    tokens: {
      textPrimary: '#fff',
      textMuted: '#aaa',
      surface: '#222',
      accent: '#4ade80',
    },
  }),
}));

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import KingdomSelector from '../KingdomSelector';

describe('KingdomSelector', () => {
  const mockOnSelect = jest.fn();
  const mockKingdoms = [
    {
      id: 'kingdom-1',
      name: 'Principality of Stone',
      type: 'main' as const,
      districts: ['Noble', 'Craftsman', 'Port', 'Merchant'],
      bestiary: { monsters: [], stages: [] },
      adventures: [],
    },
    {
      id: 'kingdom-2',
      name: 'Sunken Kingdom',
      type: 'main' as const,
      districts: ['Drowned District', 'Marsh District', 'Mud District'],
      bestiary: { monsters: [], stages: [] },
      adventures: [],
    },
    {
      id: 'kingdom-3',
      name: 'The Verdant Expanse',
      type: 'main' as const,
      districts: ['Forest', 'Meadow', 'Grove'],
      bestiary: { monsters: [], stages: [] },
      adventures: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with title', () => {
    const { getByText } = render(
      <KingdomSelector kingdoms={mockKingdoms} onSelect={mockOnSelect} />
    );

    expect(getByText('Select Kingdom')).toBeTruthy();
  });

  it('renders empty state when no kingdoms', () => {
    const { getByText } = render(<KingdomSelector kingdoms={[]} onSelect={mockOnSelect} />);

    expect(getByText('No kingdoms loaded. Check your loader export.')).toBeTruthy();
  });

  it('renders all kingdoms when provided', () => {
    const { getByText } = render(
      <KingdomSelector kingdoms={mockKingdoms} onSelect={mockOnSelect} />
    );

    expect(getByText('Principality of Stone')).toBeTruthy();
    expect(getByText('Sunken Kingdom')).toBeTruthy();
    expect(getByText('The Verdant Expanse')).toBeTruthy();
  });

  it('selects first kingdom by default when no activeKingdomId provided', () => {
    const { getByText } = render(
      <KingdomSelector kingdoms={mockKingdoms} onSelect={mockOnSelect} />
    );

    // First kingdom should be active (accent color)
    const firstKingdomName = getByText('Principality of Stone');

    expect(firstKingdomName.props.style.color).toBe('#0B0B0B');
  });

  it('selects specified active kingdom', () => {
    const { getByText } = render(
      <KingdomSelector
        kingdoms={mockKingdoms}
        activeKingdomId='kingdom-2'
        onSelect={mockOnSelect}
      />
    );

    // Second kingdom should be active
    const secondKingdomName = getByText('Sunken Kingdom');

    expect(secondKingdomName.props.style.color).toBe('#0B0B0B');

    // First kingdom should be inactive
    const firstKingdomName = getByText('Principality of Stone');

    expect(firstKingdomName.props.style.color).toBe('#fff');
  });

  it('calls onSelect when kingdom is pressed', () => {
    const { getByText } = render(
      <KingdomSelector kingdoms={mockKingdoms} onSelect={mockOnSelect} />
    );

    fireEvent.press(getByText('Sunken Kingdom'));

    expect(mockOnSelect).toHaveBeenCalledWith('kingdom-2');
  });

  it('calls onSelect when kingdom name is pressed', () => {
    const { getByText } = render(
      <KingdomSelector kingdoms={mockKingdoms} onSelect={mockOnSelect} />
    );

    fireEvent.press(getByText('The Verdant Expanse'));

    expect(mockOnSelect).toHaveBeenCalledWith('kingdom-3');
  });

  it('handles null activeKingdomId by defaulting to first kingdom', () => {
    const { getByText } = render(
      <KingdomSelector kingdoms={mockKingdoms} activeKingdomId={null} onSelect={mockOnSelect} />
    );

    // First kingdom should be active
    const firstKingdomName = getByText('Principality of Stone');
    expect(firstKingdomName.props.style.color).toBe('#0B0B0B');
  });

  it('handles undefined activeKingdomId by defaulting to first kingdom', () => {
    const { getByText } = render(
      <KingdomSelector
        kingdoms={mockKingdoms}
        activeKingdomId={undefined}
        onSelect={mockOnSelect}
      />
    );

    // First kingdom should be active
    const firstKingdomName = getByText('Principality of Stone');
    expect(firstKingdomName.props.style.color).toBe('#0B0B0B');
  });

  it('applies correct styling to active kingdom', () => {
    const { getByText } = render(
      <KingdomSelector
        kingdoms={mockKingdoms}
        activeKingdomId='kingdom-2'
        onSelect={mockOnSelect}
      />
    );

    const kingdomName = getByText('Sunken Kingdom');

    expect(kingdomName.props.style).toMatchObject({
      color: '#0B0B0B',
      fontWeight: '800',
    });
  });

  it('applies correct styling to inactive kingdom', () => {
    const { getByText } = render(
      <KingdomSelector
        kingdoms={mockKingdoms}
        activeKingdomId='kingdom-2'
        onSelect={mockOnSelect}
      />
    );

    const kingdomName = getByText('Principality of Stone');

    expect(kingdomName.props.style).toMatchObject({
      color: '#fff',
      fontWeight: '800',
    });
  });

  it('handles single kingdom correctly', () => {
    const singleKingdom = [
      {
        id: 'kingdom-1',
        name: 'Single Kingdom',
        type: 'main' as const,
        districts: ['District A'],
        bestiary: { monsters: [], stages: [] },
        adventures: [],
      },
    ];

    const { getByText } = render(
      <KingdomSelector kingdoms={singleKingdom} onSelect={mockOnSelect} />
    );

    expect(getByText('Single Kingdom')).toBeTruthy();

    // Should be active by default
    const kingdomName = getByText('Single Kingdom');
    expect(kingdomName.props.style.color).toBe('#0B0B0B');
  });
});
