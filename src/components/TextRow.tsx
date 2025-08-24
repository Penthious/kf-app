import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';

export default function TextRow({label, value, onChangeText, placeholder}:{label:string; value:string; onChangeText:(t:string)=>void; placeholder?:string}) {
    const { tokens } = useThemeTokens();
    return (
        <View style={{paddingVertical:8}}>
            <Text style={{color: tokens.textPrimary, fontWeight:'600', marginBottom:6}}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={tokens.textMuted}
                style={{backgroundColor: tokens.surface, color: tokens.textPrimary, borderWidth:1, borderColor:'#0006', padding:10, borderRadius:12}}
                autoCorrect={false}
            />
        </View>
    );
}