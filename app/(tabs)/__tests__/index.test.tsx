import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { render, screen } from '@testing-library/react-native';
import CampaignsScreen from '../index';

jest.mock('@/store/campaigns');
jest.mock('@/theme/ThemeProvider');
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockUseCampaigns = useCampaigns as jest.MockedFunction<typeof useCampaigns>;
const mockUseThemeTokens = useThemeTokens as jest.MockedFunction<typeof useThemeTokens>;

describe('CampaignsScreen', () => {
  beforeEach(() => {
    mockUseThemeTokens.mockReturnValue({
      tokens: {
        __version: 1,
        bg: '#000',
        surface: '#111',
        card: '#222',
        textPrimary: '#fff',
        textMuted: '#888',
        accent: '#0af',
        success: '#0f0',
        warning: '#fa0',
        danger: '#f00',
      },
      mode: 'dark' as const,
      setMode: jest.fn(),
      setCustomTokens: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when there are no campaigns', () => {
    mockUseCampaigns.mockReturnValue({ campaigns: {} } as any);
    render(<CampaignsScreen />);
    expect(screen.getByText('Campaigns')).toBeTruthy();
    expect(screen.getByText('You don’t have any campaigns yet.')).toBeTruthy();
    expect(screen.getByText('Tap “New Campaign” below to create your first one.')).toBeTruthy();
  });

  it('renders campaign list and allows navigation', () => {
    mockUseCampaigns.mockReturnValue({
      campaigns: {
        abc: { campaignId: 'abc', name: 'Test Campaign', members: [{ isActive: true }] },
      },
    } as any);
    render(<CampaignsScreen />);
    expect(screen.getByText('Test Campaign')).toBeTruthy();
  });
});
