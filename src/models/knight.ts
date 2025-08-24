export type Virtues = {
    bravery: number;
    tenacity: number;
    sagacity: number;
    fortitude: number;
    might: number;
    insight: number;
};

export type RapportEntry = {
    withKnightUID: string;   // UID of the OTHER knight (can be external)
    displayName: string;     // friendly label
    ticks: 0 | 1 | 2 | 3;    // 0–3
    boon?: string;           // optional when ticks=3
    updatedAt: number;
};

// Investigation model: per-attempt history + completed list
export type InvestigationResult = 'pass' | 'fail';

export type InvestigationAttempt = {
    code: string;                  // e.g., "I1-1"
    result: InvestigationResult;   // pass | fail
    at: number;                    // timestamp (ms)
};

export type InvestigationsPerChapter = {
    attempts: InvestigationAttempt[]; // history for this chapter
    completed: string[];              // codes marked completed (max 5 per chapter)
};

export type ChoiceMatrix = {
    // Numeric 1..30 + E1..E10
    [key: string]: boolean | undefined;
};

export type KnightSheet = {
    virtues: Virtues;
    bane: number;
    gold: number;
    leads: number;
    sighOfGraal: 0 | 1;
    chapter: number;            // 0..5
    firstDeath?: boolean;     // has this knight had their first death?
    chapterQuest?: string;      // free text
    investigations: InvestigationsPerChapter[]; // length 5
    choiceMatrix: ChoiceMatrix; // {'1':true, ..., 'E10':false}
    prologueDone: boolean;
    postgameDone: boolean;
    notes?: string;
    saints?: string[];
    mercenaries?: string[];
};

export type Knight = {
    knightUID: string;
    ownerUserId?: string;
    catalogId: string;          // 'renholder', 'kara', etc.
    name: string;
    version: number;
    updatedAt: number;
    rapport: RapportEntry[];
    sheet: KnightSheet;
};

// Defaults
export const defaultInvestigations = (): InvestigationsPerChapter[] =>
    Array.from({ length: 5 }, () => ({ attempts: [], completed: [] }));

export const defaultChoiceMatrix = (): ChoiceMatrix => {
    const matrix: ChoiceMatrix = {};
    for (let i = 1; i <= 30; i++) matrix[String(i)] = false;
    for (let i = 1; i <= 10; i++) matrix[`E${i}`] = false;
    return matrix;
};