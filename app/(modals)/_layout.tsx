import { useThemeTokens } from '@/theme/ThemeProvider';
import { Stack, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function ModalsLayout() {
  const router = useRouter();
  const { tokens } = useThemeTokens();

  return (
    <Stack
      screenOptions={{
        presentation: 'fullScreenModal',
        headerStyle: { backgroundColor: tokens.surface },
        headerTitleStyle: { color: tokens.textPrimary },
        headerTintColor: tokens.textPrimary,
        // 👇 Ensure the whole modal scene is dark
        contentStyle: { backgroundColor: tokens.bg },
        headerRight: () => null,
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            style={{
              marginLeft: 12,
              paddingHorizontal: 12,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: tokens.surface,
              borderWidth: 1,
              borderColor: '#0006',
            }}
          >
            <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Close</Text>
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name='keywords' options={{ title: 'Keywords' }} />
      <Stack.Screen name='theme' options={{ title: 'Theme' }} />
      <Stack.Screen name='faq' options={{ title: 'FAQ' }} />
    </Stack>
  );
}
