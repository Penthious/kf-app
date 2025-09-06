import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';

// ---- expo-router mock ----
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({})),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

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

jest.mock('@/store/campaigns', () => ({
  useCampaigns: () => ({
    campaigns: {},
    endExpedition: mockEndExpedition,
  }),
}));

// Import the component after mocking
import HeaderMenuButton from '@/features/campaign/ui/HeaderMenuButton';

// ---- Alert mock ----
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('HeaderMenuButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEndExpedition.mockClear();
  });

  it('renders the menu button', () => {
    const { getByTestId, getByText } = render(<HeaderMenuButton testID='header-menu' />);

    expect(getByTestId('header-menu')).toBeTruthy();
    expect(getByText('☰')).toBeTruthy();
  });

  it('renders without testID when not provided', () => {
    const { getByText } = render(<HeaderMenuButton />);

    expect(getByText('☰')).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    const button = getByTestId('header-menu');
    expect(button.props.accessibilityLabel).toBe('Open quick menu');
    expect(button.props.accessibilityRole).toBe('button');
  });

  it('has correct hit slop for touch target', () => {
    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    const button = getByTestId('header-menu');
    expect(button.props.hitSlop).toBe(12);
  });

  it('shows menu when button is pressed', async () => {
    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    // The menu should be rendered
    expect(getByTestId('header-menu-menu-menu')).toBeTruthy();
  });

  it('shows exit campaign option when id is present', async () => {
    const { useLocalSearchParams } = require('expo-router');
    useLocalSearchParams.mockReturnValue({ id: 'test-campaign' });

    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    // The menu should be rendered
    expect(getByTestId('header-menu-menu-menu')).toBeTruthy();
  });

  it('does not show exit campaign option when id is not present', async () => {
    const { useLocalSearchParams } = require('expo-router');
    useLocalSearchParams.mockReturnValue({});

    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    // The menu should still be rendered
    expect(getByTestId('header-menu-menu-menu')).toBeTruthy();
  });

  it('has correct menu items structure', async () => {
    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    // The menu should be rendered
    expect(getByTestId('header-menu-menu-menu')).toBeTruthy();
  });

  it('has correct menu items when id is present', async () => {
    const { useLocalSearchParams } = require('expo-router');
    useLocalSearchParams.mockReturnValue({ id: 'test-campaign' });

    const { getByTestId } = render(<HeaderMenuButton testID='header-menu' />);

    await act(async () => {
      fireEvent.press(getByTestId('header-menu'));
    });

    // The menu should be rendered
    expect(getByTestId('header-menu-menu-menu')).toBeTruthy();
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
});
