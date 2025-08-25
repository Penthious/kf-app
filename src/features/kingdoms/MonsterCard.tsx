import React from 'react';
import { View, Text } from 'react-native';
import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import StageBadge from './StageBadge';
import { KingdomCatalog, MonsterRef } from './utils';

export default function MonstersCard({
                                         kingdom, stageRow, availableOnly = true,
                                     }: {
    kingdom?: KingdomCatalog;
    stageRow: Record<string, number>;
    availableOnly?: boolean;
}) {
    const { tokens } = useThemeTokens();
    const monsters: MonsterRef[] = kingdom?.bestiary?.monsters ?? [];
    const list = availableOnly ? monsters.filter(m => (stageRow[m.id] ?? 0) > 0) : monsters;

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                {kingdom?.name ?? 'Kingdom'} • Monsters
            </Text>
            <View style={{ gap: 8 }}>
                {list.length > 0 ? list.map(m => {
                    const stage = stageRow[m.id] ?? 0;
                    return (
                        <View key={m.id} style={{
                            padding: 12, borderRadius: 10, backgroundColor: tokens.surface,
                            borderWidth: 1, borderColor: '#0006',
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <View>
                                <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{m.name}</Text>
                                <Text style={{ color: tokens.textMuted, marginTop: 2 }}>{m.id}</Text>
                            </View>
                            <StageBadge stage={stage} />
                        </View>
                    );
                }) : (
                    <Text style={{ color: tokens.textMuted }}>No monsters currently available.</Text>
                )}
            </View>
        </Card>
    );
}