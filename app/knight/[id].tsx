// app/knight/[id].tsx
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CollapsibleCard from '@/components/ui/CollapsibleCard';
import Stepper from '@/components/ui/Stepper';
import SwitchRow from '@/components/ui/SwitchRow';
import TabButton from '@/components/ui/TabButton';
import TextRow from '@/components/ui/TextRow';

import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

import { ensureChapter, type Knight } from '@/models/knight';

import AlliesCard from '@/features/knights/AlliesCard';
import ChapterInvestigations from '@/features/knights/ChapterInvestigations';
import NotesCard from '@/features/knights/NotesCard';
import ChoiceMatrixCard from '@/features/knights/ui/ChoiceMatrixCard';
import { KnightGearCard } from '@/features/knights/ui/KnightGearCard';
import SheetBasicsCard from '@/features/knights/ui/SheetBasicsCard';
import VicesCard from '@/features/knights/ui/VicesCard';
import VirtuesCard from '@/features/knights/ui/VirtuesCard';

function Pill({
  label,
  tone = 'default',
  onPress,
}: {
  label: string;
  tone?: 'default' | 'success' | 'danger' | 'accent';
  onPress?: () => void;
}) {
  const { tokens } = useThemeTokens();
  const bg =
    tone === 'success'
      ? '#2b6b3f'
      : tone === 'danger'
        ? '#7a2d2d'
        : tone === 'accent'
          ? tokens.accent
          : tokens.surface;
  const color = tone === 'accent' ? '#0B0B0B' : tokens.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: '#0006',
        marginRight: 8,
      }}
    >
      <Text style={{ color, fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
}

function HeaderBar({
  title,
  right,
  onBack,
  onDelete,
}: {
  title: string;
  right?: React.ReactNode;
  onBack: () => void;
  onDelete: () => void;
}) {
  const { tokens } = useThemeTokens();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: tokens.surface,
        borderBottomWidth: 1,
        borderColor: '#0006',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Pressable
        onPress={onBack}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 10,
          backgroundColor: tokens.card,
        }}
      >
        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Back</Text>
      </Pressable>

      <Text style={{ color: tokens.textPrimary, fontWeight: '800' }} numberOfLines={1}>
        {title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {right}
        <Pressable
          onPress={onDelete}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
            backgroundColor: '#2A1313',
            borderWidth: 1,
            borderColor: '#0006',
          }}
        >
          <Text style={{ color: '#F9DADA', fontWeight: '800' }}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

type TabType = 'quest' | 'character' | 'equipment';

export default function KnightDetail() {
  const params = useLocalSearchParams() as { id?: string; campaignId?: string | string[] };
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const campaignId = Array.isArray(params.campaignId) ? params.campaignId[0] : params.campaignId;

  const router = useRouter();
  const { tokens } = useThemeTokens();
  const [activeTab, setActiveTab] = useState<TabType>('quest');

  // State for collapsible cards
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    identity: true,
    chapterQuest: true,
    chapterInvestigations: true,
    notes: true,
    sessionFlags: true,
    virtues: true,
    vices: true,
    sheetBasics: true,
    choiceMatrix: true,
    equipment: true,
    allies: true,
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const { knightsById, renameKnight, removeKnight, completeQuest, updateKnightSheet } =
    useKnights();

  const { setPartyLeader } = useCampaigns();

  const k: Knight | undefined = useMemo(
    () => (id ? knightsById[id] : undefined),
    [id, knightsById]
  );

  // read current leader for this campaign (if any) so we can toggle UI
  const currentLeaderUID = useCampaigns(s => {
    if (!campaignId) return undefined;
    const c = s.campaigns?.[campaignId];
    if (!c) return undefined;
    return c.partyLeaderUID || c.members?.find(m => m.isLeader)?.knightUID || undefined;
  });

  if (!k) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: tokens.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Knight not found</Text>
      </SafeAreaView>
    );
  }

  const chNum = k.sheet.chapter ?? 1;
  const ch = ensureChapter(k.sheet, chNum);

  const leaderControls = campaignId ? (
    currentLeaderUID === k.knightUID ? (
      <Pill label='Unset Leader' tone='danger' onPress={() => setPartyLeader(campaignId, '')} />
    ) : (
      <Pill
        label='Set as Leader'
        tone='accent'
        onPress={() => setPartyLeader(campaignId, k.knightUID)}
      />
    )
  ) : null;

  const renderQuestTab = () => (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      {/* Identity */}
      <CollapsibleCard
        title='Identity'
        isExpanded={expandedCards.identity}
        onToggle={() => toggleCard('identity')}
      >
        <TextRow
          label='Name'
          value={k.name}
          placeholder='Knight name'
          onChangeText={t => renameKnight(k.knightUID, t)}
        />
        <Text style={{ color: tokens.textMuted, marginTop: 4 }}>
          Catalog:{' '}
          <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{k.catalogId}</Text>
        </Text>
        {campaignId ? (
          <Text style={{ color: tokens.textMuted, marginTop: 6 }}>
            Campaign:{' '}
            <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{campaignId}</Text>{' '}
            {currentLeaderUID === k.knightUID ? '• Party Leader' : ''}
          </Text>
        ) : null}
      </CollapsibleCard>

      {/* Chapter & Quest */}
      <CollapsibleCard
        title='Chapter & Quest'
        isExpanded={expandedCards.chapterQuest}
        onToggle={() => toggleCard('chapterQuest')}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>Current Chapter</Text>
          <Stepper
            value={k.sheet.chapter}
            min={1}
            max={5}
            onChange={v => {
              const result = updateKnightSheet(k.knightUID, { chapter: v });
              if (!result.ok) Alert.alert('Error', result.error || 'Failed to update chapter.');
            }}
          />
        </View>

        <View style={{ height: 10 }} />

        <Text style={{ color: tokens.textPrimary, marginBottom: 6 }}>
          Quest Status:{' '}
          <Text style={{ fontWeight: '800' }}>
            {ch.quest.completed
              ? ch.quest.outcome
                ? `Completed • ${ch.quest.outcome}`
                : 'Completed'
              : 'Not attempted'}
          </Text>
        </Text>

        <View style={{ flexDirection: 'row' }}>
          <Pill
            label='Attempt Quest • Pass'
            tone='success'
            onPress={() => {
              const r = completeQuest(k.knightUID, chNum, 'pass');
              if (!r.ok) Alert.alert('Error', r.error || 'Failed to set quest.');
            }}
          />
          <Pill
            label='Attempt Quest • Fail'
            tone='danger'
            onPress={() => {
              const r = completeQuest(k.knightUID, chNum, 'fail');
              if (!r.ok) Alert.alert('Error', r.error || 'Failed to set quest.');
            }}
          />
        </View>
        <Text style={{ color: tokens.textMuted, marginTop: 6 }}>
          A quest is considered completed as soon as it&apos;s attempted, even if it fails.
        </Text>
      </CollapsibleCard>

      <CollapsibleCard
        title='Chapter Investigations'
        isExpanded={expandedCards.chapterInvestigations}
        onToggle={() => toggleCard('chapterInvestigations')}
      >
        <ChapterInvestigations knightUID={k.knightUID} chapter={chNum} />
      </CollapsibleCard>

      <CollapsibleCard
        title='Notes'
        isExpanded={expandedCards.notes}
        onToggle={() => toggleCard('notes')}
      >
        <NotesCard knightUID={k.knightUID} />
      </CollapsibleCard>

      <CollapsibleCard
        title='Session Flags'
        isExpanded={expandedCards.sessionFlags}
        onToggle={() => toggleCard('sessionFlags')}
      >
        <SwitchRow
          label='Prologue done'
          value={k.sheet.prologueDone}
          onValueChange={on => {
            const result = updateKnightSheet(k.knightUID, { prologueDone: on });
            if (!result.ok)
              Alert.alert('Error', result.error || 'Failed to update prologue status.');
          }}
        />
        <SwitchRow
          label='Postgame started'
          value={k.sheet.postgameDone}
          onValueChange={on => {
            const result = updateKnightSheet(k.knightUID, { postgameDone: on });
            if (!result.ok)
              Alert.alert('Error', result.error || 'Failed to update postgame status.');
          }}
        />
      </CollapsibleCard>
    </ScrollView>
  );

  const renderCharacterTab = () => (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <CollapsibleCard
        title='Virtues'
        isExpanded={expandedCards.virtues}
        onToggle={() => toggleCard('virtues')}
      >
        <VirtuesCard knightUID={k.knightUID} />
      </CollapsibleCard>
      <CollapsibleCard
        title='Vices'
        isExpanded={expandedCards.vices}
        onToggle={() => toggleCard('vices')}
      >
        <VicesCard knightUID={k.knightUID} />
      </CollapsibleCard>
      <CollapsibleCard
        title='Sheet Basics'
        isExpanded={expandedCards.sheetBasics}
        onToggle={() => toggleCard('sheetBasics')}
      >
        <SheetBasicsCard knightUID={k.knightUID} />
      </CollapsibleCard>
      <CollapsibleCard
        title='Choice Matrix'
        isExpanded={expandedCards.choiceMatrix}
        onToggle={() => toggleCard('choiceMatrix')}
      >
        <ChoiceMatrixCard knightUID={k.knightUID} />
      </CollapsibleCard>
    </ScrollView>
  );

  const renderEquipmentTab = () => (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <CollapsibleCard
        title='Gear'
        isExpanded={expandedCards.equipment}
        onToggle={() => toggleCard('equipment')}
      >
        <KnightGearCard knightUID={k.knightUID} />
      </CollapsibleCard>
      <CollapsibleCard
        title='Allies'
        isExpanded={expandedCards.allies}
        onToggle={() => toggleCard('allies')}
      >
        <AlliesCard knightUID={k.knightUID} />
      </CollapsibleCard>
    </ScrollView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
      <HeaderBar
        title={k.name || 'Knight'}
        right={leaderControls}
        onBack={() => router.back()}
        onDelete={() => {
          Alert.alert('Delete knight?', 'This cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                removeKnight(k.knightUID);
                router.back();
              },
            },
          ]);
        }}
      />

      {/* Tab Navigation */}
      <View style={{ flexDirection: 'row', backgroundColor: tokens.surface }}>
        <TabButton
          label='Quest & Progress'
          isActive={activeTab === 'quest'}
          onPress={() => setActiveTab('quest')}
        />
        <TabButton
          label='Character'
          isActive={activeTab === 'character'}
          onPress={() => setActiveTab('character')}
        />
        <TabButton
          label='Gear & Allies'
          isActive={activeTab === 'equipment'}
          onPress={() => setActiveTab('equipment')}
        />
      </View>

      {/* Tab Content */}
      {activeTab === 'quest' && renderQuestTab()}
      {activeTab === 'character' && renderCharacterTab()}
      {activeTab === 'equipment' && renderEquipmentTab()}
    </SafeAreaView>
  );
}
