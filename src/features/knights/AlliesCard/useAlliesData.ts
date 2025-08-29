import ALLIES_CATALOG from '@/catalogs/allies';
import { useKnights } from '@/store/knights';
import { useMemo } from 'react';

export interface AllyOption {
    id: string;
    name: string;
}

export interface AlliesData {
    saints: {
        selected: string[];
        options: AllyOption[];
    };
    mercenaries: {
        selected: string[];
        options: AllyOption[];
    };
    addAlly: (kind: 'saints' | 'mercs', ally: AllyOption) => void;
    removeAlly: (kind: 'saints' | 'mercs', name: string) => void;
}

export function useAlliesData(knightUID: string): AlliesData {
    const { knightsById, updateKnightSheet } = useKnights();
    const knight = knightsById[knightUID];

    const saintsSelected = knight?.sheet?.saints ?? [];
    const mercenariesSelected = knight?.sheet?.mercenaries ?? [];

    const saintsOptions = useMemo(() => ALLIES_CATALOG.saints as AllyOption[], []);
    const mercenariesOptions = useMemo(() => ALLIES_CATALOG.mercenaries as AllyOption[], []);

    const addAlly = (kind: 'saints' | 'mercs', ally: AllyOption) => {
        if (kind === 'saints') {
            const next = Array.from(new Set([...saintsSelected, ally.name]));
            updateKnightSheet(knightUID, { saints: next });
        } else {
            const next = Array.from(new Set([...mercenariesSelected, ally.name]));
            updateKnightSheet(knightUID, { mercenaries: next });
        }
    };

    const removeAlly = (kind: 'saints' | 'mercs', name: string) => {
        if (kind === 'saints') {
            updateKnightSheet(knightUID, { saints: saintsSelected.filter((s: string) => s !== name) });
        } else {
            updateKnightSheet(knightUID, { mercenaries: mercenariesSelected.filter((s: string) => s !== name) });
        }
    };

    return {
        saints: {
            selected: saintsSelected,
            options: saintsOptions,
        },
        mercenaries: {
            selected: mercenariesSelected,
            options: mercenariesOptions,
        },
        addAlly,
        removeAlly,
    };
}
