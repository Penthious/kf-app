import type { Gear } from '@/models/gear';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface GearCardProps {
  gear: Gear;
  onUpload?: (gear: Gear) => void;
  onCamera?: (gear: Gear) => void;
  onGallery?: (gear: Gear) => void;
  onDelete?: (gear: Gear) => void;
  onShare?: (gear: Gear) => void;
  onUnlock?: (gear: Gear) => void;
  isUnlocked?: boolean;
}

export function GearCard({
  gear,
  onUpload,
  onCamera,
  onGallery,
  onDelete,
  onShare,
  onUnlock,
  isUnlocked,
}: GearCardProps) {
  const { tokens } = useThemeTokens();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  // const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const formatStat = (key: string, value: number) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    return `${label}: ${value >= 0 ? '+' : ''}${value}`;
  };

  const getGearTypeLabel = () => {
    if (gear.kingdomId) {
      if (gear.type === 'monster' && gear.monsterId) {
        return `Monster: ${gear.monsterId}`;
      }
      return `Kingdom: ${gear.kingdomId}`;
    }
    if (gear.type === 'upgrade' && gear.upgradeType) {
      return `Upgrade: ${gear.upgradeType.charAt(0).toUpperCase() + gear.upgradeType.slice(1)}`;
    }
    if (gear.type === 'merchant' && gear.side) {
      return `Merchant: ${gear.side.charAt(0).toUpperCase() + gear.side.slice(1)}`;
    }
    return `Type: ${gear.type.charAt(0).toUpperCase() + gear.type.slice(1)}`;
  };

  const renderStats = () => {
    const statEntries = Object.entries(gear.stats).filter(([_, value]) => value !== undefined);
    return statEntries.map(([key, value]) => (
      <Text key={key} style={[styles.statText, { color: tokens.textMuted }]}>
        {formatStat(key, value as number)}
      </Text>
    ));
  };

  const renderKeywords = () => {
    return gear.keywords.map((keyword, index) => (
      <Text key={index} style={[styles.keywordText, { color: tokens.textMuted }]}>
        {keyword}
      </Text>
    ));
  };

  return (
    <View
      style={[styles.container, { backgroundColor: tokens.surface, borderColor: tokens.textMuted }]}
    >
      <View style={styles.contentRow}>
        {/* Left side - Stats and Info */}
        <View style={styles.leftContent}>
          <Text style={[styles.name, { color: tokens.textPrimary }]}>{gear.name}</Text>
          <Text style={[styles.typeLabel, { color: tokens.textMuted }]}>{getGearTypeLabel()}</Text>

          <View style={styles.statsContainer}>{renderStats()}</View>

          <View style={styles.keywordsContainer}>{renderKeywords()}</View>

          <View style={styles.propertiesContainer}>
            <Text style={[styles.propertyText, { color: tokens.textMuted }]}>
              Rarity: {gear.rarity.charAt(0).toUpperCase() + gear.rarity.slice(1)}
            </Text>
            {gear.cost !== undefined && (
              <Text style={[styles.propertyText, { color: tokens.textMuted }]}>
                Cost: {gear.cost}
              </Text>
            )}
            {gear.consumable && (
              <Text style={[styles.propertyText, { color: tokens.textMuted }]}>Consumable</Text>
            )}
            {gear.stackable && gear.maxStack && (
              <Text style={[styles.propertyText, { color: tokens.textMuted }]}>
                Stackable: {gear.maxStack}
              </Text>
            )}
            {gear.attachedToGearId && (
              <Text style={[styles.propertyText, { color: tokens.textMuted }]}>
                Attached to: {gear.attachedToGearId}
              </Text>
            )}
            {gear.isReforged && (
              <Text style={[styles.propertyText, { color: tokens.textMuted }]}>Reforged</Text>
            )}
            <Text style={[styles.propertyText, { color: tokens.accent }]}>
              Quantity: {gear.quantity}
            </Text>
          </View>

          {onUnlock &&
            (isUnlocked ? (
              <View style={[styles.unlockButton, { backgroundColor: tokens.textMuted }]}>
                <Ionicons name='checkmark-circle' size={16} color={tokens.textPrimary} />
                <Text style={[styles.unlockButtonText, { color: tokens.textPrimary }]}>
                  Unlocked
                </Text>
              </View>
            ) : (
              <Pressable
                style={[styles.unlockButton, { backgroundColor: tokens.accent }]}
                onPress={() => onUnlock(gear)}
                testID='gear-unlock-button'
              >
                <Ionicons name='add-circle' size={16} color='#0B0B0B' />
                <Text style={[styles.unlockButtonText, { color: '#0B0B0B' }]}>Unlock</Text>
              </Pressable>
            ))}
        </View>

        {/* Right side - Image */}
        <View style={styles.rightContent}>
          <Pressable style={styles.imageContainer} onPress={() => setIsImageModalVisible(true)}>
            {gear.imageUrl ? (
              <Image
                source={{ uri: gear.imageUrl }}
                style={styles.image}
                testID='gear-image'
                resizeMode='cover'
              />
            ) : (
              <View
                style={[styles.placeholderImage, { backgroundColor: tokens.textMuted }]}
                testID='gear-image-placeholder'
              >
                <Text style={{ color: tokens.textPrimary }}>No Image</Text>
              </View>
            )}

            {onUpload && (
              <Pressable
                style={[styles.uploadButton, { backgroundColor: tokens.surface }]}
                onPress={() => onUpload(gear)}
                testID='gear-upload-button'
              >
                <Text style={{ color: tokens.textPrimary }}>Upload</Text>
              </Pressable>
            )}
          </Pressable>
        </View>
      </View>

      {/* Image Modal */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.9)' }]}>
          <View style={styles.modalContent}>
            {/* Close button */}
            <Pressable style={styles.closeButton} onPress={() => setIsImageModalVisible(false)}>
              <Ionicons name='close' size={24} color={tokens.textPrimary} />
            </Pressable>

            {/* Image */}
            <View style={styles.modalImageContainer}>
              {gear.imageUrl ? (
                <Image
                  source={{ uri: gear.imageUrl }}
                  style={styles.modalImage}
                  resizeMode='contain'
                />
              ) : (
                <View style={[styles.modalImage, { backgroundColor: tokens.textMuted }]}>
                  <Text style={{ color: tokens.textPrimary, fontSize: 16 }}>No Image</Text>
                </View>
              )}
            </View>

            {/* Action buttons */}
            <View style={styles.modalActions}>
              {onCamera && (
                <Pressable
                  style={[styles.modalActionButton, { backgroundColor: tokens.surface }]}
                  onPress={() => {
                    setIsImageModalVisible(false);
                    // Small delay to ensure modal is closed before opening camera
                    setTimeout(() => onCamera(gear), 100);
                  }}
                  testID='gear-camera-button'
                >
                  <Ionicons name='camera' size={20} color={tokens.textPrimary} />
                  <Text style={[styles.modalActionText, { color: tokens.textPrimary }]}>
                    Camera
                  </Text>
                </Pressable>
              )}

              {onGallery && (
                <Pressable
                  style={[styles.modalActionButton, { backgroundColor: tokens.surface }]}
                  onPress={() => {
                    setIsImageModalVisible(false);
                    // Small delay to ensure modal is closed before opening gallery
                    setTimeout(() => onGallery(gear), 100);
                  }}
                  testID='gear-gallery-button'
                >
                  <Ionicons name='images' size={20} color={tokens.textPrimary} />
                  <Text style={[styles.modalActionText, { color: tokens.textPrimary }]}>
                    Gallery
                  </Text>
                </Pressable>
              )}

              {onDelete && gear.imageUrl && (
                <Pressable
                  style={[styles.modalActionButton, { backgroundColor: tokens.surface }]}
                  onPress={() => {
                    onDelete(gear);
                    setIsImageModalVisible(false);
                  }}
                  testID='gear-delete-button'
                >
                  <Ionicons name='trash' size={20} color={tokens.textPrimary} />
                  <Text style={[styles.modalActionText, { color: tokens.textPrimary }]}>
                    Delete
                  </Text>
                </Pressable>
              )}

              {onShare && gear.imageUrl && (
                <Pressable
                  style={[styles.modalActionButton, { backgroundColor: tokens.surface }]}
                  onPress={() => {
                    onShare(gear);
                    setIsImageModalVisible(false);
                  }}
                  testID='gear-share-button'
                >
                  <Ionicons name='share-outline' size={20} color={tokens.textPrimary} />
                  <Text style={[styles.modalActionText, { color: tokens.textPrimary }]}>Share</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    minHeight: 120,
  },
  contentRow: {
    flexDirection: 'row',
    flex: 1,
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },
  rightContent: {
    width: 80,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  statsContainer: {
    marginBottom: 8,
  },
  statText: {
    fontSize: 12,
    marginBottom: 2,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  keywordText: {
    fontSize: 10,
    marginRight: 8,
    marginBottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  propertiesContainer: {
    marginBottom: 8,
  },
  propertyText: {
    fontSize: 11,
    marginBottom: 2,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  unlockButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 8,
  },
  modalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  modalImage: {
    width: '100%',
    height: '80%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
