import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CampaignGear() {
  const { tokens } = useThemeTokens();
  const campaignId = useCampaigns(s => s.currentCampaignId);
  const { campaigns } = useCampaigns();
  const c = campaignId ? campaigns[campaignId] : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
            Gear (per Campaign)
          </Text>
          {!c ? (
            <Text style={{ color: tokens.textMuted }}>Campaign not found</Text>
          ) : (
            <View>
              <Text style={{ color: tokens.textMuted }}>
                Placeholder: filter/select gear for active lineup; attach to knights; integrate
                keywords popover.
              </Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
