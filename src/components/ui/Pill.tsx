import React from 'react';
import { Pressable, Text } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';

export default function Pill({
                                 label, tone = 'default', onPress,
                             }: { label: string; tone?: 'default' | 'accent' | 'success' | 'danger'; onPress?: () => void }) {
    const { tokens } = useThemeTokens();
    const bg =
        tone === 'accent' ? tokens.accent :
            tone === 'success' ? '#2b6b3f' :
                tone === 'danger' ? '#7a2d2d' : tokens.surface;
    const color = tone === 'accent' ? '#0B0B0B' : tokens.textPrimary;

    return (
        <Pressable onPress={onPress} style={{
            paddingHorizontal: 12, height: 28, borderRadius: 14,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: bg, borderWidth: 1, borderColor: '#0006'
        }}>
            <Text style={{ color, fontWeight: '800' }}>{label}</Text>
        </Pressable>
    );
}