import React from 'react';
import { Tabs } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import HeaderMenuButton from '@/components/HeaderMenuButton';
import Title from '@/features/campaign/Title';

export default function CampaignTabsLayout() {
    const { tokens } = useThemeTokens();

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
            <Tabs.Screen name="encounter" options={{ title: 'Encounter' }} />
        </Tabs>
    );
}