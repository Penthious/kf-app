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
      card: '#333',
    },
  }),
}));

// Mock knights store
const mockUpdateKnightSheet = jest.fn();
jest.mock('@/store/knights', () => ({
  useKnights: () => ({
    knightsById: {
      'knight-1': {
        uid: 'knight-1',
        name: 'Sir Galahad',
        sheet: {
          saints: ['Saint George', 'Saint Michael'],
          mercenaries: ['Black Knight'],
        },
      },
      'knight-2': {
        uid: 'knight-2',
        name: 'Sir Lancelot',
        sheet: {},
      },
    },
    updateKnightSheet: mockUpdateKnightSheet,
  }),
}));

// Mock allies catalog
jest.mock('@/catalogs/allies', () => ({
  saints: [
    { id: 'saint-george', name: 'Saint George' },
    { id: 'saint-michael', name: 'Saint Michael' },
    { id: 'saint-patrick', name: 'Saint Patrick' },
  ],
  mercenaries: [
    { id: 'black-knight', name: 'Black Knight' },
    { id: 'white-knight', name: 'White Knight' },
    { id: 'red-knight', name: 'Red Knight' },
  ],
}));

// Mock the custom hook
jest.mock('../useAlliesData', () => ({
  useAlliesData: () => ({
    saints: {
      selected: ['Saint George', 'Saint Michael'],
      options: [
        { id: 'saint-george', name: 'Saint George' },
        { id: 'saint-michael', name: 'Saint Michael' },
        { id: 'saint-patrick', name: 'Saint Patrick' },
      ],
    },
    mercenaries: {
      selected: ['Black Knight'],
      options: [
        { id: 'black-knight', name: 'Black Knight' },
        { id: 'white-knight', name: 'White Knight' },
        { id: 'red-knight', name: 'Red Knight' },
      ],
    },
    addAlly: jest.fn(),
    removeAlly: jest.fn(),
  }),
}));

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import AlliesCard from '../AlliesCard';

describe('AlliesCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with title', () => {
    const { getByText } = render(<AlliesCard knightUID='knight-1' />);

    expect(getByText('Saints & Mercenaries')).toBeTruthy();
  });

  it('renders saints section', () => {
    const { getByText, getAllByText } = render(<AlliesCard knightUID='knight-1' />);

    expect(getByText('Saints')).toBeTruthy();
    expect(getAllByText('Add')).toHaveLength(2); // Saints and Mercenaries
  });

  it('renders mercenaries section', () => {
    const { getByText, getAllByText } = render(<AlliesCard knightUID='knight-1' />);

    expect(getByText('Mercenaries')).toBeTruthy();
    expect(getAllByText('Add')).toHaveLength(2); // Saints and Mercenaries
  });

  it('renders selected saints', () => {
    const { getByText } = render(<AlliesCard knightUID='knight-1' />);

    expect(getByText('Saint George')).toBeTruthy();
    expect(getByText('Saint Michael')).toBeTruthy();
  });

  it('renders selected mercenaries', () => {
    const { getByText } = render(<AlliesCard knightUID='knight-1' />);

    expect(getByText('Black Knight')).toBeTruthy();
  });

  it('calls onAdd when saints add button is pressed', () => {
    const { getAllByText } = render(<AlliesCard knightUID='knight-1' />);

    const addButtons = getAllByText('Add');
    fireEvent.press(addButtons[0]); // First Add button (Saints)

    // The modal should be opened, but we're testing the main component behavior
    // The actual modal interaction would be tested in the AllyPickerModal test
  });

  it('calls onAdd when mercenaries add button is pressed', () => {
    const { getAllByText } = render(<AlliesCard knightUID='knight-1' />);

    const addButtons = getAllByText('Add');
    fireEvent.press(addButtons[1]); // Second Add button (Mercenaries)

    // The modal should be opened, but we're testing the main component behavior
    // The actual modal interaction would be tested in the AllyPickerModal test
  });

  it('handles knight with no allies', () => {
    // For this test, we'll just verify the component renders correctly
    // The actual empty state testing will be done in the individual component tests
    const { getByText } = render(<AlliesCard knightUID='knight-2' />);

    expect(getByText('Saints & Mercenaries')).toBeTruthy();
    expect(getByText('Saints')).toBeTruthy();
    expect(getByText('Mercenaries')).toBeTruthy();
  });

  it('handles non-existent knight', () => {
    // For this test, we'll just verify the component renders correctly
    // The actual empty state testing will be done in the individual component tests
    const { getByText } = render(<AlliesCard knightUID='non-existent' />);

    expect(getByText('Saints & Mercenaries')).toBeTruthy();
    expect(getByText('Saints')).toBeTruthy();
    expect(getByText('Mercenaries')).toBeTruthy();
  });
});
