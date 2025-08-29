import { useKnights } from '@/store/knights';
import { useMemo } from 'react';
import uuid from 'react-native-uuid';

export interface Note {
  id: string;
  text: string;
  at: number;
}

export interface NotesData {
  notes: Note[];
  addNote: (text: string) => void;
  updateNote: (id: string, text: string) => void;
  deleteNote: (id: string) => void;
}

export function useNotesData(knightUID: string): NotesData {
  const { knightsById, updateKnightSheet } = useKnights();
  const k = knightsById[knightUID];

  const notes = useMemo(() => {
    return (k?.sheet?.notes ?? []).slice().sort((a: Note, b: Note) => b.at - a.at);
  }, [k?.sheet?.notes]);

  const addNote = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const next: Note[] = [
      ...(k?.sheet?.notes ?? []),
      { id: String(uuid.v4()), text: trimmedText, at: Date.now() },
    ];
    updateKnightSheet(knightUID, { notes: next });
  };

  const updateNote = (id: string, text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const next: Note[] = (k?.sheet?.notes ?? []).map((n: Note) =>
      n.id === id ? { ...n, text: trimmedText, at: Date.now() } : n
    );
    updateKnightSheet(knightUID, { notes: next });
  };

  const deleteNote = (id: string) => {
    const next: Note[] = (k?.sheet?.notes ?? []).filter((n: Note) => n.id !== id);
    updateKnightSheet(knightUID, { notes: next });
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
  };
}
