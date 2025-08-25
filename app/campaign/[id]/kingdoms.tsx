import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { ensureChapter, countCompletedInvestigations } from '@/models/knight';
import { allKingdomsCatalog } from '@/catalogs/kingdoms/kingdomLoader';

import LeaderContextCard from '@/features/kingdoms/LeaderContextCard';
import KingdomSelector from '@/features/kingdoms/KingdomSelector';
import MonstersCard from '@/features/kingdoms/MonsterCard';
import AdventuresCard from '@/features/kingdoms/AdventuresCard';
import { KingdomCatalog, resolveStagesForBestiary } from '@/features/kingdoms/utils';

export default function CampaignKingdoms() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { tokens } = useThemeTokens();

    const { campaigns } = useCampaigns() as any;
    const { knightsById } = useKnights() as any;
    const c = id ? campaigns?.[id] : undefined;

    // load kingdoms array/function
    const kingdoms: KingdomCatalog[] = useMemo(() => {
        const kAny = allKingdomsCatalog as any;
        if (Array.isArray(kAny)) return kAny as KingdomCatalog[];
        if (typeof kAny === 'function') return (kAny() as KingdomCatalog[]) || [];
        return [];
    }, []);

    // resolve leader
    const activeMembers: any[] = c ? (c.members || []).filter((m: any) => m.isActive) : [];
    const explicitCandidates: string[] = c ? [
        c.settings?.partyLeaderUID,
        (c as any).partyLeaderUID,
        (c.members || []).find((m: any) => m.isLeader)?.knightUID,
    ].filter(Boolean) as string[] : [];
    const leaderUID: string | undefined = c
        ? (explicitCandidates.find(uid => !!knightsById?.[uid])
            || activeMembers.find((m: any) => !!knightsById?.[m.knightUID])?.knightUID)
        : undefined;

    const leader = leaderUID ? knightsById?.[leaderUID] : undefined;
    const chapter: number | undefined = leader?.sheet?.chapter ?? 1;
    const ch = leader && chapter ? ensureChapter(leader.sheet, chapter) : undefined;
    const questDone = !!ch?.quest?.completed;
    const completedInvs = ch ? countCompletedInvestigations(ch) : 0;

    // selection
    const [activeKingdomId, setActiveKingdomId] = useState<string | null>(null);
    const activeKingdom = useMemo(
        () => kingdoms.find(k => k.id === (activeKingdomId ?? kingdoms[0]?.id)),
        [kingdoms, activeKingdomId]
    );

    // compute stage row
    const { row: stageRow } =
        resolveStagesForBestiary(activeKingdom, chapter, questDone, completedInvs);

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

                <MonstersCard kingdom={activeKingdom} stageRow={stageRow} />
                <AdventuresCard kingdom={activeKingdom} />
            </ScrollView>
        </View>
    );
}