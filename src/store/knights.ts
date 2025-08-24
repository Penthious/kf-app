import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    Knight,
    KnightSheet,
    RapportEntry,
    InvestigationsPerChapter,
    InvestigationAttempt,
    InvestigationResult,
    defaultInvestigations,
    defaultChoiceMatrix
} from '@/models/knight';

type KnightsState = {
    knightsById: Record<string, Knight>;

    addKnight: (k: Omit<Knight, 'version' | 'updatedAt'>) => Knight;
    removeKnight: (id: string) => void;
    renameKnight: (id: string, name: string) => void;

    updateKnightSheet: (id: string, patch: Partial<KnightSheet>) => void;

    setRapport: (
        id: string,
        withKnightUID: string,
        displayName: string,
        ticks: 0 | 1 | 2 | 3,
        boon?: string
    ) => void;

    // replaces arrays only when provided
    setInvestigations: (
        id: string,
        chapterIndex: number,
        patch: Partial<InvestigationsPerChapter>
    ) => void;

    addInvestigationAttempt: (
        id: string,
        chapterIndex: number,
        code: string,
        result: InvestigationResult
    ) => void;

    toggleInvestigationCompleted: (
        id: string,
        chapterIndex: number,
        code: string
    ) => void;

    toggleChoiceMatrix: (id: string, key: string) => void;
};

export const useKnights = create<KnightsState>()(
    persist(
        (set, get) => ({
            knightsById: {},

            addKnight: (k) => {
                const now = Date.now();
                const withDefaults: Knight = {
                    ...k,
                    version: 1,
                    updatedAt: now,
                    sheet: {
                        virtues: k.sheet.virtues,
                        bane: k.sheet.bane ?? 0,
                        gold: k.sheet.gold ?? 0,
                        leads: k.sheet.leads ?? 0,
                        sighOfGraal: k.sheet.sighOfGraal ?? 0,
                        chapter: k.sheet.chapter ?? 0,
                        chapterQuest: k.sheet.chapterQuest ?? '',
                        investigations: k.sheet.investigations ?? defaultInvestigations(),
                        choiceMatrix: k.sheet.choiceMatrix ?? defaultChoiceMatrix(),
                        prologueDone: k.sheet.prologueDone ?? false,
                        postgameDone: k.sheet.postgameDone ?? false,
                        notes: k.sheet.notes ?? '',
                        saints: k.sheet.saints ?? [],
                        mercenaries: k.sheet.mercenaries ?? []
                    }
                };

                set((s) => ({
                    knightsById: { ...s.knightsById, [withDefaults.knightUID]: withDefaults }
                }));
                return withDefaults;
            },

            removeKnight: (id) =>
                set((s) => {
                    const copy = { ...s.knightsById };
                    delete copy[id];
                    return { knightsById: copy };
                }),

            renameKnight: (id, name) =>
                set((s) => {
                    const k = s.knightsById[id];
                    if (!k) return {};
                    return {
                        knightsById: {
                            ...s.knightsById,
                            [id]: { ...k, name, updatedAt: Date.now() }
                        }
                    };
                }),

            updateKnightSheet: (id, patch) =>
                set((s) => {
                    const k = s.knightsById[id];
                    if (!k) return {};
                    return {
                        knightsById: {
                            ...s.knightsById,
                            [id]: { ...k, sheet: { ...k.sheet, ...patch }, updatedAt: Date.now() }
                        }
                    };
                }),

            setRapport: (id, withKnightUID, displayName, ticks, boon) =>
                set((s) => {
                    const k = s.knightsById[id];
                    if (!k) return {};
                    const existing = k.rapport.find((r) => r.withKnightUID === withKnightUID);
                    let next: RapportEntry[];
                    if (existing) {
                        next = k.rapport.map((r) =>
                            r.withKnightUID === withKnightUID
                                ? { ...r, ticks, boon, displayName, updatedAt: Date.now() }
                                : r
                        );
                    } else {
                        next = [
                            ...k.rapport,
                            { withKnightUID, displayName, ticks, boon, updatedAt: Date.now() }
                        ];
                    }
                    return {
                        knightsById: {
                            ...s.knightsById,
                            [id]: { ...k, rapport: next, updatedAt: Date.now() }
                        }
                    };
                }),

            // Deep-merge patch for a chapter investigations object
            setInvestigations: (id, chapterIndex, patch) =>
                set((s) => {
                    const k = s.knightsById[id];
                    if (!k) return {};
                    const list = k.sheet.investigations?.length
                        ? [...k.sheet.investigations]
                        : defaultInvestigations();
                    const safeIdx = Math.max(0, Math.min(4, chapterIndex));
                    const cur = list[safeIdx] ?? { attempts: [], completed: [] };
                    const next: InvestigationsPerChapter = {
                        attempts: patch.attempts !== undefined ? patch.attempts : cur.attempts,
                        completed: patch.completed !== undefined ? patch.completed : cur.completed
                    };
                    list[safeIdx] = next;
                    return {
                        knightsById: {
                            ...s.knightsById,
                            [id]: {
                                ...k,
                                sheet: { ...k.sheet, investigations: list },
                                updatedAt: Date.now()
                            }
                        }
                    };
                }),

            addInvestigationAttempt: (id, chapterIndex, code, result) =>
                set((s) => {
                    const k = s.knightsById[id];
                    if (!k) return {};
                    const list = k.sheet.investigations?.length
                        ? [...k.sheet.investigations]
                        : defaultInvestigations();
                    const safeIdx = Math.max(0, Math.min(4, chapterIndex));
                    const cur = list[safeIdx] ?? { attempts: [], completed: [] };
                    // Do not allow retakes once an investigation is completed
                    if (cur.completed.includes(code)) {
                      return {};
                    }
                    const attempt: InvestigationAttempt = { code, result, at: Date.now() };
                    const next: InvestigationsPerChapter = {
                        attempts: [...cur.attempts, attempt].slice(-12), // keep last 12
                        completed: cur.completed
                    };
                    list[safeIdx] = next;
                    return {
                        knightsById: {
                            ...s.knightsById,
                            [id]: {
                                ...k,
                                sheet: { ...k.sheet, investigations: list },
                                updatedAt: Date.now()
                            }
                        }
                    };
                }),

            toggleInvestigationCompleted: (id, chapterIndex, code) =>
                set((s) => {
                    const k = s.knightsById[id];
                    if (!k) return {};
                    const list = k.sheet.investigations?.length
                        ? [...k.sheet.investigations]
                        : defaultInvestigations();
                    const safeIdx = Math.max(0, Math.min(4, chapterIndex));
                    const cur = list[safeIdx] ?? { attempts: [], completed: [] };
                    const exists = cur.completed.includes(code);
                    const nextCompleted = exists
                        ? cur.completed.filter((c) => c !== code)
                        : [...cur.completed, code].slice(0, 5); // max 5 per chapter
                    list[safeIdx] = { attempts: cur.attempts, completed: nextCompleted };
                    return {
                        knightsById: {
                            ...s.knightsById,
                            [id]: {
                                ...k,
                                sheet: { ...k.sheet, investigations: list },
                                updatedAt: Date.now()
                            }
                        }
                    };
                }),

            toggleChoiceMatrix: (id, key) =>
                set((s) => {
                    const k = s.knightsById[id];
                    if (!k) return {};
                    const cm = { ...(k.sheet.choiceMatrix ?? defaultChoiceMatrix()) };
                    cm[key] = !cm[key];
                    return {
                        knightsById: {
                            ...s.knightsById,
                            [id]: {
                                ...k,
                                sheet: { ...k.sheet, choiceMatrix: cm },
                                updatedAt: Date.now()
                            }
                        }
                    };
                })
        }),
        { name: 'knights-store' }
    )
);