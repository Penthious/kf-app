import type { ReactNode } from 'react';

// Common mock component prop types
export interface MockCardProps {
    children?: ReactNode;
}

export interface MockCardTitleProps {
    children?: ReactNode;
}

export interface MockTextRowProps {
    label?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    testID?: string;
}

export interface MockSwitchRowProps {
    label?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    testID?: string;
}

export interface MockStepperProps {
    value?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
    editable?: boolean;
    formatValue?: (value: number) => string;
    parseValue?: (text: string) => number;
    testID?: string;
}

export interface MockPillProps {
    label?: string;
    selected?: boolean;
    onPress?: () => void;
    testID?: string;
}

export interface MockAllyChipProps {
    label?: string;
    onRemove?: (name: string) => void;
}

export interface MockContextMenuProps {
    visible?: boolean;
    items?: Array<{
        key: string;
        label: string;
        onPress: () => void;
        destructive?: boolean;
    }>;
    onRequestClose?: () => void;
    testID?: string;
}

export interface MockInvestigationPillsProps {
    entries?: Array<{
        code: string;
        result: 'pass' | 'fail';
        lead?: boolean;
    }>;
    onPress?: (code: string) => void;
}

export interface MockInvestigationChooserProps {
    code?: string;
    locked?: boolean;
    onNormalPass?: () => void;
    onNormalFail?: () => void;
    onLeadComplete?: () => void;
    onCancel?: () => void;
}

export interface MockNoteInputProps {
    onAdd?: (text: string) => void;
}

export interface MockNotesListProps {
    notes?: Array<{
        id: string;
        text: string;
        at: number;
    }>;
    editingId?: string | null;
    editText?: string;
    onEditTextChange?: (text: string) => void;
    onBeginEdit?: (id: string) => void;
    onCancelEdit?: () => void;
    onSaveEdit?: (id: string, text: string) => void;
    onDelete?: (id: string) => void;
}

export interface MockActiveLineupProps {
    list?: Array<{
        knightUID: string;
        name: string;
        isLeader?: boolean;
    }>;
    maxSlots?: number;
    onSetLeader?: (uid: string) => void;
    onBench?: (uid: string) => void;
    onEdit?: (uid: string) => void;
}

export interface MockBenchedListProps {
    list?: Array<{
        knightUID: string;
        name: string;
    }>;
    onActivate?: (uid: string) => void;
    onEdit?: (uid: string) => void;
}

export interface MockKnight {
    knightUID: string;
    name: string;
    sheet: {
        chapter: number;
        chapters: Record<string, {
            quest: { completed: boolean; outcome?: string };
            attempts: Array<{
                code: string;
                result: 'pass' | 'fail';
                lead?: boolean;
            }>;
            completed: string[];
        }>;
        virtues: Record<string, number>;
        vices: Record<string, number>;
        [key: string]: any;
    };
    [key: string]: any;
}

export interface MockMonstersState {
    all: Array<{
        id: string;
        name: string;
        level: number;
        toHit: number;
        wounds: number;
        exhibitionStartingWounds: number;
    }>;
    byId: Record<string, {
        id: string;
        name: string;
        level: number;
        toHit: number;
        wounds: number;
        exhibitionStartingWounds: number;
    }>;
}
