import VisionPhase from '@/features/expedition/VisionPhase';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { ScrollView, View } from 'react-native';

export default function CampaignExpedition() {
  const { tokens } = useThemeTokens();
  const campaignId = useCampaigns(s => s.currentCampaignId);

  if (!campaignId) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Error state handled by VisionPhase component */}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <VisionPhase campaignId={campaignId} />
      </ScrollView>
    </View>
  );
}
