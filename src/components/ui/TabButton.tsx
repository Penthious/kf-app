import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text } from 'react-native';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export default function TabButton({ label, isActive, onPress }: TabButtonProps) {
  const { tokens } = useThemeTokens();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: isActive ? tokens.accent : tokens.surface,
        borderBottomWidth: 2,
        borderBottomColor: isActive ? tokens.accent : 'transparent',
      }}
    >
      <Text
        style={{
          color: isActive ? '#0B0B0B' : tokens.textPrimary,
          fontWeight: '800',
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
