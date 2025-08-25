// app/campaign/[id]/knights.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import TextRow from '@/components/TextRow';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import uuid from 'react-native-uuid';

export default function CampaignKnights() {
    const { tokens } = useThemeTokens();
    const router = useRouter();
    const { id } = useGlobalSearchParams<{ id: string }>();

    // stores (keep hook order stable)
    const {
        campaigns,
        benchMember,
        removeMember,
        setPartyLeader,
        addKnightToCampaign,
        replaceCatalogKnight,
    } = useCampaigns();
    const { knightsById, addKnight } = useKnights() as any;

    // local state
    const [newName, setNewName] = useState('');
    const [newCatalog, setNewCatalog] = useState<string | null>(null);

    // derive campaign (no early returns; render placeholder if missing)
    const c = (id && campaigns[id]) || undefined;
    const activeSlots = c?.settings.fivePlayerMode ? 5 : 4;
    const members = c?.members ?? [];
    const activeMembers = members.filter((m) => m.isActive);
    const benchedMembers = members.filter((m) => !m.isActive);

    // Knights not yet part of this campaign
    const memberUIDs = useMemo(() => new Set(members.map((m) => m.knightUID)), [members]);
    const availableKnights = useMemo(
        () => Object.values(knightsById).filter((k: any) => !memberUIDs.has(k.knightUID)),
        [knightsById, memberUIDs]
    );

    const onAddExisting = (knightUID: string, asActive = true) => {
        if (!c) return;
        const res = addKnightToCampaign(c.campaignId, knightUID) as { conflict?: { existingUID: string } } | {};
        if (res && 'conflict' in res && (res as any).conflict) {
            const k = (knightsById as any)[knightUID];
            if (!k) return;
            Alert.alert(
                'Catalog conflict',
                `An active ${k.catalogId} is already in this campaign. What would you like to do?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Replace Active', style: 'destructive', onPress: () => replaceCatalogKnight(c.campaignId, k.catalogId, knightUID) },
                    {
                        text: 'Add as Benched',
                        onPress: () => {
                            addKnightToCampaign(c.campaignId, knightUID);
                            benchMember(c.campaignId, knightUID, true);
                        },
                    },
                ]
            );
        } else if (!asActive) {
            benchMember(c.campaignId, knightUID, true);
        }
    };

    // quick-create
    const CATALOG_CHOICES = [
        'kara', 'ser-sonch', 'renholder', 'fleishritter', 'paracelsa',
        'stoneface', 'delphine', 'reiner',
        'absolute-bastard', 'ser-gallant',
    ];
    const canCreate = newName.trim().length > 0 && !!newCatalog;

    const onCreateKnight = (asActive = true) => {
        if (!c || !canCreate) return;
        const knightUID = uuid.v4() as string;

        const k = {
            knightUID,
            ownerUserId: 'me',
            catalogId: newCatalog as string,
            name: newName.trim(),
            sheet: {
                virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
                bane: 0,
                sighOfGraal: 0,
                gold: 0,
                leads: 0,
                chapter: 1,
                prologueDone: false,
                postgameDone: false,
                firstDeath: false,
                investigations: {}, // full sheet manages attempts/results
                vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
                armory: [],
            },
            rapport: [],
            saints: [],
            mercenaries: [],
        } as any;

        addKnight(k);
        onAddExisting(knightUID, asActive);
        setNewName('');
        setNewCatalog(null);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Placeholder when campaign missing (keep hooks stable) */}
                {!c ? (
                    <Card>
                        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Campaign not found</Text>
                        <Text style={{ color: tokens.textMuted, marginTop: 4 }}>Reopen from the Campaigns list.</Text>
                    </Card>
                ) : (
                    <>
                        {/* Active lineup */}
                        <Card style={{ marginBottom: 12 }}>
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                                Active Lineup ({activeMembers.length}/{activeSlots})
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {activeMembers.map((m) => {
                                    const k = (knightsById as any)[m.knightUID];
                                    const label = k ? k.name : m.displayName;
                                    const isLeader = c.partyLeaderKnightUID === m.knightUID;
                                    return (
                                        <View key={m.knightUID} style={{ marginRight: 8, marginBottom: 8 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                                                    <Text style={{ color: isLeader ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>
                                                        {label}{isLeader ? ' • Leader' : ''}
                                                    </Text>
                                                </Pressable>
                                                <View style={{ width: 6 }} />
                                                <Pressable
                                                    onPress={() => router.push(`/knight/${m.knightUID}`)} // 👉 go to full sheet
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
                                                    <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>Edit</Text>
                                                </Pressable>
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
                                                    <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>Bench</Text>
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
                                                    <Text style={{ color: '#F9DADA', fontWeight: '700' }}>Remove</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    );
                                })}
                                {activeMembers.length === 0 ? (
                                    <Text style={{ color: tokens.textMuted }}>No active knights.</Text>
                                ) : null}
                            </View>
                        </Card>

                        {/* Benched */}
                        <Card style={{ marginBottom: 12 }}>
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Benched</Text>
                            <View>
                                {benchedMembers.length === 0 ? (
                                    <Text style={{ color: tokens.textMuted }}>No benched knights.</Text>
                                ) : (
                                    benchedMembers.map((m) => {
                                        const k = (knightsById as any)[m.knightUID];
                                        const label = k ? k.name : m.displayName;
                                        return (
                                            <View
                                                key={m.knightUID}
                                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}
                                            >
                                                <Text style={{ color: tokens.textPrimary }}>
                                                    {label} <Text style={{ color: tokens.textMuted }}>({m.catalogId})</Text>
                                                </Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Pressable
                                                        onPress={() => router.push(`/knight/${m.knightUID}`)} // 👉 full sheet
                                                        style={{
                                                            paddingHorizontal: 12, height: 32, borderRadius: 16,
                                                            alignItems: 'center', justifyContent: 'center',
                                                            backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006', marginRight: 8,
                                                        }}
                                                    >
                                                        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Edit</Text>
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() => benchMember(c.campaignId, m.knightUID, false)}
                                                        style={{
                                                            paddingHorizontal: 12, height: 32, borderRadius: 16,
                                                            alignItems: 'center', justifyContent: 'center',
                                                            backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006',
                                                        }}
                                                    >
                                                        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Activate</Text>
                                                    </Pressable>
                                                </View>
                                            </View>
                                        );
                                    })
                                )}
                            </View>
                        </Card>

                        {/* Add existing knights */}
                        <Card style={{ marginBottom: 12 }}>
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Add Existing Knights</Text>
                            {availableKnights.length === 0 ? (
                                <Text style={{ color: tokens.textMuted }}>No other knights available. Create a new one below.</Text>
                            ) : (
                                <View>
                                    {availableKnights.map((k: any) => (
                                        <View key={k.knightUID} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <View>
                                                <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{k.name}</Text>
                                                <Text style={{ color: tokens.textMuted, fontSize: 12 }}>{k.catalogId}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Pressable
                                                    onPress={() => onAddExisting(k.knightUID, true)}
                                                    style={{
                                                        paddingHorizontal: 12, height: 32, borderRadius: 16,
                                                        alignItems: 'center', justifyContent: 'center',
                                                        backgroundColor: tokens.accent, marginRight: 8,
                                                    }}
                                                >
                                                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Add Active</Text>
                                                </Pressable>
                                                <Pressable
                                                    onPress={() => onAddExisting(k.knightUID, false)}
                                                    style={{
                                                        paddingHorizontal: 12, height: 32, borderRadius: 16,
                                                        alignItems: 'center', justifyContent: 'center',
                                                        backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006',
                                                    }}
                                                >
                                                    <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Bench</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </Card>

                        {/* Quick-create new knight */}
                        <Card>
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Quick‑Create Knight</Text>
                            <TextRow label="Name" value={newName} onChangeText={setNewName} placeholder="e.g., Renholder" />
                            <Text style={{ color: tokens.textMuted, marginBottom: 6 }}>Catalog</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                                {CATALOG_CHOICES.map((idOpt) => {
                                    const selected = newCatalog === idOpt;
                                    return (
                                        <Pressable
                                            key={idOpt}
                                            onPress={() => setNewCatalog(idOpt)}
                                            style={{
                                                marginRight: 8, marginBottom: 8,
                                                paddingHorizontal: 12, height: 32, borderRadius: 16,
                                                alignItems: 'center', justifyContent: 'center',
                                                backgroundColor: selected ? tokens.accent : tokens.surface,
                                                borderWidth: 1, borderColor: '#0006',
                                            }}
                                        >
                                            <Text style={{ color: selected ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>
                                                {idOpt}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Pressable
                                    disabled={!canCreate}
                                    onPress={() => onCreateKnight(false)}
                                    style={{
                                        paddingHorizontal: 12, height: 40, borderRadius: 12,
                                        alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: canCreate ? tokens.surface : '#333',
                                        borderWidth: 1, borderColor: '#0006', marginRight: 8,
                                        opacity: canCreate ? 1 : 0.5,
                                    }}
                                >
                                    <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Create as Benched</Text>
                                </Pressable>
                                <Pressable
                                    disabled={!canCreate}
                                    onPress={() => onCreateKnight(true)}
                                    style={{
                                        paddingHorizontal: 12, height: 40, borderRadius: 12,
                                        alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: canCreate ? tokens.accent : '#333',
                                        opacity: canCreate ? 1 : 0.5,
                                    }}
                                >
                                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Create & Activate</Text>
                                </Pressable>
                            </View>
                        </Card>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}