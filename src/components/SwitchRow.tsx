import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';

export default function SwitchRow({label, value, onValueChange}:{label: string; value: boolean; onValueChange:(v:boolean)=>void}) {
    const { tokens } = useThemeTokens();
    return (
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:8}}>
            <Text style={{color: tokens.textPrimary, fontWeight:'600'}}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ true: tokens.accent, false: '#444' }}
                thumbColor={'#0B0B0B'}
            />
        </View>
    );
}