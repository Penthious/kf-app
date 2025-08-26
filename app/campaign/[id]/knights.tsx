// app/campaign/[id]/knights.tsx
import React from 'react';
import { View, ScrollView, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import uuid from 'react-native-uuid';

import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';

import ActiveLineup from '@/features/knights/ui/ActiveLineup';
import BenchedList from '@/features/knights/ui/BenchedList';
import AddExistingKnights from '@/features/knights/ui/AddExistingKnights';
import QuickCreateKnight, { type QuickCreateKnightProps } from '@/features/knights/ui/QuickCreateKnight';

import {
    useKnightsLists,
    useCampaignActions,
    useKnightsMap,
    useKnightActions,
} from '@/features/knights/selectors';

import type { Knight } from '@/models/knight';
import {useCampaigns} from "@/store/campaigns";

export default function CampaignKnights() {
    const { tokens } = useThemeTokens();
    const router = useRouter();
    const campaignId = useCampaigns((s) => (s as any).currentCampaignId);

    // store-derived lists and actions
    const {
        campaign: c,
        activeSlots,
        activeCatalogIds,
        lineupItems,
        benchedItems,
        availableItems,
    } = useKnightsLists(campaignId);

    const {
        benchMember,
        removeMember,
        setPartyLeader,
        addKnightToCampaign,
        replaceCatalogKnight,
        addKnightAsBenched,
    } = useCampaignActions();

    const knightsById = useKnightsMap();
    const { addKnight } = useKnightActions();

    const openAddExistingModal = () => {
        if (campaignId) router.push(`/add-existing-knights?id=${campaignId}`);
        else router.push('/add-existing-knights');
    };

    // --- helpers ---------------------------------------------------------------

    const hasActiveCatalog = (catalogId: string) => activeCatalogIds.has(catalogId);

    /** Ensure the given knight becomes an active member, respecting single-catalog rule */
    const ensureActive = (knightUID: string, meta?: { catalogId: string; displayName: string }) => {
        if (!c) return;
        const k = knightsById[knightUID];
        const catalogId = k?.catalogId ?? meta?.catalogId ?? 'unknown';
        const displayName = k?.name ?? meta?.displayName ?? 'Unknown Knight';

        const existing = c.members.find(m => m.knightUID === knightUID);
        if (existing) {
            // already in campaign
            if (existing.isActive) return;
            if (hasActiveCatalog(existing.catalogId)) {
                // swap the existing active of this catalog for this knight
                replaceCatalogKnight(c.campaignId, existing.catalogId, knightUID, { displayName });
            } else {
                // just activate
                benchMember(c.campaignId, knightUID, false);
            }
            return;
        }

        // not yet in campaign
        if (hasActiveCatalog(catalogId)) {
            replaceCatalogKnight(c.campaignId, catalogId, knightUID, { displayName });
        } else {
            addKnightToCampaign(c.campaignId, knightUID, { catalogId, displayName });
        }
    };

    /** Ensure the given knight is present as benched (idempotent) */
    const ensureBenched = (knightUID: string, meta?: { catalogId: string; displayName: string }) => {
        if (!c) return;
        const k = knightsById[knightUID];
        const catalogId = k?.catalogId ?? meta?.catalogId ?? 'unknown';
        const displayName = k?.name ?? meta?.displayName ?? 'Unknown Knight';

        const existing = c.members.find(m => m.knightUID === knightUID);
        if (existing) {
            if (existing.isActive) benchMember(c.campaignId, knightUID, true);
            return;
        }
        addKnightAsBenched(c.campaignId, knightUID, { catalogId, displayName });
    };

    const onAddExisting = (knightUID: string, asActive = true) => {
        const k = knightsById[knightUID];
        const meta = { catalogId: k?.catalogId ?? 'unknown', displayName: k?.name ?? 'Unknown Knight' };
        if (asActive) ensureActive(knightUID, meta);
        else ensureBenched(knightUID, meta);
    };

    const onCreateKnight: QuickCreateKnightProps['onCreate'] = ({ name, catalogId, asActive }) => {
        if (!c) return;

        const k: Knight = {
            knightUID: uuid.v4() as string,
            ownerUserId: 'me',
            catalogId,
            name: name.trim(),
            sheet: {
                virtues: { bravery: 0, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
                vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
                bane: 0,
                sighOfGraal: 0,
                gold: 0,
                leads: 0,
                chapter: 1,
                chapters: {},
                prologueDone: false,
                postgameDone: false,
                armory: [],
                firstDeath: false,
                choiceMatrix: {},
                saints: [],
                mercenaries: [],
                notes: [],
            },
            rapport: [],
            version: 1,
            updatedAt: Date.now(),
        };

        const saved = addKnight(k);
        const meta = { catalogId: saved.catalogId, displayName: saved.name };
        if (asActive) ensureActive(saved.knightUID, meta);
        else ensureBenched(saved.knightUID, meta);
    };

    const onEditKnight = (uid: string) => router.push(`/knight/${uid}`);

    // --- render ----------------------------------------------------------------

    if (!c) {
        return (
            <View style={{ flex: 1, backgroundColor: tokens.bg }}>
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    <Card>
                        <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 6 }}>
                            Campaign not found
                        </Text>
                        <Text style={{ color: tokens.textMuted }}>Reopen it from the Campaigns list.</Text>
                    </Card>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                <Card>
                    <Card.Title>Active Lineup</Card.Title>
                    <ActiveLineup
                        list={lineupItems}
                        maxSlots={activeSlots}
                        onSetLeader={(uid) => setPartyLeader(c.campaignId, uid)}
                        onBench={(uid) => onAddExisting(uid, false)}
                        onEdit={onEditKnight}
                    />
                </Card>

                <Card>
                    <Card.Title>Benched Knights</Card.Title>
                    <BenchedList
                        list={benchedItems}
                        activeCatalogIds={activeCatalogIds}
                        onActivate={(uid) => onAddExisting(uid, true)}
                        onRemove={(uid) => removeMember(c.campaignId, uid)}
                        onEdit={onEditKnight}
                    />
                </Card>

                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                        Add Existing (inline)
                    </Text>
                    <AddExistingKnights
                        list={availableItems}
                        onAddActive={(uid) => onAddExisting(uid, true)}
                        onBench={(uid) => onAddExisting(uid, false)}
                    />
                </Card>

                <QuickCreateKnight onCreate={onCreateKnight} />
            </ScrollView>
        </View>
    );
}