import Pill from '@/components/ui/Pill';
import Stepper from '@/components/ui/Stepper';
import { KingdomView } from '@/features/kingdoms/kingdomView';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useMemo, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

interface ContractsCardProps {
  kingdom?: KingdomView;
}

export default function ContractsCard({ kingdom }: ContractsCardProps) {
  const { tokens } = useThemeTokens();
  const [expandedContract, setExpandedContract] = useState<string | null>(null);

  const campaigns = useCampaigns(s => s.campaigns);
  const currentCampaignId = useCampaigns(s => s.currentCampaignId);
  const setContractProgress = useCampaigns(s => s.setContractProgress);

  const c = currentCampaignId ? campaigns[currentCampaignId] : undefined;

  // Helper function to create contract ID
  const createContractId = (contractName: string): string => {
    const slug = (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${kingdom?.id}:${slug(contractName)}`;
  };

  // Get kingdom state from current campaign
  const kState = useMemo(() => {
    if (!c || !kingdom) return undefined;
    return c.kingdoms?.find(k => k.kingdomId === kingdom.id);
  }, [c, kingdom]);

  // Helper: read contract count (supports array or record storage)
  const getContractCount = (contractId: string): number => {
    const contracts: unknown = kState?.contracts;
    if (!contracts) return 0;

    if (Array.isArray(contracts)) {
      const found = (contracts as unknown[]).find(
        contract =>
          contract &&
          typeof contract === 'object' &&
          'id' in contract &&
          (contract as { id: string }).id === contractId
      ) as { completedCount?: number } | undefined;
      return found ? Number(found.completedCount ?? 0) : 0;
    }

    if (typeof contracts === 'object') {
      const rec = contracts as Record<string, unknown>;
      const v = rec[contractId];
      if (typeof v === 'number') return v;
      if (v && typeof v === 'object' && 'completedCount' in v) {
        return Number((v as { completedCount?: number }).completedCount ?? 0);
      }
    }

    return 0;
  };

  // Handle single attempt contract completion
  const onCompleteOnce = (contractId: string) => {
    if (!c || !kingdom) return;
    setContractProgress(c.campaignId, kingdom.id, contractId, { singleAttempt: true });
  };

  // Handle stepper count changes
  const onChangeCount = (contractId: string, next: number, current: number) => {
    if (!c || !kingdom) return;
    const delta = Math.max(0, Math.floor(next)) - Math.max(0, Math.floor(current));
    if (delta !== 0) setContractProgress(c.campaignId, kingdom.id, contractId, { delta });
  };

  // Handle contract expansion
  const onToggleExpanded = (contractId: string) => {
    setExpandedContract(expandedContract === contractId ? null : contractId);
  };

  // Early return if no kingdom
  if (!kingdom) return null;

  const contracts = kingdom.contracts || [];

  return (
    <View
      style={{
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#0006',
        backgroundColor: tokens.surface,
        gap: 8,
      }}
      testID='contracts-card'
    >
      <Text style={{ color: tokens.textPrimary, fontWeight: '800' }} testID='contracts-card-title'>
        Contracts
      </Text>

      {contracts.length === 0 ? (
        <Text style={{ color: tokens.textMuted }} testID='no-contracts-message'>
          No contracts available.
        </Text>
      ) : (
        <View style={{ gap: 8 }} testID='contracts-list'>
          {contracts.map(contract => {
            const contractId = createContractId(contract.name);
            const curCount = getContractCount(contractId);
            const isExpanded = expandedContract === contractId;

            if (contract.singleAttempt) {
              const completed = curCount >= 1;
              return (
                <View
                  key={contractId}
                  testID={`contract-item-${contractId}`}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#0006',
                    backgroundColor: tokens.card,
                    gap: 8,
                  }}
                >
                  {/* Contract Header */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text
                        style={{ color: tokens.textPrimary, fontWeight: '700' }}
                        testID={`contract-name-${contractId}`}
                      >
                        {contract.name}
                      </Text>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}
                      >
                        <Text
                          style={{ color: tokens.textMuted, fontSize: 12 }}
                          testID={`contract-tier-${contractId}`}
                        >
                          {contract.tier.toUpperCase()}
                        </Text>
                        <Text
                          style={{ color: tokens.textMuted, fontSize: 12 }}
                          testID={`contract-attempts-${contractId}`}
                        >
                          {contract.singleAttempt ? 'One-time' : 'Unlimited'}
                        </Text>
                      </View>
                    </View>
                    <Pill
                      label={completed ? 'Completed' : 'Mark Complete'}
                      selected={completed}
                      onPress={() => onCompleteOnce(contractId)}
                      testID={`contract-pill-${contractId}`}
                    />
                  </View>

                  {/* Contract Details Toggle */}
                  <TouchableOpacity
                    onPress={() => onToggleExpanded(contractId)}
                    style={{
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      backgroundColor: tokens.surface,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: '#0003',
                    }}
                    testID={`contract-toggle-${contractId}`}
                  >
                    <Text style={{ color: tokens.textMuted, fontSize: 12, textAlign: 'center' }}>
                      {isExpanded ? 'Hide Details' : 'Show Details'}
                    </Text>
                  </TouchableOpacity>

                  {/* Expanded Contract Details */}
                  {isExpanded && (
                    <View
                      style={{ gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#0003' }}
                    >
                      <View>
                        <Text
                          style={{
                            color: tokens.textPrimary,
                            fontWeight: '600',
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          Objective:
                        </Text>
                        <Text style={{ color: tokens.textMuted, fontSize: 13, lineHeight: 18 }}>
                          {contract.objective}
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={{
                            color: tokens.textPrimary,
                            fontWeight: '600',
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          Setup:
                        </Text>
                        <Text style={{ color: tokens.textMuted, fontSize: 13, lineHeight: 18 }}>
                          {contract.setup}
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={{
                            color: tokens.textPrimary,
                            fontWeight: '600',
                            fontSize: 14,
                            marginBottom: 4,
                          }}
                        >
                          Reward:
                        </Text>
                        <Text style={{ color: tokens.textMuted, fontSize: 13, lineHeight: 18 }}>
                          {contract.reward}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            }

            return (
              <View
                key={contractId}
                testID={`contract-item-${contractId}`}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#0006',
                  backgroundColor: tokens.card,
                  gap: 8,
                }}
              >
                {/* Contract Header */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text
                      style={{ color: tokens.textPrimary, fontWeight: '700' }}
                      testID={`contract-name-${contractId}`}
                    >
                      {contract.name}
                    </Text>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}
                    >
                      <Text
                        style={{ color: tokens.textMuted, fontSize: 12 }}
                        testID={`contract-tier-${contractId}`}
                      >
                        {contract.tier.toUpperCase()}
                      </Text>
                      <Text
                        style={{ color: tokens.textMuted, fontSize: 12 }}
                        testID={`contract-attempts-${contractId}`}
                      >
                        {contract.singleAttempt ? 'One-time' : 'Unlimited'}
                      </Text>
                    </View>
                  </View>
                  <Stepper
                    value={curCount}
                    min={0}
                    step={1}
                    editable
                    onChange={next => onChangeCount(contractId, next, curCount)}
                    testID={`contract-stepper-${contractId}`}
                  />
                </View>

                {/* Contract Details Toggle */}
                <TouchableOpacity
                  onPress={() => onToggleExpanded(contractId)}
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    backgroundColor: tokens.surface,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: '#0003',
                  }}
                  testID={`contract-toggle-${contractId}`}
                >
                  <Text style={{ color: tokens.textMuted, fontSize: 12, textAlign: 'center' }}>
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </Text>
                </TouchableOpacity>

                {/* Expanded Contract Details */}
                {isExpanded && (
                  <View
                    style={{ gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#0003' }}
                  >
                    <View>
                      <Text
                        style={{
                          color: tokens.textPrimary,
                          fontWeight: '600',
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        Objective:
                      </Text>
                      <Text style={{ color: tokens.textMuted, fontSize: 13, lineHeight: 18 }}>
                        {contract.objective}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: tokens.textPrimary,
                          fontWeight: '600',
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        Setup:
                      </Text>
                      <Text style={{ color: tokens.textMuted, fontSize: 13, lineHeight: 18 }}>
                        {contract.setup}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: tokens.textPrimary,
                          fontWeight: '600',
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        Reward:
                      </Text>
                      <Text style={{ color: tokens.textMuted, fontSize: 13, lineHeight: 18 }}>
                        {contract.reward}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
