import Button from '@/components/Button';
import Card from '@/components/Card';
import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

interface VisionPhaseProps {
  campaignId: string;
}

export default function VisionPhase({ campaignId }: VisionPhaseProps) {
  const { tokens } = useThemeTokens();
  const {
    campaigns,
    setPartyLeader,
    startExpedition,
    setKnightExpeditionChoice,
    setSelectedKingdom,
    setExpeditionPhase,
  } = useCampaigns();

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

  const handlePartyLeaderChange = (newLeaderUID: string) => {
    setSelectedPartyLeader(newLeaderUID);

    // Clear quest choices from all knights except the new leader
    activeKnights.forEach(member => {
      if (member.knightUID !== newLeaderUID) {
        const choice = getKnightChoice(member.knightUID);
        if (choice?.choice === 'quest') {
          // Clear the quest choice from non-leaders
          setKnightExpeditionChoice(campaignId, member.knightUID, 'free-roam');
        }
      }
    });
  };

  const handleStartExpedition = () => {
    if (!selectedPartyLeader) {
      Alert.alert(
        'Party Leader Required',
        'Please select a party leader before starting the expedition.'
      );
      return;
    }

    if (!campaign.selectedKingdomId) {
      Alert.alert(
        'Kingdom Required',
        'Please select a destination kingdom before starting the expedition.'
      );
      return;
    }

    // Set the party leader first
    setPartyLeader(campaignId, selectedPartyLeader);

    // If expedition doesn't exist yet, start it
    if (!expedition) {
      startExpedition(campaignId);
    }
  };

  const handleKnightChoice = (
    knightUID: string,
    choice: 'quest' | 'investigation' | 'free-roam'
  ) => {
    // Only allow quest selection for the party leader
    if (choice === 'quest' && !isPartyLeader(knightUID)) {
      Alert.alert('Quest Restriction', 'Only the party leader can select a quest.');
      return;
    }

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
                onPress={() => handlePartyLeaderChange(member.knightUID)}
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

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {isLeader && (
                  <Button
                    label='Quest'
                    onPress={() => handleKnightChoice(member.knightUID, 'quest')}
                    tone={choice?.choice === 'quest' ? 'accent' : 'default'}
                  />
                )}
                <Button
                  label='Investigation'
                  onPress={() => handleKnightChoice(member.knightUID, 'investigation')}
                  tone={choice?.choice === 'investigation' ? 'accent' : 'default'}
                />
                <Button
                  label='Free Roam'
                  onPress={() => handleKnightChoice(member.knightUID, 'free-roam')}
                  tone={choice?.choice === 'free-roam' ? 'accent' : 'default'}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Kingdom Selection */}
      {selectedPartyLeader && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: tokens.textPrimary, fontWeight: '700', marginBottom: 12 }}>
            Select Destination Kingdom
          </Text>
          <Text style={{ color: tokens.textMuted, marginBottom: 12 }}>
            The Party Leader determines which Kingdom you are delving into.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {allKingdomsCatalog.map(kingdom => {
              const isSelected = campaign.selectedKingdomId === kingdom.id;
              return (
                <Button
                  key={kingdom.id}
                  label={kingdom.name}
                  onPress={() => setSelectedKingdom(campaignId, kingdom.id)}
                  tone={isSelected ? 'accent' : 'default'}
                />
              );
            })}
          </View>
        </View>
      )}

      {/* Start Expedition Button */}
      {!expedition && (
        <Button label='Start Expedition' onPress={handleStartExpedition} tone='accent' />
      )}

      {expedition && expedition.currentPhase === 'vision' && (
        <Button
          label='Begin Outpost Phase'
          onPress={() => {
<<<<<<< HEAD
            if (!campaign.selectedKingdomId) {
              Alert.alert(
                'Kingdom Required',
                'Please select a destination kingdom before proceeding to the Outpost Phase.'
              );
              return;
            }
=======
>>>>>>> 92b8c2d (feat: implement outpost phase with phase transitions)
            setExpeditionPhase(campaignId, 'outpost');
          }}
          tone='accent'
        />
      )}
    </Card>
  );
}
