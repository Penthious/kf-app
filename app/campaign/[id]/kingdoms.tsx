// app/campaign/[id]/kingdoms.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalSearchParams } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

// 👇 your new loader (JSON + helpers)
import { KINGDOMS, getUnlockedMonsters, type Kingdom } from '@/catalogs/kingdoms/kingdomLoader';

/** If you didn't make a separate file yet, keep this tiny helper here.
 * Every chapter spans 4 rows: Quest, Inv1, Inv2, Inv3 (0-based inside a chapter). */
function stageIndexFromProgress(chapter: number, invCompleted: number) {
    const ch = Math.max(1, Math.floor(chapter));
    const inv = Math.min(Math.max(0, Math.floor(invCompleted)), 3);
    return (ch - 1) * 4 + inv;
}

/** Count completed investigations for the given chapter from a Knight sheet.
 * This is defensive against slightly different shapes. */
function countCompletedInvestigationsForChapter(leader: any, chapter: number) {
    const chKey = String(chapter);
    const chData = leader?.sheet?.investigations?.[chKey];
    if (!chData) return 0;

    // Case A: completed is a Record<invId, true>
    if (chData.completed && typeof chData.completed === 'object') {
        return Object.values(chData.completed).filter(Boolean).length;
    }

    // Case B: attempts is an array with { id, result: 'pass'|'fail' }
    if (Array.isArray(chData.attempts)) {
        return chData.attempts.filter((a: any) => a?.result === 'pass').length;
    }

    // Fallback
    return 0;
}

function Pill({
                  label,
                  selected,
                  onPress,
              }: {
    label: string;
    selected?: boolean;
    onPress?: () => void;
}) {
    const { tokens } = useThemeTokens();
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingHorizontal: 12,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? tokens.accent : tokens.surface,
                borderWidth: 1,
                borderColor: '#0006',
                marginRight: 8,
                marginBottom: 8,
            }}
        >
            <Text style={{ color: selected ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>
                {label}
            </Text>
        </Pressable>
    );
}

function TierChip({ tier }: { tier: 1 | 2 | 3 | 4 }) {
    // simple color ramp; feel free to map to your theme tokens later
    const bg = tier === 1 ? '#5a6e17' : tier === 2 ? '#c28a15' : tier === 3 ? '#c25415' : '#a11b1b';
    return (
        <View
            style={{
                paddingHorizontal: 8,
                height: 22,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: bg,
            }}
        >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>Tier {tier}</Text>
        </View>
    );
}

export default function CampaignKingdoms() {
    const { tokens } = useThemeTokens();
    const { id } = useGlobalSearchParams<{ id: string }>();

    const { campaigns } = useCampaigns();
    const { knightsById } = useKnights() as any;

    const c = (id && campaigns[id]) || undefined;

    // Build a list of available kingdoms from the loader registry
    const kingdomList: Kingdom[] = useMemo(() => Object.values(KINGDOMS), []);
    const [selectedKingdomId, setSelectedKingdomId] = useState<string>(
        kingdomList[0]?.id ?? 'principality-of-stone'
    );
    const kg = KINGDOMS[selectedKingdomId];

    // Resolve party leader + progress
    const leader = useMemo(() => {
        if (!c?.partyLeaderKnightUID) return undefined;
        return (knightsById as any)[c.partyLeaderKnightUID];
    }, [c?.partyLeaderKnightUID, knightsById]);

    const chapter = leader?.sheet?.chapter ?? 1;
    const invCompleted = countCompletedInvestigationsForChapter(leader, chapter);

    // Compute stage index and clamp to available rows in the JSON
    const stageIndexRaw = stageIndexFromProgress(chapter, invCompleted);
    const rowCount = kg?.bestiary?.stages?.length ?? 0;
    const stageIndex = Math.max(0, Math.min(stageIndexRaw, Math.max(0, rowCount - 1)));

    // Derive unlocked monsters for that kingdom + stage
    const unlocked = kg ? getUnlockedMonsters(kg, stageIndex) : [];

    // Pretty label for the current row
    const withinChapterIndex = stageIndex % 4; // 0..3
    const stageLabel =
        withinChapterIndex === 0
            ? 'Quest'
            : withinChapterIndex === 1
                ? 'Investigation I'
                : withinChapterIndex === 2
                    ? 'Investigation II'
                    : 'Investigation III';

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
                        {/* Context card */}
                        <Card style={{ marginBottom: 12 }}>
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 6 }}>
                                Kingdom Hunts
                            </Text>
                            <Text style={{ color: tokens.textMuted }}>
                                Monsters available depend on the current party leader’s chapter and completed
                                investigations.
                            </Text>
                            <View style={{ height: 8 }} />
                            <Text style={{ color: tokens.textPrimary }}>
                                Leader:{' '}
                                <Text style={{ fontWeight: '800' }}>{leader?.name ?? '— (no leader set)'}</Text>
                            </Text>
                            <Text style={{ color: tokens.textPrimary }}>
                                Chapter: <Text style={{ fontWeight: '800' }}>{chapter}</Text> • Stage:{' '}
                                <Text style={{ fontWeight: '800' }}>{stageLabel}</Text>{' '}
                                <Text style={{ color: tokens.textMuted }}>
                                    (completed {invCompleted} investigation
                                    {invCompleted === 1 ? '' : 's'} this chapter)
                                </Text>
                            </Text>
                        </Card>

                        {/* Kingdom selector */}
                        <Card style={{ marginBottom: 12 }}>
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                                Select Kingdom
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {kingdomList.map((k) => (
                                    <Pill
                                        key={k.id}
                                        label={k.name}
                                        selected={selectedKingdomId === k.id}
                                        onPress={() => setSelectedKingdomId(k.id)}
                                    />
                                ))}
                            </View>
                        </Card>

                        {/* Unlocked monsters */}
                        <Card>
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                                Unlocked Monsters — {kg?.name ?? '—'}
                            </Text>

                            {unlocked.length === 0 ? (
                                <Text style={{ color: tokens.textMuted }}>
                                    No monsters are available for this stage in {kg?.name ?? 'this kingdom'}.
                                </Text>
                            ) : (
                                <View style={{ gap: 10 }}>
                                    {unlocked.map(({ monster, tier }) => (
                                        <View
                                            key={monster.id}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                paddingVertical: 6,
                                            }}
                                        >
                                            <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>
                                                {monster.name}
                                            </Text>
                                            <TierChip tier={tier} />
                                        </View>
                                    ))}
                                </View>
                            )}
                        </Card>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}