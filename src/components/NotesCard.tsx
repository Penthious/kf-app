// src/components/NotesCard.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useKnights } from '@/store/knights';
import uuid from 'react-native-uuid';

export type Note = { id: string; text: string; at: number };

export default function NotesCard({ knightUID }: { knightUID: string }) {
    const { tokens } = useThemeTokens();
    const { knightsById, updateKnightSheet } = useKnights() as any;
    const k = knightsById[knightUID];

    const notes: Note[] = (k.sheet.notes ?? [])
        .slice()
        .sort((a: Note, b: Note) => b.at - a.at);

    const [draft, setDraft] = useState<string>('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>('');

    const saveAdd = (): void => {
        const t = draft.trim();
        if (!t) return;
        const next: Note[] = [
            ...(k.sheet.notes as Note[] | undefined ?? []),
            { id: String(uuid.v4()), text: t, at: Date.now() },
        ];
        updateKnightSheet(knightUID, { notes: next });
        setDraft('');
    };

    const remove = (id: string): void => {
        const next: Note[] = (k.sheet.notes as Note[] | undefined ?? [])
            .filter((n: Note) => n.id !== id);
        updateKnightSheet(knightUID, { notes: next });
        if (editingId === id) { setEditingId(null); setEditText(''); }
    };

    const beginEdit = (n: Note): void => { setEditingId(n.id); setEditText(n.text); };
    const cancelEdit = (): void => { setEditingId(null); setEditText(''); };

    const saveEdit = (): void => {
        if (!editingId) return;
        const t = editText.trim();
        const next: Note[] = (k.sheet.notes as Note[] | undefined ?? [])
            .map((n: Note) => (n.id === editingId ? { ...n, text: t, at: Date.now() } : n));
        updateKnightSheet(knightUID, { notes: next });
        setEditingId(null);
        setEditText('');
    };

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Notes</Text>

            {/* Add new */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <TextInput
                    placeholder="Add a note..."
                    placeholderTextColor={tokens.textMuted}
                    value={draft}
                    onChangeText={setDraft}
                    style={{
                        flex: 1,
                        color: tokens.textPrimary,
                        backgroundColor: tokens.surface,
                        borderWidth: 1,
                        borderColor: '#0006',
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        height: 36,
                        marginRight: 8,
                    }}
                />
                <Pressable
                    onPress={saveAdd}
                    style={{
                        paddingHorizontal: 12,
                        height: 36,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: tokens.accent,
                    }}
                >
                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Add</Text>
                </Pressable>
            </View>

            {/* List */}
            <View style={{ gap: 8 }}>
                {notes.length === 0 ? (
                    <Text style={{ color: tokens.textMuted }}>No notes yet.</Text>
                ) : (
                    notes.map((n: Note) => (
                        <View
                            key={n.id}
                            style={{
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: tokens.surface,
                                borderWidth: 1,
                                borderColor: '#0006',
                            }}
                        >
                            {editingId === n.id ? (
                                <View style={{ gap: 8 }}>
                                    <TextInput
                                        value={editText}
                                        onChangeText={setEditText}
                                        placeholder="Edit note..."
                                        placeholderTextColor={tokens.textMuted}
                                        style={{ color: tokens.textPrimary }}
                                        multiline
                                    />
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <Pressable
                                            onPress={saveEdit}
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
                                            onPress={cancelEdit}
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
                                            onPress={() => remove(n.id)}
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
                                    <Text style={{ color: tokens.textPrimary, flex: 1, marginRight: 12 }}>{n.text}</Text>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        <Pressable
                                            onPress={() => beginEdit(n)}
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
                                            onPress={() => remove(n.id)}
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
                    ))
                )}
            </View>
        </Card>
    );
}