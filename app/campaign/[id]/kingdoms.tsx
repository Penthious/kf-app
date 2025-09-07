// app/campaign/[id]/kingdoms.tsx
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import Card from '@/components/Card';
import ActiveLineup from '@/features/knights/ui/ActiveLineup';

import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

import type { Campaign } from '@/models/campaign';
import { countCompletedInvestigations, ensureChapter } from '@/models/knight';

import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import { buildKingdomView } from '@/features/kingdoms/kingdomView';
import AdventuresCard from '@/features/kingdoms/ui/AdventuresCard';
import KingdomSelector from '@/features/kingdoms/ui/KingdomSelector';
import LeaderContextCard from '@/features/kingdoms/ui/LeaderContextCard';
import MonstersCard from '@/features/kingdoms/ui/MonsterCard';
import {
  resolveStagesForBestiary,
  resolveExpeditionStagesForBestiary,
} from '@/features/kingdoms/utils';
import type { KingdomCatalog } from '@/models/kingdom';

import { getMemberSets } from '@/features/knights/selectors';
import { KnightsById } from '@/features/knights/types';

export default function CampaignKingdoms() {
  const { tokens } = useThemeTokens();
  const router = useRouter();

  // ----- Current Campaign -----
  const campaignId = useCampaigns(s => s.currentCampaignId);
  const campaigns = useCampaigns(s => s.campaigns);
  const c: Campaign | undefined = campaignId ? campaigns[campaignId] : undefined;

  // actions we need for the lineup controls
  const setPartyLeader = useCampaigns(s => s.setPartyLeader);
  const benchMember = useCampaigns(s => s.benchMember);

  // ----- Knights dictionary -----
  const knightsById = useKnights(s => s.knightsById) as KnightsById;

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

  const onEditKnight = useCallback((uid: string) => router.push(`/knight/${uid}`), [router]);

  // ----- Leader context for monsters/adventures -----
  const leaderUID = c?.partyLeaderUID;
  const leader = leaderUID ? knightsById[leaderUID] : undefined;
  const chapter = leader?.sheet?.chapter ?? 1;
  const ch = leader ? ensureChapter(leader.sheet, chapter) : undefined;
  const questDone = !!ch?.quest?.completed;
  const completedInvs = ch ? countCompletedInvestigations(ch) : 0;

  // ----- Load kingdoms catalog -----
  const kingdoms: KingdomCatalog[] = allKingdomsCatalog;

  // ----- Kingdom picker state -----
  const [activeKingdomId, setActiveKingdomId] = useState<string | null>(null);
  const activeKingdom = useMemo(
    () => kingdoms.find(k => k.id === (activeKingdomId ?? kingdoms[0]?.id)),
    [kingdoms, activeKingdomId]
  );

  // ----- Stage row for current leader + kingdom -----
  const stageRow = leader
    ? (() => {
        // If we're in an expedition, use expedition-aware monster stage calculation
        if (c?.expedition && c.expedition.currentPhase !== 'vision') {
          const partyLeaderChoice = c.expedition.knightChoices.find(
            choice => choice.knightUID === leaderUID
          );
          const allKnightChoices = c.expedition.knightChoices || [];

          const expeditionStageInfo = resolveExpeditionStagesForBestiary(
            activeKingdom,
            partyLeaderChoice,
            chapter,
            allKnightChoices,
            completedInvs
          );

          return expeditionStageInfo.row;
        }

        // Otherwise, use the traditional completed progress calculation
        return resolveStagesForBestiary(activeKingdom, chapter, questDone, completedInvs).row;
      })()
    : {};

  const kv = buildKingdomView(activeKingdom?.id ?? '', c, allKingdomsCatalog);

  // ----- Guard if no campaign -----
  if (!c) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Campaign not found</Text>
        <Text style={{ color: tokens.textMuted, marginTop: 4 }}>
          Reopen it from the Campaigns list.
        </Text>
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
