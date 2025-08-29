import Card from '@/components/Card';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text, View } from 'react-native';

function Tick({ on, onPress }:{ on:boolean; onPress:()=>void }){
    const { tokens } = useThemeTokens();
    return (
        <Pressable
            onPress={onPress}
            style={{
                width:36, height:28, borderRadius:8, alignItems:'center', justifyContent:'center',
                backgroundColor: on ? tokens.accent : tokens.surface, borderWidth:1, borderColor:'#0006', marginLeft:8
            }}>
            <Text style={{ color: on ? '#0B0B0B' : tokens.textPrimary, fontWeight:'800' }}>
                {on ? '✓' : ' '}
            </Text>
        </Pressable>
    );
}

export default function VicesCard({ knightUID }:{ knightUID: string }) {
    const { tokens } = useThemeTokens();
    const { knightsById, updateKnightSheet } = useKnights() as any;
    const k = knightsById[knightUID];
    const v = k.sheet.vices;

    const set = (key: keyof typeof v, count: number) =>
        updateKnightSheet(knightUID, { vices: { ...v, [key]: count } });

    const Row = ({ keyName, label }:{ keyName: keyof typeof v; label: string }) => {
        const val = v[keyName] || 0;
        return (
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <Text style={{ color: tokens.textPrimary }}>{label}</Text>
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                    {[1,2,3,4].map(n=>(
                        <Tick key={n} on={val >= n} onPress={()=> set(keyName, val === n ? n-1 : n)} />
                    ))}
                </View>
            </View>
        );
    };

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Vices</Text>
            <Row keyName="cowardice" label="Cowardice (vs Bravery)" />
            <Row keyName="dishonor"  label="Dishonor (vs Tenacity)" />
            <Row keyName="duplicity" label="Duplicity (vs Sagacity)" />
            <Row keyName="disregard" label="Disregard (vs Fortitude)" />
            <Row keyName="cruelty"   label="Cruelty (vs Might)" />
            <Row keyName="treachery" label="Treachery (vs Insight)" />
        </Card>
    );
}