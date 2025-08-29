import { useGear } from '@/store';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { GearActions } from '../GearActions';

// Mock the stores
jest.mock('@/store/gear');
jest.mock('@/theme/ThemeProvider');

const mockUseGear = useGear as jest.MockedFunction<typeof useGear>;
const mockUseThemeTokens = useThemeTokens as jest.MockedFunction<typeof useThemeTokens>;

describe('GearActions', () => {
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

  const mockGearStore = {
    attachUpgrade: jest.fn(),
    detachUpgrade: jest.fn(),
    getAttachedUpgrade: jest.fn(),
    getUpgradeTargets: jest.fn(),
    getAvailableQuantity: jest.fn(),
    reforgeMerchantGear: jest.fn(),
    isReforged: jest.fn(),
    allGear: {
      'sword-1': {
        id: 'sword-1',
        name: 'Test Sword',
        type: 'kingdom' as const,
        stats: { attack: 2 },
        keywords: ['sharp'],
        description: 'A test sword',
        rarity: 'common' as const,
        quantity: 2,
      },
      'upgrade-1': {
        id: 'upgrade-1',
        name: 'Sharpening Stone',
        type: 'upgrade' as const,
        upgradeType: 'weapon' as const,
        stats: { attack: 1 },
        keywords: ['sharpening'],
        description: 'A sharpening stone',
        rarity: 'common' as const,
        quantity: 2,
      },
      'merchant-sword': {
        id: 'merchant-sword',
        name: 'Merchant Sword',
        type: 'merchant' as const,
        side: 'normal' as const,
        stats: { attack: 3 },
        keywords: ['merchant'],
        description: 'A merchant sword',
        rarity: 'rare' as const,
        cost: 50,
        quantity: 2,
      },
    },
  };

  beforeEach(() => {
    mockUseThemeTokens.mockReturnValue({
      tokens: mockTokens,
      mode: 'dark' as const,
      setMode: jest.fn(),
      setCustomTokens: jest.fn(),
    });
    mockUseGear.mockReturnValue(mockGearStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders upgrade section for non-upgrade, non-merchant gear', () => {
    const gear = mockGearStore.allGear['sword-1'];
    mockGearStore.getAttachedUpgrade.mockReturnValue(null);
    mockGearStore.getUpgradeTargets.mockReturnValue(['sword-1']);
    mockGearStore.getAvailableQuantity.mockReturnValue(1);

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    expect(screen.getByText('Upgrades')).toBeTruthy();
    expect(screen.getByText('Attach Upgrade')).toBeTruthy();
  });

  it('shows attached upgrade when one is attached', () => {
    const gear = mockGearStore.allGear['sword-1'];
    mockGearStore.getAttachedUpgrade.mockReturnValue('upgrade-1');
    mockGearStore.getAvailableQuantity.mockReturnValue(1);

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    expect(screen.getByText('Attached: Sharpening Stone')).toBeTruthy();
    expect(screen.getByText('Detach')).toBeTruthy();
  });

  it('shows no compatible upgrades message when none available', () => {
    const gear = mockGearStore.allGear['sword-1'];
    mockGearStore.getAttachedUpgrade.mockReturnValue(null);
    mockGearStore.getUpgradeTargets.mockReturnValue([]);

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    expect(screen.getByText('No compatible upgrades available')).toBeTruthy();
  });

  it('renders reforge section for normal merchant gear', () => {
    const gear = mockGearStore.allGear['merchant-sword'];
    mockGearStore.isReforged.mockReturnValue(false);

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    expect(screen.getByText('Reforging')).toBeTruthy();
    expect(screen.getByText('Reforge')).toBeTruthy();
  });

  it('does not render reforge section for already reforged merchant gear', () => {
    const gear = mockGearStore.allGear['merchant-sword'];
    mockGearStore.isReforged.mockReturnValue(true);

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    expect(screen.queryByText('Reforging')).toBeNull();
    expect(screen.queryByText('Reforge')).toBeNull();
  });

  it('does not render upgrade section for upgrade gear', () => {
    const gear = mockGearStore.allGear['upgrade-1'];

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    expect(screen.queryByText('Upgrades')).toBeNull();
  });

  it('does not render upgrade section for merchant gear', () => {
    const gear = mockGearStore.allGear['merchant-sword'];

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    expect(screen.queryByText('Upgrades')).toBeNull();
  });

  it('calls detachUpgrade when detach button is pressed', () => {
    const gear = mockGearStore.allGear['sword-1'];
    mockGearStore.getAttachedUpgrade.mockReturnValue('upgrade-1');

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    fireEvent.press(screen.getByText('Detach'));

    expect(mockGearStore.detachUpgrade).toHaveBeenCalledWith('upgrade-1');
  });

  it('calls reforgeMerchantGear when reforge button is pressed', () => {
    const gear = mockGearStore.allGear['merchant-sword'];
    mockGearStore.isReforged.mockReturnValue(false);

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    fireEvent.press(screen.getByText('Reforge'));

    // Check that Alert.alert was called
    expect(Alert.alert).toHaveBeenCalledWith(
      'Reforge Gear',
      'Are you sure you want to reforge Merchant Sword? This action cannot be undone.',
      expect.arrayContaining([
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reforge',
          style: 'destructive',
          onPress: expect.any(Function),
        },
      ])
    );

    // Simulate the user confirming the reforge
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const confirmButton = alertCall[2].find((button: any) => button.text === 'Reforge');
    confirmButton.onPress();

    expect(mockGearStore.reforgeMerchantGear).toHaveBeenCalledWith('merchant-sword');
  });

  it('shows upgrade modal when attach upgrade button is pressed', () => {
    const gear = mockGearStore.allGear['sword-1'];
    mockGearStore.getAttachedUpgrade.mockReturnValue(null);
    mockGearStore.getUpgradeTargets.mockReturnValue(['sword-1']);
    mockGearStore.getAvailableQuantity.mockReturnValue(1);

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    fireEvent.press(screen.getByText('Attach Upgrade'));

    expect(screen.getByText('Select Upgrade')).toBeTruthy();
    expect(screen.getByText('Sharpening Stone')).toBeTruthy();
  });

  it('calls attachUpgrade when an upgrade is selected from modal', () => {
    const gear = mockGearStore.allGear['sword-1'];
    mockGearStore.getAttachedUpgrade.mockReturnValue(null);
    mockGearStore.getUpgradeTargets.mockReturnValue(['sword-1']);
    mockGearStore.getAvailableQuantity.mockReturnValue(1);

    render(<GearActions gear={gear} knightId='knight-1' isGearInstance={true} />);

    fireEvent.press(screen.getByText('Attach Upgrade'));
    fireEvent.press(screen.getByText('Sharpening Stone'));

    expect(mockGearStore.attachUpgrade).toHaveBeenCalledWith('upgrade-1', 'sword-1');
  });
});
