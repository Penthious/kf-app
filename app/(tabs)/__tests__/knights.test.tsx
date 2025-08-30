import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { render, screen } from '@testing-library/react-native';
import KnightsScreen from '../knights';

jest.mock('@/store/knights');
jest.mock('@/theme/ThemeProvider');
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

const mockUseKnights = useKnights as jest.MockedFunction<typeof useKnights>;
const mockUseThemeTokens = useThemeTokens as jest.MockedFunction<typeof useThemeTokens>;

describe('KnightsScreen', () => {
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

  it('renders empty knights state', () => {
    mockUseKnights.mockReturnValue({ knightsById: {} } as any);
    render(<KnightsScreen />);
    expect(screen.getByText('No knights yet.')).toBeTruthy();
  });

  it('renders list of knights', () => {
    mockUseKnights.mockReturnValue({
      knightsById: {
        k1: { knightUID: 'k1', name: 'Arthur', catalogId: 'core' },
      },
    } as any);
    render(<KnightsScreen />);
    expect(screen.getByText('Arthur')).toBeTruthy();
    expect(screen.getByText('Catalog: core')).toBeTruthy();
  });
});
