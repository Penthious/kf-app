import Button from '@/components/Button';
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Text, View } from 'react-native';

interface OutpostPhaseProps {
  campaignId: string;
}

export default function OutpostPhase({ campaignId }: OutpostPhaseProps) {
  const { tokens } = useThemeTokens();
  const { campaigns, setExpeditionPhase } = useCampaigns();

  const campaign = campaigns[campaignId];

  if (!campaign) {
    return (
      <Card>
        <Text style={{ color: tokens.textMuted }}>Campaign not found</Text>
      </Card>
    );
  }

  const activeKnights = campaign.members.filter(member => member.isActive);

  if (activeKnights.length === 0) {
    return (
      <Card>
        <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
          Outpost Phase
        </Text>
        <Text style={{ color: tokens.textMuted }}>
          No active knights in this campaign. Add knights to the campaign first.
        </Text>
      </Card>
    );
  }

  const handleBeginDelvePhase = () => {
    setExpeditionPhase(campaignId, 'delve');
  };

  return (
    <Card>
      <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 16 }}>
        Outpost Phase
      </Text>

      <Text style={{ color: tokens.textMuted, marginBottom: 16 }}>
        Make all necessary preparations, including buying items, hiring help, and scouting the
        region.
      </Text>

      {/* Active Knights */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: tokens.textPrimary, fontWeight: '700', marginBottom: 12 }}>
          Active Knights
        </Text>
        {activeKnights.map(member => (
          <View
            key={member.knightUID}
            style={{
              marginBottom: 8,
              padding: 12,
              backgroundColor: tokens.surface,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
              {member.displayName}
              {member.isLeader && (
                <Text style={{ color: tokens.accent, fontWeight: '600', marginLeft: 8 }}>
                  (Party Leader)
                </Text>
              )}
            </Text>
          </View>
        ))}
      </View>

      {/* Outpost Actions */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: tokens.textPrimary, fontWeight: '700', marginBottom: 12 }}>
          Outpost Actions
        </Text>
        <Text style={{ color: tokens.textMuted, marginBottom: 16 }}>
          During the Outpost Phase, knights can:
        </Text>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 4 }}>
            • Buy Items
          </Text>
          <Text style={{ color: tokens.textMuted, fontSize: 14 }}>
            Purchase equipment and supplies from the outpost merchants
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 4 }}>
            • Hire Help
          </Text>
          <Text style={{ color: tokens.textMuted, fontSize: 14 }}>
            Recruit allies and hirelings to assist in the expedition
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 4 }}>
            • Scout the Region
          </Text>
          <Text style={{ color: tokens.textMuted, fontSize: 14 }}>
            Gather information about the area and potential dangers
          </Text>
        </View>
      </View>

      {/* Begin Delve Phase Button */}
      <Button label='Begin Delve Phase' onPress={handleBeginDelvePhase} tone='accent' />
    </Card>
  );
}
