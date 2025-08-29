import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text } from 'react-native';

interface SmallButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'default' | 'accent';
  testID?: string;
}

export default function SmallButton({
  label,
  onPress,
  disabled = false,
  tone = 'default',
  testID,
}: SmallButtonProps) {
  const { tokens } = useThemeTokens();

  const bg = tone === 'accent' ? (disabled ? tokens.surface : tokens.accent) : tokens.surface;
  const textColor =
    tone === 'accent' ? (disabled ? tokens.textMuted : '#0B0B0B') : tokens.textPrimary;
  const border = '#0006';
  const opacity = disabled ? 0.5 : 1;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      testID={testID}
      style={{
        paddingHorizontal: 14,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
        opacity,
      }}
      accessibilityRole='button'
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text
        style={{ color: textColor, fontWeight: '800' }}
        testID={testID ? `${testID}-text` : undefined}
      >
        {label}
      </Text>
    </Pressable>
  );
}
