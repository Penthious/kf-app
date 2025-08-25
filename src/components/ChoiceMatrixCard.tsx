import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useKnights } from '@/store/knights';

const BASE = Array.from({ length: 30 }, (_, i) => String(i + 1));
const EXTRAS = Array.from({ length: 10 }, (_, i) => `E${i + 1}`);

function Cell({ code, on, onToggle }:{ code: string; on: boolean; onToggle:()=>void }) {
    const { tokens } = useThemeTokens();
    return (
        <Pressable
            onPress={onToggle}
            style={{
                width: 48, height: 36, margin: 4, borderRadius: 10,
                alignItems:'center', justifyContent:'center',
                backgroundColor: on ? tokens.accent : tokens.surface,
                borderWidth:1, borderColor:'#0006'
            }}>
            <Text style={{ color: on ? '#0B0B0B' : tokens.textPrimary, fontWeight:'800' }}>{code}</Text>
        </Pressable>
    );
}

export default function ChoiceMatrixCard({ knightUID }:{ knightUID: string }) {
    const { tokens } = useThemeTokens();
    const { knightsById, updateKnightSheet } = useKnights() as any;
    const k = knightsById[knightUID];
    const chosen: string[] = k.sheet.choiceMatrix ?? [];

    const toggle = (code: string) => {
        const set = new Set(chosen);
        if (set.has(code)) set.delete(code); else set.add(code);
        updateKnightSheet(knightUID, { choiceMatrix: Array.from(set).sort((a,b)=>a.localeCompare(b, undefined, {numeric:true})) });
    };

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Choice Matrix</Text>
            <Text style={{ color: tokens.textMuted, marginBottom:8 }}>Tap to toggle. Selected cells are highlighted.</Text>

            <View style={{ flexDirection:'row', flexWrap:'wrap', marginBottom:8 }}>
                {BASE.map(code => (
                    <Cell key={code} code={code} on={chosen.includes(code)} onToggle={()=>toggle(code)} />
                ))}
            </View>

            <Text style={{ color: tokens.textPrimary, fontWeight:'700', marginTop:4, marginBottom:4 }}>Extras</Text>
            <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
                {EXTRAS.map(code => (
                    <Cell key={code} code={code} on={chosen.includes(code)} onToggle={()=>toggle(code)} />
                ))}
            </View>
        </Card>
    );
}