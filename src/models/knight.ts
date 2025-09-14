// --- Core types ---
export type UUID = string;

export type Virtues = {
  bravery: number;
  tenacity: number;
  sagacity: number;
  fortitude: number;
  might: number;
  insight: number;
};

export type ViceCounter = {
  cowardice: number; // vs Bravery
  dishonor: number; // vs Tenacity
  duplicity: number; // vs Sagacity
  disregard: number; // vs Fortitude
  cruelty: number; // vs Might
  treachery: number; // vs Insight
};

export type Note = {
  id: string; // uuid
  text: string;
  at: number; // ms epoch
};

export type ChapterProgress = {
  quest: { completed: boolean; outcome?: 'pass' | 'fail' };
  // Attempts list preserves history; “lead: true” marks lead-completion
  attempts: Array<{
    code: string; // e.g. 'I1-1'
    result: 'pass' | 'fail';
    lead?: boolean; // true if completed by leads
    at?: number;
  }>;
  completed: string[]; // normalized investigation codes you've completed
};

export type KnightRapport = {
  withKnightUID: UUID;
  ticks: 0 | 1 | 2 | 3;
  boon?: string; // free text
};

export type KnightSheet = {
  virtues: Virtues;
  vices: ViceCounter;

  bane: number;
  sighOfGraal: 0 | 1;
  gold: number;

  // we keep both counters available explicitly
  leads: number; // required
  clues?: number; // optional currency if you want it

  // campaign/story
  chapter: number; // 1..5
  chapters: Record<string, ChapterProgress>;
  prologueDone: boolean;
  postgameDone: boolean;

  // misc / meta
  firstDeath: boolean;
  choiceMatrix: Record<string, boolean>; // '1'..'30', 'E1'..'E10' => true
  choiceMatrixNotes: Record<string, string>; // '1'..'30', 'E1'..'E10' => note text
  saints: string[]; // catalog ids
  mercenaries: string[]; // catalog ids
  armory: string[]; // gear ids (for now)
  notes: Note[]; // player notes
  cipher: number;
};

export type Knight = {
  knightUID: UUID;
  ownerUserId: string;
  catalogId: string;
  name: string;
  sheet: KnightSheet;
  rapport: KnightRapport[];
  version: number;
  updatedAt: number;
};

// --- Defaults & migration helpers ---

export function defaultVices(): ViceCounter {
  return { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 };
}

export function defaultVirtues(): Virtues {
  return { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 };
}

export function defaultChapterProgress(): ChapterProgress {
  return { quest: { completed: false }, attempts: [], completed: [] };
}

export function defaultSheet(): KnightSheet {
  return {
    virtues: defaultVirtues(),
    vices: defaultVices(),
    bane: 0,
    sighOfGraal: 0,
    gold: 0,
    leads: 0,
    clues: 0,
    chapter: 1,
    chapters: {},
    prologueDone: false,
    postgameDone: false,
    firstDeath: false,
    choiceMatrix: {},
    choiceMatrixNotes: {},
    saints: [],
    mercenaries: [],
    armory: [],
    notes: [],
    cipher: 0,
  };
}

/** Create a knight sheet with startingVirtues applied from the catalog */
export function createSheetWithStartingVirtues(
  catalogId: string,
  catalog: Array<{ id: string; startingVirtues?: { [key: string]: number } }>
): KnightSheet {
  const sheet = defaultSheet();
  const catalogEntry = catalog.find(k => k.id === catalogId);

  if (catalogEntry?.startingVirtues) {
    sheet.virtues = { ...sheet.virtues, ...catalogEntry.startingVirtues };
  }

  // Initialize chapter 1 with default progress data
  sheet.chapters['1'] = defaultChapterProgress();

  return sheet;
}

/** Count distinct investigations that have been ATTEMPTED (pass, fail, or lead). */
export function countDistinctAttempted(ch?: ChapterProgress): number {
  if (!ch) return 0;
  const seen = new Set<string>();
  for (const a of ch.attempts ?? []) {
    if (!a?.code) continue;
    seen.add(a.code);
  }
  return seen.size;
}
/** Count total distinct completed investigations (normal or lead). */
export function countDistinctTotal(ch?: ChapterProgress): number {
  return ch?.completed?.length ?? 0;
}

/** UI: cap Normal display at 3 (lock threshold). */
export function countNormalDisplay(ch?: ChapterProgress): number {
  return Math.min(3, countDistinctAttempted(ch));
}

/** UI: cap Total display at 5 (rule limit). */
export function countTotalDisplay(ch?: ChapterProgress): number {
  return Math.min(5, countDistinctTotal(ch));
}

/** Ensure a sheet has all new fields with safe defaults (non‑destructive). */
export function ensureSheet(s: Partial<KnightSheet> | undefined): KnightSheet {
  const base = defaultSheet();
  const out: KnightSheet = {
    ...base,
    ...(s as Partial<KnightSheet>),
    virtues: { ...base.virtues, ...(s?.virtues ?? {}) },
    vices: { ...base.vices, ...(s?.vices ?? {}) },
    leads: s?.leads ?? 0,
    clues: s?.clues ?? base.clues,
    chapters: { ...base.chapters, ...(s?.chapters ?? {}) },
    choiceMatrix: { ...base.choiceMatrix, ...(s?.choiceMatrix ?? {}) },
    choiceMatrixNotes: { ...base.choiceMatrixNotes, ...(s?.choiceMatrixNotes ?? {}) },
    saints: s?.saints ?? [],
    mercenaries: s?.mercenaries ?? [],
    armory: s?.armory ?? [],
    notes: s?.notes ?? [],
    firstDeath: !!s?.firstDeath,
    prologueDone: !!s?.prologueDone,
    postgameDone: !!s?.postgameDone,
    cipher: typeof s?.cipher === 'number' ? s!.cipher : base.cipher,
  };
  return out;
}

/** Non‑destructive migration for a Knight object */
export function ensureKnight(k: Knight): Knight {
  return {
    ...k,
    sheet: ensureSheet(k.sheet),
    version: k.version ?? 1,
    updatedAt: k.updatedAt ?? Date.now(),
  };
}

export type InvestigationResult = 'pass' | 'fail';
type InvestigationKind = 'normal' | 'lead';
type DomainOk = { ok: true };
type DomainErr = { ok: false; error: string };
type DomainResult = DomainOk | DomainErr;

/**
 * Whether further NORMAL investigations are locked for the chapter.
 * Lock when there are 3 NORMAL passes (distinct by code).
 * Only LEAD completions remain allowed after this point.
 */
export function normalLocked(ch: ChapterProgress): boolean {
  return countDistinctAttempted(ch) >= 3;
}

/** Mark the chapter quest as completed; failing still counts as completed. */
export function completeQuestDomain(ch: ChapterProgress, outcome?: InvestigationResult): void {
  if (!ch.quest) ch.quest = { completed: false };
  ch.quest.completed = true;
  if (outcome) ch.quest.outcome = outcome;
}

/**
 * Add an investigation attempt and (if appropriate) record it as completed.
 *
 * Guards:
 * - If kind==='normal' and normalLocked(ch) -> error
 * - You cannot complete the same investigation code twice (idempotent on `completed`)
 * - At most 5 distinct completed investigations per chapter (game rule)
 *
 * History:
 * - Every call appends an attempt to `attempts` (so fails are preserved)
 */
export function addInvestigationDomain(
  ch: ChapterProgress,
  invId: string,
  kind: InvestigationKind,
  result: InvestigationResult,
  at: number = Date.now()
): DomainResult {
  const code = invId.trim(); // e.g. 'I1-1', 'I1-2', etc.
  if (!code) return { ok: false, error: 'Missing investigation id' };

  // Ensure arrays exist
  ch.attempts = ch.attempts ?? [];
  ch.completed = ch.completed ?? [];

  // Normal attempts may be locked by progression
  console.log('normal: ', kind);
  console.log('locked: ', normalLocked(ch));
  if (kind === 'normal' && normalLocked(ch)) {
    return { ok: false, error: 'Normal investigations are locked for this chapter' };
  }

  // Always store the attempt for history
  ch.attempts.push({ code, result, lead: kind === 'lead', at });

  // Determine if this call should mark the investigation as "completed"
  const shouldComplete = kind === 'lead' || result === 'pass';
  const alreadyCompleted = ch.completed.includes(code);

  // Max 5 distinct completed investigations per chapter
  if (shouldComplete && !alreadyCompleted) {
    if (ch.completed.length >= 5) {
      return { ok: false, error: 'Maximum of 5 completed investigations per chapter' };
    }
    ch.completed.push(code);
  }

  return { ok: true };
}

// Convenience: count completed investigations in a chapter (used by Kingdoms)
export function countCompletedInvestigations(ch: ChapterProgress | undefined): number {
  return ch ? ch.completed.length : 0;
}

// Ensure a chapter slot exists and return it
export function ensureChapter(sheet: KnightSheet, chapter: number): ChapterProgress {
  const key = String(Math.max(1, Math.min(5, Math.floor(chapter))));
  const ch = sheet.chapters[key];
  if (ch) return ch;
  const created = defaultChapterProgress();
  sheet.chapters[key] = created;
  return created;
}
