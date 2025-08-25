import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { allKingdomCatalogs } from '@/catalogs/kingdoms';

export default function CampaignKingdoms() {
    const { tokens } = useThemeTokens();
    const { id } = useLocalSearchParams<{ id: string }>();
    const {
        campaigns,
        setPartyLeader,
        setSelectedKingdom,
        selectKingdomRosterForLeader,
    } = useCampaigns();
    const { knightsById } = useKnights();

    const c = id ? campaigns[id] : undefined;
    if (!c) {
        return (
            <SafeAreaView style={{ flex:1, backgroundColor: tokens.bg, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ color: tokens.textPrimary, fontWeight:'800' }}>Campaign not found</Text>
            </SafeAreaView>
        );
    }

    const activeMembers = c.members.filter(m=>m.isActive);
    const selectedCatalog =
        allKingdomCatalogs.find(kc => kc.kingdomId === c.selectedKingdomId) ?? allKingdomCatalogs[0];

    return (
        <SafeAreaView style={{ flex:1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding:16 }}>
                {/* Party Leader */}
                <Card style={{ marginBottom:12 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Party Leader</Text>
                    <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
                        {activeMembers.map(m=>{
                            const k = knightsById[m.knightUID]; if(!k) return null;
                            const isLeader = c.partyLeaderKnightUID === m.knightUID;
                            return (
                                <View key={m.knightUID} style={{ marginRight:8, marginBottom:8 }}>
                                    <Pressable
                                        onPress={()=> setPartyLeader(c.campaignId, m.knightUID)}
                                        style={{
                                            paddingHorizontal:12, height:32, borderRadius:16,
                                            alignItems:'center', justifyContent:'center',
                                            backgroundColor: isLeader ? tokens.accent : tokens.surface,
                                            borderWidth:1, borderColor:'#0006'
                                        }}
                                    >
                                        <Text style={{ color: isLeader ? '#0B0B0B' : tokens.textPrimary, fontWeight:'800' }}>
                                            {k.name}
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                        {activeMembers.length === 0 ? (
                            <Text style={{ color: tokens.textMuted }}>Activate knights to select a leader.</Text>
                        ) : null}
                    </View>
                </Card>

                {/* Kingdom picker + roster */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Kingdom</Text>
                    {allKingdomCatalogs.length === 0 ? (
                        <Text style={{ color: tokens.textMuted }}>
                            No kingdom catalogs found. Add files under <Text style={{ fontWeight:'800' }}>src/catalogs/kingdoms</Text>.
                        </Text>
                    ) : (
                        <>
                            <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
                                {allKingdomCatalogs.map(kc=>{
                                    const selected = selectedCatalog && kc.kingdomId === selectedCatalog.kingdomId;
                                    return (
                                        <View key={kc.kingdomId} style={{ marginRight:8, marginBottom:8 }}>
                                            <Pressable
                                                onPress={()=> setSelectedKingdom(c.campaignId, kc.kingdomId)}
                                                style={{
                                                    paddingHorizontal:12, height:32, borderRadius:16,
                                                    alignItems:'center', justifyContent:'center',
                                                    backgroundColor: selected ? tokens.accent : tokens.surface,
                                                    borderWidth:1, borderColor:'#0006'
                                                }}
                                            >
                                                <Text style={{ color: selected ? '#0B0B0B' : tokens.textPrimary, fontWeight:'800' }}>
                                                    {kc.name}
                                                </Text>
                                            </Pressable>
                                        </View>
                                    );
                                })}
                            </View>

                            {selectedCatalog ? (
                                <View style={{ marginTop:10 }}>
                                    {selectKingdomRosterForLeader(c.campaignId, selectedCatalog as any).map(m=>(
                                        <View key={m.id} style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
                                            <Text style={{ color: tokens.textPrimary }}>{m.name}</Text>
                                            <Text style={{ color: m.tier>0 ? tokens.textPrimary : tokens.textMuted, fontWeight:'700' }}>
                                                {m.tier === 0 ? '—' : `Tier ${m.tier}`}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            ) : null}
                        </>
                    )}
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}