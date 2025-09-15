import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock the store
const mockSetExpeditionPhase = jest.fn();
const mockAdvanceThreatTrack = jest.fn();
const mockAdvanceTimeTrack = jest.fn();
const mockSetThreatTrackPosition = jest.fn();
const mockSetTimeTrackPosition = jest.fn();
const mockAddClue = jest.fn();
const mockAddObjective = jest.fn();
const mockCompleteObjective = jest.fn();
const mockAddContract = jest.fn();
const mockAcceptContract = jest.fn();
const mockCompleteContract = jest.fn();
const mockExploreLocation = jest.fn();
const mockSetCurrentLocation = jest.fn();

jest.mock('@/store/campaigns', () => ({
  useCampaigns: jest.fn(),
}));

// Mock theme
jest.mock('@/theme/ThemeProvider', () => ({
  useThemeTokens: jest.fn(),
}));

// Mock components
jest.mock('@/components/Button', () => {
  const { Text, TouchableOpacity } = require('react-native');
  return ({ label, onPress, disabled, ...props }: any) => (
    <TouchableOpacity onPress={onPress} disabled={disabled} {...props}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
});

jest.mock('@/components/Card', () => {
  const { View } = require('react-native');
  return ({ children, style, ...props }: any) => (
    <View style={style} {...props}>
      {children}
    </View>
  );
});

jest.mock('@/components/ui/CollapsibleCard', () => {
  const { View, Text } = require('react-native');
  return ({ children, title, style, ...props }: any) => (
    <View style={style} {...props}>
      <Text>{title}</Text>
      {children}
    </View>
  );
});

// Mock scavenge deck
jest.mock('@/catalogs/scavenge-deck', () => ({
  SCAVENGE_DECK: [
    {
      id: 'test-card-1',
      type: 'kingdom',
      name: 'Test Kingdom Card',
      description: 'A test kingdom card',
      rarity: 'common',
    },
    {
      id: 'test-card-2',
      type: 'upgrade',
      name: 'Test Upgrade Card',
      description: 'A test upgrade card',
      rarity: 'uncommon',
    },
  ],
  getAvailableScavengeTypes: jest.fn(() => ['kingdom', 'upgrade']),
}));

// Mock ScavengeSelectionModal
jest.mock('@/features/expedition/ScavengeSelectionModal', () => {
  const { View, Text } = require('react-native');
  return ({ visible, onClose, onSelectCards, phase, availableCards }: any) => {
    if (!visible) return null;
    return (
      <View testID='scavenge-selection-modal'>
        <Text>Scavenge Selection Modal</Text>
      </View>
    );
  };
});

// Mock other expedition components
jest.mock('@/features/expedition/ClueSelectionModal', () => {
  const { View, Text } = require('react-native');
  return ({ visible, onClose, onSelectClues }: any) => {
    if (!visible) return null;
    return (
      <View testID='clue-selection-modal'>
        <Text>Clue Selection Modal</Text>
      </View>
    );
  };
});

jest.mock('@/features/expedition/DistrictWheel', () => {
  const { View, Text } = require('react-native');
  return ({ onSelectDistrict }: any) => (
    <View testID='district-wheel'>
      <Text>District Wheel</Text>
    </View>
  );
});

jest.mock('@/features/expedition/KingdomTrack', () => {
  const { View, Text } = require('react-native');
  return ({ onAdvanceThreat, onAdvanceTime }: any) => (
    <View testID='kingdom-track'>
      <Text>Threat Track</Text>
      <Text>Time Track</Text>
    </View>
  );
});

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Import after mocks
import DelvePhase from '@/features/expedition/DelvePhase';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';

const mockUseThemeTokens = useThemeTokens as jest.MockedFunction<typeof useThemeTokens>;
const mockUseCampaigns = useCampaigns as jest.MockedFunction<typeof useCampaigns>;

describe('DelvePhase', () => {
  const mockCampaignId = 'test-campaign';
  const mockCampaign = {
    id: mockCampaignId,
    name: 'Test Campaign',
    selectedKingdomId: 'kingdom-1',
    expedition: {
      currentPhase: 'delve' as const,
      partyLeaderUID: 'knight-1',
      knightChoices: [
        {
          knightUID: 'knight-1',
          choice: 'quest' as const,
          status: 'in-progress' as const,
        },
      ],
      delveProgress: {
        threatTrack: 3,
        timeTrack: 2,
        clues: [],
        objectives: [],
        contracts: [],
        currentLocation: 'village',
        exploredLocations: [],
        hasTriggeredThreatSevenPlus: false,
      },
    },
    members: [
      {
        uid: 'knight-1',
        name: 'Knight One',
        isActive: true,
      },
    ],
  };

  const mockTokens = {
    __version: 1,
    bg: '#000',
    surface: '#111',
    card: '#222',
    textPrimary: '#fff',
    textMuted: '#aaa',
    accent: '#4ade80',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseThemeTokens.mockReturnValue({
      tokens: mockTokens,
      mode: 'dark',
      setMode: jest.fn(),
      setCustomTokens: jest.fn(),
      isInitialized: true,
    });

    mockUseCampaigns.mockReturnValue({
      campaigns: {
        [mockCampaignId]: mockCampaign,
      },
      setExpeditionPhase: mockSetExpeditionPhase,
      advanceThreatTrack: mockAdvanceThreatTrack,
      advanceTimeTrack: mockAdvanceTimeTrack,
      setThreatTrackPosition: mockSetThreatTrackPosition,
      setTimeTrackPosition: mockSetTimeTrackPosition,
      addClue: mockAddClue,
      addObjective: mockAddObjective,
      completeObjective: mockCompleteObjective,
      addContract: mockAddContract,
      acceptContract: mockAcceptContract,
      completeContract: mockCompleteContract,
      exploreLocation: mockExploreLocation,
      setCurrentLocation: mockSetCurrentLocation,
    });
  });

  describe('First Phase (default)', () => {
    it('renders with first phase title', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      expect(screen.getByText('Delve Phase')).toBeTruthy();
    });

    it('renders with first phase button text', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      expect(screen.getByText('Begin Clash Phase')).toBeTruthy();
    });

    it('navigates to clash phase when button is pressed', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      const button = screen.getByText('Begin Clash Phase');
      fireEvent.press(button);

      expect(mockSetExpeditionPhase).toHaveBeenCalledWith(mockCampaignId, 'clash');
    });
  });

  describe('Second Phase', () => {
    it('renders with second phase title', () => {
      render(<DelvePhase campaignId={mockCampaignId} phase='second' />);

      expect(screen.getByText('Second Delve Phase')).toBeTruthy();
    });

    it('renders with second phase button text', () => {
      render(<DelvePhase campaignId={mockCampaignId} phase='second' />);

      expect(screen.getByText('Begin Second Clash Phase')).toBeTruthy();
    });

    it('navigates to second-clash phase when button is pressed', () => {
      render(<DelvePhase campaignId={mockCampaignId} phase='second' />);

      const button = screen.getByText('Begin Second Clash Phase');
      fireEvent.press(button);

      expect(mockSetExpeditionPhase).toHaveBeenCalledWith(mockCampaignId, 'second-clash');
    });
  });

  describe('Kingdom Track', () => {
    it('renders kingdom track component', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      // KingdomTrack components should be rendered (threat and time tracks)
      expect(screen.getByText('Threat Track')).toBeTruthy();
      expect(screen.getByText('Time Track')).toBeTruthy();
    });
  });

  describe('Clues Section', () => {
    it('shows add clue button', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      expect(screen.getByText('Collect Clue')).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('handles missing campaign gracefully', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {},
        setExpeditionPhase: mockSetExpeditionPhase,
        advanceThreatTrack: mockAdvanceThreatTrack,
        advanceTimeTrack: mockAdvanceTimeTrack,
        setThreatTrackPosition: mockSetThreatTrackPosition,
        setTimeTrackPosition: mockSetTimeTrackPosition,
        addClue: mockAddClue,
        addObjective: mockAddObjective,
        completeObjective: mockCompleteObjective,
        addContract: mockAddContract,
        acceptContract: mockAcceptContract,
        completeContract: mockCompleteContract,
        exploreLocation: mockExploreLocation,
        setCurrentLocation: mockSetCurrentLocation,
      });

      render(<DelvePhase campaignId='nonexistent-campaign' />);

      // Should render error message when campaign not found
      expect(screen.getByText('Campaign not found')).toBeTruthy();
    });
  });

  describe('Phase Prop Validation', () => {
    it('defaults to first phase when no phase prop is provided', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      expect(screen.getByText('Delve Phase')).toBeTruthy();
      expect(screen.getByText('Begin Clash Phase')).toBeTruthy();
    });

    it('accepts explicit first phase prop', () => {
      render(<DelvePhase campaignId={mockCampaignId} phase='first' />);

      expect(screen.getByText('Delve Phase')).toBeTruthy();
      expect(screen.getByText('Begin Clash Phase')).toBeTruthy();
    });

    it('accepts second phase prop', () => {
      render(<DelvePhase campaignId={mockCampaignId} phase='second' />);

      expect(screen.getByText('Second Delve Phase')).toBeTruthy();
      expect(screen.getByText('Begin Second Clash Phase')).toBeTruthy();
    });
  });
});
