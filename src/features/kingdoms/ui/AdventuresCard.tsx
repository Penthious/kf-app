import Pill from '@/components/ui/Pill';
import Stepper from '@/components/ui/Stepper';
import { KingdomView } from "@/features/kingdoms/kingdomView";
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

interface AdventuresCardProps {
    kingdom?: KingdomView;
}

export default function AdventuresCard({ kingdom }: AdventuresCardProps) {
    const { tokens } = useThemeTokens();

    const campaigns = useCampaigns(s => s.campaigns);
    const currentCampaignId = useCampaigns(s => s.currentCampaignId);
    const setAdventureProgress = useCampaigns(s => s.setAdventureProgress);

    const c = currentCampaignId ? campaigns[currentCampaignId] : undefined;

    // Helper function to create adventure ID
    const createAdventureId = (adventureName: string): string => {
        const slug = (s: string) =>
            s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        return `${kingdom?.id}:${slug(adventureName)}`;
    };

    // Get kingdom state from current campaign
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
                (a) => a && typeof a === 'object' && 'id' in a && (a as { id: string }).id === advId
            ) as { completedCount?: number } | undefined;
            return found ? Number(found.completedCount ?? 0) : 0;
        }

        if (typeof advs === 'object') {
            const rec = advs as Record<string, unknown>;
            const v = rec[advId];
            if (typeof v === 'number') return v;
            if (v && typeof v === 'object' && 'completedCount' in v) {
                return Number((v as { completedCount?: number }).completedCount ?? 0);
            }
        }

        return 0;
    };

    // Handle single attempt adventure completion
    const onCompleteOnce = (advId: string) => {
        if (!c || !kingdom) return;
        setAdventureProgress(c.campaignId, kingdom.id, advId, { singleAttempt: true });
    };

    // Handle stepper count changes
    const onChangeCount = (advId: string, next: number, current: number) => {
        if (!c || !kingdom) return;
        const delta = Math.max(0, Math.floor(next)) - Math.max(0, Math.floor(current));
        if (delta !== 0) setAdventureProgress(c.campaignId, kingdom.id, advId, { delta });
    };

    // Early return if no kingdom
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
            testID="adventures-card"
        >
            <Text 
                style={{ color: tokens.textPrimary, fontWeight: '800' }}
                testID="adventures-card-title"
            >
                Adventures
            </Text>

            {kingdom.adventures.length === 0 ? (
                <Text 
                    style={{ color: tokens.textMuted }}
                    testID="no-adventures-message"
                >
                    No adventures available.
                </Text>
            ) : (
                <View style={{ gap: 8 }} testID="adventures-list">
                    {kingdom.adventures.map(adv => {
                        const advId = createAdventureId(adv.name);
                        const curCount = getAdventureCount(advId);

                        if (adv.singleAttempt) {
                            const completed = curCount >= 1;
                            return (
                                <View
                                    key={advId}
                                    testID={`adventure-item-${advId}`}
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
                                        <Text 
                                            style={{ color: tokens.textPrimary, fontWeight: '700' }}
                                            testID={`adventure-name-${advId}`}
                                        >
                                            {adv.name}
                                        </Text>
                                        <Text 
                                            style={{ color: tokens.textMuted, marginTop: 2, fontSize: 12 }}
                                            testID={`adventure-roll-${advId}`}
                                        >
                                            Roll: {adv.roll.min}–{adv.roll.max}
                                        </Text>
                                    </View>
                                    <Pill
                                        label={completed ? 'Completed' : 'Mark Complete'}
                                        selected={completed}
                                        onPress={() => onCompleteOnce(advId)}
                                        testID={`adventure-pill-${advId}`}
                                    />
                                </View>
                            );
                        }

                        return (
                            <View
                                key={advId}
                                testID={`adventure-item-${advId}`}
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
                                    <Text 
                                        style={{ color: tokens.textPrimary, fontWeight: '700' }}
                                        testID={`adventure-name-${advId}`}
                                    >
                                        {adv.name}
                                    </Text>
                                    <Text 
                                        style={{ color: tokens.textMuted, marginTop: 2, fontSize: 12 }}
                                        testID={`adventure-roll-${advId}`}
                                    >
                                        Roll: {adv.roll.min}–{adv.roll.max}
                                    </Text>
                                </View>
                                <Stepper
                                    value={curCount}
                                    min={0}
                                    step={1}
                                    editable
                                    onChange={(next) => onChangeCount(advId, next, curCount)}
                                    testID={`adventure-stepper-${advId}`}
                                />
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}
