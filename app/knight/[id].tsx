// app/knight/[id].tsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import TextRow from '@/components/TextRow';
import Stepper from '@/components/Stepper';
import SwitchRow from '@/components/SwitchRow';
import { useKnights } from '@/store/knights';
import { ensureChapter, type Knight } from '@/models/knight';
import ChapterInvestigations from '@/components/ChapterInvestigations';
import VirtuesCard from '@/components/VirtuesCard';
import VicesCard from '@/components/VicesCard';
import SheetBasicsCard from '@/components/SheetBasicsCard';
import ChoiceMatrixCard from '@/components/ChoiceMatrixCard';
import AlliesCard from '@/components/AlliesCard';
import NotesCard from '@/components/NotesCard';

function HeaderBar({
                       title,
                       onBack,
                       onDelete,
                   }: {
    title: string;
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
    );
}

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

export default function KnightDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { tokens } = useThemeTokens();

    const {
        knightsById,
        renameKnight,
        completeQuest,
        // available if you want to wire quick actions here:
        addNormalInvestigation,
        addLeadCompletion,
        convertFailToLead,
    } = useKnights() as any;

    const k: Knight | undefined = useMemo(() => (id ? knightsById[id] : undefined), [id, knightsById]);

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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <HeaderBar
                title={k.name || 'Knight'}
                onBack={() => router.back()}
                onDelete={() => {
                    Alert.alert('Delete knight?', 'This cannot be undone.', [
                        { text: 'Cancel', style: 'cancel' },
                        // If you kept removeKnight shim, wire it here:
                        // { text: 'Delete', style: 'destructive', onPress: () => { removeKnight(k.knightUID); router.back(); } }
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
                        // allow empty while editing
                        onChangeText={(t) => renameKnight(k.knightUID, t)}
                    />
                    <Text style={{ color: tokens.textMuted, marginTop: 4 }}>
                        Catalog: <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{k.catalogId}</Text>
                    </Text>
                </Card>

                {/* Chapter & Quest */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                        Chapter & Quest
                    </Text>

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

                {/* Sheet toggles (examples; keep/add what you need) */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Session Flags</Text>
                    <SwitchRow
                        label="Prologue done"
                        value={k.sheet.prologueDone}
                        onValueChange={(on) => {
                            // update via sheet patch (use your updateKnightSheet shim if present)
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