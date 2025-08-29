export interface KnightSheetQuick {
  chapter: number;
  investigations?: Record<number, { questCompleted?: boolean; completed?: string[] }>;
  prologueDone?: boolean;
  postgameDone?: boolean;
  firstDeath?: boolean;
}

export interface KnightQuick {
  knightUID: string;
  name: string;
  sheet: KnightSheetQuick;
}

export interface QuickEditPatch {
  name?: string;
  sheet?: Partial<KnightSheetQuick>;
  // For nested chapter data:
  investigationsPatch?: {
    chapter: number;
    questCompleted?: boolean;
    completedCount?: number;
  };
}

export interface QuickEditProps {
  visible: boolean;
  onClose: () => void;
  knight?: KnightQuick;
  onSave: (patch: QuickEditPatch) => void;
  onOpenFullSheet?: () => void;
  testID?: string;
}
