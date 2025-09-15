import { Tier } from '@/catalogs/tier';
import { JURA_CONTRACTS } from '@/catalogs/contracts/jura-contracts';
import { KingdomContractDef } from '@/models/kingdom';
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
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  const campaign = campaigns[campaignId];
  const partyLeader = campaign?.partyLeaderUID ? knightsById[campaign.partyLeaderUID] : undefined;

  if (!partyLeader) {
    return null;
  }

  // Get unlocked contracts based on campaign progress
  const unlockedContractNames = campaign?.settings?.juraContracts?.unlockedContracts || [
    'Fragments of the Past',
  ];

  // Filter contracts to only show unlocked ones (no tier restriction for Jura contracts)
  const availableContracts = JURA_CONTRACTS.filter(contract =>
    unlockedContractNames.includes(contract.name)
  );

  // Group contracts by tier
  const contractsByTier = availableContracts.reduce(
    (acc, contract) => {
      if (!acc[contract.tier]) {
        acc[contract.tier] = [];
      }
      acc[contract.tier].push(contract);
      return acc;
    },
    {} as Record<Tier, typeof availableContracts>
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

  const toggleTierExpansion = (tier: Tier) => {
    setExpandedTier(expandedTier === tier ? null : tier);
  };

  // Show locked contracts for context (but not selectable)
  const lockedContracts = JURA_CONTRACTS.filter(
    contract => !unlockedContractNames.includes(contract.name)
  );

  const lockedContractsByTier = lockedContracts.reduce(
    (acc, contract) => {
      if (!acc[contract.tier]) {
        acc[contract.tier] = [];
      }
      acc[contract.tier].push(contract);
      return acc;
    },
    {} as Record<Tier, typeof lockedContracts>
  );

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#0006',
        backgroundColor: tokens.surface,
        marginBottom: 20,
      }}
    >
      <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
        Jura Contracts
      </Text>

      <Text style={{ color: tokens.textMuted, marginBottom: 12 }}>
        Special contracts from the TTSF expansion. Available contracts are unlocked through gameplay
        progression.
      </Text>

      <ScrollView style={{ maxHeight: 400 }}>
        {/* Available Contracts */}
        {Array.from(
          new Set([...Object.keys(contractsByTier), ...Object.keys(lockedContractsByTier)])
        ).map(tier => {
          const tierKey = tier as Tier;
          const contracts = contractsByTier[tierKey];
          const lockedContractsForTier = lockedContractsByTier[tierKey] || [];

          if ((!contracts || contracts.length === 0) && lockedContractsForTier.length === 0) {
            return null;
          }

          const isExpanded = expandedTier === tier;

          return (
            <View key={tier} style={{ marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => toggleTierExpansion(tierKey)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 12,
                  backgroundColor: tokens.card,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#0006',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>
                    {tier.toUpperCase()} Contracts
                  </Text>
                  <Pill label={`${contracts?.length || 0}`} selected={false} />
                  {lockedContractsForTier.length > 0 && (
                    <Pill label={`${lockedContractsForTier.length} locked`} selected={false} />
                  )}
                </View>
                <Text style={{ color: tokens.textMuted, fontSize: 18 }}>
                  {isExpanded ? '−' : '+'}
                </Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={{ marginTop: 8, gap: 8 }}>
                  {/* Available Contracts */}
                  {contracts?.map((contract: KingdomContractDef) => (
                    <TouchableOpacity
                      key={contract.name}
                      onPress={() => handleContractSelect(contract.name)}
                      style={{
                        padding: 12,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: isSelected(contract.name) ? tokens.accent : '#0003',
                        backgroundColor: isSelected(contract.name)
                          ? `${tokens.accent}20`
                          : tokens.surface,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text
                            style={{
                              color: tokens.textPrimary,
                              fontWeight: '600',
                              marginBottom: 4,
                            }}
                          >
                            {contract.name}
                          </Text>
                          <Text style={{ color: tokens.textMuted, fontSize: 12 }}>
                            {contract.objective}
                          </Text>
                        </View>
                        <Pill
                          label={isSelected(contract.name) ? 'Selected' : 'Select'}
                          selected={isSelected(contract.name)}
                          onPress={() => handleContractSelect(contract.name)}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}

                  {/* Locked Contracts */}
                  {lockedContractsForTier.map((contract: KingdomContractDef) => (
                    <View
                      key={contract.name}
                      style={{
                        padding: 12,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: '#0002',
                        backgroundColor: tokens.surface,
                        opacity: 0.6,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <View style={{ flex: 1, paddingRight: 12 }}>
                          <Text
                            style={{
                              color: tokens.textMuted,
                              fontWeight: '600',
                              marginBottom: 4,
                            }}
                          >
                            {contract.name}
                          </Text>
                          <Text style={{ color: tokens.textMuted, fontSize: 12 }}>
                            ??? (Locked)
                          </Text>
                        </View>
                        <Pill label='Locked' selected={false} />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {selectedContract && selectedContract.kingdomId === 'jura' && (
        <View
          style={{
            marginTop: 12,
            padding: 12,
            backgroundColor: `${tokens.accent}20`,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: tokens.accent,
          }}
        >
          <Text style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 4 }}>
            Selected Jura Contract
          </Text>
          <Text style={{ color: tokens.textMuted }}>
            {selectedContract.contractId
              .split(':')[1]
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
        </View>
      )}
    </View>
  );
}
