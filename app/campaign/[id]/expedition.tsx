import VisionPhase from '@/features/expedition/VisionPhase';
import OutpostPhase from '@/features/expedition/OutpostPhase';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { ScrollView, Text, View } from 'react-native';
import Card from '@/components/Card';

export default function CampaignExpedition() {
  const { tokens } = useThemeTokens();
  const campaignId = useCampaigns(s => s.currentCampaignId);
  const { campaigns } = useCampaigns();
  
  const campaign = campaignId ? campaigns[campaignId] : undefined;
  const expedition = campaign?.expedition;

  if (!campaignId || !campaign) {
    return (
      <View style={{ flex: 1, backgroundColor: tokens.bg }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Card>
            <Text style={{ color: tokens.textMuted }}>Campaign not found</Text>
          </Card>
        </ScrollView>
      </View>
    );
  }

  const renderPhaseComponent = () => {
    if (!expedition) {
      return <VisionPhase campaignId={campaignId} />;
    }

    switch (expedition.currentPhase) {
      case 'vision':
        return <VisionPhase campaignId={campaignId} />;
      case 'outpost':
        return <OutpostPhase campaignId={campaignId} />;
      default:
        return (
          <Card>
            <Text style={{ color: tokens.textMuted }}>
              Phase &quot;{expedition.currentPhase}&quot; not yet implemented
            </Text>
          </Card>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {renderPhaseComponent()}
      </ScrollView>
    </View>
  );
}
