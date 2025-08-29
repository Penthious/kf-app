import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text, View } from 'react-native';

interface KnightActionButtonsProps {
    onClose: () => void;
    onSave: () => void;
    onOpenFullSheet?: () => void;
    canSave: boolean;
    testID?: string;
}

export function KnightActionButtons({ 
    onClose, 
    onSave, 
    onOpenFullSheet, 
    canSave, 
    testID 
}: KnightActionButtonsProps) {
    const { tokens } = useThemeTokens();

    return (
        <>
            <View style={{ height: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable
                    onPress={onClose}
                    testID={testID ? `${testID}-cancel-button` : undefined}
                    style={{
                        paddingHorizontal: 16, height: 44, borderRadius: 12,
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006',
                    }}
                >
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Cancel</Text>
                </Pressable>

                <View style={{ flexDirection: 'row' }}>
                    {onOpenFullSheet ? (
                        <Pressable
                            onPress={onOpenFullSheet}
                            testID={testID ? `${testID}-open-full-sheet-button` : undefined}
                            style={{
                                marginRight: 8,
                                paddingHorizontal: 16, height: 44, borderRadius: 12,
                                alignItems: 'center', justifyContent: 'center',
                                backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006',
                            }}
                        >
                            <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Open Full Sheet</Text>
                        </Pressable>
                    ) : null}

                    <Pressable
                        disabled={!canSave}
                        onPress={onSave}
                        testID={testID ? `${testID}-save-button` : undefined}
                        style={{
                            paddingHorizontal: 16, height: 44, borderRadius: 12,
                            alignItems: 'center', justifyContent: 'center',
                            backgroundColor: canSave ? tokens.accent : '#333',
                            opacity: canSave ? 1 : 0.5,
                        }}
                    >
                        <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Save</Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
}
