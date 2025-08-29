import type { Gear } from '@/models/gear';
import { useGear } from '@/store';
import type { GearStore } from '@/store/gear';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface GearActionsProps {
  gear: Gear;
  knightId: string;
  isGearInstance?: boolean; // Indicates if this is a gear instance (equipped gear) or gear type
}

export function GearActions({ gear, knightId, isGearInstance = false }: GearActionsProps) {
  const { tokens } = useThemeTokens();
  // Select only needed fields to ease test mocking compatibility
  const {
    attachUpgrade,
    detachUpgrade,
    getAttachedUpgrade,
    getUpgradeTargets,
    reforgeMerchantGear,
    isReforged,
    getAvailableQuantity,
    allGear,
  } = useGear((s: GearStore) => ({
    attachUpgrade: s.attachUpgrade,
    detachUpgrade: s.detachUpgrade,
    getAttachedUpgrade: s.getAttachedUpgrade,
    getUpgradeTargets: s.getUpgradeTargets,
    reforgeMerchantGear: s.reforgeMerchantGear,
    isReforged: s.isReforged,
    getAvailableQuantity: s.getAvailableQuantity,
    allGear: s.allGear,
  }));

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const attachedUpgrade = isGearInstance ? getAttachedUpgrade(gear.id) : null;
  const isGearReforged = isReforged(gear.id);

  const handleAttachUpgrade = (upgradeId: string) => {
    if (isGearInstance) {
      attachUpgrade(upgradeId, gear.id);
      setShowUpgradeModal(false);
    }
  };

  const handleDetachUpgrade = () => {
    if (attachedUpgrade) {
      detachUpgrade(attachedUpgrade);
    }
  };

  const handleReforge = () => {
    Alert.alert(
      'Reforge Gear',
      `Are you sure you want to reforge ${gear.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reforge',
          style: 'destructive',
          onPress: () => reforgeMerchantGear(gear.id),
        },
      ]
    );
  };

  const getAvailableUpgrades = () => {
    if (!isGearInstance) return [];
    return (Object.values(allGear) as Gear[]).filter(
      (item: Gear) =>
        item.type === 'upgrade' &&
        getUpgradeTargets(item.id).includes(gear.id) &&
        getAvailableQuantity(item.id) > 0
    );
  };

  const availableUpgrades = getAvailableUpgrades();

  return (
    <View style={styles.container}>
      {/* Upgrade Actions */}
      {isGearInstance && gear.type !== 'upgrade' && gear.type !== 'merchant' && (
        <View style={styles.actionSection}>
          <Text style={[styles.sectionTitle, { color: tokens.textPrimary }]}>Upgrades</Text>

          {attachedUpgrade ? (
            <View style={styles.attachedUpgrade}>
              <Text style={[styles.upgradeText, { color: tokens.textMuted }]}>
                Attached: {allGear[attachedUpgrade]?.name}
              </Text>
              <Pressable
                style={[styles.actionButton, { backgroundColor: tokens.accent }]}
                onPress={handleDetachUpgrade}
              >
                <Ionicons name='remove-circle' size={16} color='#0B0B0B' />
                <Text style={[styles.buttonText, { color: '#0B0B0B' }]}>Detach</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.upgradeActions}>
              {availableUpgrades.length > 0 ? (
                <Pressable
                  style={[styles.actionButton, { backgroundColor: tokens.accent }]}
                  onPress={() => setShowUpgradeModal(true)}
                >
                  <Ionicons name='add-circle' size={16} color='#0B0B0B' />
                  <Text style={[styles.buttonText, { color: '#0B0B0B' }]}>Attach Upgrade</Text>
                </Pressable>
              ) : (
                <Text style={[styles.noUpgradesText, { color: tokens.textMuted }]}>
                  No compatible upgrades available
                </Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* Merchant Reforging */}
      {isGearInstance && gear.type === 'merchant' && gear.side === 'normal' && !isGearReforged && (
        <View style={styles.actionSection}>
          <Text style={[styles.sectionTitle, { color: tokens.textPrimary }]}>Reforging</Text>
          <Pressable
            style={[styles.actionButton, { backgroundColor: tokens.accent }]}
            onPress={handleReforge}
          >
            <Ionicons name='hammer' size={16} color='#0B0B0B' />
            <Text style={[styles.buttonText, { color: '#0B0B0B' }]}>Reforge</Text>
          </Pressable>
        </View>
      )}

      {/* Upgrade Selection Modal */}
      <Modal
        visible={showUpgradeModal}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setShowUpgradeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: tokens.surface }]}>
            <Text style={[styles.modalTitle, { color: tokens.textPrimary }]}>Select Upgrade</Text>

            {availableUpgrades.map((upgrade: Gear) => (
              <Pressable
                key={upgrade.id}
                style={[styles.upgradeOption, { borderColor: tokens.textMuted }]}
                onPress={() => handleAttachUpgrade(upgrade.id)}
              >
                <Text style={[styles.upgradeName, { color: tokens.textPrimary }]}>
                  {upgrade.name}
                </Text>
                <Text style={[styles.upgradeDescription, { color: tokens.textMuted }]}>
                  {upgrade.description}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={[styles.cancelButton, { backgroundColor: tokens.textMuted }]}
              onPress={() => setShowUpgradeModal(false)}
            >
              <Text style={[styles.buttonText, { color: tokens.textPrimary }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  actionSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  attachedUpgrade: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upgradeText: {
    fontSize: 12,
    flex: 1,
  },
  upgradeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noUpgradesText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  upgradeOption: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  upgradeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
});
