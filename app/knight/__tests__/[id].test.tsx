import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useKnights } from '@/store/knights';
import KnightDetailScreen from '../[id]';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

// Mock the knights store
jest.mock('@/store/knights', () => ({
  useKnights: jest.fn(),
}));

// Mock the campaigns store
jest.mock('@/store/campaigns', () => ({
  useCampaigns: jest.fn(),
}));

// Mock React Native components
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  StyleSheet: {
    create: jest.fn(styles => styles),
    flatten: jest.fn(style => style),
  },
  ScrollView: 'ScrollView',
  Text: 'Text',
  View: 'View',
  Pressable: 'Pressable',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
}));

// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
  useThemeTokens: () => ({
    tokens: {
      bg: '#000',
      textPrimary: '#fff',
      textMuted: '#aaa',
      accent: '#4ade80',
    },
  }),
}));

// Mock Card component
jest.mock('@/components/Card', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockCard({ children, style }: any) {
    return (
      <View testID='card' style={style}>
        {children}
      </View>
    );
  };
});

// Mock TextRow component
jest.mock('@/components/ui/TextRow', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockTextRow({ label, value, onChangeText, placeholder }: any) {
    return (
      <View testID='text-row'>
        <Text>{label}</Text>
        <Text>{value || placeholder}</Text>
      </View>
    );
  };
});

// Mock other UI components
jest.mock('@/components/ui/SmallButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return function MockSmallButton({ onPress, children, ...props }: any) {
    return (
      <Pressable testID='small-button' onPress={onPress} {...props}>
        <Text>{children}</Text>
      </Pressable>
    );
  };
});

jest.mock('@/components/ui/Pill', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return function MockPill({ label, selected, onPress }: any) {
    return (
      <Pressable testID='pill' onPress={onPress}>
        <Text>{label}</Text>
      </Pressable>
    );
  };
});

jest.mock('@/components/ui/Stepper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockStepper({ value, onValueChange, min, max, step }: any) {
    return (
      <View testID='stepper'>
        <Text>Stepper: {value}</Text>
      </View>
    );
  };
});

jest.mock('@/components/ui/SwitchRow', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockSwitchRow({ label, value, onValueChange }: any) {
    return (
      <View testID='switch-row'>
        <Text>
          {label}: {value ? 'ON' : 'OFF'}
        </Text>
      </View>
    );
  };
});

jest.mock('@/features/knights/AlliesCard/AllyPickerModal', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockAllyPickerModal({ visible, onClose, onSelect }: any) {
    if (!visible) return null;
    return (
      <View testID='ally-picker-modal'>
        <Text>Ally Picker Modal</Text>
      </View>
    );
  };
});

jest.mock('@/features/knights/AlliesCard/AlliesCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockAlliesCard({ knight }: any) {
    return (
      <View testID='allies-card'>
        <Text>Allies Card</Text>
      </View>
    );
  };
});

jest.mock('@/features/knights/NotesCard/NoteInput', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockNoteInput({ value, onChangeText }: any) {
    return (
      <View testID='note-input'>
        <Text>Note Input: {value}</Text>
      </View>
    );
  };
});

jest.mock('@/features/knights/NotesCard/NotesCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockNotesCard({ knight }: any) {
    return (
      <View testID='notes-card'>
        <Text>Notes Card</Text>
      </View>
    );
  };
});

describe('KnightDetailScreen', () => {
  const mockRouter = {
    back: jest.fn(),
  };

  const mockUseKnights = {
    knightsById: {},
    removeKnight: jest.fn(),
    renameKnight: jest.fn(),
    completeQuest: jest.fn(),
    updateKnightSheet: jest.fn(),
  };

  const mockUseCampaigns = {
    setPartyLeader: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (useKnights as any).mockReturnValue(mockUseKnights);
    (require('expo-router').useLocalSearchParams as any).mockReturnValue({ id: 'knight-1' });
    (require('@/store/campaigns').useCampaigns as any).mockReturnValue(mockUseCampaigns);
  });

  it('shows delete confirmation when delete button is pressed', () => {
    const knight = {
      knightUID: 'knight-1',
      name: 'Sir Test',
      catalogId: 'cat-1',
      ownerUserId: 'user-1',
      version: 1,
      updatedAt: 0,
      sheet: {
        virtues: { bravery: 1, tenacity: 1, sagacity: 1, fortitude: 1, might: 1, insight: 1 },
        vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
        bane: 0,
        sighOfGraal: 0,
        gold: 0,
        leads: 0,
        clues: 0,
        chapter: 1,
        chapters: {},
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
      },
      rapport: [],
    };

    (useKnights as any).mockReturnValue({
      ...mockUseKnights,
      knightsById: { 'knight-1': knight },
    });

    const { getByText } = render(<KnightDetailScreen />);

    // Find and press the delete button (assuming it's in the header or a menu)
    // This might need to be adjusted based on the actual UI structure
    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);

    expect(Alert.alert).toHaveBeenCalledWith('Delete knight?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: expect.any(Function),
      },
    ]);
  });

  it('calls removeKnight and navigates back when delete is confirmed', () => {
    const knight = {
      knightUID: 'knight-1',
      name: 'Sir Test',
      catalogId: 'cat-1',
      ownerUserId: 'user-1',
      version: 1,
      updatedAt: 0,
      sheet: {
        virtues: { bravery: 1, tenacity: 1, sagacity: 1, fortitude: 1, might: 1, insight: 1 },
        vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
        bane: 0,
        sighOfGraal: 0,
        gold: 0,
        leads: 0,
        clues: 0,
        chapter: 1,
        chapters: {},
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
      },
      rapport: [],
    };

    (useKnights as any).mockReturnValue({
      ...mockUseKnights,
      knightsById: { 'knight-1': knight },
    });

    const { getByText } = render(<KnightDetailScreen />);

    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);

    // Get the onPress function from the Alert.alert call
    const alertCall = (Alert.alert as any).mock.calls[0];
    const confirmDeleteButton = alertCall[2][1]; // The delete button
    confirmDeleteButton.onPress();

    expect(mockUseKnights.removeKnight).toHaveBeenCalledWith('knight-1');
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('handles cancel gracefully', () => {
    const knight = {
      knightUID: 'knight-1',
      name: 'Sir Test',
      catalogId: 'cat-1',
      ownerUserId: 'user-1',
      version: 1,
      updatedAt: 0,
      sheet: {
        virtues: { bravery: 1, tenacity: 1, sagacity: 1, fortitude: 1, might: 1, insight: 1 },
        vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
        bane: 0,
        sighOfGraal: 0,
        gold: 0,
        leads: 0,
        clues: 0,
        chapter: 1,
        chapters: {},
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
      },
      rapport: [],
    };

    (useKnights as any).mockReturnValue({
      ...mockUseKnights,
      knightsById: { 'knight-1': knight },
    });

    const { getByText } = render(<KnightDetailScreen />);

    const deleteButton = getByText('Delete');
    fireEvent.press(deleteButton);

    // Get the onPress function from the Alert.alert call
    const alertCall = (Alert.alert as any).mock.calls[0];
    const buttons = alertCall[2]; // The buttons array is the third argument
    if (buttons && buttons[0] && typeof buttons[0].onPress === 'function') {
      const cancelButton = buttons[0]; // The cancel button
      cancelButton.onPress();
    }

    expect(mockUseKnights.removeKnight).not.toHaveBeenCalled();
    expect(mockRouter.back).not.toHaveBeenCalled();
  });
});
