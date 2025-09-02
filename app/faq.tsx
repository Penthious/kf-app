import { useThemeTokens } from '@/theme/ThemeProvider';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import FAQScreen from '@/features/faq/ui/FAQScreen';
import HeaderMenuButton from '@/features/campaign/ui/HeaderMenuButton';

export default function FAQRoute() {
  const { tokens } = useThemeTokens();

  useEffect(() => {
    // Set the header title and right component
    // This will be handled by the Stack.Screen options below
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'FAQ',
          headerStyle: { backgroundColor: tokens.bg },
          headerShadowVisible: false,
          headerTintColor: tokens.textPrimary,
          headerRight: () => <HeaderMenuButton />,
        }}
      />
      <FAQScreen />
    </>
  );
}
