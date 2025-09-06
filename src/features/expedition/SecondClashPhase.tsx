import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface SecondClashPhaseProps {
  campaignId: string;
}

export default function SecondClashPhase({ campaignId }: SecondClashPhaseProps) {
  const { tokens } = useThemeTokens();
  const { campaigns, completeClash, setExpeditionPhase } = useCampaigns();

  const campaign = campaigns[campaignId];
  const expedition = campaign?.expedition;
  const clashResults = expedition?.clashResults || [];

  const [woundsDealt, setWoundsDealt] = useState(0);
  const [woundsReceived, setWoundsReceived] = useState(0);
  const [specialEffects, setSpecialEffects] = useState<string[]>([]);

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
    clashInfo: {
      backgroundColor: tokens.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    clashType: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.textPrimary,
      textTransform: 'capitalize',
    },
    clashDescription: {
      fontSize: 14,
      color: tokens.textMuted,
      marginTop: 4,
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
      minWidth: 100,
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
    specialEffectsList: {
      gap: 8,
    },
    specialEffectItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: tokens.card,
      padding: 8,
      borderRadius: 6,
    },
    specialEffectText: {
      flex: 1,
      fontSize: 14,
      color: tokens.textPrimary,
    },
    removeButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    removeButtonText: {
      color: tokens.danger,
      fontSize: 12,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
    },
    buttonHalf: {
      flex: 1,
    },
    resultsSection: {
      gap: 12,
    },
    resultItem: {
      backgroundColor: tokens.card,
      padding: 12,
      borderRadius: 8,
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    resultType: {
      fontSize: 16,
      fontWeight: '600',
      color: tokens.textPrimary,
      textTransform: 'capitalize',
    },
    resultOutcome: {
      fontSize: 14,
      fontWeight: '600',
      color: tokens.success,
      textTransform: 'capitalize',
    },
    resultOutcomeDefeat: {
      color: tokens.danger,
    },
    resultDetails: {
      fontSize: 14,
      color: tokens.textMuted,
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

  const handleCompleteClash = (outcome: 'victory' | 'defeat') => {
    Alert.alert(
      'Complete Full Clash',
      `Mark the final clash as ${outcome}? This will end the expedition.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Mark as ${outcome}`,
          onPress: () => {
            completeClash(
              campaignId,
              outcome,
              woundsDealt,
              woundsReceived,
              specialEffects.length > 0 ? specialEffects : undefined
            );
            // Reset form
            setWoundsDealt(0);
            setWoundsReceived(0);
            setSpecialEffects([]);
          },
        },
      ]
    );
  };

  const addSpecialEffect = () => {
    Alert.prompt('Add Special Effect', 'Enter a special effect from the clash:', text => {
      if (text && text.trim()) {
        setSpecialEffects(prev => [...prev, text.trim()]);
      }
    });
  };

  const removeSpecialEffect = (index: number) => {
    setSpecialEffects(prev => prev.filter((_, i) => i !== index));
  };

  const handleBeginSpoils = () => {
    Alert.alert(
      'Begin Spoils Phase',
      'Move to the Spoils Phase to distribute loot and complete quests?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Begin Spoils Phase',
          onPress: () => setExpeditionPhase(campaignId, 'spoils'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phaseTitle}>Full Clash</Text>

      <Text style={styles.phaseDescription}>
        The final decisive battle of the expedition. Fight until either side is defeated.
      </Text>

      <Card>
        <View style={styles.clashInfo}>
          <Text style={styles.clashType}>Full Clash</Text>
          <Text style={styles.clashDescription}>
            Full tactical battle with all mechanics. Last until either side is defeated. No retreat
            is possible - this is the final confrontation.
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Clash Resolution</Text>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Wounds Dealt:</Text>
            <Button
              label='-'
              onPress={() => setWoundsDealt(Math.max(0, woundsDealt - 1))}
              style={styles.inputButton}
            />
            <Text style={styles.counterDisplay}>{woundsDealt}</Text>
            <Button
              label='+'
              onPress={() => setWoundsDealt(woundsDealt + 1)}
              style={styles.inputButton}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Wounds Received:</Text>
            <Button
              label='-'
              onPress={() => setWoundsReceived(Math.max(0, woundsReceived - 1))}
              style={styles.inputButton}
            />
            <Text style={styles.counterDisplay}>{woundsReceived}</Text>
            <Button
              label='+'
              onPress={() => setWoundsReceived(woundsReceived + 1)}
              style={styles.inputButton}
            />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Special Effects</Text>
            <Button
              label='Add Special Effect'
              onPress={addSpecialEffect}
              style={{ marginBottom: 8 }}
            />

            {specialEffects.length > 0 && (
              <View style={styles.specialEffectsList}>
                {specialEffects.map((effect, index) => (
                  <View key={index} style={styles.specialEffectItem}>
                    <Text style={styles.specialEffectText}>{effect}</Text>
                    <Button
                      label='Remove'
                      onPress={() => removeSpecialEffect(index)}
                      style={styles.removeButton}
                      tone='danger'
                    />
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.buttonRow}>
            <Button
              label='Mark Victory'
              onPress={() => handleCompleteClash('victory')}
              tone='success'
              style={styles.buttonHalf}
            />
            <Button
              label='Mark Defeat'
              onPress={() => handleCompleteClash('defeat')}
              tone='danger'
              style={styles.buttonHalf}
            />
          </View>
        </View>
      </Card>

      {clashResults.length > 0 && (
        <Card>
          <Text style={styles.sectionTitle}>All Clash Results</Text>
          <View style={styles.resultsSection}>
            {clashResults.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultType}>{result.type} Clash</Text>
                  <Text
                    style={[
                      styles.resultOutcome,
                      result.outcome === 'defeat' && styles.resultOutcomeDefeat,
                    ]}
                  >
                    {result.outcome}
                  </Text>
                </View>
                <Text style={styles.resultDetails}>
                  Dealt {result.woundsDealt} wounds, received {result.woundsReceived} wounds
                </Text>
                {result.specialEffects && result.specialEffects.length > 0 && (
                  <Text style={styles.resultDetails}>
                    Effects: {result.specialEffects.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </Card>
      )}

      <Card>
        <Button label='Begin Spoils Phase' onPress={handleBeginSpoils} tone='accent' />
      </Card>
    </View>
  );
}
