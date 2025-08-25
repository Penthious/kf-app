import React from 'react';
import { Tabs, useLocalSearchParams, router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import HeaderMenuButton from '@/components/HeaderMenuButton';

function ExitButton() {
    const { tokens } = useThemeTokens();
    return (
        <Pressable
            onPress={() => router.replace('/')}
            hitSlop={12}
            style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 10,
                backgroundColor: tokens.card,
                borderWidth: 1,
                borderColor: '#0006',
                marginRight: 8,
            }}
            accessibilityRole="button"
            accessibilityLabel="Exit campaign"
        >
            <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Back</Text>
        </Pressable>
    );
}

function Title() {
    const {id} = useLocalSearchParams<{ id?: string }>();
    const {tokens} = useThemeTokens();
    const {campaigns} = require('@/store/campaigns').useCampaigns(); // safe inside component

    const campaign = id ? campaigns?.[id] : undefined;
    const title = campaign ? `Campaign – ${campaign.name}` : 'Campaign';

    return (
        <View>
            <Text
                numberOfLines={1}
                style={{color: tokens.textPrimary, fontWeight: '800'}}
            >
                {title}
            </Text>
        </View>
    );
}

export default function CampaignTabsLayout() {
    const { tokens } = useThemeTokens();

    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: tokens.bg },
                headerShadowVisible: false,
                headerTitle: () => <Title />,
                headerLeft: () => <ExitButton />,
                headerRight: () => <HeaderMenuButton />,
                tabBarStyle: { backgroundColor: tokens.surface, borderTopColor: '#0006' },
                tabBarActiveTintColor: tokens.accent,
                tabBarInactiveTintColor: tokens.textMuted,
            }}
        >
            <Tabs.Screen name="kingdoms" options={{ title: 'Kingdoms' }} />
            <Tabs.Screen name="knights" options={{ title: 'Knights' }} />
            <Tabs.Screen name="gear" options={{ title: 'Gear' }} />
            <Tabs.Screen name="encounter" options={{ title: 'Encounter' }} />
        </Tabs>
    );
}