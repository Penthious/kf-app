import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import VisionPhase from '../VisionPhase';

// Mock the stores and dependencies
jest.mock('@/store/campaigns');
jest.mock('@/theme/ThemeProvider');
jest.mock('@/catalogs/kingdoms', () => ({
  allKingdomsCatalog: [
    { id: 'kingdom-1', name: 'Test Kingdom 1' },
    { id: 'kingdom-2', name: 'Test Kingdom 2' },
  ],
}));

const mockUseCampaigns = useCampaigns as jest.MockedFunction<typeof useCampaigns>;
const mockUseThemeTokens = useThemeTokens as jest.MockedFunction<typeof useThemeTokens>;

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('VisionPhase', () => {
  const mockTokens = {
    __version: 1,
    bg: '#0E1116',
    surface: '#1C1C1E',
    card: '#1C2230',
    textPrimary: '#FFFFFF',
    textMuted: '#888888',
    accent: '#007AFF',
    success: '#4CC38A',
    warning: '#E7B549',
    danger: '#E5484D',
  };

  const mockActiveKnights = [
    {
      knightUID: 'knight-1',
      displayName: 'Knight One',
      catalogId: 'catalog-1',
      isActive: true,
      joinedAt: Date.now(),
      isLeader: true,
    },
    {
      knightUID: 'knight-2',
      displayName: 'Knight Two',
      catalogId: 'catalog-2',
      isActive: true,
      joinedAt: Date.now(),
    },
    {
      knightUID: 'knight-3',
      displayName: 'Knight Three',
      catalogId: 'catalog-3',
      isActive: true,
      joinedAt: Date.now(),
    },
  ];

  const mockCampaign = {
    campaignId: 'test-campaign-1',
    name: 'Test Campaign',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settings: {
      fivePlayerMode: false,
    },
    members: mockActiveKnights,
    kingdoms: [],
    partyLeaderUID: 'knight-1',
    selectedKingdomId: 'kingdom-1',
  };

  const mockExpedition = {
    currentPhase: 'vision' as const,
    knightChoices: [],
    phaseStartedAt: Date.now(),
  };

  const mockStoreActions = {
    setPartyLeader: jest.fn(),
    startExpedition: jest.fn(),
    setKnightExpeditionChoice: jest.fn(),
    setSelectedKingdom: jest.fn(),
    setExpeditionPhase: jest.fn(),
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
        'test-campaign-1': mockCampaign,
      },
      ...mockStoreActions,
    });
  });

  describe('Basic Rendering', () => {
    it('renders Vision Phase title and description', () => {
      render(<VisionPhase campaignId='test-campaign-1' />);

      expect(screen.getByText('Vision Phase')).toBeTruthy();
      expect(screen.getByText(/Choose a Quest and Investigations/)).toBeTruthy();
    });

    it('renders party leader selection section', () => {
      render(<VisionPhase campaignId='test-campaign-1' />);

      expect(screen.getByText('Select Party Leader')).toBeTruthy();
      // Use getAllByText since knight names appear in multiple sections
      expect(screen.getAllByText('Knight One')).toHaveLength(2); // Party leader + knight choices
      expect(screen.getAllByText('Knight Two')).toHaveLength(2);
      expect(screen.getAllByText('Knight Three')).toHaveLength(2);
    });

    it('renders knight choices section', () => {
      render(<VisionPhase campaignId='test-campaign-1' />);

      expect(screen.getByText('Knight Choices')).toBeTruthy();
    });

    it('renders kingdom selection when party leader is selected', () => {
      render(<VisionPhase campaignId='test-campaign-1' />);

      expect(screen.getByText('Select Destination Kingdom')).toBeTruthy();
      expect(screen.getByText('Test Kingdom 1')).toBeTruthy();
      expect(screen.getByText('Test Kingdom 2')).toBeTruthy();
    });
  });

  describe('Start Expedition Button', () => {
    it('shows Start Expedition button when no expedition exists', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: undefined },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      expect(screen.getByText('Start Expedition')).toBeTruthy();
    });

    it('calls startExpedition when Start Expedition is pressed', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: undefined },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      fireEvent.press(screen.getByText('Start Expedition'));

      expect(mockStoreActions.setPartyLeader).toHaveBeenCalledWith('test-campaign-1', 'knight-1');
      expect(mockStoreActions.startExpedition).toHaveBeenCalledWith('test-campaign-1');
    });

    it('shows alert when trying to start expedition without party leader', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, partyLeaderUID: undefined, expedition: undefined },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      fireEvent.press(screen.getByText('Start Expedition'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Party Leader Required',
        'Please select a party leader before starting the expedition.'
      );
    });

    it('shows alert when trying to start expedition without kingdom', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': {
            ...mockCampaign,
            selectedKingdomId: undefined,
            expedition: undefined,
          },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      fireEvent.press(screen.getByText('Start Expedition'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Kingdom Required',
        'Please select a destination kingdom before starting the expedition.'
      );
    });
  });

  describe('Begin Outpost Phase Button', () => {
    it('shows Begin Outpost Phase button when expedition exists and is in vision phase', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      expect(screen.getByText('Begin Outpost Phase')).toBeTruthy();
    });

    it('calls setExpeditionPhase when Begin Outpost Phase is pressed with valid state', () => {
      const expeditionWithChoices = {
        ...mockExpedition,
        knightChoices: [
          { knightUID: 'knight-1', choice: 'quest', status: 'in-progress' as const },
          { knightUID: 'knight-2', choice: 'investigation', status: 'in-progress' as const },
          { knightUID: 'knight-3', choice: 'free-roam', status: 'in-progress' as const },
        ],
      };

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: expeditionWithChoices },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      fireEvent.press(screen.getByText('Begin Outpost Phase'));

      expect(mockStoreActions.setExpeditionPhase).toHaveBeenCalledWith(
        'test-campaign-1',
        'outpost'
      );
    });

    it('shows alert when trying to begin outpost phase without kingdom', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': {
            ...mockCampaign,
            selectedKingdomId: undefined,
            expedition: mockExpedition,
          },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      fireEvent.press(screen.getByText('Begin Outpost Phase'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Kingdom Required',
        'Please select a destination kingdom before proceeding to the Outpost Phase.'
      );
    });

    it('shows alert when trying to begin outpost phase with incomplete knight choices', () => {
      const expeditionWithIncompleteChoices = {
        ...mockExpedition,
        knightChoices: [
          { knightUID: 'knight-1', choice: 'quest', status: 'in-progress' as const },
          // knight-2 and knight-3 have no choices
        ],
      };

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: expeditionWithIncompleteChoices },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      fireEvent.press(screen.getByText('Begin Outpost Phase'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Incomplete Choices',
        'All active knights must choose their quest, investigation, or free roam before proceeding. Missing choices from: Knight Two, Knight Three'
      );
    });

    it('shows alert when trying to begin outpost phase with no knight choices at all', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      fireEvent.press(screen.getByText('Begin Outpost Phase'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Incomplete Choices',
        'All active knights must choose their quest, investigation, or free roam before proceeding. Missing choices from: Knight One, Knight Two, Knight Three'
      );
    });

    it('shows alert when trying to begin outpost phase with some knights having empty choices', () => {
      const expeditionWithEmptyChoices = {
        ...mockExpedition,
        knightChoices: [
          { knightUID: 'knight-1', choice: 'quest', status: 'in-progress' as const },
          { knightUID: 'knight-2', choice: '', status: 'in-progress' as const }, // Empty choice
          { knightUID: 'knight-3', choice: 'free-roam', status: 'in-progress' as const },
        ],
      };

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: expeditionWithEmptyChoices },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      fireEvent.press(screen.getByText('Begin Outpost Phase'));

      expect(Alert.alert).toHaveBeenCalledWith(
        'Incomplete Choices',
        'All active knights must choose their quest, investigation, or free roam before proceeding. Missing choices from: Knight Two'
      );
    });

    it('allows progression when all knights have valid choices', () => {
      const expeditionWithAllChoices = {
        ...mockExpedition,
        knightChoices: [
          { knightUID: 'knight-1', choice: 'quest', status: 'in-progress' as const },
          { knightUID: 'knight-2', choice: 'investigation', status: 'in-progress' as const },
          { knightUID: 'knight-3', choice: 'free-roam', status: 'in-progress' as const },
        ],
      };

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: expeditionWithAllChoices },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      fireEvent.press(screen.getByText('Begin Outpost Phase'));

      expect(Alert.alert).not.toHaveBeenCalled();
      expect(mockStoreActions.setExpeditionPhase).toHaveBeenCalledWith(
        'test-campaign-1',
        'outpost'
      );
    });
  });

  describe('Knight Choice Interactions', () => {
    it('calls setKnightExpeditionChoice when knight choice button is pressed', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Find and press the Quest button for Knight One (party leader)
      const questButtons = screen.getAllByText('Quest');
      fireEvent.press(questButtons[0]);

      expect(mockStoreActions.setKnightExpeditionChoice).toHaveBeenCalledWith(
        'test-campaign-1',
        'knight-1',
        'quest'
      );
    });

    it('only shows Quest button for party leader', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Should only have one Quest button (for the party leader - Knight One)
      const questButtons = screen.getAllByText('Quest');
      expect(questButtons).toHaveLength(1);

      // Change party leader to Knight Two
      const knightTwoButton = screen.getAllByText('Knight Two')[0]; // Party leader selection
      fireEvent.press(knightTwoButton);

      // Now should have one Quest button for Knight Two
      const questButtonsAfterChange = screen.getAllByText('Quest');
      expect(questButtonsAfterChange).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles campaign not found', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {},
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='nonexistent-campaign' />);

      expect(screen.getByText('Campaign not found')).toBeTruthy();
    });

    it('handles no active knights', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, members: [] },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      expect(screen.getByText(/No active knights in this campaign/)).toBeTruthy();
    });

    it('handles expedition in different phase', () => {
      const outpostExpedition = {
        ...mockExpedition,
        currentPhase: 'outpost' as const,
      };

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: outpostExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      expect(screen.queryByText('Begin Outpost Phase')).toBeNull();
    });
  });
});
