import HeaderMenuButton from '@/features/campaign/ui/HeaderMenuButton';
import Title from '@/features/campaign/ui/Title';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';

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
            screenOptions={({ route }) => ({
                headerStyle: { backgroundColor: tokens.bg },
                headerShadowVisible: false,
                headerTitle: () => <Title />,
                headerRight: () => <HeaderMenuButton />,
                tabBarStyle: { backgroundColor: tokens.surface, borderTopColor: '#0006' },
                tabBarActiveTintColor: tokens.accent,
                tabBarInactiveTintColor: tokens.textMuted,
                tabBarIcon: ({ color, size }) => {
                    // Centralized mapping (consistent with your root tabs)
                    const nameMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
                        kingdoms: 'castle',
                        knights: 'head',
                        gear: 'toolbox-outline', // or 'cog-outline'
                        delve: 'road-variant',
                        clash: 'sword-cross',
                    };
                    const iconName = nameMap[route.name as keyof typeof nameMap] ?? 'dots-horizontal';

                    return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
                },
            })}
        >
            <Tabs.Screen name="kingdoms" options={{ title: 'Kingdoms' }} />
            <Tabs.Screen name="knights"  options={{ title: 'Knights'  }} />
            <Tabs.Screen name="gear"     options={{ title: 'Gear'     }} />
            <Tabs.Screen name="delve"    options={{ title: 'Delve'   }} />
            <Tabs.Screen name="clash"    options={{ title: 'Clash'   }} />
        </Tabs>
    );
}