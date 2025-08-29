import { useEffect, useMemo, useState } from 'react';
import type { KnightQuick, QuickEditPatch } from './types';

export function useKnightQuickEdit(knight?: KnightQuick) {
  const chapter = knight?.sheet.chapter ?? 1;
  const chData = useMemo(
    () => knight?.sheet.investigations?.[chapter] ?? { questCompleted: false, completed: [] },
    [knight?.sheet.investigations, chapter]
  );

  const [name, setName] = useState(knight?.name ?? '');
  const [questCompleted, setQuestCompleted] = useState<boolean>(!!chData.questCompleted);
  const [completedCount, setCompletedCount] = useState<number>(
    Array.isArray(chData.completed) ? chData.completed.length : 0
  );

  const [prologueDone, setPrologue] = useState<boolean>(!!knight?.sheet.prologueDone);
  const [postgameDone, setPostgame] = useState<boolean>(!!knight?.sheet.postgameDone);
  const [firstDeath, setFirstDeath] = useState<boolean>(!!knight?.sheet.firstDeath);

  useEffect(() => {
    setName(knight?.name ?? '');
    const freshCh = knight?.sheet.chapter ?? 1;
    const fresh = knight?.sheet.investigations?.[freshCh] ?? {
      questCompleted: false,
      completed: [],
    };
    setQuestCompleted(!!fresh.questCompleted);
    setCompletedCount(Array.isArray(fresh.completed) ? fresh.completed.length : 0);
    setPrologue(!!knight?.sheet.prologueDone);
    setPostgame(!!knight?.sheet.postgameDone);
    setFirstDeath(!!knight?.sheet.firstDeath);
  }, [
    knight?.knightUID,
    knight?.name,
    knight?.sheet.chapter,
    knight?.sheet.investigations,
    knight?.sheet.prologueDone,
    knight?.sheet.postgameDone,
    knight?.sheet.firstDeath,
  ]);

  const canSave = !!knight && name.trim().length > 0;

  const createPatch = (): QuickEditPatch => ({
    name: name.trim(),
    sheet: { prologueDone, postgameDone, firstDeath },
    investigationsPatch: { chapter, questCompleted, completedCount },
  });

  return {
    // State
    name,
    setName,
    chapter,
    questCompleted,
    setQuestCompleted,
    completedCount,
    setCompletedCount,
    prologueDone,
    setPrologue,
    postgameDone,
    setPostgame,
    firstDeath,
    setFirstDeath,
    canSave,
    // Actions
    createPatch,
  };
}
