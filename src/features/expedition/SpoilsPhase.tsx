import { allKingdomsCatalog } from '@/catalogs/kingdoms';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { progressKey, resolveExpeditionStagesForBestiary } from '@/features/kingdoms/utils';
import { countCompletedInvestigations, ensureChapter } from '@/models/knight';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Alert, StyleSheet, Text, View } from 'react-native';

interface SpoilsPhaseProps {
  campaignId: string;
}

export default function SpoilsPhase({ campaignId }: SpoilsPhaseProps) {
  const { tokens } = useThemeTokens();
  const {
    campaigns,
    addLootCard,
    exchangeLootForGold,
    exchangeLootForGear,
    completeQuest,
    endExpedition,
  } = useCampaigns();
  const { knightsById, updateKnightSheet, advanceChapter } = useKnights();

  const campaign = campaigns[campaignId];
  const expedition = campaign?.expedition;
  const spoilsProgress = expedition?.spoilsProgress;
  const knightChoices = expedition?.knightChoices || [];

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

  // Helper function to get monster stage for expedition
  const getMonsterStageInfo = (knightUID: string): string => {
    if (!campaign?.selectedKingdomId) return '';

    const selectedKingdomData = allKingdomsCatalog.find(k => k.id === campaign.selectedKingdomId);
    if (!selectedKingdomData) return '';

    const partyLeaderChoice = campaign?.expedition?.knightChoices.find(
      choice => choice.knightUID === knightUID
    );
    const knight = knightsById[knightUID];
    const knightChapter = knight?.sheet.chapter || 1;
    const allKnightChoices = campaign?.expedition?.knightChoices || [];

    // Get completed investigations count for this knight
    const completedInvestigations = knight
      ? countCompletedInvestigations(ensureChapter(knight.sheet, knightChapter))
      : 0;

    const monsterStageInfo = resolveExpeditionStagesForBestiary(
      selectedKingdomData,
      partyLeaderChoice,
      knightChapter,
      allKnightChoices,
      completedInvestigations
    );

    if (monsterStageInfo.hasChapter) {
      return ` (Monster Stage ${monsterStageInfo.stageIndex})`;
    }
    return '';
  };

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
    spoilsInfo: {
      backgroundColor: tokens.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    spoilsDescription: {
      fontSize: 14,
      color: tokens.textMuted,
      marginBottom: 8,
    },
    lootTypesList: {
      gap: 8,
    },
    lootTypeItem: {
      backgroundColor: tokens.card,
      padding: 8,
      borderRadius: 6,
    },
    lootTypeTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.textPrimary,
    },
    lootTypeDescription: {
      fontSize: 12,
      color: tokens.textMuted,
      marginTop: 2,
    },
    summarySection: {
      gap: 12,
    },
    summaryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: tokens.card,
      padding: 8,
      borderRadius: 6,
    },
    summaryLabel: {
      fontSize: 14,
      color: tokens.textPrimary,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.accent,
    },
    lootDeckSection: {
      gap: 12,
    },
    lootCardItem: {
      backgroundColor: tokens.card,
      padding: 12,
      borderRadius: 8,
    },
    lootCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    lootCardType: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.textPrimary,
      textTransform: 'capitalize',
    },
    lootCardStatus: {
      fontSize: 12,
      color: tokens.textMuted,
    },
    lootCardDetails: {
      fontSize: 12,
      color: tokens.textMuted,
      marginBottom: 8,
    },
    lootCardActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
    },
    questSection: {
      gap: 12,
    },
    questItem: {
      backgroundColor: tokens.card,
      padding: 12,
      borderRadius: 8,
    },
    questHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    questKnight: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.textPrimary,
    },
    questChoice: {
      fontSize: 12,
      color: tokens.textMuted,
      textTransform: 'capitalize',
    },
    questStatus: {
      fontSize: 12,
      fontWeight: '600',
      color: tokens.success,
      textTransform: 'capitalize',
    },
    questStatusFailed: {
      color: tokens.danger,
    },
    questStatusInProgress: {
      color: tokens.warning,
    },
    questDetails: {
      fontSize: 12,
      color: tokens.textMuted,
      marginTop: 4,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 8,
    },
    buttonHalf: {
      flex: 1,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
    },
  });

  if (!expedition) {
    return (
      <Card>
        <Text style={[styles.errorText, { color: tokens.textMuted }]}>No expedition found</Text>
      </Card>
    );
  }

  const handleAddLootCard = (
    type: 'kingdom-gear' | 'upgrade' | 'consumable-gear' | 'exhibition-clash' | 'full-clash'
  ) => {
    Alert.prompt('Add Loot Card', 'Enter source of the loot card:', source => {
      if (source && source.trim()) {
        Alert.prompt('Obtained By', 'Enter knight UID who obtained this loot:', obtainedBy => {
          if (obtainedBy && obtainedBy.trim()) {
            addLootCard(campaignId, type, source.trim(), obtainedBy.trim());
          }
        });
      }
    });
  };

  const handleExchangeLootForGold = (lootCardId: string) => {
    Alert.prompt('Exchange for Gold', 'Enter gold amount:', amountText => {
      const amount = parseInt(amountText) || 0;
      if (amount > 0) {
        exchangeLootForGold(campaignId, lootCardId, amount);
      }
    });
  };

  const handleExchangeLootForGear = (lootCardId: string) => {
    Alert.prompt('Exchange for Gear', 'Enter gear card ID:', gearCardId => {
      if (gearCardId && gearCardId.trim()) {
        exchangeLootForGear(campaignId, lootCardId, gearCardId.trim());
      }
    });
  };

  const updateKnightData = (
    knightUID: string,
    choice: { choice: string; investigationId?: string },
    status: 'success' | 'failure'
  ) => {
    const knight = knightsById[knightUID];
    if (!knight) return;

    const currentChapter = knight.sheet.chapter;
    const chapterProgress = knight.sheet.chapters[currentChapter];

    if (!chapterProgress) return;

    let updatedChapterProgress = { ...chapterProgress };

    if (choice.choice === 'quest') {
      // Update quest completion
      updatedChapterProgress = {
        ...updatedChapterProgress,
        quest: {
          completed: status === 'success',
          outcome: status === 'success' ? 'pass' : 'fail',
        },
      };
    } else if (choice.choice === 'investigation' && choice.investigationId) {
      // Update investigation completion
      const investigationCode = choice.investigationId;
      const existingAttempt = updatedChapterProgress.attempts.find(
        attempt => attempt.code === investigationCode
      );

      if (!existingAttempt) {
        // Add new attempt
        updatedChapterProgress = {
          ...updatedChapterProgress,
          attempts: [
            ...updatedChapterProgress.attempts,
            {
              code: investigationCode,
              result: status === 'success' ? 'pass' : 'fail',
              at: Date.now(),
            },
          ],
        };
      }

      // Update completed list if successful
      if (status === 'success' && !updatedChapterProgress.completed.includes(investigationCode)) {
        updatedChapterProgress = {
          ...updatedChapterProgress,
          completed: [...updatedChapterProgress.completed, investigationCode],
        };
      }
    }

    // Update the knight's sheet
    updateKnightSheet(knightUID, {
      chapters: {
        ...knight.sheet.chapters,
        [currentChapter]: updatedChapterProgress,
      },
    });

    // Check for chapter advancement after any successful completion
    if (status === 'success') {
      const advanceResult = advanceChapter(knightUID);
      if (advanceResult.ok) {
        Alert.alert(
          'Chapter Advanced!',
          `${knight.name} has completed their quest and all required investigations. They have advanced to Chapter ${knight.sheet.chapter + 1}!`
        );
      }
    }
  };

  const handleCompleteQuest = (knightUID: string, choice: { choice: string }) => {
    const choiceType =
      choice.choice === 'quest'
        ? 'Quest'
        : choice.choice === 'investigation'
          ? 'Investigation'
          : 'Free Roam';
    Alert.alert(`Complete ${choiceType}`, `Mark ${choice.choice} as successful or failed?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Success',
        onPress: () => {
          Alert.prompt(
            'Success Details',
            `Enter details about how the ${choice.choice} was completed:`,
            details => {
              const finalDetails =
                details && details.trim() ? details.trim() : 'Completed successfully';
              completeQuest(campaignId, knightUID, 'success', finalDetails);
              updateKnightData(knightUID, choice, 'success');
            }
          );
        },
      },
      {
        text: 'Failure',
        onPress: () => {
          Alert.prompt(
            'Failure Details',
            `Enter details about why the ${choice.choice} failed:`,
            details => {
              const finalDetails = details && details.trim() ? details.trim() : 'Failed';
              completeQuest(campaignId, knightUID, 'failure', finalDetails);
              updateKnightData(knightUID, choice, 'failure');
            }
          );
        },
      },
    ]);
  };

  const handleEndExpedition = () => {
    Alert.alert(
      'End Expedition',
      'Are you sure you want to end this expedition? All expedition data will be reset and you can start a new one.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Expedition',
          style: 'destructive',
          onPress: () => {
            endExpedition(campaignId);
          },
        },
      ]
    );
  };

  const lootTypes = [
    {
      type: 'kingdom-gear' as const,
      title: 'Kingdom Gear Loot',
      description: 'Can be exchanged for a Gear card from the Kingdom where obtained',
    },
    {
      type: 'upgrade' as const,
      title: 'Upgrade Loot',
      description: 'Can be exchanged for a Gear Upgrade card to strengthen current Gear',
    },
    {
      type: 'consumable-gear' as const,
      title: 'Consumable Gear Loot',
      description: 'Can be exchanged for special Gear that moves to Merchant deck after expedition',
    },
    {
      type: 'exhibition-clash' as const,
      title: 'Exhibition Clash Loot',
      description: 'Can be exchanged for a Gear card from a Monster defeated in Exhibition Clash',
    },
    {
      type: 'full-clash' as const,
      title: 'Full Clash Loot',
      description: 'Can be exchanged for a Gear card from a Monster defeated in Full Clash',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.phaseTitle}>Spoils Phase</Text>

      <Text style={styles.phaseDescription}>
        Divide the loot and complete quests. Exchange Loot cards for Gold or Gear.
      </Text>

      <Card>
        <View style={styles.spoilsInfo}>
          <Text style={styles.spoilsDescription}>
            After an Expedition, Knights return to an Outpost to recover and divide loot. During the
            game, effects add cards to the Loot deck. At the end, during Loot Distribution, you can
            exchange your Loot cards for either Gold or specific Gear cards.
          </Text>
        </View>

        <View style={styles.lootTypesList}>
          <Text style={styles.sectionTitle}>Loot Card Types</Text>
          {lootTypes.map(lootType => (
            <View key={lootType.type} style={styles.lootTypeItem}>
              <Text style={styles.lootTypeTitle}>{lootType.title}</Text>
              <Text style={styles.lootTypeDescription}>{lootType.description}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Spoils Summary</Text>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Loot Cards</Text>
            <Text style={styles.summaryValue}>{spoilsProgress?.lootDeck.length || 0}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Gold Earned</Text>
            <Text style={styles.summaryValue}>{spoilsProgress?.goldEarned || 0}</Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Gear Acquired</Text>
            <Text style={styles.summaryValue}>{spoilsProgress?.gearAcquired.length || 0}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.lootDeckSection}>
          <Text style={styles.sectionTitle}>Loot Deck</Text>

          {spoilsProgress?.lootDeck.map(loot => (
            <View key={loot.id} style={styles.lootCardItem}>
              <View style={styles.lootCardHeader}>
                <Text style={styles.lootCardType}>{loot.type.replace('-', ' ')}</Text>
                <Text style={styles.lootCardStatus}>
                  {loot.exchangedFor ? `Exchanged for ${loot.exchangedFor}` : 'Available'}
                </Text>
              </View>
              <Text style={styles.lootCardDetails}>
                Source: {loot.source} | Obtained by: {loot.obtainedBy}
              </Text>
              {!loot.exchangedFor && (
                <View style={styles.lootCardActions}>
                  <Button
                    label='Exchange for Gold'
                    onPress={() => handleExchangeLootForGold(loot.id)}
                  />
                  <Button
                    label='Exchange for Gear'
                    onPress={() => handleExchangeLootForGear(loot.id)}
                  />
                </View>
              )}
            </View>
          )) || <Text style={styles.errorText}>No loot cards yet</Text>}
        </View>
      </Card>

      <Card>
        <View style={styles.questSection}>
          <Text style={styles.sectionTitle}>Quest Completions</Text>

          {knightChoices.map(choice => (
            <View key={choice.knightUID} style={styles.questItem}>
              <View style={styles.questHeader}>
                <Text style={styles.questKnight}>
                  {campaign.members.find(m => m.knightUID === choice.knightUID)?.displayName ||
                    choice.knightUID}
                </Text>
                <Text
                  style={[
                    styles.questStatus,
                    choice.status === 'failed' && styles.questStatusFailed,
                    choice.status === 'in-progress' && styles.questStatusInProgress,
                  ]}
                >
                  {choice.status === 'completed' ? 'completed' : choice.status}
                </Text>
              </View>
              <Text style={styles.questChoice}>
                {choice.choice === 'quest' &&
                  campaign?.partyLeaderUID === choice.knightUID &&
                  `Quest (${getQuestLevel(choice.knightUID)})${getMonsterStageInfo(choice.knightUID)}`}
                {choice.choice === 'quest' &&
                  campaign?.partyLeaderUID !== choice.knightUID &&
                  `Quest (${getQuestLevel(choice.knightUID)})`}
                {choice.choice === 'investigation' &&
                  choice.investigationId &&
                  campaign?.partyLeaderUID === choice.knightUID &&
                  `Investigation ${choice.investigationId}${getMonsterStageInfo(choice.knightUID)}`}
                {choice.choice === 'investigation' &&
                  choice.investigationId &&
                  campaign?.partyLeaderUID !== choice.knightUID &&
                  `Investigation ${choice.investigationId}`}
                {choice.choice === 'investigation' &&
                  !choice.investigationId &&
                  campaign?.partyLeaderUID === choice.knightUID &&
                  `Investigation (not selected)${getMonsterStageInfo(choice.knightUID)}`}
                {choice.choice === 'investigation' &&
                  !choice.investigationId &&
                  campaign?.partyLeaderUID !== choice.knightUID &&
                  `Investigation (not selected)`}
                {choice.choice === 'free-roam' &&
                  campaign?.partyLeaderUID === choice.knightUID &&
                  `Free Roam${getMonsterStageInfo(choice.knightUID)}`}
                {choice.choice === 'free-roam' &&
                  campaign?.partyLeaderUID !== choice.knightUID &&
                  `Free Roam`}
              </Text>
              {choice.successDetails && (
                <Text style={styles.questDetails}>Success: {choice.successDetails}</Text>
              )}
              {choice.failureDetails && (
                <Text style={styles.questDetails}>Failure: {choice.failureDetails}</Text>
              )}
              {choice.status === 'in-progress' ? (
                <Button
                  label={`Complete ${choice.choice === 'quest' ? 'Quest' : choice.choice === 'investigation' ? 'Investigation' : 'Free Roam'}`}
                  onPress={() => handleCompleteQuest(choice.knightUID, choice)}
                />
              ) : (
                <Button
                  label={choice.status === 'completed' ? 'Completed ✓' : 'Failed ✗'}
                  onPress={() => handleCompleteQuest(choice.knightUID, choice)}
                  tone={choice.status === 'completed' ? 'success' : 'danger'}
                />
              )}
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.buttonRow}>
          {lootTypes.map(lootType => (
            <Button
              key={lootType.type}
              label={`Add ${lootType.title.split(' ')[0]}`}
              onPress={() => handleAddLootCard(lootType.type)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <Button label='End Expedition' onPress={handleEndExpedition} tone='danger' />
      </Card>
    </View>
  );
}
