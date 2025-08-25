import React from 'react';
import { Tabs, useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import HeaderMenuButton from '@/components/HeaderMenuButton';
import { Text } from 'react-native';
import { useCampaigns } from '@/store/campaigns';

export default function CampaignTabsLayout() {
    const { tokens } = useThemeTokens();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { campaigns } = useCampaigns();
    const c = id ? campaigns[id] : undefined;

    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: tokens.surface },
                headerTitleStyle: { color: tokens.textPrimary },
                headerTintColor: tokens.textPrimary,
                tabBarStyle: { backgroundColor: tokens.surface },
                tabBarActiveTintColor: tokens.accent,
                tabBarInactiveTintColor: tokens.textMuted,
                headerRight: () => <HeaderMenuButton />,
            }}
        >
            <Tabs.Screen
                name="kingdoms"
                options={{
                    title: c ? `Kingdoms • ${c.name}` : 'Kingdoms',
                    tabBarLabel: 'Kingdoms',
                }}
            />
            <Tabs.Screen
                name="gear"
                options={{
                    title: c ? `Gear • ${c.name}` : 'Gear',
                    tabBarLabel: 'Gear',
                }}
            />
            <Tabs.Screen
                name="encounter"
                options={{
                    title: c ? `Encounter • ${c.name}` : 'Encounter',
                    tabBarLabel: 'Encounter',
                }}
            />
            <Tabs.Screen
                name="knights"
                options={{
                    title: c ? `Knights • ${c.name}` : 'Current Knights',
                    tabBarLabel: 'Knights',
                }}
            />
        </Tabs>
    );
}