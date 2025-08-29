import { useThemeTokens } from '@/theme/ThemeProvider';
import { Text, View } from 'react-native';
import { NoteItem } from './NoteItem';
import { Note } from './useNotesData';

interface NotesListProps {
  notes: Note[];
  editingId: string | null;
  editText: string;
  onEditTextChange: (text: string) => void;
  onBeginEdit: (note: { id: string; text: string }) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: (id: string) => void;
}

export function NotesList({
  notes,
  editingId,
  editText,
  onEditTextChange,
  onBeginEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: NotesListProps) {
  const { tokens } = useThemeTokens();

  if (notes.length === 0) {
    return <Text style={{ color: tokens.textMuted }}>No notes yet.</Text>;
  }

  return (
    <View style={{ gap: 8 }}>
      {notes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          isEditing={editingId === note.id}
          editText={editText}
          onEditTextChange={onEditTextChange}
          onBeginEdit={onBeginEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
}
