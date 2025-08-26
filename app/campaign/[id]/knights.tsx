// app/campaign/[id]/knights.tsx
import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';

import Card from '@/components/Card';

import { useCampaigns } from '@/store/campaigns';
import { useKnights } from '@/store/knights';

import type { Campaign } from '@/models/campaign';
import { Knight, defaultSheet } from '@/models/knight';

import ActiveLineup from '@/features/knights/ui/ActiveLineup';
import BenchedList from '@/features/knights/ui/BenchedList';
import AddExistingKnights from '@/features/knights/ui/AddExistingKnights';
import QuickCreateKnight from '@/features/knights/ui/QuickCreateKnight';

import {getMemberSets} from '@/features/knights/selectors';
import {KnightsById} from "@/features/knights/types";
import uuid from "react-native-uuid";

export default function CampaignKnightsPage() {
    const campaignId = useCampaigns((s) => (s as any).currentCampaignId);
    const { tokens } = useThemeTokens();
    const router = useRouter();

    // ---- Stores ----
    const campaigns = useCampaigns((s) => s.campaigns);
    const addKnightToCampaign = useCampaigns((s) => s.addKnightToCampaign);
    const addKnightAsBenched = useCampaigns((s) => s.addKnightAsBenched);
    const replaceCatalogKnight = useCampaigns((s) => s.replaceCatalogKnight);
    const benchMember = useCampaigns((s) => s.benchMember);
    const removeMember = useCampaigns((s) => s.removeMember);
    const setPartyLeader = useCampaigns((s) => s.setPartyLeader);

    const knightsById = useKnights((s) => s.knightsById) as KnightsById;

    const knightsStore = useKnights();

    const campaign: Campaign | undefined = campaignId ? campaigns[campaignId] : undefined;

    // ---- Derived lists (pure; model-aware) ----
    const { active, benched, available, activeCatalogIds } = useMemo(
        () => getMemberSets(campaign, knightsById),
        [campaign, knightsById]
    );

    // ---- Handlers: Active lineup ----
    const handleSetLeader = useCallback(
        (knightUID: string) => {
            if (!campaignId) return;
            setPartyLeader(campaignId, knightUID);
        },
        [campaignId, setPartyLeader]
    );

    const handleBench = useCallback(
        (knightUID: string) => {
            if (!campaignId) return;
            benchMember(campaignId, knightUID, true);
        },
        [campaignId, benchMember]
    );

    const handleRemove = useCallback(
        (knightUID: string) => {
            if (!campaignId) return;
            Alert.alert('Remove knight from campaign?', 'This will not delete the knight.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeMember(campaignId, knightUID) },
            ]);
        },
        [campaignId, removeMember]
    );

    const handleEdit = useCallback(
        (knightUID: string) => {
            router.push(`/knight/${knightUID}`);
        },
        [router]
    );

    // ---- Handlers: Benched ----
    const handleActivateFromBench = useCallback(
        (knightUID: string) => {
            if (!campaignId) return;
            const k = knightsById[knightUID] as Knight | undefined;
            const catalogId = k?.catalogId ?? 'unknown';
            replaceCatalogKnight(campaignId, catalogId, knightUID, { displayName: k?.name });
        },
        [campaignId, replaceCatalogKnight, knightsById]
    );

    // ---- Handlers: Add Existing ----
    const handleAddExistingActive = useCallback(
        (knightUID: string) => {
            if (!campaignId) return;
            const k = knightsById[knightUID] as Knight | undefined;
            const catalogId = k?.catalogId ?? 'unknown';
            const displayName = k?.name ?? 'Unknown Knight';

            const res = addKnightToCampaign(campaignId, knightUID, { catalogId, displayName }) as
                | { conflict?: { existingUID: string } }
                | {};

            // If an active of same catalog exists, replace it.
            if ('conflict' in res && res.conflict?.existingUID) {
                replaceCatalogKnight(campaignId, catalogId, knightUID, { displayName });
            }
        },
        [campaignId, addKnightToCampaign, replaceCatalogKnight, knightsById]
    );

    const handleAddExistingBench = useCallback(
        (knightUID: string) => {
            if (!campaignId) return;
            const k = knightsById[knightUID] as Knight | undefined;
            addKnightAsBenched(campaignId, knightUID, {
                catalogId: k?.catalogId ?? 'unknown',
                displayName: k?.name ?? 'Unknown Knight',
            });
        },
        [campaignId, addKnightAsBenched, knightsById]
    );

    // ---- Handler: Quick create ----
    const handleQuickCreate = useCallback(
        async ({ name, catalogId, asActive }: { name: string; catalogId: string; asActive: boolean }) => {
            if (!campaignId) return;


            const uid = uuid.v4() as string;

            const k: Omit<Knight, 'version' | 'updatedAt'> = {
                knightUID: uid,
                ownerUserId: 'me',
                catalogId,
                name: name.trim() || catalogId,
                sheet: defaultSheet(),
                rapport: [],
            };
            const result = knightsStore.addKnight(k);
            const newUID = (result && result.knightUID) ?? undefined;

            if (!newUID) {
                Alert.alert('Failed to create knight', 'Could not determine new knight id.');
                return;
            }

            // Add to campaign (active or benched)
            const displayName = name;
            if (asActive) {
                const res = addKnightToCampaign(campaignId, newUID, { catalogId, displayName }) as
                    | { conflict?: { existingUID: string } }
                    | {};
                if ('conflict' in res && res.conflict?.existingUID) {
                    replaceCatalogKnight(campaignId, catalogId, newUID, { displayName });
                }
            } else {
                addKnightAsBenched(campaignId, newUID, { catalogId, displayName });
            }
        },
        [campaignId, knightsStore, addKnightToCampaign, addKnightAsBenched, replaceCatalogKnight]
    );

    // ---- Render ----
    if (!campaignId || !campaign) {
        return (
            <View style={{ flex: 1, backgroundColor: tokens.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Campaign not found</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                {/* Active lineup */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                        Active Knights
                    </Text>
                    <ActiveLineup
                        list={active}
                        maxSlots={campaign.settings.fivePlayerMode ? 5 : 4}
                        onSetLeader={handleSetLeader}
                        onBench={handleBench}
                        onEdit={handleEdit}
                    />
                </Card>

                {/* Benched list */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                        Benched
                    </Text>
                    <BenchedList
                        list={benched}
                        activeCatalogIds={activeCatalogIds}
                        onActivate={handleActivateFromBench}
                        onRemove={handleRemove}
                        onEdit={handleEdit}
                    />
                </Card>

                {/* Add existing knights */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                        Add Existing Knights
                    </Text>
                    <AddExistingKnights
                        list={available}
                        onAddActive={handleAddExistingActive}
                        onBench={handleAddExistingBench}
                    />
                </Card>

                {/* Quick create */}
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                        Quick Create Knight
                    </Text>
                    <QuickCreateKnight onCreate={handleQuickCreate} />
                </Card>
            </ScrollView>
        </View>
    );
}