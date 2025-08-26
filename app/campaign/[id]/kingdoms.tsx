import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useLocalSearchParams, useSegments } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';

// stores
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

// knight helpers
import { ensureChapter, countCompletedInvestigations } from '@/models/knight';

// catalogs
import { allKingdomsCatalog } from '@/catalogs/kingdoms/kingdomLoader';

// feature components
import LeaderContextCard from '@/features/kingdoms/LeaderContextCard';
import KingdomSelector from '@/features/kingdoms/KingdomSelector';
import MonstersCard from '@/features/kingdoms/MonsterCard';
import AdventuresCard from '@/features/kingdoms/AdventuresCard';

// utils/types for kingdoms
import { KingdomCatalog, resolveStagesForBestiary } from '@/features/kingdoms/utils';

export default function CampaignKingdoms() {
    const { tokens } = useThemeTokens();
    const campaignId = useCampaigns((s) => (s as any).currentCampaignId);
    const leaderUID = useCampaigns(
        (s) => (s as any).campaigns?.[campaignId!]?.partyLeaderUID
    );
    const leader = useKnights(
        (s) => (leaderUID ? (s as any).knightsById?.[leaderUID] : undefined)
    );

    // --- Load kingdoms array/function ---
    const kingdoms: KingdomCatalog[] = useMemo(() => {
        const any = allKingdomsCatalog as any;
        if (Array.isArray(any)) return any as KingdomCatalog[];
        if (typeof any === 'function') return (any() as KingdomCatalog[]) || [];
        return [];
    }, []);

    // --- Derive leader progress ---
    const chapter: number = leader?.sheet?.chapter ?? 1;
    const ch = leader ? ensureChapter(leader.sheet, chapter) : undefined;
    const questDone = !!ch?.quest?.completed;
    const completedInvs = ch ? countCompletedInvestigations(ch) : 0;

    // --- UI: active kingdom picker ---
    const [activeKingdomId, setActiveKingdomId] = useState<string | null>(null);
    const activeKingdom = useMemo(
        () => kingdoms.find((k) => k.id === (activeKingdomId ?? kingdoms[0]?.id)),
        [kingdoms, activeKingdomId]
    );

    // --- Compute stage row for current leader + kingdom ---
    const stageRow = leader
        ? resolveStagesForBestiary(activeKingdom, chapter, questDone, completedInvs).row
        : {};

    return (
        <View style={{ flex: 1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                <LeaderContextCard
                    leaderName={leader?.name}
                    chapter={chapter}
                    questDone={questDone}
                    completedInvs={completedInvs}
                />

                <KingdomSelector
                    kingdoms={kingdoms}
                    activeKingdomId={activeKingdom?.id ?? kingdoms[0]?.id}
                    onSelect={setActiveKingdomId}
                />

                {leader ? (
                    <>
                        <MonstersCard kingdom={activeKingdom} stageRow={stageRow} />
                        <AdventuresCard kingdom={activeKingdom} />
                    </>
                ) : (
                    <View>
                        <Text style={{ color: tokens.textMuted }}>
                            Select a party leader to see available monsters and adventures.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}