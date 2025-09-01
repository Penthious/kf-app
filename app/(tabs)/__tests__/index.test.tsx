import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCampaigns } from '@/store/campaigns';
import CampaignsScreen from '../index';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
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

describe('CampaignsScreen', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockUseCampaigns = {
    campaigns: {},
    removeCampaign: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (useCampaigns as any).mockReturnValue(mockUseCampaigns);
  });

  it('renders campaigns list', () => {
    const campaigns = {
      'campaign-1': {
        campaignId: 'campaign-1',
        name: 'Test Campaign',
        members: [
          { knightUID: 'uid-1', isActive: true },
          { knightUID: 'uid-2', isActive: false },
        ],
        createdAt: 0,
        updatedAt: 0,
        kingdoms: [],
        settings: { fivePlayerMode: false, notes: '' },
      },
    };

    (useCampaigns as any).mockReturnValue({
      ...mockUseCampaigns,
      campaigns,
    });

    const { getByText } = render(<CampaignsScreen />);
    expect(getByText('Test Campaign')).toBeTruthy();
    expect(getByText('1 active · 2 total')).toBeTruthy();
  });

  it('navigates to campaign when pressed', () => {
    const campaigns = {
      'campaign-1': {
        campaignId: 'campaign-1',
        name: 'Test Campaign',
        members: [],
        createdAt: 0,
        updatedAt: 0,
        kingdoms: [],
        settings: { fivePlayerMode: false, notes: '' },
      },
    };

    (useCampaigns as any).mockReturnValue({
      ...mockUseCampaigns,
      campaigns,
    });

    const { getByText } = render(<CampaignsScreen />);
    fireEvent.press(getByText('Test Campaign'));

    expect(mockRouter.push).toHaveBeenCalledWith('/campaign/campaign-1');
  });

  it('shows delete confirmation when delete button is pressed', () => {
    const campaigns = {
      'campaign-1': {
        campaignId: 'campaign-1',
        name: 'Test Campaign',
        members: [],
        createdAt: 0,
        updatedAt: 0,
        kingdoms: [],
        settings: { fivePlayerMode: false, notes: '' },
      },
    };

    (useCampaigns as any).mockReturnValue({
      ...mockUseCampaigns,
      campaigns,
    });

    const { getByText } = render(<CampaignsScreen />);
    fireEvent.press(getByText('Delete'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete campaign?',
      'Are you sure you want to delete "Test Campaign"? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: expect.any(Function),
        },
      ]
    );
  });

  it('calls removeCampaign when delete is confirmed', () => {
    const campaigns = {
      'campaign-1': {
        campaignId: 'campaign-1',
        name: 'Test Campaign',
        members: [],
        createdAt: 0,
        updatedAt: 0,
        kingdoms: [],
        settings: { fivePlayerMode: false, notes: '' },
      },
    };

    (useCampaigns as any).mockReturnValue({
      ...mockUseCampaigns,
      campaigns,
    });

    const { getByText } = render(<CampaignsScreen />);
    fireEvent.press(getByText('Delete'));

    // Get the onPress function from the Alert.alert call
    const alertCall = (Alert.alert as any).mock.calls[0];
    const deleteButton = alertCall[2][1]; // The delete button
    deleteButton.onPress();

    expect(mockUseCampaigns.removeCampaign).toHaveBeenCalledWith('campaign-1');
  });
});
