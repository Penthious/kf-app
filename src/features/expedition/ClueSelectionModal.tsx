import { CLUE_CATALOG } from '@/catalogs/clues';
import Button from '@/components/Button';
import { useThemeTokens } from '@/theme/ThemeProvider';
import type { ClueType } from '@/models/campaign';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

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
      Alert.alert('No Clue Selected', 'Please select a clue type to discover.');
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

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: tokens.bg }]}>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>Select Clue Type</Text>
          <Text style={[styles.subtitle, { color: tokens.textMuted }]}>
            Discovered by {discoveredBy}
          </Text>

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
                <View style={[styles.clueImage, { backgroundColor: '#E0E0E0' }]}>
                  <Text style={{ color: '#666', fontSize: 12, textAlign: 'center' }}>
                    {clue.type.toUpperCase()}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <Button label='Cancel' onPress={handleCancel} tone='default' />
            <Button label='Discover Clue' onPress={handleConfirm} tone='accent' />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  clueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  clueCard: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clueImage: {
    width: 48,
    height: 48,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
