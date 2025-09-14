import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import Button from '@/components/Button';
import { calculateExpeditionMonsterStage } from '@/features/kingdoms/utils';
import type { CampaignSettings, KnightExpeditionChoice } from '@/models/campaign';
import type { DistrictWheel as DistrictWheelType } from '@/models/district';
import { getDistrictsWithMonsters } from '@/models/district';
import { getBestiaryWithExpansions, type KingdomMonster } from '@/models/kingdom';
import { selectMonsterName, useMonsters } from '@/store/monsters';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import MonsterSelectionModal from './MonsterSelectionModal';

interface DistrictWheelProps {
  districtWheel: DistrictWheelType;
  onRotate: () => void;
  onReplaceMonster: (districtId: string, monsterId: string) => void;
  campaignExpansions?: CampaignSettings['expansions'];
  currentChapter: number;
  partyLeaderChoice?: KnightExpeditionChoice;
  allKnightChoices: KnightExpeditionChoice[];
  partyLeaderCompletedInvestigations: number;
}

export default function DistrictWheel({
  districtWheel,
  onRotate,
  onReplaceMonster,
  campaignExpansions,
  currentChapter,
  partyLeaderChoice,
  allKnightChoices,
  partyLeaderCompletedInvestigations,
}: DistrictWheelProps) {
  const { tokens } = useThemeTokens();
  const monstersState = useMonsters();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [showMonsterModal, setShowMonsterModal] = useState(false);

  const districtsWithMonsters = getDistrictsWithMonsters(districtWheel);

  // Get available monsters for the kingdom
  const kingdomCatalog = allKingdomsCatalog.find(k => k.id === districtWheel.kingdomId);
  const bestiary = kingdomCatalog
    ? getBestiaryWithExpansions(kingdomCatalog, campaignExpansions)
    : { monsters: [], stages: [] };

  // Calculate the correct stage index based on expedition choices
  const stageIndex = calculateExpeditionMonsterStage(
    partyLeaderChoice,
    currentChapter,
    allKnightChoices,
    partyLeaderCompletedInvestigations
  );

  // Filter to monsters that have valid stage values for the current stage
  // Both kingdom and wandering monsters can be used in the district wheel
  const availableMonsters = bestiary.monsters.filter((m: KingdomMonster) => {
    // Check if the stage index is within bounds
    if (stageIndex < 0 || stageIndex >= bestiary.stages.length) {
      return false;
    }

    // Check if this monster has a valid (non-null) stage value for the current stage
    const stageValue = bestiary.stages[stageIndex]?.[m.id];
    return stageValue !== null && stageValue !== undefined;
  });

  const handleChangeMonster = (districtId: string) => {
    setSelectedDistrictId(districtId);
    setShowMonsterModal(true);
  };

  const handleFightMonster = (districtId: string) => {
    const district = districtsWithMonsters.find(d => d.district.id === districtId);
    if (district?.assignment?.monsterId) {
      // Navigate to monster fight screen with monster ID and level
      const monsterLevel = bestiary.stages[stageIndex]?.[district.assignment.monsterId] || 1;
      router.push({
        pathname: '/monster/fight',
        params: {
          monsterId: district.assignment.monsterId,
          level: monsterLevel.toString(),
        },
      });
    }
  };

  const handleMonsterSelect = (monsterId: string) => {
    if (selectedDistrictId) {
      onReplaceMonster(selectedDistrictId, monsterId);
    }
    setShowMonsterModal(false);
    setSelectedDistrictId(null);
  };

  return (
    <View>
      <View style={{ gap: 12 }}>
        {districtsWithMonsters.map(({ district, assignment }) => (
          <View
            key={district.id}
            style={{
              padding: 12,
              backgroundColor: tokens.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: tokens.textMuted + '20',
            }}
          >
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: tokens.textPrimary }}>
                {district.name}
              </Text>
              {assignment && (
                <Text style={{ fontSize: 14, color: tokens.textMuted, marginTop: 4 }}>
                  {selectMonsterName(assignment.monsterId)(monstersState)} (Level{' '}
                  {bestiary.stages[stageIndex]?.[assignment.monsterId] || 'Unknown'})
                </Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button
                label='Change'
                onPress={() => handleChangeMonster(district.id)}
                tone='default'
              />
              {assignment && (
                <Button
                  label='Fight'
                  onPress={() => handleFightMonster(district.id)}
                  tone='accent'
                />
              )}
            </View>
          </View>
        ))}

        <View style={{ marginTop: 8 }}>
          <Button label='Rotate Districts' onPress={onRotate} tone='accent' />
        </View>

        <Text style={{ fontSize: 12, color: tokens.textMuted, textAlign: 'center', marginTop: 8 }}>
          Rotations: {districtWheel.currentRotation}
        </Text>
      </View>

      <MonsterSelectionModal
        visible={showMonsterModal}
        onClose={() => {
          setShowMonsterModal(false);
          setSelectedDistrictId(null);
        }}
        onSelectMonster={handleMonsterSelect}
        districtWheel={districtWheel}
        availableMonsters={availableMonsters}
        currentMonsterId={
          selectedDistrictId
            ? districtsWithMonsters.find(d => d.district.id === selectedDistrictId)?.assignment
                ?.monsterId
            : undefined
        }
        partyLeaderChoice={partyLeaderChoice}
        currentChapter={currentChapter}
        allKnightChoices={allKnightChoices}
        partyLeaderCompletedInvestigations={partyLeaderCompletedInvestigations}
        campaignExpansions={campaignExpansions}
      />
    </View>
  );
}
