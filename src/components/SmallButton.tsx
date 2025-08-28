import {useThemeTokens} from "@/theme/ThemeProvider";
import {Pressable, Text} from "react-native";
import React from "react";

export default function SmallButton({
                         label,
                         onPress,
                         disabled = false,
                         tone = 'default',
                     }: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    tone?: 'default' | 'accent';
}) {
    const { tokens } = useThemeTokens();

    const bg =
        tone === 'accent'
            ? (disabled ? tokens.surface : tokens.accent)
            : tokens.surface;
    const textColor = tone === 'accent' ? (disabled ? tokens.textMuted : '#0B0B0B') : tokens.textPrimary;
    const border = '#0006';
    const opacity = disabled ? 0.5 : 1;

    return (
        <Pressable
            onPress={disabled ? undefined : onPress}
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
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
        >
            <Text style={{ color: textColor, fontWeight: '800' }}>{label}</Text>
        </Pressable>
    );
}
