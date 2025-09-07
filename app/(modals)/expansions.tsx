import Card from '@/components/Card';
import SwitchRow from '@/components/ui/SwitchRow';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { getExpansionDescription, getExpansionDisplayName } from '../../src/utils/knights';

export default function ExpansionsScreen() {
  const { tokens } = useThemeTokens();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { campaigns, setExpansionEnabled } = useCampaigns();

  const campaign = id ? campaigns[id] : null;
  const ttsfEnabled = campaign?.settings.expansions?.ttsf?.enabled ?? false;
  const tbbhEnabled = campaign?.settings.expansions?.tbbh?.enabled ?? false;
  const trkoeEnabled = campaign?.settings.expansions?.trkoe?.enabled ?? false;
  const absoluteBastardEnabled =
    campaign?.settings.expansions?.['absolute-bastard']?.enabled ?? false;
  const serGallantEnabled = campaign?.settings.expansions?.['ser-gallant']?.enabled ?? false;

  const handleExpansionToggle = (
    expansion: 'ttsf' | 'tbbh' | 'trkoe' | 'absolute-bastard' | 'ser-gallant',
    enabled: boolean
  ) => {
    if (id) {
      setExpansionEnabled(id, expansion, enabled);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Card>
          <Text
            style={{
              color: tokens.textPrimary,
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 16,
            }}
          >
            Expansion Settings
          </Text>

          <Text style={{ color: tokens.textMuted, marginBottom: 16 }}>
            Enable or disable expansions for this campaign. Changes will affect available monsters
            and knights.
          </Text>

          <SwitchRow
            label={getExpansionDisplayName('ttsf')}
            value={ttsfEnabled}
            onValueChange={enabled => handleExpansionToggle('ttsf', enabled)}
            description={getExpansionDescription('ttsf')}
          />

          <SwitchRow
            label={getExpansionDisplayName('tbbh')}
            value={tbbhEnabled}
            onValueChange={enabled => handleExpansionToggle('tbbh', enabled)}
            description={getExpansionDescription('tbbh')}
          />

          <SwitchRow
            label={getExpansionDisplayName('trkoe')}
            value={trkoeEnabled}
            onValueChange={enabled => handleExpansionToggle('trkoe', enabled)}
            description={getExpansionDescription('trkoe')}
          />

          <SwitchRow
            label={getExpansionDisplayName('absolute-bastard')}
            value={absoluteBastardEnabled}
            onValueChange={enabled => handleExpansionToggle('absolute-bastard', enabled)}
            description={getExpansionDescription('absolute-bastard')}
          />

          <SwitchRow
            label={getExpansionDisplayName('ser-gallant')}
            value={serGallantEnabled}
            onValueChange={enabled => handleExpansionToggle('ser-gallant', enabled)}
            description={getExpansionDescription('ser-gallant')}
          />
        </Card>

        <Card>
          <Text
            style={{ color: tokens.textPrimary, fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}
          >
            About Expansions
          </Text>

          <Text style={{ color: tokens.textMuted, lineHeight: 20, marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>Ten Thousand Succulent Fears:</Text>
            {'\n'}Adds new monsters to existing kingdoms and introduces new wandering monsters that
            can appear during expeditions. Also includes Ser Ubar and Stoneface knights.
          </Text>

          <Text style={{ color: tokens.textMuted, lineHeight: 20, marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>The Barony of Bountiful Harvest:</Text>
            {'\n'}Adds Delphine knight to your campaign.
          </Text>

          <Text style={{ color: tokens.textMuted, lineHeight: 20, marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>The Red Kingdom of Eshin:</Text>
            {'\n'}Adds Reiner knight to your campaign.
          </Text>

          <Text style={{ color: tokens.textMuted, lineHeight: 20, marginBottom: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>Absolute Bastard:</Text>
            {'\n'}Adds Absolute Bastard knight to your campaign.
          </Text>

          <Text style={{ color: tokens.textMuted, lineHeight: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Ser Gallant:</Text>
            {'\n'}Adds Ser Gallant knight to your campaign.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
