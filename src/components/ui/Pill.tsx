// src/components/ui/Pill.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';

type PillProps = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  tone?: 'default' | 'accent' | 'success' | 'danger';
  onPress?: () => void;
  testID?: string;
};

export default function Pill({
  label,
  selected = false,
  disabled = false,
  tone = 'default',
  onPress,
  testID,
}: PillProps) {
  const { tokens } = useThemeTokens();

  // base colors
  const baseBg =
    tone === 'accent'
      ? tokens.accent
      : tone === 'success'
        ? '#2b6b3f'
        : tone === 'danger'
          ? '#7a2d2d'
          : tokens.surface;

  // selected override
  const bg = selected ? (tone === 'accent' ? tokens.accent : tokens.card) : baseBg;

  const textColor =
    tone === 'accent'
      ? selected
        ? '#0B0B0B'
        : '#0B0B0B'
      : selected
        ? tokens.textPrimary
        : tokens.textPrimary;

  // If no onPress is provided, render as a non-interactive View
  if (!onPress) {
    return (
      <View
        accessibilityLabel={label}
        accessibilityState={{ disabled, selected }}
        testID={testID}
        style={{
          paddingHorizontal: 12,
          height: 32,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: selected ? tokens.accent : '#0006',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text style={{ color: textColor, fontWeight: '800' }}>{label}</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      hitSlop={8}
      accessibilityRole='button'
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected }}
      testID={testID}
      style={{
        paddingHorizontal: 12,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: selected ? tokens.accent : '#0006',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ color: textColor, fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}
