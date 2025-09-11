import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import Button from '@/components/Button';
import Card from '@/components/Card';
import CollapsibleCard from '@/components/ui/CollapsibleCard';
import { resolveExpeditionStagesForBestiary } from '@/features/kingdoms/utils';
import type { ClueType } from '@/models/campaign';
import { getBestiaryWithExpansions } from '@/models/kingdom';
import { countCompletedInvestigations, ensureChapter } from '@/models/knight';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import ClueSelectionModal from './ClueSelectionModal';
import DistrictWheel from './DistrictWheel';
import KingdomTrack from './KingdomTrack';

interface DelvePhaseProps {
  campaignId: string;
  phase?: 'first' | 'second';
}

export default function DelvePhase({ campaignId, phase = 'first' }: DelvePhaseProps) {
  const { tokens } = useThemeTokens();
  const [showClueSelection, setShowClueSelection] = useState(false);
  const [isDelvePhaseExpanded, setIsDelvePhaseExpanded] = useState(true);
  const [isDistrictWheelExpanded, setIsDistrictWheelExpanded] = useState(true);
  const [isKingdomTrackerExpanded, setIsKingdomTrackerExpanded] = useState(true);
  const {
    campaigns,
    setExpeditionPhase,
    initializeDelveProgress,
    addClue,
    exploreLocation,
    setCurrentLocation,
    advanceThreatTrack,
    advanceTimeTrack,
    setThreatTrackPosition,
    setTimeTrackPosition,
    advanceCurseTracker,
    setCurseTrackerPosition,
    rotateDistrictWheel,
    replaceDistrictMonster,
    updateDistrictWheelForCurrentStage,
  } = useCampaigns();
  const { knightsById } = useKnights();

  const campaign = campaigns[campaignId];
  const activeKnights = campaign?.members.filter(member => member.isActive) || [];
  const selectedKingdom = campaign?.selectedKingdomId;
  const delveProgress = campaign?.expedition?.delveProgress;

  // Initialize delve progress if it doesn't exist
  useEffect(() => {
    if (campaign && !delveProgress) {
      initializeDelveProgress(campaignId);
    }
  }, [campaign, campaignId, delveProgress, initializeDelveProgress]);

  // Check if the district wheel needs to be updated for the current stage
  useEffect(() => {
    if (campaign?.expedition?.districtWheel && selectedKingdom && campaign.partyLeaderUID) {
      const partyLeaderKnight = knightsById[campaign.partyLeaderUID];
      const partyLeaderChoice = campaign?.expedition?.knightChoices.find(
        choice => choice.knightUID === campaign.partyLeaderUID
      );
      const partyLeaderChapter = partyLeaderKnight?.sheet.chapter || 1;
      const allKnightChoices = campaign?.expedition?.knightChoices || [];
      const partyLeaderCompletedInvestigations = partyLeaderKnight
        ? countCompletedInvestigations(ensureChapter(partyLeaderKnight.sheet, partyLeaderChapter))
        : 0;

      const selectedKingdomData = allKingdomsCatalog.find(k => k.id === selectedKingdom);
      if (selectedKingdomData) {
        const monsterStageInfo = resolveExpeditionStagesForBestiary(
          selectedKingdomData,
          partyLeaderChoice,
          partyLeaderChapter,
          allKnightChoices,
          partyLeaderCompletedInvestigations
        );

        const districtWheel = campaign.expedition.districtWheel;
        const kingdomCatalog = allKingdomsCatalog.find(k => k.id === selectedKingdom);

        if (kingdomCatalog) {
          const bestiary = getBestiaryWithExpansions(
            kingdomCatalog,
            campaign.settings?.expansions || {}
          );
          const currentStageIndex = monsterStageInfo.stageIndex;

          // Check if any current monsters are not available at the new stage
          const currentMonsterIds = districtWheel.assignments.map(a => a.monsterId);
          const availableMonsters = bestiary.monsters.filter(m => {
            if (currentStageIndex < 0 || currentStageIndex >= bestiary.stages.length) {
              return false;
            }
            const stageValue = bestiary.stages[currentStageIndex]?.[m.id];
            return stageValue !== null && stageValue !== undefined;
          });
          const availableMonsterIds = availableMonsters.map(m => m.id);

          // If any current monsters are not available at the new stage, update the district wheel
          const needsUpdate = currentMonsterIds.some(id => !availableMonsterIds.includes(id));

          if (needsUpdate) {
            updateDistrictWheelForCurrentStage(campaignId, selectedKingdom, partyLeaderKnight);
          }
        }
      }
    }
  }, [
    campaign?.expedition?.districtWheel,
    selectedKingdom,
    campaign?.partyLeaderUID,
    campaign?.expedition?.knightChoices,
    campaign?.settings?.expansions,
    knightsById,
    campaignId,
    updateDistrictWheelForCurrentStage,
  ]);

  if (!campaign) {
    return (
      <Card>
        <Text style={{ color: tokens.textMuted }}>Campaign not found</Text>
      </Card>
    );
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

  // Calculate monster stage based on expedition choices
  const partyLeaderChoice = campaign?.expedition?.knightChoices.find(
    choice => choice.knightUID === campaign.partyLeaderUID
  );
  const partyLeaderKnight = partyLeader ? knightsById[partyLeader.knightUID] : undefined;
  const partyLeaderChapter = partyLeaderKnight?.sheet.chapter || 1;
  const allKnightChoices = campaign?.expedition?.knightChoices || [];

  // Get completed investigations count for party leader
  const partyLeaderCompletedInvestigations = partyLeaderKnight
    ? countCompletedInvestigations(ensureChapter(partyLeaderKnight.sheet, partyLeaderChapter))
    : 0;

  const monsterStageInfo = selectedKingdomData
    ? resolveExpeditionStagesForBestiary(
        selectedKingdomData,
        partyLeaderChoice,
        partyLeaderChapter,
        allKnightChoices,
        partyLeaderCompletedInvestigations
      )
    : { row: {}, hasChapter: false, stageIndex: 0 };

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

    setShowClueSelection(true);
  };

  const handleSelectClues = (clueSelections: { type: ClueType; count: number }[]) => {
    if (!partyLeader) return;

    const totalClues = clueSelections.reduce((sum, selection) => sum + selection.count, 0);

    // Add each clue
    clueSelections.forEach(selection => {
      for (let i = 0; i < selection.count; i++) {
        const clueId = `clue-${Date.now()}-${Math.random()}`;
        addClue(campaignId, {
          id: clueId,
          type: selection.type,
          discoveredBy: partyLeader.knightUID,
        });
      }
    });

    const clueTypesText = clueSelections
      .map(
        selection => `${selection.count} ${selection.type} clue${selection.count > 1 ? 's' : ''}`
      )
      .join(', ');

    Alert.alert(
      'Clues Discovered',
      `${partyLeader.displayName} has discovered ${totalClues} clue${totalClues > 1 ? 's' : ''}: ${clueTypesText}!`
    );
  };

  const handleAdvanceThreat = () => {
    const currentThreat = delveProgress?.threatTrack.currentPosition || 0;
    const newThreat = currentThreat + 1;
    const isFirstTimeAboveSeven = currentThreat < 7 && newThreat >= 7;

    advanceThreatTrack(campaignId, 1);

    if (isFirstTimeAboveSeven) {
      Alert.alert(
        'Monster Spawn!',
        'Additionally, when you raise your threat to 7 or above for the first time during the current Expedition, spawn an Encounter Monster token onto an adjacent Kingdom tile (after moving all other Encounter Monsters). The Encounter Monster token should correspond to the Encounter Monster of your district, as per the District Wheel.',
        [{ text: 'Got it!', style: 'default' }]
      );
    } else {
      Alert.alert('Threat Increased', 'The threat level has increased!');
    }
  };

  const handleAdvanceTime = () => {
    advanceTimeTrack(campaignId, 1);
    Alert.alert('Time Passed', 'Time has advanced on the kingdom track.');
  };

  const handleThreatTrackPress = (segmentNumber: number) => {
    const currentThreat = delveProgress?.threatTrack.currentPosition || 0;
    const isFirstTimeAboveSeven = currentThreat < 7 && segmentNumber >= 7;

    setThreatTrackPosition(campaignId, segmentNumber);

    if (isFirstTimeAboveSeven) {
      Alert.alert(
        'Monster Spawn!',
        'Additionally, when you raise your threat to 7 or above for the first time during the current Expedition, spawn an Encounter Monster token onto an adjacent Kingdom tile (after moving all other Encounter Monsters). The Encounter Monster token should correspond to the Encounter Monster of your district, as per the District Wheel.',
        [{ text: 'Got it!', style: 'default' }]
      );
    }
  };

  const handleTimeTrackPress = (segmentNumber: number) => {
    setTimeTrackPosition(campaignId, segmentNumber);
  };

  const handleCurseTrackerPress = (segmentNumber: number) => {
    setCurseTrackerPosition(campaignId, segmentNumber);
  };

  return (
    <ScrollView>
      <CollapsibleCard
        title={phase === 'second' ? 'Second Delve Phase' : 'Delve Phase'}
        isExpanded={isDelvePhaseExpanded}
        onToggle={() => setIsDelvePhaseExpanded(!isDelvePhaseExpanded)}
      >
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

        {monsterStageInfo.hasChapter && (
          <Text style={{ color: tokens.textPrimary, marginBottom: 12 }}>
            Monster Stage:{' '}
            <Text style={{ fontWeight: 'bold' }}>Stage {monsterStageInfo.stageIndex}</Text>
            {partyLeaderChoice && (
              <Text style={{ color: tokens.textMuted, fontSize: 12 }}>
                {' '}
                (
                {partyLeaderChoice.choice === 'quest'
                  ? 'Quest'
                  : partyLeaderChoice.choice === 'investigation'
                    ? 'Investigation'
                    : 'Free Roam'}
                )
              </Text>
            )}
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
            <View style={{ marginLeft: 16, marginBottom: 4 }}>
              {(() => {
                const clueCounts = delveProgress.clues.reduce(
                  (acc, clue) => {
                    acc[clue.type] = (acc[clue.type] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                );

                const clueTypeColors: Record<string, string> = {
                  swords: 'Red',
                  faces: 'Green',
                  eye: 'Blue',
                  book: 'Yellow',
                };

                return Object.entries(clueTypeColors).map(([type, colorName]) => (
                  <Text key={type} style={{ color: tokens.textMuted, fontSize: 12 }}>
                    • {colorName}: {clueCounts[type] || 0}
                  </Text>
                ));
              })()}
            </View>
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
      </CollapsibleCard>

      {/* Kingdom Tracks */}
      {/* District Wheel */}
      {campaign?.expedition?.districtWheel && (
        <CollapsibleCard
          title='District Wheel'
          isExpanded={isDistrictWheelExpanded}
          onToggle={() => setIsDistrictWheelExpanded(!isDistrictWheelExpanded)}
        >
          <DistrictWheel
            districtWheel={campaign.expedition.districtWheel}
            onRotate={() => rotateDistrictWheel(campaignId)}
            onReplaceMonster={(districtId, monsterId) =>
              replaceDistrictMonster(campaignId, districtId, monsterId, partyLeaderKnight)
            }
            campaignExpansions={campaign.settings.expansions}
            currentChapter={partyLeaderChapter}
            partyLeaderChoice={partyLeaderChoice}
            allKnightChoices={allKnightChoices}
            partyLeaderCompletedInvestigations={partyLeaderCompletedInvestigations}
          />
        </CollapsibleCard>
      )}

      {delveProgress && (
        <CollapsibleCard
          title='Kingdom Tracker'
          isExpanded={isKingdomTrackerExpanded}
          onToggle={() => setIsKingdomTrackerExpanded(!isKingdomTrackerExpanded)}
        >
          <View style={{ gap: 16 }}>
            {/* Threat Track */}
            <KingdomTrack
              title='Threat Track'
              icon='skull'
              style='threat'
              currentPosition={delveProgress.threatTrack.currentPosition}
              onSegmentPress={handleThreatTrackPress}
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
                {
                  id: 'threat-9',
                  number: 9,
                  isSpecial: true,
                  isHuntSpace: true,
                  huntSpaceType: 'double',
                  label: '6666',
                },
              ]}
            />

            {/* Time Track */}
            <KingdomTrack
              title='Time Track'
              icon='crown'
              style='time'
              currentPosition={delveProgress.timeTrack.currentPosition}
              onSegmentPress={handleTimeTrackPress}
              showZeroButton={true}
              segments={[
                { id: 'time-1', number: 1 },
                { id: 'time-2', number: 2 },
                { id: 'time-3', number: 3 },
                { id: 'time-4', number: 4 },
                { id: 'time-5', number: 5 },
                { id: 'time-6', number: 6 },
                { id: 'time-7', number: 7 },
                { id: 'time-8', number: 8, isSpecial: true, label: 'EXHIBITION CLASH' },
                { id: 'time-9', number: 9 },
                { id: 'time-10', number: 10 },
                { id: 'time-11', number: 11 },
                { id: 'time-12', number: 12 },
                { id: 'time-13', number: 13 },
                { id: 'time-14', number: 14 },
                { id: 'time-15', number: 15 },
                { id: 'time-16', number: 16, isSpecial: true, label: 'FULL CLASH' },
              ]}
            />

            {/* Curse Tracker */}
            {delveProgress.curseTracker && (
              <KingdomTrack
                title='Curse Tracker'
                icon='curse'
                style='curse'
                currentPosition={delveProgress.curseTracker.currentPosition}
                onSegmentPress={handleCurseTrackerPress}
                segments={[
                  { id: 'curse-0', number: 0 },
                  { id: 'curse-1', number: 1 },
                  { id: 'curse-2', number: 2 },
                  { id: 'curse-3', number: 3 },
                  { id: 'curse-4', number: 4 },
                ]}
              />
            )}
          </View>
        </CollapsibleCard>
      )}

      <Card style={{ marginBottom: 16 }}>
        <View style={{ marginTop: 16, gap: 8 }}>
          <Button label='Explore Location' onPress={handleExploreLocation} />
          <Button label='Collect Clue' onPress={handleCollectClue} />
          <Button label='Advance Threat Track' onPress={handleAdvanceThreat} />
          <Button label='Advance Time Track' onPress={handleAdvanceTime} />
          <Button label='Advance Curse Tracker' onPress={() => advanceCurseTracker(campaignId)} />
        </View>
      </Card>

      <Button
        label={phase === 'second' ? 'Begin Second Clash Phase' : 'Begin Clash Phase'}
        onPress={() =>
          setExpeditionPhase(campaignId, phase === 'second' ? 'second-clash' : 'clash')
        }
        tone='accent'
      />

      <ClueSelectionModal
        visible={showClueSelection}
        onClose={() => setShowClueSelection(false)}
        onSelectClues={handleSelectClues}
      />
    </ScrollView>
  );
}
