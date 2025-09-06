import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface RestPhaseProps {
  campaignId: string;
}

export default function RestPhase({ campaignId }: RestPhaseProps) {
  const { tokens } = useThemeTokens();
  const {
    campaigns,
    useRestAbility,
    discardResourceTokens,
    performMonsterRotation,
    resolveCampfireTale,
    setExpeditionPhase,
  } = useCampaigns();

  const campaign = campaigns[campaignId];
  const expedition = campaign?.expedition;
  const restProgress = expedition?.restProgress;

  const [resourceTokensToDiscard, setResourceTokensToDiscard] = useState(0);

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
    restInfo: {
      backgroundColor: tokens.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    restDescription: {
      fontSize: 14,
      color: tokens.textMuted,
      marginBottom: 8,
    },
    stepList: {
      gap: 8,
    },
    stepItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    stepNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.accent,
      minWidth: 20,
    },
    stepText: {
      flex: 1,
      fontSize: 14,
      color: tokens.textPrimary,
    },
    completedStep: {
      opacity: 0.6,
    },
    completedText: {
      textDecorationLine: 'line-through',
    },
    formSection: {
      gap: 12,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    inputLabel: {
      fontSize: 16,
      color: tokens.textPrimary,
      minWidth: 120,
    },
    inputButton: {
      flex: 1,
    },
    counterDisplay: {
      fontSize: 18,
      fontWeight: '600',
      color: tokens.textPrimary,
      minWidth: 40,
      textAlign: 'center',
    },
    abilitiesList: {
      gap: 8,
    },
    abilityItem: {
      backgroundColor: tokens.card,
      padding: 8,
      borderRadius: 6,
    },
    abilityText: {
      fontSize: 14,
      color: tokens.textPrimary,
    },
    campfireTaleInfo: {
      backgroundColor: tokens.card,
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    campfireTaleText: {
      fontSize: 14,
      color: tokens.textMuted,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
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

  const handleUseRestAbility = () => {
    Alert.prompt(
      'Use Rest Ability',
      'Enter the ID or name of the Technique card with Rest keyword:',
      text => {
        if (text && text.trim()) {
          // Call the action directly since it's a Zustand action, not a React hook
          useCampaigns.getState().useRestAbility(campaignId, text.trim());
        }
      }
    );
  };

  const handleDiscardResourceTokens = () => {
    if (resourceTokensToDiscard > 0) {
      discardResourceTokens(campaignId, resourceTokensToDiscard);
      setResourceTokensToDiscard(0);
    }
  };

  const handlePerformMonsterRotation = () => {
    Alert.alert('Perform Monster Rotation', 'Perform Rotation 2 as specified in the rules?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Perform Rotation',
        onPress: () => performMonsterRotation(campaignId),
      },
    ]);
  };

  const handleResolveCampfireTale = () => {
    Alert.prompt('Resolve Campfire Tale', 'Enter the tale ID from the Kingdom Codex:', taleId => {
      if (taleId && taleId.trim()) {
        Alert.prompt(
          'Rapport Bonus',
          'Enter the highest Rapport between any two Knights in your party:',
          rapportText => {
            const rapportBonus = parseInt(rapportText) || 0;
            Alert.prompt('Tale Result', 'Enter the result of the Campfire Tale:', result => {
              if (result && result.trim()) {
                resolveCampfireTale(campaignId, taleId.trim(), rapportBonus, result.trim());
              }
            });
          }
        );
      }
    });
  };

  const handleBeginSecondDelve = () => {
    Alert.alert(
      'Begin Second Delve Phase',
      'Continue exploring the Kingdom map for the second half of the expedition?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Begin Second Delve',
          onPress: () => setExpeditionPhase(campaignId, 'second-delve'),
        },
      ]
    );
  };

  const restSteps = [
    { id: 'rest-abilities', text: 'Knights may play Technique cards with the Rest keyword' },
    { id: 'resource-tokens', text: 'Discard all Resource tokens' },
    { id: 'monster-rotation', text: 'Perform Rotation 2' },
    { id: 'campfire-tales', text: 'You may resolve a Campfire Tale' },
  ];

  const isStepCompleted = (stepId: string) => {
    switch (stepId) {
      case 'rest-abilities':
        return (restProgress?.restAbilitiesUsed.length || 0) > 0;
      case 'resource-tokens':
        return (restProgress?.resourceTokensDiscarded || 0) > 0;
      case 'monster-rotation':
        return restProgress?.monsterRotationPerformed || false;
      case 'campfire-tales':
        return !!restProgress?.campfireTaleResolved;
      default:
        return false;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phaseTitle}>Rest Phase</Text>

      <Text style={styles.phaseDescription}>
        Take a moment&apos;s respite to prepare for the challenges ahead. Resolve the following
        steps:
      </Text>

      <Card>
        <View style={styles.restInfo}>
          <Text style={styles.restDescription}>
            An Expedition can be a daunting experience for your Knights. By the time you reach the
            midpoint, you will likely have had a few close encounters with monsters, and even an
            Exhibition Clash under your belt.
          </Text>
        </View>

        <View style={styles.stepList}>
          {restSteps.map(step => (
            <View
              key={step.id}
              style={[styles.stepItem, isStepCompleted(step.id) && styles.completedStep]}
            >
              <Text style={styles.stepNumber}>{restSteps.indexOf(step) + 1}.</Text>
              <Text style={[styles.stepText, isStepCompleted(step.id) && styles.completedText]}>
                {step.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Rest Actions</Text>

          <Button
            label='Use Rest Ability'
            onPress={handleUseRestAbility}
            style={{ marginBottom: 8 }}
          />

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Resource Tokens:</Text>
            <Button
              label='-'
              onPress={() => setResourceTokensToDiscard(Math.max(0, resourceTokensToDiscard - 1))}
              style={styles.inputButton}
            />
            <Text style={styles.counterDisplay}>{resourceTokensToDiscard}</Text>
            <Button
              label='+'
              onPress={() => setResourceTokensToDiscard(resourceTokensToDiscard + 1)}
              style={styles.inputButton}
            />
            <Button
              label='Discard'
              onPress={handleDiscardResourceTokens}
              disabled={resourceTokensToDiscard === 0}
              style={styles.inputButton}
            />
          </View>

          <Button
            label='Perform Monster Rotation'
            onPress={handlePerformMonsterRotation}
            style={{ marginBottom: 8 }}
          />

          <Button
            label='Resolve Campfire Tale'
            onPress={handleResolveCampfireTale}
            style={{ marginBottom: 16 }}
          />
        </View>
      </Card>

      {restProgress && (
        <Card>
          <Text style={styles.sectionTitle}>Rest Progress</Text>

          {restProgress.restAbilitiesUsed.length > 0 && (
            <View style={styles.abilitiesList}>
              <Text style={styles.sectionTitle}>Rest Abilities Used:</Text>
              {restProgress.restAbilitiesUsed.map((ability, index) => (
                <View key={index} style={styles.abilityItem}>
                  <Text style={styles.abilityText}>{ability}</Text>
                </View>
              ))}
            </View>
          )}

          {restProgress.resourceTokensDiscarded > 0 && (
            <Text style={styles.abilityText}>
              Resource tokens discarded: {restProgress.resourceTokensDiscarded}
            </Text>
          )}

          {restProgress.monsterRotationPerformed && (
            <Text style={styles.abilityText}>Monster Rotation 2 performed ✓</Text>
          )}

          {restProgress.campfireTaleResolved && (
            <View style={styles.campfireTaleInfo}>
              <Text style={styles.sectionTitle}>Campfire Tale Resolved</Text>
              <Text style={styles.campfireTaleText}>
                Tale ID: {restProgress.campfireTaleResolved.taleId}
              </Text>
              <Text style={styles.campfireTaleText}>
                Rapport Bonus: +{restProgress.campfireTaleResolved.rapportBonus}
              </Text>
              <Text style={styles.campfireTaleText}>
                Result: {restProgress.campfireTaleResolved.result}
              </Text>
            </View>
          )}
        </Card>
      )}

      <Card>
        <Button label='Begin Second Delve Phase' onPress={handleBeginSecondDelve} tone='accent' />
      </Card>
    </View>
  );
}
