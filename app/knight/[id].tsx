// app/knight/[id].tsx
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '@/components/Card';
import Stepper from '@/components/ui/Stepper';
import SwitchRow from '@/components/ui/SwitchRow';
import TextRow from '@/components/ui/TextRow';

import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

import { ensureChapter, type Knight } from '@/models/knight';

import AlliesCard from '@/features/knights/AlliesCard';
import ChapterInvestigations from '@/features/knights/ChapterInvestigations';
import ChoiceMatrixCard from '@/features/knights/ChoiceMatrixCard';
import NotesCard from '@/features/knights/NotesCard';
import SheetBasicsCard from '@/features/knights/SheetBasicsCard';
import VicesCard from '@/features/knights/VicesCard';
import VirtuesCard from '@/features/knights/VirtuesCard';

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

export default function KnightDetail() {
    const params = useLocalSearchParams() as { id?: string; campaignId?: string | string[] };
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const campaignId = Array.isArray(params.campaignId) ? params.campaignId[0] : params.campaignId;

    const router = useRouter();
    const { tokens } = useThemeTokens();

    const {
        knightsById,
        renameKnight,
        completeQuest,
    } = useKnights() as any;

    const { setPartyLeader } = useCampaigns() as any;

    const k: Knight | undefined = useMemo(() => (id ? knightsById[id] : undefined), [id, knightsById]);

    // read current leader for this campaign (if any) so we can toggle UI
    const currentLeaderUID = useCampaigns(s => {
        if (!campaignId) return undefined;
        const c = (s as any).campaigns?.[campaignId];
        if (!c) return undefined;
        return (
            c.settings?.partyLeaderUID ||
            c.members?.find((m: any) => m.isLeader)?.knightUID ||
            undefined
        );
    });

    if (!k) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Knight not found</Text>
            </SafeAreaView>
        );
    }

    const chNum = k.sheet.chapter ?? 1;
    const ch = ensureChapter(k.sheet, chNum);

    const leaderControls =
        campaignId ? (
            currentLeaderUID === k.knightUID ? (
                <Pill
                    label="Unset Leader"
                    tone="danger"
                    onPress={() => setPartyLeader(campaignId, '')}
                />
            ) : (
                <Pill
                    label="Set as Leader"
                    tone="accent"
                    onPress={() => setPartyLeader(campaignId, k.knightUID)}
                />
            )
        ) : null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <HeaderBar
                title={k.name || 'Knight'}
                right={leaderControls}
                onBack={() => router.back()}
                onDelete={() => {
                    Alert.alert('Delete knight?', 'This cannot be undone.', [
                        { text: 'Cancel', style: 'cancel' },
                        // wire your removeKnight here if desired
                    ]);
                }}
            />

            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                {/* Identity */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Identity</Text>
                    <TextRow
                        label="Name"
                        value={k.name}
                        placeholder="Knight name"
                        onChangeText={(t) => renameKnight(k.knightUID, t)}
                    />
                    <Text style={{ color: tokens.textMuted, marginTop: 4 }}>
                        Catalog: <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{k.catalogId}</Text>
                    </Text>
                    {campaignId ? (
                        <Text style={{ color: tokens.textMuted, marginTop: 6 }}>
                            Campaign: <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{campaignId}</Text>{' '}
                            {currentLeaderUID === k.knightUID ? '• Party Leader' : ''}
                        </Text>
                    ) : null}
                </Card>

                {/* Chapter & Quest */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Chapter & Quest</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>Current Chapter</Text>
                        <Stepper
                            value={k.sheet.chapter}
                            min={1}
                            max={5}
                            onChange={(v) => {
                                const now = Date.now();
                                (useKnights.getState() as any).addKnight({
                                    ...k,
                                    sheet: { ...k.sheet, chapter: v },
                                    version: k.version,
                                    updatedAt: now,
                                });
                            }}
                        />
                    </View>

                    <View style={{ height: 10 }} />

                    <Text style={{ color: tokens.textPrimary, marginBottom: 6 }}>
                        Quest Status:{' '}
                        <Text style={{ fontWeight: '800' }}>
                            {ch.quest.completed ? (ch.quest.outcome ? `Completed • ${ch.quest.outcome}` : 'Completed') : 'Not attempted'}
                        </Text>
                    </Text>

                    <View style={{ flexDirection: 'row' }}>
                        <Pill
                            label="Attempt Quest • Pass"
                            tone="success"
                            onPress={() => {
                                const r = completeQuest(k.knightUID, chNum, 'pass');
                                if (!r.ok) Alert.alert('Error', r.error || 'Failed to set quest.');
                            }}
                        />
                        <Pill
                            label="Attempt Quest • Fail"
                            tone="danger"
                            onPress={() => {
                                const r = completeQuest(k.knightUID, chNum, 'fail');
                                if (!r.ok) Alert.alert('Error', r.error || 'Failed to set quest.');
                            }}
                        />
                    </View>
                    <Text style={{ color: tokens.textMuted, marginTop: 6 }}>
                        A quest is considered completed as soon as it’s attempted, even if it fails.
                    </Text>
                </Card>

                <ChapterInvestigations knightUID={k.knightUID} chapter={chNum} />
                <VirtuesCard knightUID={k.knightUID} />
                <VicesCard knightUID={k.knightUID} />
                <SheetBasicsCard knightUID={k.knightUID} />
                <ChoiceMatrixCard knightUID={k.knightUID} />
                <AlliesCard knightUID={k.knightUID} />
                <NotesCard knightUID={k.knightUID} />

                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Session Flags</Text>
                    <SwitchRow
                        label="Prologue done"
                        value={k.sheet.prologueDone}
                        onValueChange={(on) => {
                            const now = Date.now();
                            (useKnights.getState() as any).addKnight({
                                ...k,
                                sheet: { ...k.sheet, prologueDone: on },
                                version: k.version,
                                updatedAt: now,
                            });
                        }}
                    />
                    <SwitchRow
                        label="Postgame started"
                        value={k.sheet.postgameDone}
                        onValueChange={(on) => {
                            const now = Date.now();
                            (useKnights.getState() as any).addKnight({
                                ...k,
                                sheet: { ...k.sheet, postgameDone: on },
                                version: k.version,
                                updatedAt: now,
                            });
                        }}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}