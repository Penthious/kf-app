// src/components/TextRow.tsx
import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';

type Props = {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
    multiline?: boolean;
    numberOfLines?: number;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'multiline' | 'numberOfLines'>;

export default function TextRow({
                                    label,
                                    value,
                                    onChangeText,
                                    placeholder,
                                    multiline = false,
                                    numberOfLines = multiline ? 4 : 1,
                                    ...rest
                                }: Props) {
    const { tokens } = useThemeTokens();

    return (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ color: tokens.textMuted, marginBottom: 6 }}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={tokens.textMuted}
                multiline={multiline}
                numberOfLines={numberOfLines}
                style={{
                    color: tokens.textPrimary,
                    backgroundColor: tokens.surface,
                    borderWidth: 1,
                    borderColor: '#0006',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: multiline ? 10 : 8,
                    minHeight: multiline ? 96 : 40,
                    textAlignVertical: multiline ? 'top' as const : 'center' as const,
                }}
                {...rest}
            />
        </View>
    );
}