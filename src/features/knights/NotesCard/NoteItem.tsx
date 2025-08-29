import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Note } from './useNotesData';

interface NoteItemProps {
    note: Note;
    isEditing: boolean;
    editText: string;
    onEditTextChange: (text: string) => void;
    onBeginEdit: (note: { id: string; text: string }) => void;
    onCancelEdit: () => void;
    onSaveEdit: () => void;
    onDelete: (id: string) => void;
}

export function NoteItem({
    note,
    isEditing,
    editText,
    onEditTextChange,
    onBeginEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete,
}: NoteItemProps) {
    const { tokens } = useThemeTokens();

    return (
        <View
            style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: tokens.surface,
                borderWidth: 1,
                borderColor: '#0006',
            }}
        >
            {isEditing ? (
                <View style={{ gap: 8 }}>
                    <TextInput
                        value={editText}
                        onChangeText={onEditTextChange}
                        placeholder="Edit note..."
                        placeholderTextColor={tokens.textMuted}
                        style={{ color: tokens.textPrimary }}
                        multiline
                    />
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Pressable
                            onPress={onSaveEdit}
                            style={{
                                paddingHorizontal: 12,
                                height: 32,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: tokens.accent,
                            }}
                        >
                            <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Save</Text>
                        </Pressable>
                        <Pressable
                            onPress={onCancelEdit}
                            style={{
                                paddingHorizontal: 12,
                                height: 32,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: tokens.surface,
                                borderWidth: 1,
                                borderColor: '#0006',
                            }}
                        >
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => onDelete(note.id)}
                            style={{
                                paddingHorizontal: 12,
                                height: 32,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#2A1313',
                                borderWidth: 1,
                                borderColor: '#0006',
                            }}
                        >
                            <Text style={{ color: '#F9DADA', fontWeight: '800' }}>Delete</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: tokens.textPrimary, flex: 1, marginRight: 12 }}>{note.text}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Pressable
                            onPress={() => onBeginEdit(note)}
                            style={{
                                paddingHorizontal: 12,
                                height: 32,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: tokens.surface,
                                borderWidth: 1,
                                borderColor: '#0006',
                            }}
                        >
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Edit</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => onDelete(note.id)}
                            style={{
                                paddingHorizontal: 12,
                                height: 32,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#2A1313',
                                borderWidth: 1,
                                borderColor: '#0006',
                            }}
                        >
                            <Text style={{ color: '#F9DADA', fontWeight: '800' }}>Delete</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}
