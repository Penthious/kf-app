import { useKnights } from '@/store/knights';
import { useMemo } from 'react';

export interface ChoiceMatrixNotesData {
  notes: Record<string, string>;
  getNote: (code: string) => string;
  hasNote: (code: string) => boolean;
  setNote: (code: string, text: string) => void;
  deleteNote: (code: string) => void;
  getAllNotes: () => Array<{ code: string; text: string }>;
}

export function useChoiceMatrixNotes(knightUID: string): ChoiceMatrixNotesData {
  const { knightsById, updateKnightSheet } = useKnights();
  const k = knightsById[knightUID];

  const notes = useMemo(() => {
    return k?.sheet?.choiceMatrixNotes ?? {};
  }, [k?.sheet?.choiceMatrixNotes]);

  const getNote = (code: string): string => {
    return notes[code] ?? '';
  };

  const hasNote = (code: string): boolean => {
    return !!notes[code]?.trim();
  };

  const setNote = (code: string, text: string) => {
    const trimmedText = text.trim();
    const next = { ...notes };

    if (trimmedText) {
      next[code] = trimmedText;
    } else {
      delete next[code];
    }

    updateKnightSheet(knightUID, { choiceMatrixNotes: next });
  };

  const deleteNote = (code: string) => {
    const next = { ...notes };
    delete next[code];
    updateKnightSheet(knightUID, { choiceMatrixNotes: next });
  };

  const getAllNotes = (): Array<{ code: string; text: string }> => {
    return Object.entries(notes)
      .filter(([, text]) => text.trim())
      .map(([code, text]) => ({ code, text }))
      .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
  };

  return {
    notes,
    getNote,
    hasNote,
    setNote,
    deleteNote,
    getAllNotes,
  };
}
