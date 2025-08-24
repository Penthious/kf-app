import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';

type Props = {
    label?: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
};

export default function Stepper({ label, value, onChange, min = 0, max = Number.MAX_SAFE_INTEGER, step = 1 }: Props){
    const { tokens } = useThemeTokens();
    const dec = () => onChange(Math.max(min, value - step));
    const inc = () => onChange(Math.min(max, value + step));
    return (
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:8}}>
            {label ? <Text style={{color: tokens.textPrimary, fontWeight:'600'}}>{label}</Text> : <View />}
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Pressable onPress={dec} style={{backgroundColor: tokens.surface, paddingVertical:6, paddingHorizontal:12, borderTopLeftRadius:10, borderBottomLeftRadius:10, borderWidth:1, borderColor:'#0006'}}>
                    <Text style={{color: tokens.textPrimary, fontWeight:'800'}}>-</Text>
                </Pressable>
                <View style={{backgroundColor: tokens.card, paddingVertical:6, paddingHorizontal:14, borderTopWidth:1, borderBottomWidth:1, borderColor:'#0006'}}>
                    <Text style={{color: tokens.textPrimary, minWidth:28, textAlign:'center'}}>{value}</Text>
                </View>
                <Pressable onPress={inc} style={{backgroundColor: tokens.surface, paddingVertical:6, paddingHorizontal:12, borderTopRightRadius:10, borderBottomRightRadius:10, borderWidth:1, borderColor:'#0006'}}>
                    <Text style={{color: tokens.textPrimary, fontWeight:'800'}}>+</Text>
                </Pressable>
            </View>
        </View>
    );
}