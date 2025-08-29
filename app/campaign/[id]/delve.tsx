import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CampaignDelve() {
    const { tokens } = useThemeTokens();
    const campaignId = useCampaigns((s) => s.currentCampaignId);
    const { campaigns } = useCampaigns();
    const c = campaignId ? campaigns[campaignId] : undefined;

    return (
        <SafeAreaView style={{ flex:1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding:16 }}>
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Delve</Text>
                    {!c ? (
                        <Text style={{ color: tokens.textMuted }}>Campaign not found</Text>
                    ) : (
                        <View>
                            <Text style={{ color: tokens.textMuted }}>
                                Placeholder: boss/minions, conditions, to‑hit math using leader + selected kingdom roster.
                            </Text>
                        </View>
                    )}
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}
