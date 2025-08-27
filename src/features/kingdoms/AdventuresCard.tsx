import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Pill from '@/components/ui/Pill';
import Stepper from '@/components/Stepper';
import { useCampaigns } from '@/store/campaigns';
import type { KingdomCatalog } from '@/models/kingdom';

export default function AdventuresCard({ kingdom }: { kingdom?: KingdomCatalog }) {
    const { tokens } = useThemeTokens();
    const campaigns = useCampaigns(s => s.campaigns);
    const currentCampaignId = useCampaigns(s => (s as any).currentCampaignId) as string | undefined;
    const setAdventureProgress = useCampaigns(s => (s as any).setAdventureProgress) as (
        campaignId: string,
        kingdomId: string,
        adventureId: string,
        opts?: { singleAttempt?: boolean; delta?: number }
    ) => void;

    const c = currentCampaignId ? campaigns[currentCampaignId] : undefined;

    const slug = (s: string) =>
        s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const kState = useMemo(() => {
        if (!c || !kingdom) return undefined;
        return c.kingdoms?.find(k => k.kingdomId === kingdom.id);
    }, [c, kingdom]);

    // Helper: read adventure count (supports array or record storage)
    const getAdventureCount = (advId: string): number => {
        const advs: unknown = kState?.adventures;
        if (!advs) return 0;

        if (Array.isArray(advs)) {
            const found = (advs as unknown[]).find(
                (a) => a && typeof a === 'object' && 'id' in (a as any) && (a as any).id === advId
            ) as any | undefined;
            return found ? Number(found.completedCount ?? 0) : 0;
        }

        if (typeof advs === 'object') {
            const rec = advs as Record<string, unknown>;
            const v = rec[advId];
            if (typeof v === 'number') return v;
            if (v && typeof v === 'object' && 'completedCount' in (v as any)) {
                return Number((v as any).completedCount ?? 0);
            }
        }

        return 0;
    };

    const onCompleteOnce = (advId: string) => {
        if (!c || !kingdom) return;
        setAdventureProgress(c.campaignId, kingdom.id, advId, { singleAttempt: true });
    };

    const onChangeCount = (advId: string, next: number, current: number) => {
        if (!c || !kingdom) return;
        const delta = Math.max(0, Math.floor(next)) - Math.max(0, Math.floor(current));
        if (delta !== 0) setAdventureProgress(c.campaignId, kingdom.id, advId, { delta });
    };

    if (!kingdom) return null;

    return (
        <View
            style={{
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#0006',
                backgroundColor: tokens.surface,
                gap: 8,
            }}
        >
            <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Adventures</Text>

            {kingdom.adventures.length === 0 ? (
                <Text style={{ color: tokens.textMuted }}>No adventures available.</Text>
            ) : (
                <View style={{ gap: 8 }}>
                    {kingdom.adventures.map(adv => {
                        const advId = `${kingdom.id}:${slug(adv.name)}`;
                        const curCount = getAdventureCount(advId);

                        if (adv.singleAttempt) {
                            const completed = curCount >= 1;
                            return (
                                <View
                                    key={advId}
                                    style={{
                                        padding: 10,
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: '#0006',
                                        backgroundColor: tokens.card,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View style={{ flex: 1, paddingRight: 12 }}>
                                        <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>
                                            {adv.name}
                                        </Text>
                                        <Text style={{ color: tokens.textMuted, marginTop: 2, fontSize: 12 }}>
                                            Roll: {adv.roll.min}–{adv.roll.max}
                                        </Text>
                                    </View>
                                    <Pill
                                        label={completed ? 'Completed' : 'Mark Complete'}
                                        selected={completed}
                                        onPress={() => onCompleteOnce(advId)}
                                    />
                                </View>
                            );
                        }

                        return (
                            <View
                                key={advId}
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: '#0006',
                                    backgroundColor: tokens.card,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View style={{ flex: 1, paddingRight: 12 }}>
                                    <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>
                                        {adv.name}
                                    </Text>
                                    <Text style={{ color: tokens.textMuted, marginTop: 2, fontSize: 12 }}>
                                        Roll: {adv.roll.min}–{adv.roll.max}
                                    </Text>
                                </View>
                                <Stepper
                                    value={curCount}
                                    min={0}
                                    step={1}
                                    editable
                                    onChange={(next) => onChangeCount(advId, next, curCount)}
                                />
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}
