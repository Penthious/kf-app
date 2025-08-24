import { Tabs } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout(){
  const {tokens} = useThemeTokens();
  return (
    <Tabs screenOptions={({route}) => ({
      headerShown: false,
      tabBarStyle: { backgroundColor: tokens.surface },
      tabBarActiveTintColor: tokens.accent,
      tabBarInactiveTintColor: tokens.textMuted,
      tabBarIcon: ({color, size}) => {
        const icons: Record<string,string> = {
          index: 'albums',
          knights: 'person',
          gear: 'construct',
          encounter: 'flame',
          keywords: 'book',
          theme: 'color-palette'
        };
        const name = icons[route.name] || 'apps';
        return <Ionicons name={name as any} size={size} color={color} />;
      }
    })}>
      <Tabs.Screen name="index" options={{title:"Campaigns"}} />
      <Tabs.Screen name="knights" options={{title:"Knights"}} />
      <Tabs.Screen name="gear" options={{title:"Gear"}} />
      <Tabs.Screen name="encounter" options={{title:"Encounter"}} />
      <Tabs.Screen name="keywords" options={{title:"Keywords"}} />
      <Tabs.Screen name="theme" options={{title:"Theme"}} />
    </Tabs>
  );
}
