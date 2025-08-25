// app/campaign/[id]/kingdoms.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { ensureChapter, countCompletedInvestigations } from '@/models/knight';
import { allKingdomsCatalog } from '@/catalogs/kingdoms/kingdomLoader';

// ---- types that match your JSON shape ----
type MonsterRef = { id: string; name: string };
type StageRowRaw = Record<string, number | null>; // null means locked
type Bestiary = {
    monsters: MonsterRef[];
    stages: StageRowRaw[]; // flat array: [ch1-Q, ch1-I1, ch1-I2, ch1-I3, ch2-Q, ...]
};
type Adventure = { id: string; name: string; repeatable?: boolean; note?: string };

type KingdomCatalog = {
    id: string;
    name: string;
    bestiary?: Bestiary;            // <-- your JSON has this
    adventures?: Adventure[];
};

// ---- small UI bits ----
function HeaderBar({ title, onBack }: { title: string; onBack: () => void }) {
    const { tokens } = useThemeTokens();
    return (
        <View style={{
            paddingHorizontal:16, paddingVertical:12,
            backgroundColor:tokens.surface, borderBottomWidth:1, borderColor:'#0006',
            flexDirection:'row', alignItems:'center', justifyContent:'space-between'
        }}>
            <Pressable onPress={onBack} style={{ paddingVertical:8, paddingHorizontal:10, borderRadius:10, backgroundColor:tokens.card }}>
                <Text style={{ color:tokens.textPrimary, fontWeight:'800' }}>Back</Text>
            </Pressable>
            <Text style={{ color:tokens.textPrimary, fontWeight:'800' }} numberOfLines={1}>{title}</Text>
            <View style={{ width:64 }} />
        </View>
    );
}

function Pill({ label, tone = 'default', onPress }:{
    label:string; tone?:'default'|'accent'|'success'|'danger'; onPress?:()=>void;
}) {
    const { tokens } = useThemeTokens();
    const bg = tone==='accent'?tokens.accent:tone==='success'?'#2b6b3f':tone==='danger'?'#7a2d2d':tokens.surface;
    const color = tone==='accent' ? '#0B0B0B' : tokens.textPrimary;
    return (
        <Pressable onPress={onPress} style={{
            paddingHorizontal:12, height:28, borderRadius:14,
            alignItems:'center', justifyContent:'center',
            backgroundColor:bg, borderWidth:1, borderColor:'#0006'
        }}>
            <Text style={{ color, fontWeight:'800' }}>{label}</Text>
        </Pressable>
    );
}

function StageBadge({ stage }: { stage: number }) {
    const palette: Record<number, { bg: string; text: string }> = {
        0: { bg: '#444',    text: '#fff' }, // locked
        1: { bg: '#27ae60', text: '#0B0B0B' }, // green
        2: { bg: '#f1c40f', text: '#0B0B0B' }, // yellow
        3: { bg: '#e67e22', text: '#fff' },    // orange
        4: { bg: '#c0392b', text: '#fff' },    // red
    };
    const { bg, text } = palette[stage] ?? palette[0];
    return (
        <View
            style={{
                backgroundColor: bg,
                paddingHorizontal: 12,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#0006',
                minWidth: 84,
            }}
            accessibilityRole="text"
            accessible
            accessibilityLabel={stage === 0 ? 'Locked' : `Stage ${stage}`}
        >
            <Text style={{ color: text, fontWeight: '800' }}>
                {stage === 0 ? 'Locked' : `Stage ${stage}`}
            </Text>
        </View>
    );
}

// ---- progress helpers ----
function progressKey(questCompleted:boolean, completedInvs:number): 0|1|2|3 {
    // returns the offset into the 4‑row block for a chapter
    if (questCompleted && completedInvs >= 3) return 3; // I3
    if (completedInvs >= 2) return 2;                    // I2
    if (completedInvs >= 1) return 1;                    // I1
    return 0;                                            // Q
}

// Turn a raw StageRow (with nulls) into numeric stage map (0..4)
function normalizeRow(row?: StageRowRaw): Record<string, number> {
    const out: Record<string, number> = {};
    if (!row) return out;
    for (const [k, v] of Object.entries(row)) out[k] = v ?? 0;
    return out;
}

// Resolve the “current” stage row for this kingdom given leader state.
// Supports your bestiary.flat‑array schema.
function resolveStagesForBestiary(
    kingdom: KingdomCatalog | undefined,
    chapter: number | undefined,
    questCompleted: boolean,
    completedInvs: number
): { row: Record<string, number>; hasChapter: boolean } {
    const b = kingdom?.bestiary;
    if (!b || !Array.isArray(b.stages) || !chapter || chapter <= 0) {
        return { row: {}, hasChapter: false };
    }
    const stride = 4; // Q, I1, I2, I3 per chapter
    const offset = progressKey(questCompleted, completedInvs);
    const idx = (chapter - 1) * stride + offset;
    const row = b.stages[idx];
    if (!row) {
        // we have bestiary, but not enough rows for this chapter
        return { row: {}, hasChapter: false };
    }
    return { row: normalizeRow(row), hasChapter: true };
}

export default function CampaignKingdoms(){
    const { id } = useLocalSearchParams<{ id:string }>();
    const router = useRouter();
    const { tokens } = useThemeTokens();

    const { campaigns } = useCampaigns() as any;
    const { knightsById } = useKnights() as any;

    const c = id ? campaigns?.[id] : undefined;

    // Load all kingdoms from loader (array or function)
    const kingdoms: KingdomCatalog[] = useMemo(() => {
        const kAny = allKingdomsCatalog as any;
        if (Array.isArray(kAny)) return kAny as KingdomCatalog[];
        if (typeof kAny === 'function') return (kAny() as KingdomCatalog[]) || [];
        return [];
    }, []);

    // Resolve party leader
    const activeMembers: any[] = c ? (c.members || []).filter((m:any)=>m.isActive) : [];
    const explicitCandidates: string[] = c ? [
        c.settings?.partyLeaderUID,
        (c as any).partyLeaderUID,
        (c.members || []).find((m:any)=>m.isLeader)?.knightUID,
    ].filter(Boolean) as string[] : [];
    const leaderUID: string | undefined = c
        ? (explicitCandidates.find(uid => !!knightsById?.[uid])
            || activeMembers.find((m:any)=>!!knightsById?.[m.knightUID])?.knightUID)
        : undefined;

    const leader = leaderUID ? knightsById?.[leaderUID] : undefined;
    const leaderChapter: number | undefined = leader?.sheet?.chapter ?? 1;
    const ch = leader && leaderChapter ? ensureChapter(leader.sheet, leaderChapter) : undefined;
    const questDone = !!ch?.quest?.completed; // per your clarification: attempt counts as completed for chapter gating
    const completedInvs = ch ? countCompletedInvestigations(ch) : 0;

    // UI state: which kingdom is selected (chapter-agnostic selector)
    const [activeKingdomId, setActiveKingdomId] = useState<string | null>(null);
    const activeKingdom = useMemo(
        () => kingdoms.find(k => k.id === (activeKingdomId ?? kingdoms[0]?.id)),
        [kingdoms, activeKingdomId]
    );

    // Compute “monsters you can tackle right now” from bestiary schema
    const { row: stageRow, hasChapter } =
        resolveStagesForBestiary(activeKingdom, leaderChapter, questDone, completedInvs);

    const monsters: MonsterRef[] = activeKingdom?.bestiary?.monsters ?? [];
    const availableMonsters = monsters.filter(m => (stageRow[m.id] ?? 0) > 0);

    return (
        <SafeAreaView style={{ flex:1, backgroundColor:tokens.bg }}>
            <HeaderBar title={c ? `${c.name} • Kingdoms` : 'Campaign • Kingdoms'} onBack={()=>router.back()} />
            <ScrollView contentContainerStyle={{ padding:16, gap:12 }}>
                {!c ? (
                    <Card><Text style={{ color:tokens.textPrimary, fontWeight:'800' }}>Campaign not found</Text></Card>
                ) : (
                    <>
                        {/* Leader context */}
                        <Card>
                            <Text style={{ color:tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Party Leader Context</Text>
                            {leader ? (
                                <Text style={{ color:tokens.textMuted }}>
                                    {leader.name} • Chapter {leaderChapter} • Quest: {questDone ? 'Completed' : 'Not yet'} •{' '}
                                    Completed Investigations: <Text style={{ color:tokens.textPrimary, fontWeight:'800' }}>{completedInvs}/5</Text>
                                </Text>
                            ) : (
                                <Text style={{ color:tokens.textMuted }}>No leader selected.</Text>
                            )}
                        </Card>

                        {/* Kingdom selector */}
                        <Card>
                            <Text style={{ color:tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Select Kingdom</Text>
                            {kingdoms.length === 0 ? (
                                <Text style={{ color:tokens.textMuted }}>
                                    No kingdoms loaded. Ensure <Text style={{ color: tokens.textPrimary, fontWeight:'800' }}>allKingdomsCatalog</Text> exports your JSONs.
                                </Text>
                            ) : (
                                <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
                                    {kingdoms.map(k => {
                                        const isActive = (activeKingdom?.id ?? kingdoms[0]?.id) === k.id;
                                        return (
                                            <Pressable
                                                key={k.id}
                                                onPress={()=>setActiveKingdomId(k.id)}
                                                style={{
                                                    padding:12, borderRadius:10,
                                                    backgroundColor: isActive ? tokens.accent : tokens.surface,
                                                    borderWidth:1, borderColor:'#0006', minWidth:'48%'
                                                }}>
                                                <Text style={{ color: isActive ? '#0B0B0B' : tokens.textPrimary, fontWeight:'800' }}>{k.name}</Text>
                                                <Text style={{ color: isActive ? '#0B0B0B' : tokens.textMuted, marginTop:2, fontSize:12 }}>{k.id}</Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            )}
                        </Card>

                        {/* Active kingdom details */}
                        {activeKingdom && (
                            <>
                                <Card>
                                    <Text style={{ color:tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>
                                        {activeKingdom.name} • Monsters (available now)
                                    </Text>

                                    <View style={{ gap:8 }}>
                                        {availableMonsters.length > 0 ? (
                                            availableMonsters.map(m => {
                                                const stage = stageRow[m.id]!;
                                                // 🎨 stage colors like in the book
                                                const stageColors: Record<number, string> = {
                                                    1: '#90EE90', // green
                                                    2: '#e3b341', // yellow
                                                    3: '#e67e22', // orange
                                                    4: '#d35400', // red-orange
                                                };
                                                const bg = stageColors[stage] ?? '#444'; // gray if locked or unknown

                                                return (
                                                    <View
                                                        key={m.id}
                                                        style={{
                                                            padding: 12,
                                                            borderRadius: 10,
                                                            backgroundColor: tokens.surface,
                                                            borderWidth: 1,
                                                            borderColor: '#0006',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <View>
                                                            <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{m.name}</Text>
                                                            <Text style={{ color: tokens.textMuted, marginTop: 2 }}>{m.id}</Text>
                                                        </View>

                                                        {/* ✅ book-colored stage badge */}
                                                        <StageBadge stage={stage} />
                                                    </View>                                                );
                                            })
                                        ) : (
                                            <Text style={{ color:tokens.textMuted }}>No monsters currently available.</Text>
                                        )}
                                    </View>
                                </Card>
                                <Card>
                                    <Text style={{ color:tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>
                                        {activeKingdom.name} • Adventures
                                    </Text>
                                    <View style={{ gap:8 }}>
                                        {(activeKingdom.adventures ?? []).map(a => (
                                            <View key={a.id} style={{
                                                padding:12, borderRadius:10, backgroundColor:tokens.surface,
                                                borderWidth:1, borderColor:'#0006'
                                            }}>
                                                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                                                    <View style={{ flex:1, paddingRight:8 }}>
                                                        <Text style={{ color:tokens.textPrimary, fontWeight:'700' }}>{a.name}</Text>
                                                        <Text style={{ color:tokens.textMuted, marginTop:2 }}>{a.id}</Text>
                                                    </View>
                                                    {a.repeatable ? <Pill label="Repeatable" tone="accent" /> : <Pill label="One-time" />}
                                                </View>
                                                {a.note ? <Text style={{ color:tokens.textMuted, marginTop:6 }}>{a.note}</Text> : null}
                                            </View>
                                        ))}
                                    </View>
                                    {(activeKingdom.adventures ?? []).length === 0 && (
                                        <Text style={{ color:tokens.textMuted }}>No adventures listed in this catalog.</Text>
                                    )}
                                </Card>
                            </>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}