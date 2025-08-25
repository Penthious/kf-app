import React from 'react';
import { View, Text } from 'react-native';
import Card from '@/components/Card';
import Stepper from '@/components/Stepper';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useKnights } from '@/store/knights';

export default function VirtuesCard({ knightUID }: { knightUID: string }){
    const { tokens } = useThemeTokens();
    const { knightsById, updateKnightSheet } = useKnights() as any;
    const k = knightsById[knightUID];
    const v = k.sheet.virtues;

    const set = (key: keyof typeof v, val: number) =>
        updateKnightSheet(knightUID, { virtues: { ...v, [key]: val } });

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Virtues</Text>
            {([
                ['bravery','Bravery'],
                ['tenacity','Tenacity'],
                ['sagacity','Sagacity'],
                ['fortitude','Fortitude'],
                ['might','Might'],
                ['insight','Insight'],
            ] as const).map(([key,label])=>(
                <View key={key} style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <Text style={{ color: tokens.textPrimary }}>{label}</Text>
                    <Stepper value={v[key]} min={0} max={10} onChange={(n)=>set(key,n)} />
                </View>
            ))}
        </Card>
    );
}