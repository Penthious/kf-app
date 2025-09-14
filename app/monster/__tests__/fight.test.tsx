import { MONSTERS } from '@/catalogs/monsters';
import { MonsterStats } from '@/models/monster';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MonsterFightScreen from '../fight';

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  router: {
    back: jest.fn(),
  },
}));

// Mock theme provider
jest.mock('@/theme/ThemeProvider', () => ({
  useThemeTokens: () => ({
    tokens: {
      bg: '#000000',
      textPrimary: '#ffffff',
      textMuted: '#888888',
      surface: '#1a1a1a',
      accent: '#007AFF',
    },
  }),
}));

// Mock components
jest.mock('@/components/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return function MockButton({ label, onPress, tone }: any) {
    return (
      <TouchableOpacity
        onPress={onPress}
        testID={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock('@/components/Card', () => {
  return function MockCard({ children }: any) {
    return <div data-testid='card'>{children}</div>;
  };
});

describe('MonsterFightScreen', () => {
  const mockUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
    typeof useLocalSearchParams
  >;
  const mockRouterBack = router.back as jest.MockedFunction<typeof router.back>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Route Parameter Handling', () => {
    it('should parse monsterId and level from URL params', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '2',
      });

      render(<MonsterFightScreen />);

      // Should not show error messages
      expect(screen.queryByText('Monster Not Found')).toBeNull();
      expect(screen.queryByText('Level Not Found')).toBeNull();
    });

    it('should handle missing monsterId parameter', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: '',
        level: '1',
      });

      render(<MonsterFightScreen />);

      expect(screen.getByText('Monster Not Found')).toBeTruthy();
      expect(screen.getByText("The monster you're looking for doesn't exist.")).toBeTruthy();
    });

    it('should handle missing level parameter', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '',
      });

      render(<MonsterFightScreen />);

      // Should default to level 1 and find the monster
      expect(screen.queryByText('Monster Not Found')).toBeNull();
      expect(screen.queryByText('Level Not Found')).toBeNull();
    });

    it('should handle invalid level parameter', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: 'invalid',
      });

      render(<MonsterFightScreen />);

      // Should default to level 1
      expect(screen.queryByText('Monster Not Found')).toBeNull();
      expect(screen.queryByText('Level Not Found')).toBeNull();
    });
  });

  describe('Monster Data Loading', () => {
    it('should find and display monster stats for valid monsterId and level', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '2',
      });

      render(<MonsterFightScreen />);

      // Find the ratwolves monster with level 2
      const ratwolvesLevel2 = MONSTERS.find(
        (m: MonsterStats) => m.id === 'ratwolves' && m.level === 2
      );
      expect(ratwolvesLevel2).toBeTruthy();

      // Should display monster name and level
      expect(screen.getByText(ratwolvesLevel2!.name)).toBeTruthy();
      expect(screen.getByText('Level 2')).toBeTruthy();
    });

    it('should display monster stats correctly', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '1',
      });

      render(<MonsterFightScreen />);

      const ratwolvesLevel1 = MONSTERS.find(
        (m: MonsterStats) => m.id === 'ratwolves' && m.level === 1
      );
      expect(ratwolvesLevel1).toBeTruthy();

      // Should display basic stats
      if (ratwolvesLevel1!.toHit !== undefined) {
        expect(screen.getByText(`To Hit: ${ratwolvesLevel1!.toHit}`)).toBeTruthy();
      }
      if (ratwolvesLevel1!.wounds !== undefined) {
        expect(screen.getByText(`Wounds: ${ratwolvesLevel1!.wounds}`)).toBeTruthy();
      }
    });

    it('should display AI activations when present', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '2',
      });

      render(<MonsterFightScreen />);

      const ratwolvesLevel2 = MONSTERS.find(
        (m: MonsterStats) => m.id === 'ratwolves' && m.level === 2
      );

      if (ratwolvesLevel2?.aiActivation && ratwolvesLevel2.aiActivation.length > 0) {
        expect(screen.getByText('AI Activations')).toBeTruthy();
        ratwolvesLevel2.aiActivation.forEach(activation => {
          expect(screen.getByText(`${activation.type}:`)).toBeTruthy();
          expect(screen.getByText(activation.count.toString())).toBeTruthy();
        });
      }
    });

    it('should display signature activations when present', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '2',
      });

      render(<MonsterFightScreen />);

      const ratwolvesLevel2 = MONSTERS.find(
        (m: MonsterStats) => m.id === 'ratwolves' && m.level === 2
      );

      if (ratwolvesLevel2?.signatureActivation && ratwolvesLevel2.signatureActivation.length > 0) {
        expect(screen.getByText('Signature Activations')).toBeTruthy();
        ratwolvesLevel2.signatureActivation.forEach(activation => {
          expect(screen.getByText(`${activation.type}:`)).toBeTruthy();
          expect(screen.getByText(activation.count.toString())).toBeTruthy();
        });
      }
    });

    it('should display traits when present', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '2',
      });

      render(<MonsterFightScreen />);

      const ratwolvesLevel2 = MONSTERS.find(
        (m: MonsterStats) => m.id === 'ratwolves' && m.level === 2
      );

      if (ratwolvesLevel2?.traits && ratwolvesLevel2.traits.length > 0) {
        expect(screen.getByText('Traits')).toBeTruthy();
        ratwolvesLevel2.traits.forEach(trait => {
          expect(screen.getByText(trait.name)).toBeTruthy();
          if (trait.details) {
            expect(screen.getByText(trait.details)).toBeTruthy();
          }
          if (trait.additionalSetup) {
            expect(screen.getByText(`Setup: ${trait.additionalSetup}`)).toBeTruthy();
          }
        });
      }
    });
  });

  describe('Error States', () => {
    it('should show Monster Not Found for invalid monsterId', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'nonexistent-monster',
        level: '1',
      });

      render(<MonsterFightScreen />);

      expect(screen.getByText('Monster Not Found')).toBeTruthy();
      expect(screen.getByText("The monster you're looking for doesn't exist.")).toBeTruthy();
      expect(screen.getByTestId('button-go-back')).toBeTruthy();
    });

    it('should show Level Not Found for valid monsterId but invalid level', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '999',
      });

      render(<MonsterFightScreen />);

      expect(screen.getByText('Level Not Found')).toBeTruthy();
      expect(screen.getByText('Level 999 for Ratwolves is not available.')).toBeTruthy();
      expect(screen.getByTestId('button-go-back')).toBeTruthy();
    });

    it('should show Go Back button in Monster Not Found error', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'nonexistent-monster',
        level: '1',
      });

      render(<MonsterFightScreen />);

      const goBackButton = screen.getByTestId('button-go-back');
      expect(goBackButton).toBeTruthy();
    });

    it('should show Go Back button in Level Not Found error', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '999',
      });

      render(<MonsterFightScreen />);

      const goBackButton = screen.getByTestId('button-go-back');
      expect(goBackButton).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should call router.back when Go Back button is pressed in error state', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'nonexistent-monster',
        level: '1',
      });

      render(<MonsterFightScreen />);

      const goBackButton = screen.getByTestId('button-go-back');
      fireEvent.press(goBackButton);

      expect(mockRouterBack).toHaveBeenCalledTimes(1);
    });

    it('should call router.back when Go Back button is pressed in main content', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '1',
      });

      render(<MonsterFightScreen />);

      const goBackButton = screen.getByTestId('button-go-back');
      fireEvent.press(goBackButton);

      expect(mockRouterBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('SafeAreaView Integration', () => {
    it('should render SafeAreaView in Monster Not Found error state', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'nonexistent-monster',
        level: '1',
      });

      const { UNSAFE_root } = render(<MonsterFightScreen />);

      // SafeAreaView should be present (we can't directly test the component,
      // but we can verify the structure renders without errors)
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render SafeAreaView in Level Not Found error state', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '999',
      });

      const { UNSAFE_root } = render(<MonsterFightScreen />);

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render SafeAreaView in main content state', () => {
      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'ratwolves',
        level: '1',
      });

      const { UNSAFE_root } = render(<MonsterFightScreen />);

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle monster with no activations', () => {
      // Find a monster that has no activations
      const monsterWithoutActivations = MONSTERS.find(
        (m: MonsterStats) =>
          (!m.aiActivation || m.aiActivation.length === 0) &&
          (!m.signatureActivation || m.signatureActivation.length === 0)
      );

      if (monsterWithoutActivations) {
        mockUseLocalSearchParams.mockReturnValue({
          monsterId: monsterWithoutActivations.id,
          level: monsterWithoutActivations.level.toString(),
        });

        render(<MonsterFightScreen />);

        expect(screen.getByText(monsterWithoutActivations.name)).toBeTruthy();
        // Should not crash or show activation sections
      }
    });

    it('should handle monster with no traits', () => {
      // Find a monster that has no traits
      const monsterWithoutTraits = MONSTERS.find(
        (m: MonsterStats) => !m.traits || m.traits.length === 0
      );

      if (monsterWithoutTraits) {
        mockUseLocalSearchParams.mockReturnValue({
          monsterId: monsterWithoutTraits.id,
          level: monsterWithoutTraits.level.toString(),
        });

        render(<MonsterFightScreen />);

        expect(screen.getByText(monsterWithoutTraits.name)).toBeTruthy();
        // Should not crash or show traits section
      }
    });

    it('should handle empty monster catalog gracefully', () => {
      // Mock empty MONSTERS array
      const originalMonsters = MONSTERS;
      (MONSTERS as any).length = 0;

      mockUseLocalSearchParams.mockReturnValue({
        monsterId: 'any-monster',
        level: '1',
      });

      render(<MonsterFightScreen />);

      expect(screen.getByText('Monster Not Found')).toBeTruthy();

      // Restore original MONSTERS
      (MONSTERS as any).length = originalMonsters.length;
    });
  });
});
