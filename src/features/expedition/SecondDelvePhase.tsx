import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import Button from '@/components/Button';
import KingdomTrack from './KingdomTrack';
import { allKingdomsCatalog } from '@/catalogs/kingdoms';

interface SecondDelvePhaseProps {
  campaignId: string;
}

export default function SecondDelvePhase({ campaignId }: SecondDelvePhaseProps) {
  const { tokens } = useThemeTokens();
  const {
    campaigns,
    initializeDelveProgress,
    addClue,
    addObjective,
    addContract,
    exploreLocation,
    advanceThreatTrack,
    advanceTimeTrack,
    setThreatTrackPosition,
    setTimeTrackPosition,
    setExpeditionPhase,
  } = useCampaigns();

  const campaign = campaigns[campaignId];
  const expedition = campaign?.expedition;
  const delveProgress = expedition?.delveProgress;

  const styles = StyleSheet.create({
    container: {
      gap: 16,
    },
    phaseTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: tokens.textPrimary,
      textAlign: 'center',
      marginBottom: 8,
    },
    phaseDescription: {
      fontSize: 16,
      color: tokens.textMuted,
      textAlign: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: tokens.textPrimary,
      marginBottom: 8,
    },
    infoSection: {
      backgroundColor: tokens.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    infoText: {
      fontSize: 14,
      color: tokens.textMuted,
      marginBottom: 4,
    },
    progressSection: {
      gap: 12,
    },
    progressItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: tokens.card,
      padding: 8,
      borderRadius: 6,
    },
    progressLabel: {
      fontSize: 14,
      color: tokens.textPrimary,
    },
    progressValue: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.accent,
    },
    trackSection: {
      gap: 16,
    },
    actionSection: {
      gap: 12,
    },
    actionButton: {
      marginBottom: 8,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
    },
  });

  // Initialize delve progress if it doesn't exist
  useEffect(() => {
    if (expedition && !delveProgress) {
      initializeDelveProgress(campaignId);
    }
  }, [expedition, delveProgress, campaignId, initializeDelveProgress]);

  if (!expedition) {
    return (
      <Card>
        <Text style={[styles.errorText, { color: tokens.textMuted }]}>No expedition found</Text>
      </Card>
    );
  }

  if (!delveProgress) {
    return (
      <Card>
        <Text style={[styles.errorText, { color: tokens.textMuted }]}>
          Initializing delve progress...
        </Text>
      </Card>
    );
  }

  const selectedKingdom = campaign.selectedKingdomId
    ? allKingdomsCatalog.find(k => k.id === campaign.selectedKingdomId)
    : null;

  const activeKnights = campaign.members.filter(member => member.isActive);
  const partyLeader = activeKnights.find(member => member.knightUID === campaign.partyLeaderUID);

  const handleThreatTrackPress = (segmentNumber: number) => {
    setThreatTrackPosition(campaignId, segmentNumber);
  };

  const handleTimeTrackPress = (segmentNumber: number) => {
    setTimeTrackPosition(campaignId, segmentNumber);
  };

  const handleAdvanceThreat = () => {
    advanceThreatTrack(campaignId, 1);
  };

  const handleAdvanceTime = () => {
    advanceTimeTrack(campaignId, 1);
  };

  const handleExploreLocation = () => {
    Alert.prompt('Explore Location', 'Enter location ID to explore:', locationId => {
      if (locationId && locationId.trim()) {
        exploreLocation(campaignId, locationId.trim());
      }
    });
  };

  const handleCollectClue = () => {
    Alert.prompt('Collect Clue', 'Enter clue name:', name => {
      if (name && name.trim()) {
        Alert.prompt('Clue Description', 'Enter clue description:', description => {
          if (description && description.trim()) {
            addClue(campaignId, {
              id: `clue-${Date.now()}`,
              name: name.trim(),
              description: description.trim(),
              discoveredBy: partyLeader?.knightUID || activeKnights[0]?.knightUID || '',
            });
          }
        });
      }
    });
  };

  const handleAddObjective = () => {
    Alert.prompt('Add Objective', 'Enter objective name:', name => {
      if (name && name.trim()) {
        Alert.prompt('Objective Description', 'Enter objective description:', description => {
          if (description && description.trim()) {
            addObjective(campaignId, {
              id: `objective-${Date.now()}`,
              name: name.trim(),
              description: description.trim(),
              status: 'active',
            });
          }
        });
      }
    });
  };

  const handleAddContract = () => {
    Alert.prompt('Add Contract', 'Enter contract name:', name => {
      if (name && name.trim()) {
        Alert.prompt('Contract Description', 'Enter contract description:', description => {
          if (description && description.trim()) {
            addContract(campaignId, {
              id: `contract-${Date.now()}`,
              name: name.trim(),
              description: description.trim(),
              status: 'available',
            });
          }
        });
      }
    });
  };

  const handleBeginSecondClash = () => {
    Alert.alert('Begin Second Clash Phase', 'Start the final Full Clash of the expedition?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Begin Second Clash',
        onPress: () => setExpeditionPhase(campaignId, 'second-clash'),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phaseTitle}>Second Delve Phase</Text>

      <Text style={styles.phaseDescription}>
        Continue exploring the Kingdom map, collecting Clues and fulfilling objectives and
        Contracts.
      </Text>

      <Card>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: '600' }}>Party Leader:</Text>{' '}
            {partyLeader?.displayName || 'None selected'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: '600' }}>Destination Kingdom:</Text>{' '}
            {selectedKingdom?.name || 'None selected'}
          </Text>
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: '600' }}>Active Knights:</Text> {activeKnights.length}
          </Text>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress Summary</Text>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Clues Discovered</Text>
            <Text style={styles.progressValue}>{delveProgress.clues.length}</Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Active Objectives</Text>
            <Text style={styles.progressValue}>
              {delveProgress.objectives.filter(obj => obj.status === 'active').length}
            </Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Available Contracts</Text>
            <Text style={styles.progressValue}>
              {delveProgress.contracts.filter(contract => contract.status === 'available').length}
            </Text>
          </View>

          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Locations Explored</Text>
            <Text style={styles.progressValue}>{delveProgress.exploredLocations.length}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.trackSection}>
          <KingdomTrack
            title='Threat Track'
            currentPosition={delveProgress.threatTrack.currentPosition}
            segments={[
              { id: 'threat-0', number: 0 },
              { id: 'threat-1', number: 1 },
              { id: 'threat-2', number: 2 },
              { id: 'threat-3', number: 3, isHuntSpace: true, huntSpaceType: 'single' },
              { id: 'threat-4', number: 4 },
              { id: 'threat-5', number: 5, isHuntSpace: true, huntSpaceType: 'double' },
              { id: 'threat-6', number: 6 },
              { id: 'threat-7', number: 7, isHuntSpace: true, huntSpaceType: 'single' },
              { id: 'threat-8', number: 8, isHuntSpace: true, huntSpaceType: 'single' },
              { id: 'threat-9', number: 9, isHuntSpace: true, huntSpaceType: 'double' },
            ]}
            onSegmentPress={handleThreatTrackPress}
            style='threat'
          />

          <KingdomTrack
            title='Time Track'
            currentPosition={delveProgress.timeTrack.currentPosition}
            segments={Array.from({ length: 16 }, (_, i) => ({
              id: `time-${i + 1}`,
              number: i + 1,
              label: i === 7 ? 'Clash' : i === 15 ? 'Final Clash' : undefined,
            }))}
            onSegmentPress={handleTimeTrackPress}
            style='time'
          />
        </View>
      </Card>

      <Card>
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Delve Actions</Text>

          <Button
            label='Explore Location'
            onPress={handleExploreLocation}
            style={styles.actionButton}
          />

          <Button label='Collect Clue' onPress={handleCollectClue} style={styles.actionButton} />

          <Button
            label='Add Sample Objective'
            onPress={handleAddObjective}
            style={styles.actionButton}
          />

          <Button
            label='Add Sample Contract'
            onPress={handleAddContract}
            style={styles.actionButton}
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              label='Advance Threat Track'
              onPress={handleAdvanceThreat}
              style={{ flex: 1 }}
            />
            <Button label='Advance Time Track' onPress={handleAdvanceTime} style={{ flex: 1 }} />
          </View>
        </View>
      </Card>

      <Card>
        <Button label='Begin Second Clash Phase' onPress={handleBeginSecondClash} tone='accent' />
      </Card>
    </View>
  );
}
