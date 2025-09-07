import { CLUE_CATALOG, type ClueCatalogEntry } from '@/catalogs/clues';
import Button from '@/components/Button';
import { useThemeTokens } from '@/theme/ThemeProvider';
import type { ClueType } from '@/models/campaign';
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ClueSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectClue: (clueType: ClueType) => void;
  discoveredBy: string;
}

export default function ClueSelectionModal({
  visible,
  onClose,
  onSelectClue,
  discoveredBy,
}: ClueSelectionModalProps) {
  const { tokens } = useThemeTokens();
  const [selectedClue, setSelectedClue] = useState<ClueType | null>(null);

  const handleConfirm = () => {
    if (!selectedClue) {
      Alert.alert('No Clue Selected', 'Please select a clue to discover.');
      return;
    }

    onSelectClue(selectedClue);
    setSelectedClue(null);
    onClose();
  };

  const handleCancel = () => {
    setSelectedClue(null);
    onClose();
  };

  const getRarityColor = (rarity: ClueCatalogEntry['rarity']) => {
    switch (rarity) {
      case 'common':
        return tokens.textMuted;
      case 'uncommon':
        return '#4CAF50'; // Green
      case 'rare':
        return '#2196F3'; // Blue
      case 'legendary':
        return '#FF9800'; // Orange
      default:
        return tokens.textMuted;
    }
  };

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet'>
      <View style={[styles.container, { backgroundColor: tokens.bg }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>Select Clue to Discover</Text>
          <Text style={[styles.subtitle, { color: tokens.textMuted }]}>
            Choose which type of clue {discoveredBy} has discovered
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.clueGrid}>
            {CLUE_CATALOG.map(clue => (
              <Pressable
                key={clue.type}
                style={[
                  styles.clueCard,
                  {
                    backgroundColor: tokens.surface,
                    borderColor: selectedClue === clue.type ? tokens.accent : tokens.textMuted,
                  },
                ]}
                onPress={() => setSelectedClue(clue.type)}
              >
                <View style={styles.clueImageContainer}>
                  <View style={[styles.clueImage, { backgroundColor: '#E0E0E0' }]}>
                    <Text style={{ color: '#666', fontSize: 12, textAlign: 'center' }}>
                      {clue.type.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.clueInfo}>
                  <View style={styles.clueHeader}>
                    <Text style={[styles.clueName, { color: tokens.textPrimary }]}>
                      {clue.name}
                    </Text>
                    <Text style={[styles.clueRarity, { color: getRarityColor(clue.rarity) }]}>
                      {clue.rarity.toUpperCase()}
                    </Text>
                  </View>

                  <Text style={[styles.clueDescription, { color: tokens.textMuted }]}>
                    {clue.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button label='Cancel' onPress={handleCancel} tone='default' />
          <Button
            label='Discover Clue'
            onPress={handleConfirm}
            disabled={!selectedClue}
            tone='accent'
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  clueGrid: {
    gap: 16,
  },
  clueCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clueImageContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  clueImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  clueInfo: {
    flex: 1,
  },
  clueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clueName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  clueRarity: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  clueDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});
