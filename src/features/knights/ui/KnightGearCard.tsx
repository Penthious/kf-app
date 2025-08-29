import Card from '@/components/Card';
import { GearActions } from '@/features/gear/ui/GearActions';
import type { Gear } from '@/models/gear';
import { useGearShallow } from '@/store';
import { useCampaigns } from '@/store/campaigns';
import type { GearStore } from '@/store/gear';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

interface KnightGearCardProps {
  knightUID: string;
}

export function KnightGearCard({ knightUID }: KnightGearCardProps) {
  const { tokens } = useThemeTokens();
  const {
    allGear,
    getEquippedGear,
    getAvailableGearForKnight,
    getGearOwner,
    equipGear,
    unequipGear,
    transferGear,
    getAvailableQuantity,
    getEquippedQuantity,
    gearInstanceData,
  } = useGearShallow((s: GearStore) => ({
    allGear: s.allGear,
    getEquippedGear: s.getEquippedGear,
    getAvailableGearForKnight: s.getAvailableGearForKnight,
    getGearOwner: s.getGearOwner,
    equipGear: s.equipGear,
    unequipGear: s.unequipGear,
    transferGear: s.transferGear,
    getAvailableQuantity: s.getAvailableQuantity,
    getEquippedQuantity: s.getEquippedQuantity,
    gearInstanceData: s.gearInstanceData,
  }));
  const { currentCampaignId } = useCampaigns();

  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Get equipped and available gear for this knight
  const equippedGearInstanceIds = getEquippedGear(knightUID);
  const availableGearIds = currentCampaignId
    ? getAvailableGearForKnight(currentCampaignId, knightUID)
    : [];

  const equippedGear = equippedGearInstanceIds
    .map((instanceId: string) => gearInstanceData[instanceId])
    .filter(Boolean);
  const availableGear: Gear[] = (availableGearIds as string[])
    .map((id: string) => allGear[id])
    .filter((g): g is Gear => Boolean(g));

  // Get all unlocked gear for this campaign
  const allAvailableGear = Object.values(allGear);
  const campaignUnlockedGear = currentCampaignId ? allAvailableGear.filter(gear => gear) : [];

  const handleEquipGear = (gearId: string) => {
    const currentOwner = getGearOwner(gearId);

    if (currentOwner && currentOwner !== knightUID) {
      // Gear is equipped by another knight - offer to transfer
      Alert.alert(
        'Gear in Use',
        `This gear is currently equipped by another knight. Would you like to transfer it to this knight?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Transfer',
            onPress: () => {
              transferGear(gearId, currentOwner, knightUID);
              Alert.alert('Success', 'Gear transferred!');
            },
          },
        ]
      );
    } else {
      // Gear is available or already equipped by this knight
      equipGear(knightUID, gearId);
      Alert.alert('Success', 'Gear equipped!');
    }
  };

  const handleUnequipGear = (gearId: string) => {
    unequipGear(knightUID, gearId);
    Alert.alert('Success', 'Gear unequipped!');
  };

  const formatStat = (key: string, value: number) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    return `${label}: ${value >= 0 ? '+' : ''}${value}`;
  };

  const renderGearItem = (gear: Gear, isEquipped: boolean = false, instanceId?: string) => (
    <View
      key={gear.id}
      style={[styles.gearItem, { backgroundColor: tokens.surface, borderColor: tokens.textMuted }]}
    >
      <View style={styles.gearHeader}>
        <Text style={[styles.gearName, { color: tokens.textPrimary }]}>{gear.name}</Text>
        <View style={styles.gearActions}>
          {isEquipped ? (
            <Pressable
              style={[styles.actionButton, { backgroundColor: tokens.accent }]}
              onPress={() => handleUnequipGear(instanceId || gear.id)}
            >
              <Ionicons name='remove-circle' size={16} color='#0B0B0B' />
              <Text style={[styles.actionText, { color: '#0B0B0B' }]}>Unequip</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.actionButton, { backgroundColor: tokens.accent }]}
              onPress={() => handleEquipGear(gear.id)}
            >
              <Ionicons name='add-circle' size={16} color='#0B0B0B' />
              <Text style={[styles.actionText, { color: '#0B0B0B' }]}>Equip</Text>
            </Pressable>
          )}
        </View>
      </View>

      <Text style={[styles.gearType, { color: tokens.textMuted }]}>
        {gear.type.charAt(0).toUpperCase() + gear.type.slice(1)} •{' '}
        {gear.rarity.charAt(0).toUpperCase() + gear.rarity.slice(1)}
        {!isEquipped && (
          <Text style={{ color: tokens.accent }}> • {getAvailableQuantity(gear.id)} remaining</Text>
        )}
      </Text>

      {Object.entries(gear.stats).length > 0 && (
        <View style={styles.statsContainer}>
          {Object.entries(gear.stats).map(([key, value]) => (
            <Text key={key} style={[styles.statText, { color: tokens.textMuted }]}>
              {formatStat(key, value as number)}
            </Text>
          ))}
        </View>
      )}

      {gear.keywords.length > 0 && (
        <View style={styles.keywordsContainer}>
          {gear.keywords.map((keyword, index) => (
            <Text key={index} style={[styles.keywordText, { color: tokens.textMuted }]}>
              {keyword}
            </Text>
          ))}
        </View>
      )}

      {/* Show gear actions for equipped gear */}
      {isEquipped && <GearActions gear={gear} knightId={knightUID} isGearInstance={true} />}
    </View>
  );

  return (
    <Card>
      <View style={styles.header}>
        <Text style={[styles.title, { color: tokens.textPrimary }]}>Gear</Text>
        <Pressable
          style={[styles.unlockButton, { backgroundColor: tokens.accent }]}
          onPress={() => setShowUnlockModal(!showUnlockModal)}
        >
          <Ionicons name='swap-horizontal' size={16} color='#0B0B0B' />
          <Text style={[styles.unlockButtonText, { color: '#0B0B0B' }]}>Transfer Gear</Text>
        </Pressable>
      </View>

      {/* Equipped Gear Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: tokens.textPrimary }]}>
          Equipped ({equippedGear.length})
        </Text>
        {equippedGear.length > 0 ? (
          <View style={styles.gearList}>
            {equippedGear.map((gear: Gear) => {
              const instanceId = equippedGearInstanceIds.find(
                (id: string) => gearInstanceData[id]?.id === gear.id
              );
              return renderGearItem(gear, true, instanceId);
            })}
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: tokens.textMuted }]}>No gear equipped</Text>
        )}
      </View>

      {/* Available Gear Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: tokens.textPrimary }]}>
          Available ({availableGear.length})
        </Text>
        {availableGear.length > 0 ? (
          <View style={styles.gearList}>
            {availableGear
              .filter(
                (gear: Gear) =>
                  !equippedGearInstanceIds.some(
                    (instanceId: string) => gearInstanceData[instanceId]?.id === gear.id
                  )
              )
              .map((gear: Gear) => renderGearItem(gear))}
          </View>
        ) : (
          <Text style={[styles.emptyText, { color: tokens.textMuted }]}>No gear available</Text>
        )}
      </View>

      {/* Gear Transfer Modal */}
      {showUnlockModal && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modal,
              { backgroundColor: tokens.surface, borderColor: tokens.textMuted },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: tokens.textPrimary }]}>Transfer Gear</Text>
              <Pressable onPress={() => setShowUnlockModal(false)} style={styles.closeButton}>
                <Ionicons name='close' size={24} color={tokens.textMuted} />
              </Pressable>
            </View>

            <View style={styles.availableGearList}>
              {(Object.entries(gearInstanceData) as Array<[string, Gear]>)
                .filter(([instanceId]) => {
                  // Only show gear instances that are equipped by other knights
                  const owner = getGearOwner(instanceId);
                  return owner && owner !== knightUID;
                })
                .map(([instanceId, gearInstance]: [string, Gear]) => {
                  const owner = getGearOwner(instanceId);
                  return (
                    <Pressable
                      key={instanceId}
                      style={[
                        styles.availableGearItem,
                        { backgroundColor: tokens.card, borderColor: tokens.textMuted },
                      ]}
                      onPress={() => {
                        if (owner) {
                          transferGear(instanceId, owner, knightUID);
                          Alert.alert('Success', 'Gear transferred!');
                          setShowUnlockModal(false);
                        }
                      }}
                    >
                      <Text style={[styles.availableGearName, { color: tokens.textPrimary }]}>
                        {gearInstance.name}
                      </Text>
                      <Text style={[styles.availableGearType, { color: tokens.textMuted }]}>
                        {gearInstance.type.charAt(0).toUpperCase() + gearInstance.type.slice(1)} •{' '}
                        {gearInstance.rarity.charAt(0).toUpperCase() + gearInstance.rarity.slice(1)}
                      </Text>
                      <Text style={[styles.availableGearType, { color: tokens.textMuted }]}>
                        Equipped by: {owner}
                      </Text>
                      <Ionicons name='swap-horizontal' size={20} color={tokens.accent} />
                    </Pressable>
                  );
                })}
            </View>

            {Object.entries(gearInstanceData).filter(([instanceId, gearInstance]) => {
              const owner = getGearOwner(instanceId);
              return owner && owner !== knightUID;
            }).length === 0 && (
              <Text style={[styles.emptyText, { color: tokens.textMuted }]}>
                No gear to transfer from other knights
              </Text>
            )}
          </View>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  unlockButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  gearList: {
    gap: 8,
  },
  gearItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  gearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gearName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  gearActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gearType: {
    fontSize: 14,
    marginBottom: 4,
  },
  statsContainer: {
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  keywordText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  availableGearList: {
    gap: 8,
  },
  availableGearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  availableGearName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  availableGearType: {
    fontSize: 14,
    flex: 1,
  },
});
