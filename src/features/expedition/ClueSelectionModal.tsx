import { CLUE_CATALOG } from '@/catalogs/clues';
import Button from '@/components/Button';
import type { ClueType } from '@/models/campaign';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface ClueSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectClues: (clueSelections: { type: ClueType; count: number }[]) => void;
  discoveredBy: string;
}

export default function ClueSelectionModal({
  visible,
  onClose,
  onSelectClues,
  discoveredBy,
}: ClueSelectionModalProps) {
  const { tokens } = useThemeTokens();
  const [clueCounts, setClueCounts] = useState<Record<ClueType, number>>({
    swords: 0,
    faces: 0,
    eye: 0,
    book: 0,
  });

  const handleConfirm = () => {
    const selectedClues = Object.entries(clueCounts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({ type: type as ClueType, count }));

    if (selectedClues.length === 0) {
      Alert.alert('No Clues Selected', 'Please select at least one clue to discover.');
      return;
    }

    onSelectClues(selectedClues);
    setClueCounts({ swords: 0, faces: 0, eye: 0, book: 0 });
    onClose();
  };

  const handleCancel = () => {
    setClueCounts({ swords: 0, faces: 0, eye: 0, book: 0 });
    onClose();
  };

  const adjustClueCount = (type: ClueType, delta: number) => {
    setClueCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: tokens.bg }]}>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>
            Select Clues to Discover
          </Text>
          <Text style={[styles.subtitle, { color: tokens.textMuted }]}>
            Discovered by {discoveredBy}
          </Text>

          <View style={styles.clueList}>
            {CLUE_CATALOG.map(clue => (
              <View key={clue.type} style={styles.clueRow}>
                <View style={styles.clueInfo}>
                  <View style={[styles.clueImage, { backgroundColor: clue.backgroundColor }]}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 12,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {clue.type.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.clueTypeName, { color: tokens.textPrimary }]}>
                    {clue.type.charAt(0).toUpperCase() + clue.type.slice(1)} Clue
                  </Text>
                </View>

                <View style={styles.stepperContainer}>
                  <Pressable
                    style={[styles.stepperButton, { backgroundColor: tokens.surface }]}
                    onPress={() => adjustClueCount(clue.type, -1)}
                    disabled={clueCounts[clue.type] === 0}
                  >
                    <Text style={[styles.stepperText, { color: tokens.textPrimary }]}>-</Text>
                  </Pressable>

                  <Text style={[styles.countText, { color: tokens.textPrimary }]}>
                    {clueCounts[clue.type]}
                  </Text>

                  <Pressable
                    style={[styles.stepperButton, { backgroundColor: tokens.surface }]}
                    onPress={() => adjustClueCount(clue.type, 1)}
                  >
                    <Text style={[styles.stepperText, { color: tokens.textPrimary }]}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <Button label='Cancel' onPress={handleCancel} tone='default' />
            <Button label='Discover Clues' onPress={handleConfirm} tone='accent' />
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
  clueList: {
    marginBottom: 20,
  },
  clueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  clueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  clueTypeName: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 100,
    justifyContent: 'flex-end',
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  stepperText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
  clueImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
