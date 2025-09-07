import type { InvestigationResult, Knight } from '@/models/knight';
import { addInvestigationDomain, ensureChapter, normalLocked } from '@/models/knight';
import { create } from 'zustand';
import { useCampaigns } from './campaigns';
import { storage, STORAGE_KEYS } from './storage';

export type KnightsState = {
  knightsById: Record<string, Knight>;
};

export type KnightsActions = {
  // Core actions
  addKnight: (k: Omit<Knight, 'version' | 'updatedAt'>) => Knight;
  renameKnight: (knightUID: string, name: string) => void;
  removeKnight: (knightUID: string) => void;
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
  advanceChapter: (knightUID: string) => { ok: boolean; error?: string };
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

    set(s => {
      const newState = { knightsById: { ...s.knightsById, [knight.knightUID]: knight } };
      // Save to AsyncStorage
      storage.save(STORAGE_KEYS.KNIGHTS, newState.knightsById).catch(console.error);
      return newState;
    });

    return knight;
  },

  renameKnight: (knightUID, name) =>
    set(s => {
      const knight = s.knightsById[knightUID];
      if (!knight) return s;

      const newState = {
        knightsById: {
          ...s.knightsById,
          [knightUID]: {
            ...knight,
            name,
            updatedAt: Date.now(),
          },
        },
      };
      // Save to AsyncStorage
      storage.save(STORAGE_KEYS.KNIGHTS, newState.knightsById).catch(console.error);
      return newState;
    }),

  removeKnight: knightUID =>
    set(s => {
      const { [knightUID]: removed, ...rest } = s.knightsById;
      const newState = { knightsById: rest };

      // Also remove the knight from all campaigns
      const campaignsState = useCampaigns.getState();
      const updatedCampaigns = { ...campaignsState.campaigns };

      Object.keys(updatedCampaigns).forEach(campaignId => {
        const campaign = updatedCampaigns[campaignId];
        const updatedMembers = campaign.members.filter(member => member.knightUID !== knightUID);

        // Update party leader if the deleted knight was the leader
        let updatedPartyLeaderUID = campaign.partyLeaderUID;
        if (campaign.partyLeaderUID === knightUID) {
          updatedPartyLeaderUID = undefined;
        }

        updatedCampaigns[campaignId] = {
          ...campaign,
          members: updatedMembers,
          partyLeaderUID: updatedPartyLeaderUID,
          updatedAt: Date.now(),
        };
      });

      // Update campaigns store
      useCampaigns.setState({ campaigns: updatedCampaigns });

      // Save both stores to AsyncStorage
      storage.save(STORAGE_KEYS.KNIGHTS, newState.knightsById).catch(console.error);
      storage.save(STORAGE_KEYS.CAMPAIGNS, updatedCampaigns).catch(console.error);

      return newState;
    }),

  updateKnightSheet: (knightUID, patch) => {
    const state = get();
    const knight = state.knightsById[knightUID];
    if (!knight) return { ok: false, error: 'Knight not found' };

    set(s => {
      const newState = {
        knightsById: {
          ...s.knightsById,
          [knightUID]: {
            ...knight,
            sheet: { ...knight.sheet, ...patch },
            version: knight.version + 1,
            updatedAt: Date.now(),
          },
        },
      };
      // Save to AsyncStorage
      storage.save(STORAGE_KEYS.KNIGHTS, newState.knightsById).catch(console.error);
      return newState;
    });

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

      const newState = {
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
      // Save to AsyncStorage
      storage.save(STORAGE_KEYS.KNIGHTS, newState.knightsById).catch(console.error);
      return newState;
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
    if (!domainResult.ok)
      return { ok: false, error: (domainResult as { ok: false; error: string }).error };

    set(s => {
      const k = s.knightsById[knightUID];
      if (!k) return s;

      const updatedChapters = {
        ...k.sheet.chapters,
        [chapterKey]: chapterProgress,
      };

      const newState = {
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
      // Save to AsyncStorage
      storage.save(STORAGE_KEYS.KNIGHTS, newState.knightsById).catch(console.error);
      return newState;
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
    if (!domainResult.ok)
      return { ok: false, error: (domainResult as { ok: false; error: string }).error };

    set(s => {
      const k = s.knightsById[knightUID];
      if (!k) return s;

      const updatedChapters = {
        ...k.sheet.chapters,
        [chapterKey]: chapterProgress,
      };

      const newState = {
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
      // Save to AsyncStorage
      storage.save(STORAGE_KEYS.KNIGHTS, newState.knightsById).catch(console.error);
      return newState;
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

  advanceChapter: knightUID => {
    const state = get();
    const knight = state.knightsById[knightUID];
    if (!knight) return { ok: false, error: 'Knight not found' };

    const currentChapter = knight.sheet.chapter;
    if (currentChapter >= 5) return { ok: false, error: 'Already at maximum chapter' };

    const chapterKey = String(currentChapter);
    const chapterProgress = knight.sheet.chapters[chapterKey];
    if (!chapterProgress) return { ok: false, error: 'Chapter progress not found' };

    // Check if quest is completed
    if (!chapterProgress.quest.completed) {
      return { ok: false, error: 'Quest must be completed before advancing chapter' };
    }

    // Check if 3 normal investigations have been attempted (pass, fail, or lead)
    const normalAttempted =
      chapterProgress.attempts?.filter(
        attempt =>
          attempt.code.startsWith(`I${currentChapter}-`) &&
          (attempt.code.endsWith('-1') ||
            attempt.code.endsWith('-2') ||
            attempt.code.endsWith('-3'))
      ).length || 0;

    if (normalAttempted < 3) {
      return { ok: false, error: 'Must attempt 3 normal investigations before advancing chapter' };
    }

    // Advance to next chapter
    const nextChapter = currentChapter + 1;

    set(s => {
      const k = s.knightsById[knightUID];
      if (!k) return s;

      const newState = {
        knightsById: {
          ...s.knightsById,
          [knightUID]: {
            ...k,
            sheet: {
              ...k.sheet,
              chapter: nextChapter,
            },
            updatedAt: Date.now(),
          },
        },
      };
      // Save to AsyncStorage
      storage.save(STORAGE_KEYS.KNIGHTS, newState.knightsById).catch(console.error);
      return newState;
    });

    return { ok: true };
  },
}));

// Initialize store with data from AsyncStorage
storage
  .load(STORAGE_KEYS.KNIGHTS, {})
  .then(knightsById => {
    useKnights.setState({ knightsById });
  })
  .catch(console.error);
