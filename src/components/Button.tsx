// src/components/Button.tsx
import React from 'react';
import { Text, Pressable } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';

type Props = {
    label: string;
    onPress: () => void | Promise<void>;
    tone?: 'default' | 'accent' | 'success' | 'danger';
    disabled?: boolean;
};

export default function Button({ label, onPress, tone = 'default', disabled = false }: Props) {
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
            <Text style={{ color: fg, fontWeight: '800' }}>{label}</Text>
        </Pressable>
    );
}