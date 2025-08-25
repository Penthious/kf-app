import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalSearchParams } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

type Kingdom = { id: string; name: string; note?: string };

// You can expand/rename these later; all are “unlocked” by default per your rule.
const KINGDOMS: Kingdom[] = [
    { id: 'principality-of-stone', name: 'Principality of Stone' },
    { id: 'barony-of-bountiful-harvest', name: 'Barony of Bountiful Harvest' },
    { id: 'red-kingdom-of-eshin', name: 'Red Kingdom of Eshin' },
    { id: 'ten-thousand-succulent-fears', name: 'Ten Thousand Succulent Fears' },
];

export default function CampaignKingdoms() {
    const { tokens } = useThemeTokens();
    const { id } = useGlobalSearchParams<{ id: string }>();
    const { campaigns } = useCampaigns();
    const { knightsById } = useKnights() as any;

    const c = (id && campaigns[id]) || undefined;

    // Resolve current party leader + their chapter (affects what hunts are valid)
    const leader = useMemo(() => {
        if (!c?.partyLeaderKnightUID) return undefined;
        return (knightsById as any)[c.partyLeaderKnightUID];
    }, [c?.partyLeaderKnightUID, knightsById]);

    const leaderChapter = leader?.sheet?.chapter ?? 1;
    const leaderName = leader?.name ?? '—';

    // simple local expand/collapse state per kingdom panel
    const [open, setOpen] = useState<Record<string, boolean>>({});

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {!c ? (
                    <Card>
                        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Campaign not found</Text>
                        <Text style={{ color: tokens.textMuted, marginTop: 4 }}>
                            Reopen this campaign from the list.
                        </Text>
                    </Card>
                ) : (
                    <>
                        {/* Header / context */}
                        <Card style={{ marginBottom: 12 }}>
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 6 }}>
                                Kingdom Selection
                            </Text>
                            <Text style={{ color: tokens.textMuted }}>
                                All kingdoms are selectable; valid hunts depend on the current party leader.
                            </Text>
                            <View style={{ height: 10 }} />
                            <Text style={{ color: tokens.textPrimary }}>
                                Party Leader: <Text style={{ fontWeight: '800' }}>{leaderName}</Text>
                            </Text>
                            <Text style={{ color: tokens.textPrimary }}>
                                Leader Chapter: <Text style={{ fontWeight: '800' }}>{leaderChapter}</Text>
                            </Text>
                        </Card>

                        {/* Kingdom panels */}
                        {KINGDOMS.map((k) => {
                            const isOpen = !!open[k.id];
                            return (
                                <Card key={k.id} style={{ marginBottom: 12 }}>
                                    <Pressable
                                        onPress={() => setOpen((o) => ({ ...o, [k.id]: !o[k.id] }))}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingVertical: 4,
                                        }}
                                    >
                                        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>
                                            {k.name}
                                        </Text>
                                        <Text style={{ color: tokens.textMuted }}>{isOpen ? '▾' : '▸'}</Text>
                                    </Pressable>

                                    {isOpen ? (
                                        <View style={{ marginTop: 8, gap: 10 }}>
                                            {/* Monsters block (read-only placeholder) */}
                                            <View>
                                                <Text style={{ color: tokens.textPrimary, fontWeight: '700', marginBottom: 6 }}>
                                                    Monsters (computed from leader chapter & investigations)
                                                </Text>
                                                <Text style={{ color: tokens.textMuted }}>
                                                    This will list the unlocked monsters and their tiers for the
                                                    current leader (Chapter {leaderChapter}). We’ll plug in your
                                                    exact unlock tables next.
                                                </Text>
                                            </View>

                                            {/* Kingdom Adventures block (read-only placeholder) */}
                                            <View>
                                                <Text style={{ color: tokens.textPrimary, fontWeight: '700', marginBottom: 6 }}>
                                                    Kingdom Adventures
                                                </Text>
                                                <Text style={{ color: tokens.textMuted }}>
                                                    Track one‑time vs repeatable events here. For now this panel is
                                                    read‑only; we’ll add per‑campaign persistence after we finalize
                                                    the schema you prefer.
                                                </Text>
                                            </View>

                                            {/* Destination helper */}
                                            <View style={{ marginTop: 4 }}>
                                                <Text style={{ color: tokens.textMuted }}>
                                                    Tip: choose your destination kingdom based on the leader. A new
                                                    leader may require Chapter 1 hunts even if others are further
                                                    along.
                                                </Text>
                                            </View>
                                        </View>
                                    ) : null}
                                </Card>
                            );
                        })}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}