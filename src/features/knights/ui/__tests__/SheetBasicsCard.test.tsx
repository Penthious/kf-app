import type {
  MockCardProps,
  MockStepperProps,
  MockSwitchRowProps,
} from '../../../../test-utils/types';

// Mock the Card component
jest.mock('@/components/Card', () => {
  const React = require('react');
  const { View } = require('react-native');

  function MockCard({ children }: MockCardProps) {
    return <View testID='card'>{children}</View>;
  }

  return MockCard;
});

// Mock the Stepper component
jest.mock('@/components/ui/Stepper', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return function MockStepper({
    value,
    min,
    max,
    onChange,
    editable,
    formatValue,
    parseValue,
    testID,
  }: MockStepperProps) {
    const displayValue = formatValue ? formatValue(value || 0) : (value || 0).toString();
    return (
      <View testID={testID}>
        <Text>{displayValue}</Text>
        <Pressable
          onPress={() => onChange?.(Math.min(max || 100, (value || 0) + 1))}
          testID={testID ? `${testID}-increment` : undefined}
        >
          <Text>+</Text>
        </Pressable>
        <Pressable
          onPress={() => onChange?.(Math.max(min || 0, (value || 0) - 1))}
          testID={testID ? `${testID}-decrement` : undefined}
        >
          <Text>-</Text>
        </Pressable>
      </View>
    );
  };
});

// Mock the SwitchRow component
jest.mock('@/components/ui/SwitchRow', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return function MockSwitchRow({ label, value, onValueChange, testID }: MockSwitchRowProps) {
    return (
      <View testID={testID}>
        <Text>{label}</Text>
        <Pressable
          onPress={() => onValueChange?.(!value)}
          testID={testID ? `${testID}-switch` : undefined}
        >
          <Text>{value ? 'ON' : 'OFF'}</Text>
        </Pressable>
      </View>
    );
  };
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

// Mock knights store
const mockUpdateKnightSheet = jest.fn();
jest.mock('@/store/knights', () => ({
  useKnights: () => ({
    knightsById: {
      'knight-1': {
        sheet: {
          bane: 2,
          gold: 150,
          leads: 3,
          sighOfGraal: 1,
          cipher: 42,
          firstDeath: false,
        },
      },
    },
    updateKnightSheet: mockUpdateKnightSheet,
  }),
}));

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import SheetBasicsCard from '../SheetBasicsCard';

describe('SheetBasicsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sheet basic fields', () => {
    const { getByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    expect(getByText('Sheet Basics')).toBeTruthy();
    expect(getByText('Bane')).toBeTruthy();
    expect(getByText('Gold')).toBeTruthy();
    expect(getByText('Leads')).toBeTruthy();
    expect(getByText('Sigh of the Graal')).toBeTruthy();
    expect(getByText('Cipher')).toBeTruthy();
    expect(getByText('First Death')).toBeTruthy();
  });

  it('displays current values', () => {
    const { getByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    expect(getByText('2')).toBeTruthy(); // Bane
    expect(getByText('150')).toBeTruthy(); // Gold
    expect(getByText('3')).toBeTruthy(); // Leads
    expect(getByText('**42')).toBeTruthy(); // Cipher (formatted)
    expect(getByText('OFF')).toBeTruthy(); // First Death
  });

  it('displays sigh of graal status', () => {
    const { getByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    expect(getByText('Has Sigh')).toBeTruthy();
  });

  it('calls updateKnightSheet when bane changes', () => {
    const { getAllByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    const incrementButtons = getAllByText('+');
    fireEvent.press(incrementButtons[0]);

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      bane: 3,
    });
  });

  it('calls updateKnightSheet when gold changes', () => {
    const { getAllByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    const incrementButtons = getAllByText('+');
    fireEvent.press(incrementButtons[1]); // Second stepper (Gold)

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      gold: 151,
    });
  });

  it('calls updateKnightSheet when leads changes', () => {
    const { getAllByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    const incrementButtons = getAllByText('+');
    fireEvent.press(incrementButtons[2]); // Third stepper (Leads)

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      leads: 4,
    });
  });

  it('calls updateKnightSheet when sigh of graal is toggled', () => {
    const { getByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    const sighButton = getByText('Has Sigh');
    fireEvent.press(sighButton);

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      sighOfGraal: 0,
    });
  });

  it('calls updateKnightSheet when cipher changes', () => {
    const { getAllByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    const incrementButtons = getAllByText('+');
    fireEvent.press(incrementButtons[3]); // Fourth stepper (Cipher)

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      cipher: 43,
    });
  });

  it('calls updateKnightSheet when first death is toggled', () => {
    const { getByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    const firstDeathSwitch = getByText('OFF');
    fireEvent.press(firstDeathSwitch);

    expect(mockUpdateKnightSheet).toHaveBeenCalledWith('knight-1', {
      firstDeath: true,
    });
  });

  it('formats cipher value correctly', () => {
    const { getByText } = render(<SheetBasicsCard knightUID='knight-1' />);

    expect(getByText('**42')).toBeTruthy();
  });
});
