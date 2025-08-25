// app/campaign/[id].tsx
import React from 'react';
import { Alert, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import SwitchRow from '@/components/SwitchRow';
import TextRow from '@/components/TextRow';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { allKingdomCatalogs } from '@/catalogs/kingdoms'; // registry array of catalogs

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
            <Text
                style={{ color: tokens.textPrimary, fontWeight: '800' }}
                numberOfLines={1}
            >
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

function Pill({ label, onPress }: { label: string; onPress?: () => void }) {
    const { tokens } = useThemeTokens();
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingHorizontal: 12,
                height: 32,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: tokens.surface,
                borderWidth: 1,
                borderColor: '#0006',
            }}
        >
            <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{label}</Text>
        </Pressable>
    );
}

export default function CampaignDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { tokens } = useThemeTokens();

    const {
        campaigns,
        renameCampaign,
        removeCampaign,
        setFivePlayerMode,
        setNotes,
        addKnightToCampaign,
        replaceCatalogKnight,
        benchMember,
        removeMember,
        setPartyLeader,
        setSelectedKingdom,
        selectKingdomRosterForLeader,
    } = useCampaigns();

    const { knightsById } = useKnights();

    const c = id ? campaigns[id] : undefined;
    if (!c) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: tokens.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>
                    Campaign not found
                </Text>
            </SafeAreaView>
        );
    }

    const activeSlots = c.settings.fivePlayerMode ? 5 : 4;
    const activeMembers = c.members.filter((m) => m.isActive);
    const benchedMembers = c.members.filter((m) => !m.isActive);
    const availableKnights = Object.values(knightsById);

    const onAddKnight = (knightUID: string) => {
        const res = addKnightToCampaign(c.campaignId, knightUID) as
            | { conflict?: { existingUID: string } }
            | {};
        if (res && 'conflict' in res && (res as any).conflict) {
            const k = knightsById[knightUID];
            if (!k) return;
            Alert.alert(
                'Replace existing?',
                `A(n) ${k.catalogId} is already active in this campaign. Replace with ${k.name}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Replace',
                        style: 'destructive',
                        onPress: () =>
                            replaceCatalogKnight(c.campaignId, k.catalogId, knightUID),
                    },
                ]
            );
        }
    };

    const selectedCatalog =
        allKingdomCatalogs.find((kc) => kc.kingdomId === c.selectedKingdomId) ??
        allKingdomCatalogs[0];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <HeaderBar
                title={c.name}
                onBack={() => router.back()}
                onDelete={() => {
                    Alert.alert('Delete campaign?', 'This cannot be undone.', [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => {
                                removeCampaign(c.campaignId);
                                router.replace('/(tabs)/');
                            },
                        },
                    ]);
                }}
            />

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Details */}
                <Card style={{ marginBottom: 12 }}>
                    <Text
                        style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}
                    >
                        Details
                    </Text>
                    <TextRow
                        label="Name"
                        value={c.name}
                        onChangeText={(t) => renameCampaign(c.campaignId, t)}
                        placeholder="Campaign name"
                    />
                    <SwitchRow
                        label="Five-Player Mode"
                        value={c.settings.fivePlayerMode}
                        onValueChange={(on) => setFivePlayerMode(c.campaignId, on)}
                    />
                    <TextRow
                        label="Notes"
                        value={c.settings.notes ?? ''}
                        onChangeText={(t) => setNotes(c.campaignId, t)}
                        placeholder="Optional"
                        multiline
                        numberOfLines={4}
                    />
                </Card>

                {/* Party Leader */}
                <Card style={{ marginBottom: 12 }}>
                    <Text
                        style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}
                    >
                        Party Leader
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {activeMembers.map((m) => {
                            const k = knightsById[m.knightUID];
                            if (!k) return null;
                            const isLeader = c.partyLeaderKnightUID === m.knightUID;
                            return (
                                <View
                                    key={m.knightUID}
                                    style={{ marginRight: 8, marginBottom: 8 }}
                                >
                                    <Pressable
                                        onPress={() => setPartyLeader(c.campaignId, m.knightUID)}
                                        style={{
                                            paddingHorizontal: 12,
                                            height: 32,
                                            borderRadius: 16,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: isLeader ? tokens.accent : tokens.surface,
                                            borderWidth: 1,
                                            borderColor: '#0006',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: isLeader ? '#0B0B0B' : tokens.textPrimary,
                                                fontWeight: '800',
                                            }}
                                        >
                                            {k.name}
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                        {activeMembers.length === 0 ? (
                            <Text style={{ color: tokens.textMuted }}>
                                Add and activate knights to choose a leader.
                            </Text>
                        ) : null}
                    </View>
                </Card>

                {/* Kingdom & Roster */}
                <Card style={{ marginBottom: 12 }}>
                    <Text
                        style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}
                    >
                        Kingdom
                    </Text>

                    {allKingdomCatalogs.length === 0 ? (
                        <Text style={{ color: tokens.textMuted }}>
                            No kingdom catalogs found. Add files in
                            {' '}
                            <Text style={{ fontWeight: '800' }}>src/catalogs/kingdoms</Text>.
                        </Text>
                    ) : (
                        <>
                            {/* Kingdom picker */}
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {allKingdomCatalogs.map((kc) => {
                                    const selected =
                                        selectedCatalog && kc.kingdomId === selectedCatalog.kingdomId;
                                    return (
                                        <View
                                            key={kc.kingdomId}
                                            style={{ marginRight: 8, marginBottom: 8 }}
                                        >
                                            <Pressable
                                                onPress={() =>
                                                    setSelectedKingdom(c.campaignId, kc.kingdomId)
                                                }
                                                style={{
                                                    paddingHorizontal: 12,
                                                    height: 32,
                                                    borderRadius: 16,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: selected
                                                        ? tokens.accent
                                                        : tokens.surface,
                                                    borderWidth: 1,
                                                    borderColor: '#0006',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: selected ? '#0B0B0B' : tokens.textPrimary,
                                                        fontWeight: '800',
                                                    }}
                                                >
                                                    {kc.name}
                                                </Text>
                                            </Pressable>
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Leader-driven roster */}
                            {selectedCatalog ? (
                                <View style={{ marginTop: 10 }}>
                                    {selectKingdomRosterForLeader(
                                        c.campaignId,
                                        selectedCatalog as any
                                    ).map((m) => (
                                        <View
                                            key={m.id}
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginBottom: 6,
                                            }}
                                        >
                                            <Text style={{ color: tokens.textPrimary }}>{m.name}</Text>
                                            <Text
                                                style={{
                                                    color:
                                                        m.tier > 0 ? tokens.textPrimary : tokens.textMuted,
                                                    fontWeight: '700',
                                                }}
                                            >
                                                {m.tier === 0 ? '—' : `Tier ${m.tier}`}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            ) : null}
                        </>
                    )}
                </Card>

                {/* Roster (active/bench/add) */}
                <Card style={{ marginBottom: 12 }}>
                    <Text
                        style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}
                    >
                        Roster
                    </Text>

                    {/* Active lineup slots */}
                    <Text style={{ color: tokens.textMuted, marginBottom: 6 }}>
                        Active ({activeMembers.length}/{activeSlots})
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {activeMembers.map((m) => {
                            const k = knightsById[m.knightUID];
                            const label = k ? k.name : m.displayName;
                            return (
                                <View
                                    key={m.knightUID}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginRight: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Pill label={label} />
                                    <View style={{ width: 6 }} />
                                    <Pressable
                                        onPress={() => benchMember(c.campaignId, m.knightUID, true)}
                                        style={{
                                            paddingHorizontal: 10,
                                            height: 28,
                                            borderRadius: 14,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: tokens.surface,
                                            borderWidth: 1,
                                            borderColor: '#0006',
                                        }}
                                    >
                                        <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>
                                            Bench
                                        </Text>
                                    </Pressable>
                                    <View style={{ width: 6 }} />
                                    <Pressable
                                        onPress={() => removeMember(c.campaignId, m.knightUID)}
                                        style={{
                                            paddingHorizontal: 10,
                                            height: 28,
                                            borderRadius: 14,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#2A1313',
                                            borderWidth: 1,
                                            borderColor: '#0006',
                                        }}
                                    >
                                        <Text style={{ color: '#F9DADA', fontWeight: '700' }}>
                                            Remove
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                        {/* Empty slots */}
                        {Array.from({
                            length: Math.max(0, activeSlots - activeMembers.length),
                        }).map((_, i) => (
                            <View key={`empty-${i}`} style={{ marginRight: 8, marginBottom: 8 }}>
                                <Pill label="Empty slot" />
                            </View>
                        ))}
                    </View>

                    {/* Add knight picker (simple list) */}
                    <Text style={{ color: tokens.textMuted, marginTop: 10, marginBottom: 6 }}>
                        Add Knight
                    </Text>
                    <View>
                        {availableKnights.map((k) => (
                            <View
                                key={k.knightUID}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: 8,
                                }}
                            >
                                <Text style={{ color: tokens.textPrimary }}>
                                    {k.name}{' '}
                                    <Text style={{ color: tokens.textMuted }}>({k.catalogId})</Text>
                                </Text>
                                <Pressable
                                    onPress={() => onAddKnight(k.knightUID)}
                                    style={{
                                        paddingHorizontal: 12,
                                        height: 32,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: tokens.accent,
                                    }}
                                >
                                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Add</Text>
                                </Pressable>
                            </View>
                        ))}
                        {availableKnights.length === 0 ? (
                            <Text style={{ color: tokens.textMuted }}>
                                No knights available yet. Create knights first.
                            </Text>
                        ) : null}
                    </View>

                    {/* Benched members */}
                    {benchedMembers.length > 0 ? (
                        <>
                            <Text style={{ color: tokens.textMuted, marginTop: 12, marginBottom: 6 }}>
                                Benched
                            </Text>
                            <View>
                                {benchedMembers.map((m) => {
                                    const k = knightsById[m.knightUID];
                                    const label = k ? k.name : m.displayName;
                                    return (
                                        <View
                                            key={m.knightUID}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Text style={{ color: tokens.textPrimary }}>
                                                {label}{' '}
                                                <Text style={{ color: tokens.textMuted }}>
                                                    ({m.catalogId})
                                                </Text>
                                            </Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Pressable
                                                    onPress={() =>
                                                        benchMember(c.campaignId, m.knightUID, false)
                                                    }
                                                    style={{
                                                        paddingHorizontal: 12,
                                                        height: 32,
                                                        borderRadius: 16,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: tokens.surface,
                                                        borderWidth: 1,
                                                        borderColor: '#0006',
                                                    }}
                                                >
                                                    <Text
                                                        style={{ color: tokens.textPrimary, fontWeight: '800' }}
                                                    >
                                                        Activate
                                                    </Text>
                                                </Pressable>
                                                <View style={{ width: 8 }} />
                                                <Pressable
                                                    onPress={() => removeMember(c.campaignId, m.knightUID)}
                                                    style={{
                                                        paddingHorizontal: 12,
                                                        height: 32,
                                                        borderRadius: 16,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: '#2A1313',
                                                        borderWidth: 1,
                                                        borderColor: '#0006',
                                                    }}
                                                >
                                                    <Text style={{ color: '#F9DADA', fontWeight: '800' }}>
                                                        Remove
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </>
                    ) : null}
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}