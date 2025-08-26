import { useCallback } from 'react';
import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

/**
 * Feature-level orchestration for moving knights between
 * active/benched, handling catalog conflicts, etc.
 */
export function useRosterActions(campaignId?: string) {
    const {
        addKnightToCampaign,
        replaceCatalogKnight,
        benchMember,
        addKnightAsBenched,
    } = useCampaigns() as any;

    const { knightsById } = useKnights() as any;

    const ensureActive = useCallback((knightUID: string, fallback?: { catalogId: string; displayName: string }) => {
        if (!campaignId) return;

        const k = knightsById?.[knightUID];
        const catalogId = k?.catalogId ?? fallback?.catalogId ?? 'unknown';
        const displayName = k?.name ?? fallback?.displayName ?? 'Unknown Knight';

        const c = (useCampaigns.getState() as any).campaigns?.[campaignId];
        const members = c?.members ?? [];

        const existing = members.find((m: any) => m.knightUID === knightUID);
        const hasActiveSameCatalog = members.some((m: any) => m.isActive && m.catalogId === catalogId);

        if (existing) {
            // Member already in roster → activate or replace
            if (!existing.isActive) {
                if (hasActiveSameCatalog) {
                    replaceCatalogKnight(campaignId, existing.catalogId, knightUID, { displayName });
                } else {
                    benchMember(campaignId, knightUID, false);
                }
            }
            return;
        }

        // New to roster
        if (hasActiveSameCatalog) {
            replaceCatalogKnight(campaignId, catalogId, knightUID, { displayName });
        } else {
            addKnightToCampaign(campaignId, knightUID, { catalogId, displayName });
        }
    }, [campaignId, knightsById, addKnightToCampaign, replaceCatalogKnight, benchMember]);

    const ensureBenched = useCallback((knightUID: string, fallback?: { catalogId: string; displayName: string }) => {
        if (!campaignId) return;

        const k = knightsById?.[knightUID];
        const catalogId = k?.catalogId ?? fallback?.catalogId ?? 'unknown';
        const displayName = k?.name ?? fallback?.displayName ?? 'Unknown Knight';

        addKnightAsBenched(campaignId, knightUID, { catalogId, displayName });
    }, [campaignId, knightsById, addKnightAsBenched]);

    return { ensureActive, ensureBenched };
}