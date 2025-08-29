import type { InvestigationResult, Knight } from '@/models/knight';
import { addInvestigationDomain, ensureChapter, normalLocked } from '@/models/knight';
import { create } from 'zustand';

export type KnightsState = {
  knightsById: Record<string, Knight>;
};

export type KnightsActions = {
  // Core actions
  addKnight: (k: Omit<Knight, 'version' | 'updatedAt'>) => Knight;
  renameKnight: (knightUID: string, name: string) => void;
  updateKnightSheet: (
    knightUID: string,
    patch: Partial<Knight['sheet']>
  ) => { ok: boolean; error?: string };

  // Investigation actions
  completeQuest: (
    knightUID: string,
    chapter: number,
    outcome?: InvestigationResult
  ) => { ok: boolean; error?: string };
  addNormalInvestigation: (
    knightUID: string,
    chapter: number,
    invId: string,
    result: InvestigationResult
  ) => { ok: boolean; error?: string };
  addLeadCompletion: (
    knightUID: string,
    chapter: number,
    invId: string
  ) => { ok: boolean; error?: string };
  isNormalLocked: (knightUID: string, chapter: number) => boolean;
};

export const useKnights = create<KnightsState & KnightsActions>((set, get) => ({
  knightsById: {},

  // ---- Core actions ----
  addKnight: k => {
    const now = Date.now();
    const knight: Knight = {
      ...k,
      version: 1,
      updatedAt: now,
    };

    set(s => ({
      knightsById: { ...s.knightsById, [knight.knightUID]: knight },
    }));

    return knight;
  },

  renameKnight: (knightUID, name) =>
    set(s => {
      const knight = s.knightsById[knightUID];
      if (!knight) return s;

      return {
        knightsById: {
          ...s.knightsById,
          [knightUID]: {
            ...knight,
            name,
            updatedAt: Date.now(),
          },
        },
      };
    }),

  updateKnightSheet: (knightUID, patch) => {
    const state = get();
    const knight = state.knightsById[knightUID];
    if (!knight) return { ok: false, error: 'Knight not found' };

    set(s => ({
      knightsById: {
        ...s.knightsById,
        [knightUID]: {
          ...knight,
          sheet: { ...knight.sheet, ...patch },
          version: knight.version + 1,
          updatedAt: Date.now(),
        },
      },
    }));

    return { ok: true };
  },

  // ---- Investigation actions ----
  completeQuest: (knightUID, chapter, outcome) => {
    const state = get();
    const knight = state.knightsById[knightUID];
    if (!knight) return { ok: false, error: 'Knight not found' };

    const chapterKey = String(chapter);
    const chapterProgress = ensureChapter(knight.sheet, chapter);

    if (chapterProgress.quest.completed) return { ok: false, error: 'Quest already completed' };

    set(s => {
      const k = s.knightsById[knightUID];
      if (!k) return s;

      const updatedChapters = {
        ...k.sheet.chapters,
        [chapterKey]: {
          ...chapterProgress,
          quest: { completed: true, outcome },
        },
      };

      return {
        knightsById: {
          ...s.knightsById,
          [knightUID]: {
            ...k,
            sheet: {
              ...k.sheet,
              chapters: updatedChapters,
            },
            updatedAt: Date.now(),
          },
        },
      };
    });

    return { ok: true };
  },

  addNormalInvestigation: (knightUID, chapter, invId, result) => {
    const state = get();
    const knight = state.knightsById[knightUID];
    if (!knight) return { ok: false, error: 'Knight not found' };

    const chapterKey = String(chapter);
    const chapterProgress = ensureChapter(knight.sheet, chapter);

    const domainResult = addInvestigationDomain(chapterProgress, invId, 'normal', result);
    if (!domainResult.ok) return { ok: false, error: domainResult.error };

    set(s => {
      const k = s.knightsById[knightUID];
      if (!k) return s;

      const updatedChapters = {
        ...k.sheet.chapters,
        [chapterKey]: chapterProgress,
      };

      return {
        knightsById: {
          ...s.knightsById,
          [knightUID]: {
            ...k,
            sheet: {
              ...k.sheet,
              chapters: updatedChapters,
            },
            updatedAt: Date.now(),
          },
        },
      };
    });

    return { ok: true };
  },

  addLeadCompletion: (knightUID, chapter, invId) => {
    const state = get();
    const knight = state.knightsById[knightUID];
    if (!knight) return { ok: false, error: 'Knight not found' };

    const chapterKey = String(chapter);
    const chapterProgress = ensureChapter(knight.sheet, chapter);

    const domainResult = addInvestigationDomain(chapterProgress, invId, 'lead', 'pass');
    if (!domainResult.ok) return { ok: false, error: domainResult.error };

    set(s => {
      const k = s.knightsById[knightUID];
      if (!k) return s;

      const updatedChapters = {
        ...k.sheet.chapters,
        [chapterKey]: chapterProgress,
      };

      return {
        knightsById: {
          ...s.knightsById,
          [knightUID]: {
            ...k,
            sheet: {
              ...k.sheet,
              chapters: updatedChapters,
            },
            updatedAt: Date.now(),
          },
        },
      };
    });

    return { ok: true };
  },

  isNormalLocked: (knightUID, chapter) => {
    const state = get();
    const knight = state.knightsById[knightUID];
    if (!knight) return false;

    const chapterKey = String(chapter);
    const chapterProgress = knight.sheet.chapters[chapterKey];
    if (!chapterProgress) return false;

    return normalLocked(chapterProgress);
  },
}));
