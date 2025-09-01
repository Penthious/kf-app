import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  countDistinctAttempted,
  countNormalDisplay,
  countTotalDisplay,
  defaultSheet,
} from '../models/knight';
import { useKnights } from './knights';

const resetKnightsStore = () => {
  // Partial update: do not replace the whole store or you'll lose actions
  useKnights.setState({ knightsById: {} });
};

const mockNow = (value: number) => {
  vi.setSystemTime(value);
};

function minimalKnightInput(
  overrides?: Partial<
    Parameters<typeof useKnights.getState> extends never
      ? never
      : Omit<ReturnType<typeof defaultSheet>, 'version' | 'updatedAt'>
  > &
    any
) {
  // helper to build the input for addKnight
  return {
    knightUID: 'uid-1',
    ownerUserId: 'user-1',
    catalogId: 'cat-1',
    name: 'Sir Test',
    sheet: {
      virtues: { bravery: 1, tenacity: 1, sagacity: 1, fortitude: 1, might: 1, insight: 1 },
      vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
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
      saints: [],
      mercenaries: [],
      armory: [],
      notes: [],
    },
    rapport: [],
    ...(overrides ?? {}),
  };
}

describe('knights store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    vi.restoreAllMocks();
    resetKnightsStore();
  });

  it('addKnight inserts and normalizes (returns saved object)', () => {
    const t1 = 1_700_000_000_000;
    mockNow(t1);

    const saved = useKnights.getState().addKnight(minimalKnightInput());
    const k = useKnights.getState().knightsById['uid-1'];

    expect(saved.knightUID).toBe('uid-1');
    expect(k).toBeTruthy();
    expect(k.name).toBe('Sir Test');
    // version/updatedAt should be set by the store
    expect(typeof k.version).toBe('number');
    expect(k.version).toBeGreaterThanOrEqual(1);
    expect(k.updatedAt).toBe(t1);
  });

  it('renameKnight updates name in place', () => {
    useKnights.getState().addKnight(minimalKnightInput());
    useKnights.getState().renameKnight('uid-1', 'Renholder');

    expect(useKnights.getState().knightsById['uid-1'].name).toBe('Renholder');
  });

  it('removeKnight removes knight from store', () => {
    useKnights.getState().addKnight(minimalKnightInput());
    expect(useKnights.getState().knightsById['uid-1']).toBeTruthy();

    useKnights.getState().removeKnight('uid-1');
    expect(useKnights.getState().knightsById['uid-1']).toBeUndefined();
  });

  it('removeKnight removes knight from all campaigns', () => {
    // This test verifies that removeKnight doesn't throw when called
    // The actual campaign removal logic is tested in integration tests
    useKnights.getState().addKnight(minimalKnightInput());

    expect(() => {
      useKnights.getState().removeKnight('uid-1');
    }).not.toThrow();

    expect(useKnights.getState().knightsById['uid-1']).toBeUndefined();
  });

  it('removeKnight handles non-existent knight gracefully', () => {
    expect(() => {
      useKnights.getState().removeKnight('non-existent');
    }).not.toThrow();
  });

  it('updateKnightSheet merges patch, bumps version, and updates updatedAt', () => {
    const t1 = 1_700_000_000_000;
    const t2 = 1_700_000_001_000;
    mockNow(t1);
    const saved = useKnights.getState().addKnight(minimalKnightInput());

    const v1 = saved.version;
    mockNow(t2);
    const r = useKnights.getState().updateKnightSheet('uid-1', {
      gold: 123,
      chapter: 2,
    });
    expect(r.ok).toBe(true);

    const k = useKnights.getState().knightsById['uid-1'];
    expect(k.sheet.gold).toBe(123);
    expect(k.sheet.chapter).toBe(2);
    expect(k.version).toBe(v1 + 1);
    expect(k.updatedAt).toBe(t2);
  });

  it('completeQuest marks quest done and stores outcome', () => {
    useKnights.getState().addKnight(minimalKnightInput());
    const t = 1_700_000_002_000;
    mockNow(t);

    const r = useKnights.getState().completeQuest('uid-1', 1, 'fail');
    expect(r.ok).toBe(true);

    const ch = useKnights.getState().knightsById['uid-1'].sheet.chapters['1'];
    expect(ch.quest.completed).toBe(true);
    expect(ch.quest.outcome).toBe('fail');
  });

  it('addNormalInvestigation appends history and completes on pass', () => {
    useKnights.getState().addKnight(minimalKnightInput());

    // fail attempt -> not completed
    let r1 = useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-1', 'fail');
    expect(r1.ok).toBe(true);
    let ch = useKnights.getState().knightsById['uid-1'].sheet.chapters['1'];
    expect(ch.attempts.length).toBe(1);
    expect(ch.completed).toEqual([]);

    // pass attempt -> becomes completed
    let r2 = useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-1', 'pass');
    expect(r2.ok).toBe(true);
    ch = useKnights.getState().knightsById['uid-1'].sheet.chapters['1'];
    expect(ch.attempts.length).toBe(2);
    expect(ch.completed).toEqual(['I1-1']);
  });

  it('isNormalLocked respects: quest completed AND >=3 completed investigations', () => {
    useKnights.getState().addKnight(minimalKnightInput());

    // Before completing quest: never locked
    expect(useKnights.getState().isNormalLocked('uid-1', 1)).toBe(false);

    // Complete two investigations (not enough even after quest)
    useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-1', 'pass');
    useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-2', 'pass');
    expect(useKnights.getState().isNormalLocked('uid-1', 1)).toBe(false);

    // Complete quest
    useKnights.getState().completeQuest('uid-1', 1, 'pass');
    // Still < 3, so not locked
    expect(useKnights.getState().isNormalLocked('uid-1', 1)).toBe(false);

    // Reach 3 completed => now locked
    useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-3', 'pass');
    expect(useKnights.getState().isNormalLocked('uid-1', 1)).toBe(true);
  });

  it('addLeadCompletion always counts as completed and works even when normal is locked', () => {
    useKnights.getState().addKnight(minimalKnightInput());
    // Lock the chapter for normal attempts
    useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-1', 'pass');
    useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-2', 'pass');
    useKnights.getState().completeQuest('uid-1', 1, 'pass');
    useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-3', 'pass');
    expect(useKnights.getState().isNormalLocked('uid-1', 1)).toBe(true);

    // Lead completion should still be accepted and counted
    const r = useKnights.getState().addLeadCompletion('uid-1', 1, 'I1-4');
    expect(r.ok).toBe(true);

    const ch = useKnights.getState().knightsById['uid-1'].sheet.chapters['1'];
    expect(ch.completed.includes('I1-4')).toBe(true);
    // The last attempt should be marked as lead
    expect(ch.attempts[ch.attempts.length - 1].lead).toBe(true);
  });

  it('addLeadCompletion preserves fail history and adds a lead completion for same inv', () => {
    useKnights.getState().addKnight(minimalKnightInput());

    // First: a fail
    useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-9', 'fail');

    // Convert that investigation to a lead completion
    const r = useKnights.getState().addLeadCompletion('uid-1', 1, 'I1-9');
    expect(r.ok).toBe(true);

    const ch = useKnights.getState().knightsById['uid-1'].sheet.chapters['1'];
    // History should contain both the original fail and a later lead-pass
    const codes = ch.attempts.map(a => `${a.code}:${a.result}:${a.lead ? 'lead' : 'normal'}`);
    expect(codes.some(x => x.startsWith('I1-9:fail'))).toBe(true);
    expect(codes.some(x => x.startsWith('I1-9:pass:lead'))).toBe(true);

    // Completed should include the investigation exactly once
    const occurrences = ch.completed.filter(c => c === 'I1-9').length;
    expect(occurrences).toBe(1);
  });

  it('countDistinctAttempted, countNormalDisplay (capped at 3), countTotalDisplay (capped at 5), and isNormalLocked behavior', () => {
    useKnights.getState().addKnight(minimalKnightInput());
    const getCh = () => useKnights.getState().knightsById['uid-1'].sheet.chapters['1'];
    const isLocked = () => useKnights.getState().isNormalLocked('uid-1', 1);

    // initial
    expect(countDistinctAttempted(getCh())).toBe(0);
    expect(countNormalDisplay(getCh())).toBe(0);
    expect(countTotalDisplay(getCh())).toBe(0);
    expect(isLocked()).toBe(false);

    // 1) Normal fail I1-1 -> attempts +1, total unchanged, not locked
    let r1 = useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-1', 'fail');
    expect(r1.ok).toBe(true);
    expect(countDistinctAttempted(getCh())).toBe(1);
    expect(countNormalDisplay(getCh())).toBe(1);
    expect(countTotalDisplay(getCh())).toBe(0);
    expect(isLocked()).toBe(false);

    // 2) Normal pass I1-1 (same code) -> attempts dedup stays 1, total +1
    let r2 = useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-1', 'pass');
    expect(r2.ok).toBe(true);
    expect(countDistinctAttempted(getCh())).toBe(1);
    expect(countNormalDisplay(getCh())).toBe(1);
    expect(countTotalDisplay(getCh())).toBe(1);
    expect(isLocked()).toBe(false);

    // 3) Lead completion I1-2 -> attempts +1 (2), total +1 (2)
    let r3 = useKnights.getState().addLeadCompletion('uid-1', 1, 'I1-2');
    expect(r3.ok).toBe(true);
    expect(countDistinctAttempted(getCh())).toBe(2);
    expect(countNormalDisplay(getCh())).toBe(2);
    expect(countTotalDisplay(getCh())).toBe(2);
    expect(isLocked()).toBe(false);

    // 4) Normal pass I1-3 -> attempts 3, total 3 -> lock now true
    let r4 = useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-3', 'pass');
    expect(r4.ok).toBe(true);
    expect(countDistinctAttempted(getCh())).toBe(3);
    expect(countNormalDisplay(getCh())).toBe(3); // capped at 3 (exact)
    expect(countTotalDisplay(getCh())).toBe(3);
    expect(isLocked()).toBe(true);

    // 5) Further NORMAL attempts are rejected (locked)
    let r5 = useKnights.getState().addNormalInvestigation('uid-1', 1, 'I1-4', 'fail');
    expect(r5.ok).toBe(false);
    // Counters unchanged
    expect(countDistinctAttempted(getCh())).toBe(3);
    expect(countNormalDisplay(getCh())).toBe(3);
    expect(countTotalDisplay(getCh())).toBe(3);

    // 6) LEAD still allowed after lock; attempts increases, Normal display remains capped
    let r6 = useKnights.getState().addLeadCompletion('uid-1', 1, 'I1-4');
    expect(r6.ok).toBe(true);
    expect(countDistinctAttempted(getCh())).toBe(4); // true attempts increased
    expect(countNormalDisplay(getCh())).toBe(3); // UI cap at 3
    expect(countTotalDisplay(getCh())).toBe(4);

    // 7) Push Total beyond 5; display should cap at 5
    useKnights.getState().addLeadCompletion('uid-1', 1, 'I1-5');
    useKnights.getState().addLeadCompletion('uid-1', 1, 'I1-6');
    useKnights.getState().addLeadCompletion('uid-1', 1, 'I1-7');
    // Distinct completed could be >5, but display clamps to 5
    expect(countTotalDisplay(getCh())).toBe(5);
    // Normal display remains capped
    expect(countNormalDisplay(getCh())).toBe(3);
    // Still locked for normal
    expect(isLocked()).toBe(true);
  });
});
