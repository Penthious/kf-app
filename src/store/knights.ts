import { create } from 'zustand';
import {
    Knight,
    UUID,
    InvestigationResult,
    ensureKnight,
    ensureSheet,
    ensureChapter,
    addInvestigationDomain,
    completeQuestDomain,
    normalLocked,
} from '@/models/knight';

type KnightsState = {
    knightsById: Record<UUID, Knight>;
};

type OpResult = { ok: true } | { ok: false; error: string };

type KnightsActions = {
    /** Insert a new Knight and return the saved (normalized) object. */
    addKnight: (k: Omit<Knight, 'version' | 'updatedAt'>) => Knight;

    /** Rename (display name only). */
    renameKnight: (knightUID: UUID, name: string) => void;

    /** Merge a partial patch into the sheet (auto‑normalizes + bumps version). */
    updateKnightSheet: (knightUID: UUID, patch: Partial<Knight['sheet']>) => OpResult;

    /** Mark the chapter quest completed; optional explicit outcome. */
    completeQuest: (
        knightUID: UUID,
        chapter: number,
        outcome?: InvestigationResult
    ) => OpResult;

    /** Add a normal (non‑lead) investigation attempt with result. */
    addNormalInvestigation: (
        knightUID: UUID,
        chapter: number,
        invId: string,
        result: InvestigationResult
    ) => OpResult;

    /** Add a lead completion (always counted as pass). */
    addLeadCompletion: (knightUID: UUID, chapter: number, invId: string) => OpResult;

    /**
     * Keep the fail attempt in history, but also add a lead-pass completion
     * for the same investigation code.
     */
    convertFailToLead: (knightUID: UUID, chapter: number, invId: string) => OpResult;

    /** Whether normal investigations are locked for the given chapter. */
    isNormalLocked: (knightUID: UUID, chapter: number) => boolean;
};

export const useKnights = create<KnightsState & KnightsActions>((set, get) => ({
    knightsById: {},

    addKnight: (k) => {
        // Normalize on insert so all optional fields exist.
        const saved: Knight = ensureKnight({
            ...k,
            version: (k as any).version ?? 1,
            updatedAt: Date.now(),
            sheet: ensureSheet(k.sheet),
        } as Knight);

        set((s) => ({
            ...s,
            knightsById: { ...s.knightsById, [saved.knightUID]: saved },
        }));

        return saved;
    },

    updateKnightSheet: (knightUID, patch) => {
        const s = get();
        const current = s.knightsById[knightUID];
        if (!current) return { ok: false, error: 'Knight not found' };

        const next: Knight = {
            ...current,
            sheet: ensureSheet({ ...current.sheet, ...patch }),
            version: (current.version ?? 0) + 1,
            updatedAt: Date.now(),
        };

        set({ knightsById: { ...s.knightsById, [knightUID]: next } });
        return { ok: true };
    },

    renameKnight: (knightUID, name) => {
        set((s) => {
            const k = s.knightsById[knightUID];
            if (!k) return s;
            return {
                knightsById: {
                    ...s.knightsById,
                    [knightUID]: {
                        ...k,
                        name,
                        version: (k.version ?? 0) + 1,
                        updatedAt: Date.now(),
                    },
                },
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
                [knightUID]: {
                    ...k,
                    version: (k.version ?? 0) + 1,
                    updatedAt: Date.now(),
                },
            },
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
                [knightUID]: {
                    ...k,
                    version: (k.version ?? 0) + 1,
                    updatedAt: Date.now(),
                },
            },
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
                [knightUID]: {
                    ...k,
                    version: (k.version ?? 0) + 1,
                    updatedAt: Date.now(),
                },
            },
        });
        return { ok: true };
    },

    convertFailToLead: (knightUID, chapter, invId) => {
        const s = get();
        const k = s.knightsById[knightUID];
        if (!k) return { ok: false, error: 'Knight not found' };

        const ch = ensureChapter(k.sheet, chapter);
        // Domain will keep history and add a new lead‑pass completion.
        const r = addInvestigationDomain(ch, invId, 'lead', 'pass', Date.now());
        if (!r.ok) return r;

        set({
            knightsById: {
                ...s.knightsById,
                [knightUID]: {
                    ...k,
                    version: (k.version ?? 0) + 1,
                    updatedAt: Date.now(),
                },
            },
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