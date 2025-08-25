// app/campaign/new.tsx
import React, { useMemo, useState } from 'react';
import { Alert, View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import TextRow from '@/components/TextRow';
import SwitchRow from '@/components/SwitchRow';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

export default function CampaignCreate() {
    const router = useRouter();
    const { tokens } = useThemeTokens();

    const {
        campaigns,
        addCampaign, setFivePlayerMode, setNotes, renameCampaign,
        addKnightToCampaign, setPartyLeader,
    } = useCampaigns();
    const { knightsById } = useKnights();

    // ------- local draft state (not in store yet) -------
    const [name, setName] = useState<string>(`Campaign ${Object.keys(campaigns).length + 1}`);
    const [fivePlayerMode, setFPM] = useState(false);
    const [notes, setNotesLocal] = useState('');
    const [selected, setSelected] = useState<string[]>([]); // knightUIDs
    const [leaderUID, setLeaderUID] = useState<string | undefined>(undefined);

    const allKnights = useMemo(() => Object.values(knightsById), [knightsById]);
    const activeSlots = fivePlayerMode ? 5 : 4;

    // enforce unique catalogId among selected
    const canSelect = (knightUID: string) => {
        const k = knightsById[knightUID];
        if (!k) return false;
        if (selected.includes(knightUID)) return true; // already selected
        const clash = selected.some(uid => knightsById[uid]?.catalogId === k.catalogId);
        if (clash) return false;
        if (selected.length >= activeSlots) return false;
        return true;
    };

    const onToggleKnight = (knightUID: string) => {
        if (selected.includes(knightUID)) {
            const next = selected.filter(u => u !== knightUID);
            setSelected(next);
            if (leaderUID === knightUID) setLeaderUID(next[0]);
            return;
        }
        if (!canSelect(knightUID)) {
            Alert.alert('Cannot add', 'Either you reached the slot limit or a knight of the same catalog is already selected.');
            return;
        }
        const next = [...selected, knightUID];
        setSelected(next);
        if (!leaderUID) setLeaderUID(knightUID);
    };

    const onSave = () => {
        if (!name.trim()) {
            Alert.alert('Name required', 'Please enter a campaign name.');
            return;
        }
        // 1) create campaign
        const c = addCampaign(name.trim());
        // 2) apply settings
        setFivePlayerMode(c.campaignId, fivePlayerMode);
        if (notes.trim()) setNotes(c.campaignId, notes.trim());
        if (name.trim() !== c.name) renameCampaign(c.campaignId, name.trim());
        // 3) add selected knights
        selected.forEach(uid => { addKnightToCampaign(c.campaignId, uid); });
        // 4) set leader
        if (leaderUID) setPartyLeader(c.campaignId, leaderUID);
        // 5) go to the campaign workspace (Kingdoms tab by default via index redirect)
        router.replace(`/campaign/${c.campaignId}`);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Card style={{ marginBottom: 12 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 18, marginBottom: 8 }}>
                        New Campaign
                    </Text>
                    <TextRow label="Name" value={name} onChangeText={setName} placeholder="Campaign name" />
                    <SwitchRow label="Five-Player Mode" value={fivePlayerMode} onValueChange={setFPM} />
                    <TextRow label="Notes" value={notes} onChangeText={setNotesLocal} placeholder="Optional" multiline numberOfLines={4} />
                </Card>

                <Card style={{ marginBottom: 12 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                        Pick Knights ({selected.length}/{activeSlots})
                    </Text>
                    {allKnights.length === 0 ? (
                        <Text style={{ color: tokens.textMuted }}>You haven’t created any knights yet.</Text>
                    ) : (
                        <View>
                            {allKnights.map(k => {
                                const isSelected = selected.includes(k.knightUID);
                                const disabled = !isSelected && !canSelect(k.knightUID);
                                const isLeader = leaderUID === k.knightUID && isSelected;
                                return (
                                    <View key={k.knightUID} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, opacity: disabled ? 0.5 : 1 }}>
                                        <View>
                                            <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>
                                                {k.name} {isLeader ? '• Leader' : ''}
                                            </Text>
                                            <Text style={{ color: tokens.textMuted, fontSize: 12 }}>{k.catalogId}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            {isSelected ? (
                                                <>
                                                    <Pressable
                                                        onPress={() => setLeaderUID(k.knightUID)}
                                                        style={{
                                                            paddingHorizontal: 12, height: 32, borderRadius: 16,
                                                            alignItems: 'center', justifyContent: 'center',
                                                            backgroundColor: isLeader ? tokens.accent : tokens.surface,
                                                            borderWidth: 1, borderColor: '#0006', marginRight: 8
                                                        }}
                                                    >
                                                        <Text style={{ color: isLeader ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>Leader</Text>
                                                    </Pressable>
                                                    <Pressable
                                                        onPress={() => onToggleKnight(k.knightUID)}
                                                        style={{
                                                            paddingHorizontal: 12, height: 32, borderRadius: 16,
                                                            alignItems: 'center', justifyContent: 'center',
                                                            backgroundColor: '#2A1313', borderWidth: 1, borderColor: '#0006'
                                                        }}
                                                    >
                                                        <Text style={{ color: '#F9DADA', fontWeight: '800' }}>Remove</Text>
                                                    </Pressable>
                                                </>
                                            ) : (
                                                <Pressable
                                                    disabled={disabled}
                                                    onPress={() => onToggleKnight(k.knightUID)}
                                                    style={{
                                                        paddingHorizontal: 12, height: 32, borderRadius: 16,
                                                        alignItems: 'center', justifyContent: 'center',
                                                        backgroundColor: tokens.accent
                                                    }}
                                                >
                                                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Add</Text>
                                                </Pressable>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </Card>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Pressable
                        onPress={() => router.back()}
                        style={{
                            paddingHorizontal: 16, height: 44, borderRadius: 12,
                            alignItems: 'center', justifyContent: 'center',
                            backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006'
                        }}
                    >
                        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        onPress={onSave}
                        style={{
                            paddingHorizontal: 16, height: 44, borderRadius: 12,
                            alignItems: 'center', justifyContent: 'center',
                            backgroundColor: tokens.accent
                        }}
                    >
                        <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Save & Continue</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}