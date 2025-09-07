import Card from '@/components/Card';
import SwitchRow from '@/components/ui/SwitchRow';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

export default function ExpansionsScreen() {
  const { tokens } = useThemeTokens();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { campaigns, setExpansionEnabled } = useCampaigns();

  const campaign = id ? campaigns[id] : null;
  const ttsfEnabled = campaign?.settings.expansions?.ttsf?.enabled ?? false;

  const handleTTSFToggle = (enabled: boolean) => {
    if (id) {
      setExpansionEnabled(id, 'ttsf', enabled);
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
            and content.
          </Text>

          <SwitchRow
            label='Ten Thousand Succulent Fears'
            value={ttsfEnabled}
            onValueChange={handleTTSFToggle}
            description='Adds new wandering monsters and specific kingdom monsters to all stages of the bestiary.'
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
            {'\n'}This expansion adds new monsters to existing kingdoms and introduces new wandering
            monsters that can appear during expeditions.
          </Text>

          <Text style={{ color: tokens.textMuted, lineHeight: 20 }}>
            When enabled, TTSF monsters will be added to all stages of kingdom bestiaries, and TTSF
            wandering monsters will be available during expeditions.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
