import React from 'react';
import { View, Text } from 'react-native';
import Card from '@/components/Card';
import Pill from '@/components/ui/Pill';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Adventure, KingdomCatalog } from './utils';

export default function AdventuresCard({ kingdom }: { kingdom?: KingdomCatalog }) {
    const { tokens } = useThemeTokens();
    const adventures: Adventure[] = kingdom?.adventures ?? [];

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                {kingdom?.name ?? 'Kingdom'} • Adventures
            </Text>
            <View style={{ gap: 8 }}>
                {adventures.map(a => (
                    <View key={a.id} style={{
                        padding: 12, borderRadius: 10, backgroundColor: tokens.surface,
                        borderWidth: 1, borderColor: '#0006'
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flex: 1, paddingRight: 8 }}>
                                <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{a.name}</Text>
                                <Text style={{ color: tokens.textMuted, marginTop: 2 }}>{a.id}</Text>
                            </View>
                            {a.repeatable ? <Pill label="Repeatable" tone="accent" /> : <Pill label="One-time" />}
                        </View>
                        {a.note ? <Text style={{ color: tokens.textMuted, marginTop: 6 }}>{a.note}</Text> : null}
                    </View>
                ))}
            </View>
            {adventures.length === 0 && (
                <Text style={{ color: tokens.textMuted }}>No adventures listed in this catalog.</Text>
            )}
        </Card>
    );
}