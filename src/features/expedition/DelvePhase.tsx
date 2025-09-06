import Button from '@/components/Button';
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import { Text, View, ScrollView, Alert } from 'react-native';

interface DelvePhaseProps {
  campaignId: string;
}

export default function DelvePhase({ campaignId }: DelvePhaseProps) {
  const { tokens } = useThemeTokens();
  const {
    campaigns,
    setExpeditionPhase,
    initializeDelveProgress,
    addClue,
    addObjective,
    addContract,
    exploreLocation,
    setCurrentLocation,
  } = useCampaigns();

  const campaign = campaigns[campaignId];

  if (!campaign) {
    return (
      <Card>
        <Text style={{ color: tokens.textMuted }}>Campaign not found</Text>
      </Card>
    );
  }

  const activeKnights = campaign.members.filter(member => member.isActive);
  const selectedKingdom = campaign.selectedKingdomId;
  const delveProgress = campaign.expedition?.delveProgress;

  // Initialize delve progress if it doesn't exist
  if (!delveProgress) {
    initializeDelveProgress(campaignId);
  }

  if (activeKnights.length === 0) {
    return (
      <Card>
        <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
          No Active Knights
        </Text>
        <Text style={{ color: tokens.textMuted }}>
          No active knights in this campaign. Add knights to the campaign first.
        </Text>
      </Card>
    );
  }

  if (!selectedKingdom) {
    return (
      <Card>
        <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
          No Kingdom Selected
        </Text>
        <Text style={{ color: tokens.textMuted }}>
          Please select a destination kingdom in the Vision Phase before delving.
        </Text>
      </Card>
    );
  }

  const partyLeader = activeKnights.find(k => k.knightUID === campaign.partyLeaderUID);
  const selectedKingdomData = allKingdomsCatalog.find(k => k.id === selectedKingdom);

  const handleExploreLocation = () => {
    if (!selectedKingdomData) {
      Alert.alert('Error', 'No kingdom selected for exploration');
      return;
    }

    // For now, we'll create a simple location exploration
    const locationId = `location-${Date.now()}`;
    exploreLocation(campaignId, locationId);
    setCurrentLocation(campaignId, locationId);

    Alert.alert('Location Explored', `You have explored a new area in ${selectedKingdomData.name}`);
  };

  const handleCollectClue = () => {
    if (!partyLeader) {
      Alert.alert('Error', 'No party leader selected');
      return;
    }

    const clueId = `clue-${Date.now()}`;
    addClue(campaignId, {
      id: clueId,
      name: 'Mysterious Clue',
      description: 'A piece of information that might be useful for your quest.',
      discoveredBy: partyLeader.knightUID,
    });

    Alert.alert('Clue Discovered', `${partyLeader.displayName} has discovered a new clue!`);
  };

  const handleAddObjective = () => {
    const objectiveId = `objective-${Date.now()}`;
    addObjective(campaignId, {
      id: objectiveId,
      name: 'Sample Objective',
      description: 'Complete this objective to progress in your expedition.',
      status: 'active',
    });

    Alert.alert('Objective Added', 'A new objective has been added to your expedition.');
  };

  const handleAddContract = () => {
    const contractId = `contract-${Date.now()}`;
    addContract(campaignId, {
      id: contractId,
      name: 'Sample Contract',
      description: 'Accept this contract to earn rewards.',
      status: 'available',
    });

    Alert.alert('Contract Available', 'A new contract is now available for your party.');
  };

  return (
    <ScrollView>
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 12 }}>
          Delve Phase
        </Text>
        <Text style={{ color: tokens.textMuted, marginBottom: 12 }}>
          Explore the Kingdom map, collecting Clues and fulfilling objectives and Contracts.
        </Text>

        {partyLeader && (
          <Text style={{ color: tokens.textPrimary, marginBottom: 8 }}>
            Party Leader: <Text style={{ fontWeight: 'bold' }}>{partyLeader.displayName}</Text>
          </Text>
        )}
        {selectedKingdomData && (
          <Text style={{ color: tokens.textPrimary, marginBottom: 12 }}>
            Destination Kingdom:{' '}
            <Text style={{ fontWeight: 'bold' }}>{selectedKingdomData.name}</Text>
          </Text>
        )}

        {delveProgress && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 8 }}>
              Progress Summary:
            </Text>
            <Text style={{ color: tokens.textMuted, marginBottom: 4 }}>
              Clues Found: {delveProgress.clues.length}
            </Text>
            <Text style={{ color: tokens.textMuted, marginBottom: 4 }}>
              Active Objectives:{' '}
              {delveProgress.objectives.filter(o => o.status === 'active').length}
            </Text>
            <Text style={{ color: tokens.textMuted, marginBottom: 4 }}>
              Available Contracts:{' '}
              {delveProgress.contracts.filter(c => c.status === 'available').length}
            </Text>
            <Text style={{ color: tokens.textMuted, marginBottom: 4 }}>
              Locations Explored: {delveProgress.exploredLocations.length}
            </Text>
          </View>
        )}

        <View style={{ marginTop: 16, gap: 8 }}>
          <Button label='Explore Location' onPress={handleExploreLocation} />
          <Button label='Collect Clue' onPress={handleCollectClue} />
          <Button label='Add Sample Objective' onPress={handleAddObjective} />
          <Button label='Add Sample Contract' onPress={handleAddContract} />
        </View>
      </Card>

      <Button
        label='Begin Clash Phase'
        onPress={() => setExpeditionPhase(campaignId, 'clash')}
        tone='accent'
      />
    </ScrollView>
  );
}
