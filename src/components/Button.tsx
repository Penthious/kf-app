// src/components/Button.tsx
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  tone?: 'default' | 'accent' | 'success' | 'danger';
  disabled?: boolean;
  testID?: string;
}

export default function Button({
  label,
  onPress,
  tone = 'default',
  disabled = false,
  testID,
}: ButtonProps) {
  const { tokens } = useThemeTokens();

  const bg =
    tone === 'accent'
      ? tokens.accent
      : tone === 'success'
        ? '#2b6b3f'
        : tone === 'danger'
          ? '#7a2d2d'
          : tokens.surface;

  const fg = tone === 'accent' ? '#0B0B0B' : tokens.textPrimary;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      testID={testID}
      accessibilityRole='button'
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={{
        paddingHorizontal: 16,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: '#0006',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ color: fg, fontWeight: '800' }} testID={testID ? `${testID}-text` : undefined}>
        {label}
      </Text>
    </Pressable>
  );
}
