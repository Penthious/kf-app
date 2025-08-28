import React from 'react';
import { useLocalSearchParams, Tabs } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import HeaderMenuButton from '@/components/HeaderMenuButton';
import Title from '@/features/campaign/Title';

export default function CampaignTabsLayout() {
    const { tokens } = useThemeTokens();
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();
    const campaignId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

    const setCurrentCampaignId = useCampaigns(s => s.setCurrentCampaignId);

    useEffect(() => {
        setCurrentCampaignId(campaignId);
        return () => setCurrentCampaignId(undefined);
    }, [campaignId, setCurrentCampaignId]);


    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: tokens.bg },
                headerShadowVisible: false,
                headerTitle: () => <Title />,
                headerRight: () => <HeaderMenuButton />,
                tabBarStyle: { backgroundColor: tokens.surface, borderTopColor: '#0006' },
                tabBarActiveTintColor: tokens.accent,
                tabBarInactiveTintColor: tokens.textMuted,
            }}
        >
            <Tabs.Screen name="kingdoms" options={{ title: 'Kingdoms' }} />
            <Tabs.Screen name="knights"  options={{ title: 'Knights'  }} />
            <Tabs.Screen name="gear"     options={{ title: 'Gear'     }} />
            <Tabs.Screen name="delve"    options={{ title: 'Delve'   }} />
            <Tabs.Screen name="clash"    options={{ title: 'Clash'   }} />
        </Tabs>
    );
}