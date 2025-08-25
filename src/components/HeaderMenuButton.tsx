import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeTokens } from '@/theme/ThemeProvider';

export default function HeaderMenuButton() {
    const { tokens } = useThemeTokens();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const insets = useSafeAreaInsets();

    const go = (path: string) => {
        setOpen(false);
        // small delay lets the menu close before pushing, avoids flicker
        setTimeout(() => router.push(path), 10);
    };

    return (
        <>
            {/* The hamburger button in the header */}
            <Pressable
                onPress={() => setOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Open quick menu"
                style={{
                    marginRight: 12,
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
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>☰</Text>
            </Pressable>

            {/* Top-right dropdown menu */}
            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                {/* Backdrop */}
                <Pressable
                    onPress={() => setOpen(false)}
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                >
                    {/* Empty pressable just to catch outside taps */}
                </Pressable>

                {/* Menu card — positioned near the top-right, below the header */}
                <View
                    pointerEvents="box-none"
                    style={{
                        position: 'absolute',
                        top: Math.max(insets.top + 48, 64), // header height-ish + safe area
                        right: 12,
                    }}
                >
                    <View
                        style={{
                            minWidth: 180,
                            borderRadius: 12,
                            backgroundColor: tokens.surface,
                            borderWidth: 1,
                            borderColor: '#0006',
                            overflow: 'hidden',
                            shadowColor: '#000',
                            shadowOpacity: 0.4,
                            shadowRadius: 12,
                            shadowOffset: { width: 0, height: 6 },
                            elevation: 8,
                        }}
                    >
                        <MenuItem label="Keywords" onPress={() => go('/(modals)/keywords')} />
                        <Divider />
                        <MenuItem label="Theme" onPress={() => go('/(modals)/theme')} />
                    </View>
                </View>
            </Modal>
        </>
    );
}

function MenuItem({ label, onPress }: { label: string; onPress: () => void }) {
    const { tokens } = useThemeTokens();
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => ({
                paddingHorizontal: 14,
                paddingVertical: 12,
                backgroundColor: pressed ? '#ffffff10' : 'transparent',
            })}
        >
            <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{label}</Text>
        </Pressable>
    );
}

function Divider() {
    return <View style={{ height: 1, backgroundColor: '#0006' }} />;
}