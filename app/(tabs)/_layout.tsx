import HeaderMenuButton from '@/features/campaign/ui/HeaderMenuButton';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function RootTabsLayout() {
  const { tokens } = useThemeTokens();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: tokens.surface },
        headerTitleStyle: { color: tokens.textPrimary },
        headerTintColor: tokens.textPrimary,
        headerRight: () => <HeaderMenuButton />, // hamburger on root pages
        tabBarStyle: { backgroundColor: tokens.surface },
        tabBarActiveTintColor: tokens.accent,
        tabBarInactiveTintColor: tokens.textMuted,
        tabBarIcon: ({ color, size }) => {
          const m: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: 'albums',
            knights: 'person',
            gear: 'shield',
          };
          const name: keyof typeof Ionicons.glyphMap = (m[route.name] ||
            'apps') as keyof typeof Ionicons.glyphMap;
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name='index' options={{ title: 'Campaigns', tabBarLabel: 'Campaigns' }} />
      <Tabs.Screen name='knights' options={{ title: 'Knights', tabBarLabel: 'Knights' }} />
      <Tabs.Screen name='gear' options={{ title: 'Gear', tabBarLabel: 'Gear' }} />
    </Tabs>
  );
}
