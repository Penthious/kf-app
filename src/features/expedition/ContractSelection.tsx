import Pill from '@/components/ui/Pill';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { calculateKnightTier, getAvailableContractTiers } from '@/utils/knight-tier';
import { Tier } from '@/catalogs/tier';
import { KingdomView } from '@/features/kingdoms/kingdomView';
import { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';

interface ContractSelectionProps {
  campaignId: string;
  kingdom?: KingdomView;
}

export default function ContractSelection({ campaignId, kingdom }: ContractSelectionProps) {
  const { tokens } = useThemeTokens();
  const { campaigns, selectContract, clearSelectedContract } = useCampaigns();
  const { knightsById } = useKnights();
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  const campaign = campaigns[campaignId];
  const partyLeader = campaign?.partyLeaderUID ? knightsById[campaign.partyLeaderUID] : undefined;

  if (!partyLeader || !kingdom || !kingdom.contracts || kingdom.contracts.length === 0) {
    return null;
  }

  const knightTier = calculateKnightTier(partyLeader.sheet);
  const availableTiers = getAvailableContractTiers(knightTier);

  // Group contracts by tier
  const contractsByTier = kingdom.contracts.reduce(
    (acc, contract) => {
      if (availableTiers.includes(contract.tier)) {
        if (!acc[contract.tier]) {
          acc[contract.tier] = [];
        }
        acc[contract.tier].push(contract);
      }
      return acc;
    },
    {} as Record<Tier, typeof kingdom.contracts>
  );

  const selectedContract = campaign.selectedContract;
  const isSelected = (contractName: string) =>
    selectedContract?.kingdomId === kingdom.id &&
    selectedContract?.contractId ===
      `${kingdom.id}:${contractName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')}`;

  const handleContractSelect = (contractName: string) => {
    const contractId = `${kingdom.id}:${contractName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}`;

    if (isSelected(contractName)) {
      clearSelectedContract(campaignId);
    } else {
      selectContract(campaignId, kingdom.id, contractId);
    }
  };

  const toggleTierExpansion = (tier: Tier) => {
    setExpandedTier(expandedTier === tier ? null : tier);
  };

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
        Contract Selection
      </Text>

      <Text style={{ color: tokens.textMuted, marginBottom: 12 }}>
        Select a contract based on your knight&apos;s tier. Current tier:{' '}
        <Text style={{ fontWeight: '600', color: tokens.textPrimary }}>
          {knightTier.toUpperCase()}
        </Text>
      </Text>

      <ScrollView style={{ maxHeight: 300 }}>
        {availableTiers.map(tier => {
          const contracts = contractsByTier[tier];
          if (!contracts || contracts.length === 0) return null;

          const isExpanded = expandedTier === tier;

          return (
            <View key={tier} style={{ marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => toggleTierExpansion(tier)}
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
                  <Pill label={`${contracts.length}`} selected={false} />
                </View>
                <Text style={{ color: tokens.textMuted, fontSize: 18 }}>
                  {isExpanded ? '−' : '+'}
                </Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={{ marginTop: 8, gap: 8 }}>
                  {contracts.map(contract => (
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
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {selectedContract && (
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
            Selected Contract
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
