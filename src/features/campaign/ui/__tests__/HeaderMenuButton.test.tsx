import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';

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

// ---- useCampaigns mock ----
const mockEndExpedition = jest.fn();
const mockUseCampaigns = jest.fn(() => ({
  campaigns: {},
  endExpedition: mockEndExpedition,
}));

jest.mock('@/store/campaigns', () => ({
  useCampaigns: mockUseCampaigns,
}));

// Import the component after mocking
import HeaderMenuButton from '@/features/campaign/ui/HeaderMenuButton';

// ---- Alert mock ----
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// ---- ContextMenu mock ----
import type { MockContextMenuProps } from '../../../../test-utils/types';

jest.mock('@/components/ui/ContextMenu', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');

  const MockContextMenu = ({ visible, items, onRequestClose, testID }: MockContextMenuProps) => {
    if (!visible) return null;

    return (
      <View testID={testID}>
        {items?.map(item => (
          <Pressable key={item.key} onPress={item.onPress} testID={`${testID}-item-${item.key}`}>
            <Text testID={`${testID}-item-text-${item.key}`}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  MockContextMenu.measureInWindow = () => Promise.resolve({ x: 0, y: 0, width: 100, height: 50 });

  return MockContextMenu;
});

describe('HeaderMenuButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEndExpedition.mockClear();
  });

  it('renders the menu button', () => {
    const { getByTestId, getByText } = render(<HeaderMenuButton testID='header-menu' />);

    expect(getByTestId('header-menu')).toBeTruthy();
    expect(getByText('☰')).toBeTruthy();
    expect(getByTestId('header-menu-icon')).toBeTruthy();
  });

  it('renders without testID when not provided', () => {
    const { queryByTestId } = render(<HeaderMenuButton />);

    expect(queryByTestId('header-menu')).toBeNull();
    expect(queryByTestId('header-menu-icon')).toBeNull();
  });

  it('has correct accessibility properties', () => {
    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    const button = getByTestId('header-menu');
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('Open quick menu');
  });

  it('has correct hit slop for touch target', () => {
    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    const button = getByTestId('header-menu');
    expect(button.props.hitSlop).toBe(12);
  });

  it('shows menu when button is pressed', async () => {
    const { getByTestId, getByText } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    expect(getByTestId('header-menu-menu')).toBeTruthy();
    expect(getByText('Keywords')).toBeTruthy();
    expect(getByText('Theme')).toBeTruthy();
  });

  it('shows exit campaign option when id is present', async () => {
    const { useLocalSearchParams } = require('expo-router');
    useLocalSearchParams.mockReturnValue({ id: 'test-id' });

    const { getByTestId, getByText } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    expect(getByText('Exit Campaign')).toBeTruthy();
    expect(getByTestId('header-menu-menu-item-exit')).toBeTruthy();
  });

  it('does not show exit campaign option when id is not present', async () => {
    const { useLocalSearchParams } = require('expo-router');
    useLocalSearchParams.mockReturnValue({});

    const { getByTestId, queryByText } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    expect(queryByText('Exit Campaign')).toBeNull();
  });

  it('has correct menu items structure', async () => {
    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    // Check that menu items exist
    expect(getByTestId('header-menu-menu-item-keywords')).toBeTruthy();
    expect(getByTestId('header-menu-menu-item-theme')).toBeTruthy();
  });

  it('has correct menu items when id is present', async () => {
    const { useLocalSearchParams } = require('expo-router');
    useLocalSearchParams.mockReturnValue({ id: 'test-id' });

    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    // Check that all menu items exist including exit
    expect(getByTestId('header-menu-menu-item-keywords')).toBeTruthy();
    expect(getByTestId('header-menu-menu-item-theme')).toBeTruthy();
    expect(getByTestId('header-menu-menu-item-exit')).toBeTruthy();
  });

  it('has correct styling properties', () => {
    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    const button = getByTestId('header-menu');
    expect(button.props.style).toMatchObject({
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#0006',
    });
  });

  describe('Reset Expedition functionality', () => {
    it('does not show Reset Expedition option when no campaign id', async () => {
      const { useLocalSearchParams } = require('expo-router');
      useLocalSearchParams.mockReturnValue({});

      const { getByTestId, queryByText } = render(<HeaderMenuButton testID='header-menu' />);

      await act(async () => {
        fireEvent.press(getByTestId('header-menu'));
      });

      expect(queryByText('Reset Expedition')).toBeNull();
    });

    it('does not show Reset Expedition option when expedition is in vision phase', async () => {
      const { useLocalSearchParams } = require('expo-router');

      useLocalSearchParams.mockReturnValue({ id: 'test-campaign' });
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign': {
            expedition: {
              currentPhase: 'vision',
            },
          },
        },
        endExpedition: mockEndExpedition,
      });

      const { getByTestId, queryByText } = render(<HeaderMenuButton testID='header-menu' />);

      await act(async () => {
        fireEvent.press(getByTestId('header-menu'));
      });

      expect(queryByText('Reset Expedition')).toBeNull();
    });

    it('shows Reset Expedition option when expedition is past vision phase', async () => {
      const { useLocalSearchParams } = require('expo-router');

      useLocalSearchParams.mockReturnValue({ id: 'test-campaign' });
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign': {
            expedition: {
              currentPhase: 'outpost',
            },
          },
        },
        endExpedition: mockEndExpedition,
      });

      const { getByTestId, getByText } = render(<HeaderMenuButton testID='header-menu' />);

      await act(async () => {
        fireEvent.press(getByTestId('header-menu'));
      });

      expect(getByText('Reset Expedition')).toBeTruthy();
      expect(getByTestId('header-menu-menu-item-reset-expedition')).toBeTruthy();
    });

    it('shows Reset Expedition option for all phases except vision', async () => {
      const { useLocalSearchParams } = require('expo-router');

      const phases = [
        'outpost',
        'delve',
        'clash',
        'rest',
        'second-delve',
        'second-clash',
        'spoils',
      ];

      for (const phase of phases) {
        useLocalSearchParams.mockReturnValue({ id: 'test-campaign' });
        mockUseCampaigns.mockReturnValue({
          campaigns: {
            'test-campaign': {
              expedition: {
                currentPhase: phase,
              },
            },
          },
          endExpedition: mockEndExpedition,
        });

        const { getByTestId, getByText, rerender } = render(
          <HeaderMenuButton testID='header-menu' />
        );

        await act(async () => {
          fireEvent.press(getByTestId('header-menu'));
        });

        expect(getByText('Reset Expedition')).toBeTruthy();

        // Clean up for next iteration
        rerender(<div />);
      }
    });

    it('calls endExpedition when Reset Expedition is confirmed', async () => {
      const { useLocalSearchParams } = require('expo-router');

      useLocalSearchParams.mockReturnValue({ id: 'test-campaign' });
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign': {
            expedition: {
              currentPhase: 'outpost',
            },
          },
        },
        endExpedition: mockEndExpedition,
      });

      // Mock Alert.alert to simulate user confirming the reset
      const mockAlert = jest.spyOn(Alert, 'alert');
      mockAlert.mockImplementation((title, message, buttons) => {
        // Simulate clicking the "Reset" button (index 1)
        if (buttons && buttons[1] && buttons[1].onPress) {
          buttons[1].onPress();
        }
      });

      const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

      await act(async () => {
        fireEvent.press(getByTestId('header-menu'));
      });

      await act(async () => {
        fireEvent.press(getByTestId('header-menu-menu-item-reset-expedition'));
      });

      expect(mockAlert).toHaveBeenCalledWith(
        'Reset Expedition?',
        'This will end the current expedition and return you to the Vision Phase. All expedition progress will be lost.',
        expect.any(Array)
      );
      expect(mockEndExpedition).toHaveBeenCalledWith('test-campaign');

      mockAlert.mockRestore();
    });

    it('does not call endExpedition when Reset Expedition is cancelled', async () => {
      const { useLocalSearchParams } = require('expo-router');

      useLocalSearchParams.mockReturnValue({ id: 'test-campaign' });
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign': {
            expedition: {
              currentPhase: 'outpost',
            },
          },
        },
        endExpedition: mockEndExpedition,
      });

      // Mock Alert.alert to simulate user cancelling the reset
      const mockAlert = jest.spyOn(Alert, 'alert');
      mockAlert.mockImplementation((title, message, buttons) => {
        // Simulate clicking the "Cancel" button (index 0)
        if (buttons && buttons[0] && buttons[0].onPress) {
          buttons[0].onPress();
        }
      });

      const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

      await act(async () => {
        fireEvent.press(getByTestId('header-menu'));
      });

      await act(async () => {
        fireEvent.press(getByTestId('header-menu-menu-item-reset-expedition'));
      });

      expect(mockAlert).toHaveBeenCalledWith(
        'Reset Expedition?',
        'This will end the current expedition and return you to the Vision Phase. All expedition progress will be lost.',
        expect.any(Array)
      );
      expect(mockEndExpedition).not.toHaveBeenCalled();

      mockAlert.mockRestore();
    });

    it('shows correct alert dialog structure for Reset Expedition', async () => {
      const { useLocalSearchParams } = require('expo-router');

      useLocalSearchParams.mockReturnValue({ id: 'test-campaign' });
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign': {
            expedition: {
              currentPhase: 'outpost',
            },
          },
        },
        endExpedition: mockEndExpedition,
      });

      const mockAlert = jest.spyOn(Alert, 'alert');
      mockAlert.mockImplementation(() => {});

      const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

      await act(async () => {
        fireEvent.press(getByTestId('header-menu'));
      });

      await act(async () => {
        fireEvent.press(getByTestId('header-menu-menu-item-reset-expedition'));
      });

      expect(mockAlert).toHaveBeenCalledWith(
        'Reset Expedition?',
        'This will end the current expedition and return you to the Vision Phase. All expedition progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reset',
            style: 'destructive',
            onPress: expect.any(Function),
          },
        ],
        { cancelable: true }
      );

      mockAlert.mockRestore();
    });
  });
});
