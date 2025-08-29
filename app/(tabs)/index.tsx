// app/(tabs)/index.tsx
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CampaignsScreen() {
    const router = useRouter();
    const { tokens } = useThemeTokens();
    const { campaigns } = useCampaigns();
    const list = Object.values(campaigns);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 18, marginBottom: 12 }}>
                    Campaigns
                </Text>

                {list.length === 0 ? (
                    <Card style={{ marginBottom: 12 }}>
                        <Text style={{ color: tokens.textPrimary, marginBottom: 6 }}>
                            You don’t have any campaigns yet.
                        </Text>
                        <Text style={{ color: tokens.textMuted }}>
                            Tap “New Campaign” below to create your first one.
                        </Text>
                    </Card>
                ) : (
                    list.map((c) => (
                        <Pressable
                            key={c.campaignId}
                            onPress={() => router.push(`/campaign/${c.campaignId}`)}
                            style={{ marginBottom: 12 }}
                        >
                            <Card>
                                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>{c.name}</Text>
                                <Text style={{ color: tokens.textMuted, marginTop: 4 }}>
                                    {c.members.filter((m) => m.isActive).length} active · {c.members.length} total
                                </Text>
                            </Card>
                        </Pressable>
                    ))
                )}

                <Pressable
                    onPress={() => router.push('/campaign/new')}
                    style={{
                        marginTop: 8,
                        padding: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: tokens.accent,
                    }}
                >
                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>New Campaign</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}