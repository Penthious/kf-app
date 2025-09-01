import { useCampaignNavigation } from '@/features/campaign/hooks/useCampaignNavigation';
import HeaderMenuButton from '@/features/campaign/ui/HeaderMenuButton';
import Title from '@/features/campaign/ui/Title';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';

export default function CampaignTabsLayout() {
  const { tokens } = useThemeTokens();
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const campaignId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id]);

  const setCurrentCampaignId = useCampaigns(s => s.setCurrentCampaignId);
  const { getDefaultTab } = useCampaignNavigation();

  useEffect(() => {
    setCurrentCampaignId(campaignId);
    return () => setCurrentCampaignId(undefined);
  }, [campaignId, setCurrentCampaignId]);

  useEffect(() => {
    // Navigate to the appropriate tab when the campaign is opened
    const defaultTab = getDefaultTab();

    // Only redirect if we're at the root campaign path (not already on a specific tab)
    const expectedRootPath = `/campaign/${campaignId}`;

    console.log('Campaign navigation debug:', {
      pathname,
      expectedRootPath,
      defaultTab,
      campaignId,
      shouldRedirect: pathname === expectedRootPath,
    });

    // Check if we're at the root campaign path
    if (pathname === expectedRootPath) {
      console.log('Redirecting to:', `/campaign/${campaignId}/${defaultTab}`);
      // Navigate to the appropriate default tab
      router.replace(`/campaign/${campaignId}/${defaultTab}`);
    }
  }, [campaignId, getDefaultTab, router, pathname]);

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
      <Tabs.Screen name='kingdoms' options={{ title: 'Kingdoms' }} />
      <Tabs.Screen name='knights' options={{ title: 'Knights' }} />
      <Tabs.Screen name='gear' options={{ title: 'Gear' }} />
      <Tabs.Screen name='delve' options={{ title: 'Delve' }} />
      <Tabs.Screen name='clash' options={{ title: 'Clash' }} />
    </Tabs>
  );
}
