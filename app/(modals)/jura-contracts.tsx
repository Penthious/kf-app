import { JURA_CONTRACTS, JuraContractDef } from '@/catalogs/contracts/jura-contracts';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Pill from '@/components/ui/Pill';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

export default function JuraContractsScreen() {
  const { tokens } = useThemeTokens();
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const { campaigns, unlockJuraContract, recordJuraContractAttempt } = useCampaigns();
  const [expandedContract, setExpandedContract] = useState<string | null>(null);

  const campaign = campaigns[campaignId];
  if (!campaign) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: tokens.textPrimary }}>Campaign not found</Text>
      </View>
    );
  }

  // Get unlocked contracts based on campaign progress
  const unlockedContractNames = campaign?.settings?.juraContracts?.unlockedContracts || [
    'Fragments of the Past',
  ];

  const isUnlocked = (contractName: string) => {
    return unlockedContractNames.includes(contractName);
  };

  const getAttemptCount = (contractName: string) => {
    return campaign?.settings?.juraContracts?.contractAttempts?.[contractName] || 0;
  };

  const handleUnlockContract = (contractName: string) => {
    Alert.alert(
      'Unlock Contract',
      `Are you sure you want to unlock "${contractName}"? This should only be done when the game event that unlocks this contract has occurred.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlock',
          onPress: () => {
            unlockJuraContract(campaignId, contractName);
            Alert.alert('Success', `"${contractName}" has been unlocked!`);
          },
        },
      ]
    );
  };

  const toggleContractExpansion = (contractName: string) => {
    setExpandedContract(expandedContract === contractName ? null : contractName);
  };

  const handleRecordAttempt = (contractName: string) => {
    Alert.alert('Record Attempt', `Record an attempt for "${contractName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Record',
        onPress: () => {
          recordJuraContractAttempt(campaignId, contractName);
          Alert.alert('Success', `Attempt recorded for "${contractName}"!`);
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Card>
          <Text
            style={{ color: tokens.textPrimary, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}
          >
            Jura Contracts Management
          </Text>
          <Text style={{ color: tokens.textMuted, marginBottom: 16 }}>
            Manage Jura contracts for this campaign. Unlock contracts when the appropriate game
            events occur.
          </Text>

          <View style={{ gap: 12 }}>
            {JURA_CONTRACTS.map((contract: JuraContractDef) => {
              const unlocked = isUnlocked(contract.name);
              const isExpanded = expandedContract === contract.name;
              const attemptCount = getAttemptCount(contract.name);

              return (
                <View
                  key={contract.name}
                  style={{
                    borderWidth: 1,
                    borderColor: unlocked ? tokens.accent : tokens.surface,
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: unlocked ? tokens.surface : tokens.card,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: isExpanded ? 12 : 0,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: tokens.textPrimary, fontSize: 16, fontWeight: '600' }}>
                        {contract.name}
                      </Text>
                      <View
                        style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 }}
                      >
                        <Pill label={unlocked ? 'Unlocked' : 'Locked'} selected={unlocked} />
                        {unlocked && attemptCount > 0 && (
                          <Pill
                            label={`${attemptCount} attempt${attemptCount > 1 ? 's' : ''}`}
                            selected={false}
                          />
                        )}
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      {!unlocked && (
                        <Button
                          label='Unlock'
                          onPress={() => handleUnlockContract(contract.name)}
                          tone='accent'
                        />
                      )}
                      {unlocked && (
                        <Button
                          label='Record Attempt'
                          onPress={() => handleRecordAttempt(contract.name)}
                          tone='success'
                        />
                      )}
                      <Button
                        label={isExpanded ? 'Hide' : 'Details'}
                        onPress={() => toggleContractExpansion(contract.name)}
                        tone='default'
                      />
                    </View>
                  </View>

                  {isExpanded && (
                    <View style={{ gap: 8 }}>
                      <View>
                        <Text
                          style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 4 }}
                        >
                          Objective:
                        </Text>
                        <Text style={{ color: tokens.textMuted }}>{contract.objective}</Text>
                      </View>

                      <View>
                        <Text
                          style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 4 }}
                        >
                          Setup:
                        </Text>
                        <Text style={{ color: tokens.textMuted }}>{contract.setup}</Text>
                      </View>

                      <View>
                        <Text
                          style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 4 }}
                        >
                          Reward:
                        </Text>
                        <Text style={{ color: tokens.textMuted }}>{contract.reward}</Text>
                      </View>

                      <View>
                        <Text
                          style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 4 }}
                        >
                          Single Attempt:
                        </Text>
                        <Text style={{ color: tokens.textMuted }}>
                          {contract.singleAttempt ? 'Yes' : 'No'}
                        </Text>
                      </View>

                      {unlocked && (
                        <View>
                          <Text
                            style={{
                              color: tokens.textPrimary,
                              fontWeight: '600',
                              marginBottom: 4,
                            }}
                          >
                            Attempts:
                          </Text>
                          <Text style={{ color: tokens.textMuted }}>
                            {attemptCount} attempt{attemptCount !== 1 ? 's' : ''}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}
