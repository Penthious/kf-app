// app/campaign/[id]/kingdoms.tsx
import React, { useMemo, useState, useCallback } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';

import Card from '@/components/Card';
import ActiveLineup from '@/features/knights/ui/ActiveLineup';

import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

import { ensureChapter, countCompletedInvestigations } from '@/models/knight';
import type { Campaign } from '@/models/campaign';

import { allKingdomsCatalog } from '@/store/kingdoms';
import { buildKingdomView } from '@/features/kingdoms/kingdomView';
import type { KingdomCatalog } from '@/models/kingdom';
import LeaderContextCard from '@/features/kingdoms/LeaderContextCard';
import KingdomSelector from '@/features/kingdoms/KingdomSelector';
import MonstersCard from '@/features/kingdoms/MonsterCard';
import AdventuresCard from '@/features/kingdoms/AdventuresCard';
import { resolveStagesForBestiary } from '@/features/kingdoms/utils';

import {getMemberSets,} from '@/features/knights/selectors';
import {KnightsById} from "@/features/knights/types";


export default function CampaignKingdoms() {
    const { tokens } = useThemeTokens();
    const router = useRouter();

    // ----- Current Campaign -----
    const campaignId = useCampaigns((s) => (s as any).currentCampaignId) as string | undefined;
    const campaigns = useCampaigns((s) => s.campaigns);
    const c: Campaign | undefined = campaignId ? campaigns[campaignId] : undefined;

    // actions we need for the lineup controls
    const setPartyLeader = useCampaigns((s) => s.setPartyLeader);
    const benchMember = useCampaigns((s) => s.benchMember);
    const removeMember = useCampaigns((s) => s.removeMember);

    // ----- Knights dictionary -----
    const knightsById = useKnights((s) => s.knightsById) as KnightsById;

    // ----- Derive lineup sets for the ActiveLineup card -----
    const { active } = useMemo(() => getMemberSets(c, knightsById), [c, knightsById]);
    const activeSlots = c?.settings?.fivePlayerMode ? 5 : 4;

    // handlers for ActiveLineup
    const onSetLeader = useCallback(
        (uid: string) => {
            if (!c) return;
            setPartyLeader(c.campaignId, uid);
        },
        [c, setPartyLeader]
    );

    const onBench = useCallback(
        (uid: string) => {
            if (!c) return;
            benchMember(c.campaignId, uid, true);
        },
        [c, benchMember]
    );

    const onEditKnight = useCallback(
        (uid: string) => router.push(`/knight/${uid}`),
        [router]
    );

    // ----- Leader context for monsters/adventures -----
    const leaderUID = c?.partyLeaderUID;
    const leader = leaderUID ? knightsById[leaderUID] : undefined;
    const chapter = leader?.sheet?.chapter ?? 1;
    const ch = leader ? ensureChapter(leader.sheet, chapter) : undefined;
    const questDone = !!ch?.quest?.completed;
    const completedInvs = ch ? countCompletedInvestigations(ch) : 0;

    // ----- Load kingdoms catalog -----
    const kingdoms: KingdomCatalog[] = useMemo(() => {
        const any = allKingdomsCatalog as any;
        if (Array.isArray(any)) return any as KingdomCatalog[];
        if (typeof any === 'function') return (any() as KingdomCatalog[]) || [];
        return [];
    }, []);

    // ----- Kingdom picker state -----
    const [activeKingdomId, setActiveKingdomId] = useState<string | null>(null);
    const activeKingdom = useMemo(
        () => kingdoms.find((k) => k.id === (activeKingdomId ?? kingdoms[0]?.id)),
        [kingdoms, activeKingdomId]
    );

    // ----- Stage row for current leader + kingdom -----
    const stageRow = leader
        ? resolveStagesForBestiary(activeKingdom, chapter, questDone, completedInvs).row
        : {};

    const kv = buildKingdomView(activeKingdom?.id ?? '', c, allKingdomsCatalog);


    // ----- Guard if no campaign -----
    if (!c) {
        return (
            <View style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Campaign not found</Text>
                <Text style={{ color: tokens.textMuted, marginTop: 4 }}>Reopen it from the Campaigns list.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                {/* Active lineup (quick leader swap) */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                        Active Lineup
                    </Text>
                    <ActiveLineup
                        list={active}
                        maxSlots={activeSlots}
                        onSetLeader={onSetLeader}
                        onBench={onBench}
                        onEdit={onEditKnight}
                    />
                </Card>

                {/* Leader context */}
                <LeaderContextCard
                    leaderName={leader?.name}
                    chapter={chapter}
                    questDone={questDone}
                    completedInvs={completedInvs}
                />

                {/* Kingdom selector */}
                <KingdomSelector
                    kingdoms={kingdoms}
                    activeKingdomId={activeKingdom?.id ?? kingdoms[0]?.id}
                    onSelect={setActiveKingdomId}
                />

                {/* Monsters and adventures (only when a leader is selected) */}
                {leader ? (
                    <>
                        <MonstersCard kingdom={kv} stageRow={stageRow} />
                        <AdventuresCard kingdom={kv} />
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