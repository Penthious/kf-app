// src/store/knights.ts
// Zustand store for Knights; handles quest completion, normal investigations, and lead completions.

import { create } from 'zustand';
import {
    Knight, UUID, InvestigationResult,
    ensureChapter, addInvestigationDomain, completeQuestDomain, normalLocked
} from '@/models/knight';

type KnightsState = {
    knightsById: Record<UUID, Knight>;
};

type KnightsActions = {
    addKnight: (k: Omit<Knight, 'version' | 'updatedAt'>) => void;
    renameKnight: (knightUID: UUID, name: string) => void;

    completeQuest: (knightUID: UUID, chapter: number, outcome?: InvestigationResult) => { ok: boolean; error?: string };

    addNormalInvestigation: (
        knightUID: UUID,
        chapter: number,
        invId: string,
        result: InvestigationResult
    ) => { ok: boolean; error?: string };

    addLeadCompletion: (
        knightUID: UUID,
        chapter: number,
        invId: string
    ) => { ok: boolean; error?: string };

    convertFailToLead: (
        knightUID: UUID,
        chapter: number,
        invId: string
    ) => { ok: boolean; error?: string };

    isNormalLocked: (knightUID: UUID, chapter: number) => boolean;
    updateKnightSheet: (knightUID: UUID, patch: Partial<Knight['sheet']>) => { ok: boolean; error?: string };
};

export const useKnights = create<KnightsState & KnightsActions>((set, get) => ({
    knightsById: {},

    addKnight: (k) => {
        const now = Date.now();
        const newK: Knight = { ...k, version: 1, updatedAt: now };
        set(s => ({ knightsById: { ...s.knightsById, [newK.knightUID]: newK } }));
    },

    updateKnightSheet: (knightUID, patch) => {
        const s = get();
        const k = s.knightsById[knightUID];
        if (!k) return { ok:false, error:'Knight not found' };
        const next: Knight = {
            ...k,
            sheet: { ...k.sheet, ...patch },
            version: k.version + 1,
            updatedAt: Date.now(),
        };
        return set({ knightsById: { ...s.knightsById, [knightUID]: next } }), { ok:true };
    },

    renameKnight: (knightUID, name) => {
        set(s => {
            const k = s.knightsById[knightUID];
            if (!k) return s;
            return {
                knightsById: {
                    ...s.knightsById,
                    [knightUID]: { ...k, name, version: k.version + 1, updatedAt: Date.now() }
                }
            };
        });
    },

    completeQuest: (knightUID, chapter, outcome) => {
        const s = get();
        const k = s.knightsById[knightUID];
        if (!k) return { ok: false, error: 'Knight not found' };
        const ch = ensureChapter(k.sheet, chapter);
        completeQuestDomain(ch, outcome);
        set({
            knightsById: {
                ...s.knightsById,
                [knightUID]: { ...k, version: k.version + 1, updatedAt: Date.now() }
            }
        });
        return { ok: true };
    },

    addNormalInvestigation: (knightUID, chapter, invId, result) => {
        const s = get();
        const k = s.knightsById[knightUID];
        if (!k) return { ok: false, error: 'Knight not found' };
        const ch = ensureChapter(k.sheet, chapter);

        const r = addInvestigationDomain(ch, invId, 'normal', result, Date.now());
        if (!r.ok) return r;

        set({
            knightsById: {
                ...s.knightsById,
                [knightUID]: { ...k, version: k.version + 1, updatedAt: Date.now() }
            }
        });
        return { ok: true };
    },

    addLeadCompletion: (knightUID, chapter, invId) => {
        const s = get();
        const k = s.knightsById[knightUID];
        if (!k) return { ok: false, error: 'Knight not found' };
        const ch = ensureChapter(k.sheet, chapter);

        const r = addInvestigationDomain(ch, invId, 'lead', 'pass', Date.now());
        if (!r.ok) return r;

        set({
            knightsById: {
                ...s.knightsById,
                [knightUID]: { ...k, version: k.version + 1, updatedAt: Date.now() }
            }
        });
        return { ok: true };
    },

    convertFailToLead: (knightUID, chapter, invId) => {
        const s = get();
        const k = s.knightsById[knightUID];
        if (!k) return { ok: false, error: 'Knight not found' };
        const ch = ensureChapter(k.sheet, chapter);

        // Reuse domain: adds a new lead attempt, outcome 'pass'
        const r = addInvestigationDomain(ch, invId, 'lead', 'pass', Date.now());
        if (!r.ok) return r;

        set({
            knightsById: {
                ...s.knightsById,
                [knightUID]: { ...k, version: k.version + 1, updatedAt: Date.now() }
            }
        });
        return { ok: true };
    },

    isNormalLocked: (knightUID, chapter) => {
        const s = get();
        const k = s.knightsById[knightUID];
        if (!k) return true;
        const ch = ensureChapter(k.sheet, chapter);
        return normalLocked(ch);
    },
}));