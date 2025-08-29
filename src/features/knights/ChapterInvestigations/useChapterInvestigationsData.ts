import {
    countNormalDisplay,
    countTotalDisplay,
    ensureChapter,
    ensureSheet,
    InvestigationResult,
} from '@/models/knight';
import { useKnights } from '@/store/knights';
import { useMemo } from 'react';

export interface InvestigationEntry {
    code: string;
    isCompleted: boolean;
    lastResult: InvestigationResult | undefined;
    via: 'lead' | 'normal';
}

export interface ChapterInvestigationsData {
    entries: InvestigationEntry[];
    normalDone: number;
    totalDone: number;
    locked: boolean;
    addNormalInvestigation: (code: string, result: 'pass' | 'fail') => Promise<void>;
    addLeadCompletion: (code: string) => Promise<void>;
}

/** Make keys like I1-1 … I1-5 for the given chapter */
function chapterInvKeys(chapter: number): string[] {
    const c = Math.max(1, Math.min(5, Math.floor(chapter || 1)));
    return [1, 2, 3, 4, 5].map((i) => `I${c}-${i}`);
}

export function useChapterInvestigationsData(knightUID: string, chapter: number): ChapterInvestigationsData {
    const {
        knightsById,
        addNormalInvestigation: storeAddNormalInvestigation,
        addLeadCompletion: storeAddLeadCompletion,
        isNormalLocked,
    } = useKnights() as any;

    const k = knightsById?.[knightUID];
    const sheet = ensureSheet(k?.sheet);
    const ch = ensureChapter(sheet, chapter);

    const normalDone = countNormalDisplay(ch);
    const totalDone = countTotalDisplay(ch);
    const locked = isNormalLocked?.(knightUID, chapter) ?? false;

    // Derive entries from attempts + completed
    const attemptsArr = ch.attempts ?? [];
    const completedSet = new Set(ch.completed ?? []);
    const entries = useMemo(() => {
        return chapterInvKeys(chapter).map((code) => {
            const codeAttempts = attemptsArr.filter((a) => a.code === code);
            const last = codeAttempts.at(-1);
            const isCompleted = completedSet.has(code);
            const viaLead = codeAttempts.some((a) => a.lead && a.result === 'pass');

            return {
                code,
                isCompleted,
                lastResult: last?.result as InvestigationResult | undefined,
                via: viaLead ? 'lead' : last?.lead ? 'lead' : 'normal',
            } as const;
        });
    }, [chapter, attemptsArr, completedSet]);

    const addNormalInvestigation = async (code: string, result: 'pass' | 'fail') => {
        await storeAddNormalInvestigation(knightUID, chapter, code, result);
    };

    const addLeadCompletion = async (code: string) => {
        await storeAddLeadCompletion(knightUID, chapter, code);
    };

    return {
        entries,
        normalDone,
        totalDone,
        locked,
        addNormalInvestigation,
        addLeadCompletion,
    };
}
