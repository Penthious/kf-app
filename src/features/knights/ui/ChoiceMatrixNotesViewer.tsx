import Card from '@/components/Card';
import Button from '@/components/Button';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Modal, ScrollView, Text, View } from 'react-native';
import { useChoiceMatrixNotes } from './useChoiceMatrixNotes';

interface ChoiceMatrixNotesViewerProps {
  visible: boolean;
  onClose: () => void;
  knightUID: string;
  onEditNote: (code: string) => void;
}

export default function ChoiceMatrixNotesViewer({
  visible,
  onClose,
  knightUID,
  onEditNote,
}: ChoiceMatrixNotesViewerProps) {
  const { tokens } = useThemeTokens();
  const { getAllNotes, deleteNote } = useChoiceMatrixNotes(knightUID);
  const allNotes = getAllNotes();

  const handleEditNote = (code: string) => {
    onEditNote(code);
    onClose();
  };

  const handleDeleteNote = (code: string) => {
    deleteNote(code);
  };

  return (
    <Modal visible={visible} transparent={true} animationType='fade' onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Card style={{ width: '100%', maxWidth: 500, maxHeight: '80%' }}>
          <Text
            style={{
              color: tokens.textPrimary,
              fontWeight: '800',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Choice Matrix Notes
          </Text>

          {allNotes.length === 0 ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Text style={{ color: tokens.textMuted, textAlign: 'center' }}>
                No notes yet. Click on a choice number to add a note.
              </Text>
            </View>
          ) : (
            <ScrollView style={{ maxHeight: 400 }}>
              {allNotes.map(({ code, text }) => (
                <View
                  key={code}
                  style={{
                    backgroundColor: tokens.surface,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: tokens.textMuted + '20',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text
                      style={{
                        color: tokens.textPrimary,
                        fontWeight: '700',
                        fontSize: 16,
                      }}
                    >
                      Choice {code}
                    </Text>
                    <View style={{ flex: 1 }} />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Button label='Edit' onPress={() => handleEditNote(code)} tone='default' />
                      <Button label='Delete' onPress={() => handleDeleteNote(code)} tone='danger' />
                    </View>
                  </View>
                  <Text style={{ color: tokens.textPrimary, lineHeight: 20 }}>{text}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          <Button label='Close' onPress={onClose} tone='default' />
        </Card>
      </View>
    </Modal>
  );
}
