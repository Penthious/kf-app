import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Text } from 'react-native';
import { NoteInput } from './NoteInput';
import { NotesList } from './NotesList';
import { useNotesData } from './useNotesData';

interface NotesCardProps {
    knightUID: string;
}

export default function NotesCard({ knightUID }: NotesCardProps) {
    const { tokens } = useThemeTokens();
    const { notes, addNote, updateNote, deleteNote } = useNotesData(knightUID);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>('');

    const beginEdit = (note: { id: string; text: string }) => {
        setEditingId(note.id);
        setEditText(note.text);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const saveEdit = () => {
        if (!editingId) return;
        const text = editText.trim();
        if (text) {
            updateNote(editingId, text);
        }
        setEditingId(null);
        setEditText('');
    };

    const handleDelete = (id: string) => {
        deleteNote(id);
        if (editingId === id) {
            setEditingId(null);
            setEditText('');
        }
    };

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Notes</Text>

            <NoteInput onAdd={addNote} />

            <NotesList
                notes={notes}
                editingId={editingId}
                editText={editText}
                onEditTextChange={setEditText}
                onBeginEdit={beginEdit}
                onCancelEdit={cancelEdit}
                onSaveEdit={saveEdit}
                onDelete={handleDelete}
            />
        </Card>
    );
}
