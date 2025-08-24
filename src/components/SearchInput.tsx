import React from 'react';
import {View, TextInput} from 'react-native';
import {useThemeTokens} from '@/theme/ThemeProvider';

type Props = { value: string; onChangeText: (t: string) => void; placeholder?: string };
export default function SearchInput({value, onChangeText, placeholder = 'Search keywords...'}: Props){
    const {tokens} = useThemeTokens();
    return (
        <View style={{backgroundColor: tokens.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8}}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={tokens.textMuted}
                style={{color: tokens.textPrimary, fontSize: 16}}
                autoCorrect={false}
                autoCapitalize="none"
            />
        </View>
    );
}
