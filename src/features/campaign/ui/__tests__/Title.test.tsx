// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
  useThemeTokens: () => ({
    tokens: {
      textPrimary: '#fff',
    },
  }),
}));

// Mock campaigns store
jest.mock('@/store/campaigns', () => ({
  useCampaigns: () => ({
    campaigns: {
      'campaign-1': { name: 'Test Campaign' },
      'campaign-2': { name: 'Another Campaign' },
    },
  }),
}));

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import Title from '../Title';

describe('Title', () => {
  const { useLocalSearchParams } = require('expo-router');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default title when no campaign id', () => {
    useLocalSearchParams.mockReturnValue({});

    const { getByText } = render(<Title />);

    expect(getByText('Campaign')).toBeTruthy();
  });

  it('renders campaign title when campaign id is provided', () => {
    useLocalSearchParams.mockReturnValue({ id: 'campaign-1' });

    const { getByText } = render(<Title />);

    expect(getByText('Campaign – Test Campaign')).toBeTruthy();
  });

  it('renders campaign title for different campaign', () => {
    useLocalSearchParams.mockReturnValue({ id: 'campaign-2' });

    const { getByText } = render(<Title />);

    expect(getByText('Campaign – Another Campaign')).toBeTruthy();
  });

  it('renders default title when campaign not found', () => {
    useLocalSearchParams.mockReturnValue({ id: 'non-existent' });

    const { getByText } = render(<Title />);

    expect(getByText('Campaign')).toBeTruthy();
  });

  it('has correct styling', () => {
    useLocalSearchParams.mockReturnValue({});

    const { getByText } = render(<Title />);

    const titleText = getByText('Campaign');
    expect(titleText.props.style).toMatchObject({
      color: '#fff',
      fontWeight: '800',
    });
    expect(titleText.props.numberOfLines).toBe(1);
  });
});
