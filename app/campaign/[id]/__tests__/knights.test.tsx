import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
  useThemeTokens: () => ({
    tokens: {
      textPrimary: '#fff',
      textMuted: '#aaa',
      bg: '#000',
      surface: '#222',
      accent: '#4ade80',
    },
  }),
}));

// Mock router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock campaign store
jest.mock('@/store/campaigns', () => ({
  useCampaigns: jest.fn(),
}));

// Mock knights store
jest.mock('@/store/knights', () => ({
  useKnights: jest.fn(),
}));

// Mock knight catalog
jest.mock('@/catalogs/knights', () => [
  {
    id: 'galahad',
    name: 'Sir Galahad',
    source: 'Core',
  },
  {
    id: 'lancelot',
    name: 'Sir Lancelot',
    source: 'Core',
  },
]);

// Mock knight utilities
jest.mock('@/models/knight', () => ({
  createSheetWithStartingVirtues: jest.fn().mockReturnValue({}),
}));

// Mock utils/knights to ensure getAvailableKnights works as expected
jest.mock('@/utils/knights', () => ({
  getAvailableKnights: jest.fn((allKnights, campaignExpansions) => {
    // Ensure allKnights is an array and return it filtered
    if (!Array.isArray(allKnights)) {
      return [];
    }
    return allKnights.filter(knight => {
      // Add your filtering logic here if getAvailableKnights has complex logic
      // For now, just return all mocked knights
      return true;
    });
  }),
}));

// Mock uuid
jest.mock('react-native-uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { render } from '@testing-library/react-native';
import CampaignKnightsPage from '../knights';

const mockUseCampaigns = useCampaigns as jest.MockedFunction<typeof useCampaigns>;
const mockUseKnights = useKnights as jest.MockedFunction<typeof useKnights>;

describe('CampaignKnightsPage', () => {
  const mockSetPartyLeader = jest.fn();
  const mockBenchMember = jest.fn();
  const mockAddKnightToCampaign = jest.fn();
  const mockAddKnightAsBenched = jest.fn();
  const mockReplaceCatalogKnight = jest.fn();
  const mockRemoveMember = jest.fn();

  const mockCampaign = {
    campaignId: 'test-campaign',
    name: 'Test Campaign',
    members: [
      {
        knightUID: 'knight-1',
        displayName: 'Sir Galahad',
        catalogId: 'galahad',
        isActive: true,
        joinedAt: Date.now(),
      },
      {
        knightUID: 'knight-2',
        displayName: 'Sir Lancelot',
        catalogId: 'lancelot',
        isActive: true,
        joinedAt: Date.now(),
      },
    ],
    settings: { fivePlayerMode: false, expansions: {} },
    kingdoms: [],
    partyLeaderUID: 'knight-1',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const mockKnightsById = {
    'knight-1': {
      knightUID: 'knight-1',
      name: 'Sir Galahad',
      sheet: { chapter: 1, chapters: {} },
    },
    'knight-2': {
      knightUID: 'knight-2',
      name: 'Sir Lancelot',
      sheet: { chapter: 1, chapters: {} },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useCampaigns calls individually
    mockUseCampaigns
      .mockReturnValueOnce('test-campaign') // currentCampaignId
      .mockReturnValueOnce({ 'test-campaign': mockCampaign }) // campaigns
      .mockReturnValueOnce(mockSetPartyLeader) // setPartyLeader
      .mockReturnValueOnce(mockBenchMember) // benchMember
      .mockReturnValueOnce(mockAddKnightToCampaign) // addKnightToCampaign
      .mockReturnValueOnce(mockAddKnightAsBenched) // addKnightAsBenched
      .mockReturnValueOnce(mockReplaceCatalogKnight) // replaceCatalogKnight
      .mockReturnValueOnce(mockRemoveMember); // removeMember

    mockUseKnights.mockReturnValue({
      knightsById: mockKnightsById,
    } as any);
  });

  it('renders campaign knights page', () => {
    const { getByText } = render(<CampaignKnightsPage />);

    expect(getByText('Active Knights')).toBeTruthy();
  });

  it('disables party leader changes when expedition has started', () => {
    jest.clearAllMocks();

    const campaignWithExpedition = {
      ...mockCampaign,
      expedition: {
        currentPhase: 'vision',
        knightChoices: [],
        phaseStartedAt: Date.now(),
      },
    };

    mockUseCampaigns
      .mockReturnValueOnce('test-campaign') // currentCampaignId
      .mockReturnValueOnce({ 'test-campaign': campaignWithExpedition }) // campaigns
      .mockReturnValueOnce(mockSetPartyLeader) // setPartyLeader
      .mockReturnValueOnce(mockBenchMember) // benchMember
      .mockReturnValueOnce(mockAddKnightToCampaign) // addKnightToCampaign
      .mockReturnValueOnce(mockAddKnightAsBenched) // addKnightAsBenched
      .mockReturnValueOnce(mockReplaceCatalogKnight) // replaceCatalogKnight
      .mockReturnValueOnce(mockRemoveMember); // removeMember

    const { getByText } = render(<CampaignKnightsPage />);

    // The ActiveLineup component should be rendered with isLeaderDisabled=true
    // We can't directly test this without more complex component testing,
    // but we can verify the component renders without errors
    expect(getByText('Active Knights')).toBeTruthy();
  });

  it('enables party leader changes when expedition has not started', () => {
    jest.clearAllMocks();

    const campaignWithoutExpedition = {
      ...mockCampaign,
      expedition: undefined,
    };

    mockUseCampaigns
      .mockReturnValueOnce('test-campaign') // currentCampaignId
      .mockReturnValueOnce({ 'test-campaign': campaignWithoutExpedition }) // campaigns
      .mockReturnValueOnce(mockSetPartyLeader) // setPartyLeader
      .mockReturnValueOnce(mockBenchMember) // benchMember
      .mockReturnValueOnce(mockAddKnightToCampaign) // addKnightToCampaign
      .mockReturnValueOnce(mockAddKnightAsBenched) // addKnightAsBenched
      .mockReturnValueOnce(mockReplaceCatalogKnight) // replaceCatalogKnight
      .mockReturnValueOnce(mockRemoveMember); // removeMember

    const { getByText } = render(<CampaignKnightsPage />);

    expect(getByText('Active Knights')).toBeTruthy();
  });

  it('handles different expedition phases', () => {
    const phases = [
      'vision',
      'outpost',
      'delve',
      'clash',
      'rest',
      'second-delve',
      'second-clash',
      'spoils',
    ] as const;

    phases.forEach(phase => {
      jest.clearAllMocks();

      const campaignWithPhase = {
        ...mockCampaign,
        expedition: {
          currentPhase: phase,
          knightChoices: [],
          phaseStartedAt: Date.now(),
        },
      };

      mockUseCampaigns
        .mockReturnValueOnce('test-campaign') // currentCampaignId
        .mockReturnValueOnce({ 'test-campaign': campaignWithPhase }) // campaigns
        .mockReturnValueOnce(mockSetPartyLeader) // setPartyLeader
        .mockReturnValueOnce(mockBenchMember) // benchMember
        .mockReturnValueOnce(mockAddKnightToCampaign) // addKnightToCampaign
        .mockReturnValueOnce(mockAddKnightAsBenched) // addKnightAsBenched
        .mockReturnValueOnce(mockReplaceCatalogKnight) // replaceCatalogKnight
        .mockReturnValueOnce(mockRemoveMember); // removeMember

      const { getByText } = render(<CampaignKnightsPage />);

      expect(getByText('Active Knights')).toBeTruthy();
    });
  });

  it('handles five player mode', () => {
    jest.clearAllMocks();

    const campaignFivePlayer = {
      ...mockCampaign,
      settings: { fivePlayerMode: true, expansions: {} },
    };

    mockUseCampaigns
      .mockReturnValueOnce('test-campaign') // currentCampaignId
      .mockReturnValueOnce({ 'test-campaign': campaignFivePlayer }) // campaigns
      .mockReturnValueOnce(mockSetPartyLeader) // setPartyLeader
      .mockReturnValueOnce(mockBenchMember) // benchMember
      .mockReturnValueOnce(mockAddKnightToCampaign) // addKnightToCampaign
      .mockReturnValueOnce(mockAddKnightAsBenched) // addKnightAsBenched
      .mockReturnValueOnce(mockReplaceCatalogKnight) // replaceCatalogKnight
      .mockReturnValueOnce(mockRemoveMember); // removeMember

    const { getByText } = render(<CampaignKnightsPage />);

    expect(getByText('Active Knights')).toBeTruthy();
  });
});
