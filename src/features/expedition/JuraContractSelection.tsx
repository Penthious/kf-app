import { JURA_CONTRACTS, JuraContractDef } from '@/catalogs/contracts/jura-contracts';
import Pill from '@/components/ui/Pill';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface JuraContractSelectionProps {
  campaignId: string;
}

export default function JuraContractSelection({ campaignId }: JuraContractSelectionProps) {
  const { tokens } = useThemeTokens();
  const { campaigns, selectContract, clearSelectedContract } = useCampaigns();
  const { knightsById } = useKnights();
  const [expanded, setExpanded] = useState(false);

  const campaign = campaigns[campaignId];
  const partyLeader = campaign?.partyLeaderUID ? knightsById[campaign.partyLeaderUID] : undefined;

  if (!partyLeader) {
    return null;
  }

  // Get unlocked contracts based on campaign progress
  const unlockedContractNames = campaign?.settings?.juraContracts?.unlockedContracts || [
    'Fragments of the Past',
  ];

  // Filter contracts to only show unlocked ones
  const availableContracts = JURA_CONTRACTS.filter(contract =>
    unlockedContractNames.includes(contract.name)
  );

  // Show locked contracts for context (but not selectable)
  const lockedContracts = JURA_CONTRACTS.filter(
    contract => !unlockedContractNames.includes(contract.name)
  );

  const selectedContract = campaign.selectedContract;

  const generateContractId = (contractName: string) => {
    return `jura:${contractName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}`;
  };

  const isSelected = (contractName: string) => {
    const contractId = generateContractId(contractName);
    return selectedContract?.kingdomId === 'jura' && selectedContract?.contractId === contractId;
  };

  const handleContractSelect = (contractName: string) => {
    const contractId = generateContractId(contractName);

    if (isSelected(contractName)) {
      clearSelectedContract(campaignId);
    } else {
      selectContract(campaignId, 'jura', contractId);
    }
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <View
      style={{
        backgroundColor: tokens.card,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: tokens.surface,
      }}
    >
      <TouchableOpacity
        onPress={toggleExpansion}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: expanded ? 12 : 0,
        }}
      >
        <Text style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 18 }}>
          Jura Contracts
        </Text>
        <Text style={{ color: tokens.textMuted, fontSize: 16 }}>{expanded ? '−' : '+'}</Text>
      </TouchableOpacity>

      <Text style={{ color: tokens.textMuted, marginBottom: 12 }}>
        Special contracts from the TTSF expansion. Available contracts are unlocked through gameplay
        progression.
      </Text>

      {expanded && (
        <ScrollView style={{ maxHeight: 400 }}>
          <View style={{ gap: 12 }}>
            {/* Available Contracts */}
            {availableContracts.length > 0 && (
              <View>
                <Text style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 8 }}>
                  Available Contracts
                </Text>
                {availableContracts.map((contract: JuraContractDef) => (
                  <TouchableOpacity
                    key={contract.name}
                    onPress={() => handleContractSelect(contract.name)}
                    style={{
                      padding: 12,
                      borderRadius: 6,
                      borderWidth: 2,
                      borderColor: isSelected(contract.name) ? tokens.accent : tokens.surface,
                      backgroundColor: isSelected(contract.name) ? tokens.surface : tokens.card,
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{ fontSize: 16, fontWeight: '600', color: tokens.textPrimary }}
                        >
                          {contract.name}
                        </Text>
                        <Text style={{ fontSize: 14, color: tokens.textPrimary, marginTop: 4 }}>
                          {contract.objective}
                        </Text>
                        <Text style={{ fontSize: 12, color: tokens.textMuted, marginTop: 4 }}>
                          Reward: {contract.reward}
                        </Text>
                      </View>
                      <Pill
                        label={isSelected(contract.name) ? 'Selected' : 'Select'}
                        selected={isSelected(contract.name)}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Locked Contracts */}
            {lockedContracts.length > 0 && (
              <View>
                <Text style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 8 }}>
                  Locked Contracts
                </Text>
                {lockedContracts.map((contract: JuraContractDef) => (
                  <View
                    key={contract.name}
                    style={{
                      padding: 12,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: tokens.surface,
                      backgroundColor: tokens.card,
                      opacity: 0.6,
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{ fontSize: 16, fontWeight: '600', color: tokens.textPrimary }}
                        >
                          {contract.name}
                        </Text>
                        <Text style={{ fontSize: 14, color: tokens.textMuted, marginTop: 4 }}>
                          ???
                        </Text>
                        <Text style={{ fontSize: 12, color: tokens.textMuted, marginTop: 4 }}>
                          Locked - Complete other contracts to unlock
                        </Text>
                      </View>
                      <Pill label='Locked' selected={false} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {availableContracts.length === 0 && lockedContracts.length === 0 && (
              <Text style={{ color: tokens.textMuted, textAlign: 'center', fontStyle: 'italic' }}>
                No Jura contracts available
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
