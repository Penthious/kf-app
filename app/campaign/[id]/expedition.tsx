import VisionPhase from '@/features/expedition/VisionPhase';
import OutpostPhase from '@/features/expedition/OutpostPhase';
import DelvePhase from '@/features/expedition/DelvePhase';
import ClashPhase from '@/features/expedition/ClashPhase';
import RestPhase from '@/features/expedition/RestPhase';
import SecondDelvePhase from '@/features/expedition/SecondDelvePhase';
import SecondClashPhase from '@/features/expedition/SecondClashPhase';
import SpoilsPhase from '@/features/expedition/SpoilsPhase';
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
      case 'delve':
        return <DelvePhase campaignId={campaignId} />;
      case 'clash':
        return <ClashPhase campaignId={campaignId} />;
      case 'rest':
        return <RestPhase campaignId={campaignId} />;
      case 'second-delve':
        return <SecondDelvePhase campaignId={campaignId} />;
      case 'second-clash':
        return <SecondClashPhase campaignId={campaignId} />;
      case 'spoils':
        return <SpoilsPhase campaignId={campaignId} />;
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
    <View style={{ flex: 1, backgroundColor: tokens.bg }} testID='expedition-container'>
      <ScrollView contentContainerStyle={{ padding: 16 }}>{renderPhaseComponent()}</ScrollView>
    </View>
  );
}
