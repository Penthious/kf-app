import KNIGHT_CATALOG from '@/catalogs/knights';
import {
    InvestigationResult,
    Knight,
    UUID,
    addInvestigationDomain,
    completeQuestDomain,
    ensureChapter,
    ensureKnight,
    ensureSheet,
    normalLocked,
} from '@/models/knight';
import { create } from 'zustand';


export type KnightsState = {
    knightsById: Record<UUID, Knight>;
};

type OpResult = { ok: true } | { ok: false; error: string };

export type KnightsActions = {
    /** Insert a new Knight and return the saved (normalized) object. */
    addKnight: (k: Omit<Knight, 'version' | 'updatedAt'>) => Knight;

    /** Rename (display name only). */
    renameKnight: (knightUID: UUID, name: string) => void;

    /** Merge a partial patch into the sheet (auto-normalizes + bumps version). */
    updateKnightSheet: (knightUID: UUID, patch: Partial<Knight['sheet']>) => OpResult;

    /** Mark the chapter quest completed; optional explicit outcome ('pass' | 'fail'). */
    completeQuest: (knightUID: UUID, chapter: number, outcome?: InvestigationResult) => OpResult;

    /** Add a normal (non-lead) investigation attempt with result. */
    addNormalInvestigation: (
        knightUID: UUID,
        chapter: number,
        invId: string,
        result: InvestigationResult
    ) => OpResult;

    /** Add a lead completion (always counted as pass). */
    addLeadCompletion: (knightUID: UUID, chapter: number, invId: string) => OpResult;

    /** Whether normal investigations are locked for the given chapter. */
    isNormalLocked: (knightUID: UUID, chapter: number) => boolean;
};

export const useKnights = create<KnightsState & KnightsActions>((set, get) => ({
    knightsById: {},

    addKnight: (k) => {
        const cat = Array.isArray(KNIGHT_CATALOG)
            ? (KNIGHT_CATALOG as Array<{ id: string; startingVirtues?: any; cipherStart?: number }>)
                .find((c) => c.id === k.catalogId)
            : undefined;

        const seededSheet = ensureSheet({
            ...k.sheet,
            virtues: cat?.startingVirtues ?? k.sheet?.virtues,
            cipher: typeof cat?.cipherStart === 'number' ? cat!.cipherStart : k.sheet?.cipher,
        });

        const saved: Knight = ensureKnight({
            ...k,
            sheet: seededSheet,
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

    isNormalLocked: (knightUID, chapter) => {
        const s = get();
        const k = s.knightsById[knightUID];
        if (!k) return true;
        const ch = ensureChapter(k.sheet, chapter);
        return normalLocked(ch);
    },
}));