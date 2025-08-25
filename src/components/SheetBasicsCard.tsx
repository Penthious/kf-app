import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Card from '@/components/Card';
import Stepper from '@/components/Stepper';
import SwitchRow from '@/components/SwitchRow';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useKnights } from '@/store/knights';

export default function SheetBasicsCard({ knightUID }: { knightUID: string }) {
    const { tokens } = useThemeTokens();
    const { knightsById, updateKnightSheet } = useKnights() as any;
    const k = knightsById[knightUID];
    const sheet = k.sheet;
    const leads = sheet.leads ?? 0;

    const set = (patch: Partial<typeof sheet>) => updateKnightSheet(knightUID, patch);

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Sheet Basics</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: tokens.textPrimary }}>Bane</Text>
                <Stepper value={sheet.bane} min={0} max={4} onChange={(n) => set({ bane: n })} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: tokens.textPrimary }}>Gold</Text>
                <Stepper value={sheet.gold} min={0} max={999} onChange={(n) => set({ gold: n })} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: tokens.textPrimary }}>Leads</Text>
                <Stepper value={leads} min={0} max={99} onChange={(n) => set({ leads: n })} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: tokens.textPrimary }}>Sigh of the Graal</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Pressable
                        onPress={() => set({ sighOfGraal: sheet.sighOfGraal === 1 ? 0 : 1 })}
                        style={{
                            paddingHorizontal: 12,
                            height: 32,
                            borderRadius: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: sheet.sighOfGraal ? tokens.accent : tokens.surface,
                            borderWidth: 1,
                            borderColor: '#0006',
                        }}
                    >
                        <Text style={{ color: sheet.sighOfGraal ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>
                            {sheet.sighOfGraal ? 'Has Sigh' : 'No Sigh'}
                        </Text>
                    </Pressable>
                </View>
            </View>

            <SwitchRow
                label="First Death"
                value={!!sheet.firstDeath}
                onValueChange={(on) => set({ firstDeath: on })}
            />
        </Card>
    );
}