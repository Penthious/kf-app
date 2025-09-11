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

  describe('Objectives Section', () => {
    it('shows add objective button', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      expect(screen.getByText('Add Sample Objective')).toBeTruthy();
    });
  });

  describe('Contracts Section', () => {
    it('shows add contract button', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      expect(screen.getByText('Add Sample Contract')).toBeTruthy();
    });
  });

  describe('Location Section', () => {
    it('renders location section', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      expect(screen.getByText('Explore Location')).toBeTruthy();
    });

    it('shows explore location button', () => {
      render(<DelvePhase campaignId={mockCampaignId} />);

      expect(screen.getByText('Explore Location')).toBeTruthy();
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
