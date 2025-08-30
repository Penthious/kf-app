import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { render, screen } from '@testing-library/react-native';
import CampaignDelve from '../delve';

jest.mock('@/store/campaigns');
jest.mock('@/theme/ThemeProvider');

const mockUseCampaigns = useCampaigns as jest.MockedFunction<typeof useCampaigns>;
const mockUseThemeTokens = useThemeTokens as jest.MockedFunction<typeof useThemeTokens>;

describe('CampaignDelve', () => {
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

  afterEach(() => jest.clearAllMocks());

  it('shows header and placeholder when campaign exists', () => {
    (mockUseCampaigns as any).mockImplementation((selector?: any) => {
      const store = { currentCampaignId: 'c1', campaigns: { c1: { campaignId: 'c1' } } };
      return selector ? selector(store) : store;
    });

    render(<CampaignDelve />);
    expect(screen.getByText('Delve')).toBeTruthy();
    expect(screen.getByText(/Placeholder:/)).toBeTruthy();
  });

  it('shows "Campaign not found" when missing', () => {
    (mockUseCampaigns as any).mockImplementation((selector?: any) => {
      const store = { currentCampaignId: 'missing', campaigns: {} };
      return selector ? selector(store) : store;
    });

    render(<CampaignDelve />);
    expect(screen.getByText('Campaign not found')).toBeTruthy();
  });
});
