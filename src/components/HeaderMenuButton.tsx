import React, { useRef, useState } from 'react';
import { Pressable, Text , Alert} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import ContextMenu, { measureInWindow } from '@/components/ui/ContextMenu';

export default function HeaderMenuButton() {
    const { tokens } = useThemeTokens();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const anchorRef = useRef<any>(null);
    const [open, setOpen] = useState(false);
    const [frame, setFrame] = useState<any>(null);

    const showMenu = async () => {
        const f = await measureInWindow(anchorRef);
        setFrame(f);
        setOpen(true);
    };

    // Close then navigate on next frame → feels instant, avoids modal flashing
    const go = (fn: () => void) => {
        setOpen(false);
        requestAnimationFrame(fn);
    };

    return (
        <>
            <Pressable
                ref={anchorRef}
                onPress={showMenu}
                hitSlop={12}
                style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 10,
                    backgroundColor: tokens.card,
                    borderWidth: 1,
                    borderColor: '#0006',
                }}
                accessibilityRole="button"
                accessibilityLabel="Open quick menu"
            >
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>☰</Text>
            </Pressable>

            <ContextMenu
                visible={open}
                anchorFrame={frame}
                onRequestClose={() => setOpen(false)}
                items={[
                    { key: 'keywords', label: 'Keywords', onPress: () => go(() => router.push('/keywords')) },
                    { key: 'theme',    label: 'Theme',    onPress: () => go(() => router.push('/theme')) },
                    ...(id ? [
                        {
                            key: 'exit',
                            label: 'Exit Campaign',
                            destructive: true,
                            onPress: () =>
                                go(() =>
                                    Alert.alert(
                                        'Leave campaign?',
                                        'This will return you to home.',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            { text: 'Exit', style: 'destructive', onPress: () => router.replace('/') },
                                        ],
                                        { cancelable: true }
                                    )
                                ),
                        },
                    ] : []),
                ]}
            />
        </>
    );
}