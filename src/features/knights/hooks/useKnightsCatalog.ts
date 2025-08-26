import { useMemo } from 'react';
import KNIGHTS from '@/catalogs/knights.json';

/**
 * Returns the list of knight catalog IDs from your JSON.
 * Keeps the page free from hardcoded arrays.
 */
export function useKnightsCatalog() {
    return useMemo(() => {
        const arr = Array.isArray(KNIGHTS) ? KNIGHTS : [];
        const ids = arr.map((k: any) => k.id).filter(Boolean);
        return { ids, list: arr };
    }, []);
}