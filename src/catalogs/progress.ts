// Map (chapter, investigationsCompletedThisChapter) -> stage index.
// Per your rule: every 4 rows = a chapter: [Quest, Inv1, Inv2, Inv3]
export function stageIndexFromProgress(chapter: number, invCompleted: number) {
    const ch = Math.max(1, Math.floor(chapter));         // 1-based
    const inv = Math.min(Math.max(0, Math.floor(invCompleted)), 3); // clamp 0..3
    return (ch - 1) * 4 + inv;                            // 0-based stage index
}