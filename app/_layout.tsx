import { Stack } from 'expo-router';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

export default function RootLayout() {
    return (
        <ThemeProvider>
            <ActionSheetProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="campaign/[id]" />
                    {/* ⛔️ Do NOT set presentation/options here; the group controls it */}
                    <Stack.Screen name="(modals)" />
                </Stack>
            </ActionSheetProvider>
        </ThemeProvider>
    );
}