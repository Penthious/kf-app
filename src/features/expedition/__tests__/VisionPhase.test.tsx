import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import VisionPhase from '../VisionPhase';

// Mock the stores and dependencies
jest.mock('@/store/campaigns');
jest.mock('@/store/knights');
jest.mock('@/theme/ThemeProvider');
jest.mock('@/catalogs/kingdoms', () => ({
  allKingdomsCatalog: [
    { id: 'kingdom-1', name: 'Test Kingdom 1' },
    { id: 'kingdom-2', name: 'Test Kingdom 2' },
  ],
}));

const mockUseCampaigns = useCampaigns as jest.MockedFunction<typeof useCampaigns>;
const mockUseKnights = useKnights as jest.MockedFunction<typeof useKnights>;
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

  const mockKnightsById = {
    'knight-1': {
      knightUID: 'knight-1',
      name: 'Knight One',
      catalogId: 'catalog-1',
      ownerUserId: 'user-1',
      sheet: {
        chapter: 1,
        chapters: {
          1: {
            quest: { completed: false },
            attempts: [
              { code: 'I1-1', result: 'pass' },
              { code: 'I1-2', result: 'fail' },
              { code: 'I1-3', result: 'pass' },
            ],
            completed: ['I1-1', 'I1-3'], // Knight has completed I1-1 and I1-3
          },
        },
        virtues: { faith: 0, hope: 0, charity: 0 },
        vices: { pride: 0, greed: 0, lust: 0, envy: 0, gluttony: 0, wrath: 0, sloth: 0 },
        bane: 0,
        sighOfGraal: 0,
        gold: 0,
        leads: 0,
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
        cipher: 0,
      },
      version: 1,
      updatedAt: Date.now(),
    },
    'knight-2': {
      knightUID: 'knight-2',
      name: 'Knight Two',
      catalogId: 'catalog-2',
      ownerUserId: 'user-1',
      sheet: {
        chapter: 2,
        chapters: {
          2: {
            quest: { completed: false },
            attempts: [],
            completed: [], // Knight has no completed investigations
          },
        },
        virtues: { faith: 0, hope: 0, charity: 0 },
        vices: { pride: 0, greed: 0, lust: 0, envy: 0, gluttony: 0, wrath: 0, sloth: 0 },
        bane: 0,
        sighOfGraal: 0,
        gold: 0,
        leads: 0,
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
        cipher: 0,
      },
      version: 1,
      updatedAt: Date.now(),
    },
    'knight-3': {
      knightUID: 'knight-3',
      name: 'Knight Three',
      catalogId: 'catalog-3',
      ownerUserId: 'user-1',
      sheet: {
        chapter: 1,
        chapters: {
          1: {
            quest: { completed: false },
            attempts: [],
            completed: ['I1-1', 'I1-2', 'I1-3', 'I1-4', 'I1-5'], // Knight has completed all investigations
          },
        },
        virtues: { faith: 0, hope: 0, charity: 0 },
        vices: { pride: 0, greed: 0, lust: 0, envy: 0, gluttony: 0, wrath: 0, sloth: 0 },
        bane: 0,
        sighOfGraal: 0,
        gold: 0,
        leads: 0,
        prologueDone: false,
        postgameDone: false,
        firstDeath: false,
        choiceMatrix: {},
        saints: [],
        mercenaries: [],
        armory: [],
        notes: [],
        cipher: 0,
      },
      version: 1,
      updatedAt: Date.now(),
    },
  };

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
    mockUseKnights.mockReturnValue({
      knightsById: mockKnightsById,
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

  describe('Investigation Selection', () => {
    it('shows investigation selection modal when investigation button is pressed for knight with available investigations', () => {
      // Use Knight Two who has no attempted investigations
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Find and press the Investigation button for Knight Two (has no attempted investigations)
      const investigationButtons = screen.getAllByText('Investigation');
      fireEvent.press(investigationButtons[1]); // Second investigation button

      // Modal should appear
      expect(screen.getByText('Select Investigation')).toBeTruthy();
      expect(screen.getByText('Choose an investigation for Knight Two')).toBeTruthy();
    });

    it('shows alert when knight has attempted all normal investigations', () => {
      // Create a knight with all normal investigations attempted
      const knightWithAllAttempts = {
        ...mockKnightsById['knight-2'],
        sheet: {
          ...mockKnightsById['knight-2'].sheet,
          chapter: 1,
          chapters: {
            1: {
              quest: { completed: false },
              attempts: [
                { code: 'I1-1', result: 'pass' },
                { code: 'I1-2', result: 'fail' },
                { code: 'I1-3', result: 'pass' },
              ],
              completed: ['I1-1', 'I1-3'],
            },
          },
        },
      };

      mockUseKnights.mockReturnValue({
        knightsById: {
          ...mockKnightsById,
          'knight-2': knightWithAllAttempts,
        },
      });

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Find and press the Investigation button for Knight Two (has attempted all normal investigations)
      const investigationButtons = screen.getAllByText('Investigation');
      fireEvent.press(investigationButtons[1]); // Second investigation button

      // Should show alert since all normal investigations have been attempted
      expect(Alert.alert).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'No Available Investigations',
        'This knight has completed all investigations for their current chapter.'
      );
    });

    it('shows available investigations for knight with partial attempts', () => {
      // Create a knight with only some investigations attempted
      const knightWithPartialAttempts = {
        ...mockKnightsById['knight-2'],
        sheet: {
          ...mockKnightsById['knight-2'].sheet,
          chapter: 1,
          chapters: {
            1: {
              quest: { completed: false },
              attempts: [
                { code: 'I1-1', result: 'pass' },
                { code: 'I1-2', result: 'fail' },
              ],
              completed: ['I1-1'],
            },
          },
        },
      };

      mockUseKnights.mockReturnValue({
        knightsById: {
          ...mockKnightsById,
          'knight-2': knightWithPartialAttempts,
        },
      });

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Find and press the Investigation button for Knight Two (has attempted I1-1, I1-2)
      const investigationButtons = screen.getAllByText('Investigation');
      fireEvent.press(investigationButtons[1]); // Second investigation button

      // Should show available investigation: I1-3 (only normal investigations 1-3 are allowed)
      expect(screen.getByText('I1-3')).toBeTruthy();
      expect(screen.queryByText('I1-1')).toBeNull(); // Attempted (passed)
      expect(screen.queryByText('I1-2')).toBeNull(); // Attempted (failed)
      expect(screen.queryByText('I1-4')).toBeNull(); // Special investigations not available
      expect(screen.queryByText('I1-5')).toBeNull(); // Special investigations not available
    });

    it('shows all investigations for knight with no completed investigations', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Find and press the Investigation button for Knight Two (chapter 2, no completed investigations)
      const investigationButtons = screen.getAllByText('Investigation');
      fireEvent.press(investigationButtons[1]); // Second investigation button

      // Should show normal investigations for chapter 2: I2-1, I2-2, I2-3 (only normal investigations 1-3 are allowed)
      expect(screen.getByText('I2-1')).toBeTruthy();
      expect(screen.getByText('I2-2')).toBeTruthy();
      expect(screen.getByText('I2-3')).toBeTruthy();
      expect(screen.queryByText('I2-4')).toBeNull(); // Special investigations not available
      expect(screen.queryByText('I2-5')).toBeNull(); // Special investigations not available
    });

    it('shows alert when knight has no available investigations', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Find and press the Investigation button for Knight Three (has completed all investigations)
      const investigationButtons = screen.getAllByText('Investigation');
      fireEvent.press(investigationButtons[2]); // Third investigation button

      // Should show alert
      expect(Alert.alert).toHaveBeenCalledWith(
        'No Available Investigations',
        'This knight has completed all investigations for their current chapter.'
      );
    });

    it('calls setKnightExpeditionChoice with investigation ID when investigation is selected', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Open investigation selection modal for Knight Two (has no attempted investigations)
      const investigationButtons = screen.getAllByText('Investigation');
      fireEvent.press(investigationButtons[1]); // Second investigation button

      // Select an investigation
      fireEvent.press(screen.getByText('I2-1'));

      // Should call setKnightExpeditionChoice with investigation ID
      expect(mockStoreActions.setKnightExpeditionChoice).toHaveBeenCalledWith(
        'test-campaign-1',
        'knight-2',
        'investigation',
        undefined,
        'I2-1'
      );
    });

    it('closes modal when cancel button is pressed', () => {
      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: mockExpedition },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Open investigation selection modal
      const investigationButtons = screen.getAllByText('Investigation');
      fireEvent.press(investigationButtons[0]);

      // Modal should be visible
      expect(screen.getByText('Select Investigation')).toBeTruthy();

      // Press cancel
      fireEvent.press(screen.getByText('Cancel'));

      // Modal should be closed - check that the modal content is no longer accessible
      // Since React Native Modal doesn't remove content from DOM when hidden,
      // we check that the modal's visible state has changed by ensuring
      // the investigation selection modal state is reset
      expect(screen.queryByText('Choose an investigation for Knight One')).toBeNull();
    });

    it('displays selected investigation in button label', () => {
      const expeditionWithInvestigationChoice = {
        ...mockExpedition,
        knightChoices: [
          {
            knightUID: 'knight-1',
            choice: 'investigation',
            investigationId: 'I1-2',
            status: 'in-progress' as const,
          },
        ],
      };

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: expeditionWithInvestigationChoice },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Should show investigation ID in button label
      expect(screen.getByText('Investigation (I1-2)')).toBeTruthy();
    });

    it('displays what each knight is attempting', () => {
      const expeditionWithMultipleChoices = {
        ...mockExpedition,
        knightChoices: [
          {
            knightUID: 'knight-1',
            choice: 'investigation',
            investigationId: 'I1-2',
            status: 'in-progress' as const,
          },
          {
            knightUID: 'knight-2',
            choice: 'quest',
            status: 'in-progress' as const,
          },
          {
            knightUID: 'knight-3',
            choice: 'free-roam',
            status: 'in-progress' as const,
          },
        ],
      };

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': { ...mockCampaign, expedition: expeditionWithMultipleChoices },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Should show what each knight is attempting
      expect(screen.getByText('Attempting: Investigation I1-2')).toBeTruthy();
      expect(screen.getByText('Attempting: Quest')).toBeTruthy();
      expect(screen.getByText('Attempting: Free Roam')).toBeTruthy();
    });

    it('displays quest level for party leader attempting quest', () => {
      const expeditionWithQuestChoice = {
        ...mockExpedition,
        knightChoices: [
          {
            knightUID: 'knight-1',
            choice: 'quest',
            status: 'in-progress' as const,
          },
        ],
      };

      mockUseCampaigns.mockReturnValue({
        campaigns: {
          'test-campaign-1': {
            ...mockCampaign,
            expedition: expeditionWithQuestChoice,
            partyLeaderUID: 'knight-1', // Make knight-1 the party leader
          },
        },
        ...mockStoreActions,
      });

      render(<VisionPhase campaignId='test-campaign-1' />);

      // Should show quest level for party leader (knight-1 has 2 completed investigations, so I2)
      expect(screen.getByText('Attempting: Quest (Chapter 1 - I2)')).toBeTruthy();
    });
  });
});
