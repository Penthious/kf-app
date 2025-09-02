import HeaderMenuButton from '@/features/campaign/ui/HeaderMenuButton';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

export default function RootTabsLayout() {
  const { tokens, isInitialized } = useThemeTokens();

  // Show loading state while theme initializes
  if (!isInitialized || !tokens) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0E1116',
        }}
      >
        <Text style={{ color: '#E8EEF8' }}>Loading...</Text>
      </View>
    );
  }

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
          const m: Record<string, string> = {
            index: 'albums',
            knights: 'person',
            gear: 'shield',
          };
          const name = m[route.name] || 'apps';
          return (
            <Ionicons name={name as keyof typeof Ionicons.glyphMap} size={size} color={color} />
          );
        },
      })}
    >
      <Tabs.Screen name='index' options={{ title: 'Campaigns', tabBarLabel: 'Campaigns' }} />
      <Tabs.Screen name='knights' options={{ title: 'Knights', tabBarLabel: 'Knights' }} />
      <Tabs.Screen name='gear' options={{ title: 'Gear', tabBarLabel: 'Gear' }} />
    </Tabs>
  );
}
