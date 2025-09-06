import Button from '@/components/Button';
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

interface VisionPhaseProps {
  campaignId: string;
}

export default function VisionPhase({ campaignId }: VisionPhaseProps) {
  const { tokens } = useThemeTokens();
  const { campaigns, setPartyLeader, startExpedition, setKnightExpeditionChoice } = useCampaigns();

  const campaign = campaigns[campaignId];
  const expedition = campaign?.expedition;

  const [selectedPartyLeader, setSelectedPartyLeader] = useState<string | null>(
    campaign?.partyLeaderUID || null
  );

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
          Vision Phase
        </Text>
        <Text style={{ color: tokens.textMuted }}>
          No active knights in this campaign. Add knights to the campaign first.
        </Text>
      </Card>
    );
  }

  const handleStartExpedition = () => {
    if (!selectedPartyLeader) {
      Alert.alert(
        'Party Leader Required',
        'Please select a party leader before starting the expedition.'
      );
      return;
    }

    startExpedition(campaignId);
    setPartyLeader(campaignId, selectedPartyLeader);
  };

  const handleKnightChoice = (
    knightUID: string,
    choice: 'quest' | 'investigation' | 'free-roam'
  ) => {
    setKnightExpeditionChoice(campaignId, knightUID, choice);
  };

  const getKnightChoice = (knightUID: string) => {
    return expedition?.knightChoices.find(choice => choice.knightUID === knightUID);
  };

  const isPartyLeader = (knightUID: string) => {
    return selectedPartyLeader === knightUID;
  };

  return (
    <Card>
      <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 16 }}>
        Vision Phase
      </Text>

      <Text style={{ color: tokens.textMuted, marginBottom: 16 }}>
        Choose a Quest and Investigations, decide on the Party Leader, read the stories in your
        Knightbooks and unveil a Kingdom.
      </Text>

      {/* Party Leader Selection */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: tokens.textPrimary, fontWeight: '700', marginBottom: 12 }}>
          Select Party Leader
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {activeKnights.map(member => {
            const isSelected = isPartyLeader(member.knightUID);

            return (
              <Button
                key={member.knightUID}
                label={member.displayName}
                onPress={() => setSelectedPartyLeader(member.knightUID)}
                tone={isSelected ? 'accent' : 'default'}
              />
            );
          })}
        </View>
      </View>

      {/* Knight Choices */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: tokens.textPrimary, fontWeight: '700', marginBottom: 12 }}>
          Knight Choices
        </Text>

        {activeKnights.map(member => {
          const choice = getKnightChoice(member.knightUID);
          const isLeader = isPartyLeader(member.knightUID);

          return (
            <View
              key={member.knightUID}
              style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: tokens.surface,
                borderRadius: 8,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                  {member.displayName}
                </Text>
                {isLeader && (
                  <Text style={{ color: tokens.accent, fontWeight: '600', marginLeft: 8 }}>
                    (Party Leader)
                  </Text>
                )}
              </View>

              {choice ? (
                <View>
                  <Text style={{ color: tokens.textMuted, marginBottom: 4 }}>
                    Selected: {choice.choice.replace('-', ' ').toUpperCase()}
                  </Text>
                  <Text style={{ color: tokens.textMuted, fontSize: 12 }}>
                    Status: {choice.status}
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {isLeader && (
                    <Button
                      label='Quest'
                      onPress={() => handleKnightChoice(member.knightUID, 'quest')}
                      tone='default'
                    />
                  )}
                  <Button
                    label='Investigation'
                    onPress={() => handleKnightChoice(member.knightUID, 'investigation')}
                    tone='default'
                  />
                  <Button
                    label='Free Roam'
                    onPress={() => handleKnightChoice(member.knightUID, 'free-roam')}
                    tone='default'
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Start Expedition Button */}
      {!expedition && (
        <Button label='Start Expedition' onPress={handleStartExpedition} tone='accent' />
      )}

      {expedition && (
        <View>
          <Text style={{ color: tokens.textMuted, marginBottom: 8 }}>
            Expedition started! Current phase: {expedition.currentPhase}
          </Text>
          <Text style={{ color: tokens.textMuted, fontSize: 12 }}>
            Phase started: {new Date(expedition.phaseStartedAt).toLocaleString()}
          </Text>
        </View>
      )}
    </Card>
  );
}
