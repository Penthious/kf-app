export type UUID = string;

export type InvestigationVia = 'normal' | 'lead';
export type InvestigationResult = 'pass' | 'fail';

export type InvestigationAttempt = {
    invId: string;                 // e.g., "I1-1".."I1-5", "I2-3", etc (your naming)
    via: InvestigationVia;         // 'normal' or 'lead'
    result: InvestigationResult;   // 'pass' | 'fail'
    at: number;                    // timestamp ms
};

export type InvestigationEntry = {
    // Canonical per-invId status for this chapter:
    invId: string;
    via: InvestigationVia;         // latest via that completed this invId
    outcome: InvestigationResult;  // pass | fail  (lead implies 'pass')
    attempts: number;              // normal retries counted here
    firstAt: number;
    lastAt: number;
};

export type ChapterQuest = {
    completed: boolean;            // true as soon as quest is attempted (even if fail)
    outcome?: InvestigationResult; // optional pass/fail for display
};

export type ChapterInvestigations = {
    /** Full history (auditable). */
    history: InvestigationAttempt[];

    /**
     * Canonical per-invId result for this chapter (distinct investigations).
     * Key: invId (e.g., "I1-1")
     */
    entries: Record<string, InvestigationEntry>;
};

export type ChapterProgress = {
    quest: ChapterQuest;
    investigations: ChapterInvestigations;
};

export type Virtues = {
    bravery: number;
    tenacity: number;
    sagacity: number;
    fortitude: number;
    might: number;
    insight: number;
};

export type ViceCounter = {
    cowardice: number;   // 0..4 each
    dishonor: number;
    duplicity: number;
    disregard: number;
    cruelty: number;
    treachery: number;
};

export type KnightRapport = {
    withKnightUID: UUID;
    ticks: 0 | 1 | 2 | 3;
    boonNote?: string;
};

export type KnightSheet = {
    virtues: Virtues;
    vices: ViceCounter;

    bane: number;
    sighOfGraal: 0 | 1;
    gold: number;

    /** If you use “clue tokens” as a currency, keep it here or in campaign. */
    clues?: number;

    /** Optional separate “leads” counter if you keep both. */
    leads?: number;

    /** Current chapter (1..5). */
    chapter: number;

    /** Per-chapter data keyed by '1'..'5'. */
    chapters: Record<string, ChapterProgress>;

    armory: string[];
    prologueDone: boolean;
    postgameDone: boolean;
};

export type Knight = {
    knightUID: UUID;
    ownerUserId: string;
    catalogId: string;     // Kara / Renholder / etc id
    name: string;
    sheet: KnightSheet;
    rapport: KnightRapport[];
    version: number;
    updatedAt: number;
};

/* -------------------- Pure helpers (no store required) -------------------- */

export function ensureChapter(sheet: KnightSheet, chapter: number): ChapterProgress {
    // guard old data that never had chapters created
    if (!sheet.chapters) (sheet as any).chapters = {};

    const fallback = Number.isFinite(sheet.chapter) ? sheet.chapter : 1;
    const num = Math.max(1, Math.floor(chapter || fallback || 1));
    const key = String(num);

    let ch = sheet.chapters[key];
    if (!ch) {
        ch = {
            quest: { completed: false, outcome: undefined },
            investigations: { history: [], entries: {} },
        };
        sheet.chapters[key] = ch;
    }
    return ch;
}
/** Count distinct investigations completed via NORMAL in this chapter (pass or fail). */
export function countDistinctNormal(ch: ChapterProgress): number {
    return Object.values(ch.investigations.entries).filter(e => e.via === 'normal').length;
}

/** Count total distinct completed investigations (normal + lead) in this chapter. */
export function countDistinctTotal(ch: ChapterProgress): number {
    return Object.keys(ch.investigations.entries).length;
}

/** Has a specific investigation already PASSED this chapter? (blocks further attempts) */
export function hasPassed(ch: ChapterProgress, invId: string): boolean {
    const e = ch.investigations.entries[invId];
    return !!e && e.outcome === 'pass';
}

/** Are NORMAL investigations locked now? (quest completed + 3 distinct normal done) */
export function normalLocked(ch: ChapterProgress): boolean {
    return ch.quest.completed && countDistinctNormal(ch) >= 3;
}

/**
 * Add or update entry for an investigation.
 * - For 'normal': creates/updates entry; outcome may be 'pass' or 'fail'. Distinct-normal cap: 3.
 * - For 'lead': marks as PASS, does not count against normal cap; total distinct cap: 5.
 * Returns {ok, error} for rule violations.
 */
export function addInvestigationDomain(
    ch: ChapterProgress,
    invId: string,
    via: InvestigationVia,
    result: InvestigationResult,
    whenMs: number = Date.now()
): { ok: boolean; error?: string } {
    // Prevent retake if already passed
    if (hasPassed(ch, invId)) {
        return { ok: false, error: 'This investigation already passed this chapter.' };
    }

    // Normal flow: cap at 3 distinct NORMAL
    if (via === 'normal') {
        if (normalLocked(ch)) {
            return { ok: false, error: 'Normal investigations are locked (quest + 3 done).' };
        }
        // If entry exists (same invId), just update attempts/result; else enforce distinct cap
        const exists = !!ch.investigations.entries[invId];
        if (!exists && countDistinctNormal(ch) >= 3) {
            return { ok: false, error: 'You already have 3 normal investigations this chapter.' };
        }
    }

    // Total distinct cap: 5 (normal + lead)
    const existsEntry = !!ch.investigations.entries[invId];
    if (!existsEntry && countDistinctTotal(ch) >= 5) {
        return { ok: false, error: 'You already completed 5 investigations this chapter.' };
    }

    // Record in history
    ch.investigations.history.push({ invId, via, result, at: whenMs });

    // Upsert canonical entry
    const prev = ch.investigations.entries[invId];
    const attempts = (prev?.attempts ?? 0) + (via === 'normal' ? 1 : 0);

    const outcome: InvestigationResult = via === 'lead' ? 'pass' : result;
    const firstAt = prev?.firstAt ?? whenMs;
    const entry: InvestigationEntry = {
        invId,
        via, // latest via
        outcome,
        attempts,
        firstAt,
        lastAt: whenMs,
    };
    ch.investigations.entries[invId] = entry;

    return { ok: true };
}

/** Mark quest as completed (even on fail). */
export function completeQuestDomain(ch: ChapterProgress, outcome?: InvestigationResult) {
    ch.quest.completed = true;
    if (outcome) ch.quest.outcome = outcome;
}