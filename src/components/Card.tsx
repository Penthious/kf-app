// src/components/Card.tsx
import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';

type CardProps = ViewProps & { children: React.ReactNode };

export default function Card({ children, style, ...rest }: CardProps) {
  const { tokens } = useThemeTokens();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: tokens.surface,
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: '#0006',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  const { tokens } = useThemeTokens();
  return (
    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
      {children}
    </Text>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  const { tokens } = useThemeTokens();
  return <Text style={{ color: tokens.textMuted }}>{children}</Text>;
}

Card.Title = Title;
Card.BodyText = BodyText;
