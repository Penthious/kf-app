import Button from '@/components/Button';
import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useEffect, useRef, useState } from 'react';
import { Modal, Text, TextInput, View } from 'react-native';
import { useChoiceMatrixNotes } from './useChoiceMatrixNotes';

interface ChoiceMatrixNoteModalProps {
  visible: boolean;
  onClose: () => void;
  knightUID: string;
  code: string;
}

export default function ChoiceMatrixNoteModal({
  visible,
  onClose,
  knightUID,
  code,
}: ChoiceMatrixNoteModalProps) {
  const { tokens } = useThemeTokens();
  const { getNote, setNote, hasNote } = useChoiceMatrixNotes(knightUID);
  const [noteText, setNoteText] = useState('');
  const hasInitialized = useRef(false);

  // Load existing note when modal opens
  useEffect(() => {
    if (visible && !hasInitialized.current) {
      const existingNote = getNote(code);
      setNoteText(existingNote);
      hasInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, code]); // Intentionally omitting getNote to prevent infinite re-renders

  // Reset initialization flag when modal closes
  useEffect(() => {
    if (!visible) {
      hasInitialized.current = false;
    }
  }, [visible]);

  const handleSave = () => {
    setNote(code, noteText);
    onClose();
  };

  const handleCancel = () => {
    setNoteText('');
    onClose();
  };

  const handleDelete = () => {
    setNote(code, '');
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType='fade' onRequestClose={handleCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Card style={{ width: '100%', maxWidth: 400 }}>
          <Text
            style={{
              color: tokens.textPrimary,
              fontWeight: '800',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            Note for Choice {code}
          </Text>

          <Text style={{ color: tokens.textMuted, marginBottom: 12, textAlign: 'center' }}>
            Add a note to track your thoughts about this choice
          </Text>

          <TextInput
            style={{
              backgroundColor: tokens.surface,
              color: tokens.textPrimary,
              borderWidth: 1,
              borderColor: tokens.textMuted + '30',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              minHeight: 100,
              textAlignVertical: 'top',
            }}
            placeholder='Enter your note here...'
            placeholderTextColor={tokens.textMuted}
            value={noteText}
            onChangeText={setNoteText}
            multiline
            numberOfLines={4}
          />

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <Button label='Save' onPress={handleSave} tone='accent' />
            <Button label='Cancel' onPress={handleCancel} tone='default' />
          </View>

          {hasNote(code) && <Button label='Delete Note' onPress={handleDelete} tone='danger' />}
        </Card>
      </View>
    </Modal>
  );
}
