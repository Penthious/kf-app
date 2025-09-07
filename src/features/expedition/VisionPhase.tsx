import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { progressKey } from '@/features/kingdoms/utils';
import { countCompletedInvestigations } from '@/models/knight';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Alert, Modal, Text, View } from 'react-native';

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
  const { knightsById } = useKnights();

  const campaign = campaigns[campaignId];
  const expedition = campaign?.expedition;

  const [selectedPartyLeader, setSelectedPartyLeader] = useState<string | null>(
    campaign?.partyLeaderUID || null
  );
  const [investigationSelectionModal, setInvestigationSelectionModal] = useState<{
    isVisible: boolean;
    knightUID: string;
    knightName: string;
  }>({
    isVisible: false,
    knightUID: '',
    knightName: '',
  });

  // Helper function to get quest level for a knight
  const getQuestLevel = (knightUID: string): string => {
    const knight = knightsById[knightUID];
    if (!knight) return 'Unknown';

    const chapter = knight.sheet.chapter;
    const chapterProgress = knight.sheet.chapters[chapter];

    if (!chapterProgress) return `Chapter ${chapter} - Q`;

    const questCompleted = chapterProgress.quest.completed;
    const investigationsDone = countCompletedInvestigations(chapterProgress);
    const level = progressKey(questCompleted, investigationsDone);

    // Map level to quest stage
    switch (level) {
      case 0:
        return `Chapter ${chapter} - Q`;
      case 1:
        return `Chapter ${chapter} - I1`;
      case 2:
        return `Chapter ${chapter} - I2`;
      case 3:
        return `Chapter ${chapter} - I3`;
      default:
        return `Chapter ${chapter} - Q`;
    }
  };

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

    // If investigation is chosen, show investigation selection modal
    if (choice === 'investigation') {
      const knight = knightsById[knightUID];
      const availableInvestigations = getAvailableInvestigations(knightUID);

      if (availableInvestigations.length === 0) {
        Alert.alert(
          'No Available Investigations',
          'This knight has completed all investigations for their current chapter.'
        );
        return;
      }

      setInvestigationSelectionModal({
        isVisible: true,
        knightUID,
        knightName: knight?.name || 'Unknown Knight',
      });
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

  // Get available investigations for a knight based on their current chapter and completed investigations
  const getAvailableInvestigations = (knightUID: string): string[] => {
    const knight = knightsById[knightUID];
    if (!knight) return [];

    const currentChapter = knight.sheet.chapter;
    const chapterProgress = knight.sheet.chapters[currentChapter];

    if (!chapterProgress) return [];

    // Only allow normal investigations (1-3), not special investigations (4-5)
    const normalInvestigations = [1, 2, 3].map(i => `I${currentChapter}-${i}`);

    // Filter out investigations that have been attempted (both passed and failed) OR completed
    const attemptedInvestigations = (chapterProgress.attempts || []).map(attempt => attempt.code);
    const completedInvestigations = chapterProgress.completed || [];
    const unavailableInvestigations = [...attemptedInvestigations, ...completedInvestigations];

    const availableInvestigations = normalInvestigations.filter(
      investigation => !unavailableInvestigations.includes(investigation)
    );

    return availableInvestigations;
  };

  const handleInvestigationSelection = (investigationId: string) => {
    setKnightExpeditionChoice(
      campaignId,
      investigationSelectionModal.knightUID,
      'investigation',
      undefined,
      investigationId
    );
    setInvestigationSelectionModal({
      isVisible: false,
      knightUID: '',
      knightName: '',
    });
  };

  const closeInvestigationSelectionModal = () => {
    setInvestigationSelectionModal({
      isVisible: false,
      knightUID: '',
      knightName: '',
    });
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

      {/* Border between Party Leader and Knight Choices */}
      <View
        style={{
          height: 1,
          backgroundColor: tokens.textMuted,
          opacity: 0.3,
          marginBottom: 20,
        }}
      />

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
                borderWidth: 1,
                borderColor: tokens.textMuted + '30',
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

              {/* Show what the knight is attempting */}
              {choice?.choice && (
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ color: tokens.textMuted, fontSize: 12 }}>
                    Attempting:{' '}
                    <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                      {choice.choice === 'quest' &&
                        isLeader &&
                        `Quest (${getQuestLevel(member.knightUID)})`}
                      {choice.choice === 'quest' && !isLeader && 'Quest'}
                      {choice.choice === 'investigation' &&
                        choice.investigationId &&
                        `Investigation ${choice.investigationId}`}
                      {choice.choice === 'investigation' &&
                        !choice.investigationId &&
                        'Investigation (not selected)'}
                      {choice.choice === 'free-roam' && 'Free Roam'}
                    </Text>
                  </Text>
                </View>
              )}

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {isLeader && (
                  <Button
                    label='Quest'
                    onPress={() => handleKnightChoice(member.knightUID, 'quest')}
                    tone={choice?.choice === 'quest' ? 'accent' : 'default'}
                  />
                )}
                <Button
                  label={
                    choice?.choice === 'investigation' && choice?.investigationId
                      ? `Investigation (${choice.investigationId})`
                      : 'Investigation'
                  }
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

      {/* Border between Knight Choices and Kingdom Selection */}
      {selectedPartyLeader && (
        <View
          style={{
            height: 1,
            backgroundColor: tokens.textMuted,
            opacity: 0.3,
            marginBottom: 20,
          }}
        />
      )}

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
            if (!campaign.selectedKingdomId) {
              Alert.alert(
                'Kingdom Required',
                'Please select a destination kingdom before proceeding to the Outpost Phase.'
              );
              return;
            }

            // Check that all active knights have made their choices
            const knightsWithoutChoices = activeKnights.filter(member => {
              const choice = getKnightChoice(member.knightUID);
              return !choice || !choice.choice;
            });

            if (knightsWithoutChoices.length > 0) {
              const knightNames = knightsWithoutChoices
                .map(member => member.displayName)
                .join(', ');
              Alert.alert(
                'Incomplete Choices',
                `All active knights must choose their quest, investigation, or free roam before proceeding. Missing choices from: ${knightNames}`
              );
              return;
            }

            setExpeditionPhase(campaignId, 'outpost');
          }}
          tone='accent'
        />
      )}

      {/* Investigation Selection Modal */}
      <Modal
        visible={investigationSelectionModal.isVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={closeInvestigationSelectionModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Card style={{ width: '100%', maxWidth: 400 }}>
            <Text
              style={{
                color: tokens.textPrimary,
                fontWeight: '800',
                marginBottom: 16,
                textAlign: 'center',
              }}
            >
              Select Investigation
            </Text>
            <Text style={{ color: tokens.textMuted, marginBottom: 16, textAlign: 'center' }}>
              Choose an investigation for {investigationSelectionModal.knightName}
            </Text>

            <View style={{ gap: 8, marginBottom: 16 }}>
              {getAvailableInvestigations(investigationSelectionModal.knightUID).map(
                investigationId => (
                  <Button
                    key={investigationId}
                    label={investigationId}
                    onPress={() => handleInvestigationSelection(investigationId)}
                    tone='default'
                  />
                )
              )}
            </View>

            <Button label='Cancel' onPress={closeInvestigationSelectionModal} tone='default' />
          </Card>
        </View>
      </Modal>
    </Card>
  );
}
