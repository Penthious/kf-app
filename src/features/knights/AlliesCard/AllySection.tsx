import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text, View } from 'react-native';
import { AllyChip } from './AllyChip';

interface AllySectionProps {
    title: string;
    allies: string[];
    onAdd: () => void;
    onRemove: (name: string) => void;
}

export function AllySection({ title, allies, onAdd, onRemove }: AllySectionProps) {
    const { tokens } = useThemeTokens();

    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ color: tokens.textPrimary, fontWeight: '700' }}>{title}</Text>
                <Pressable
                    onPress={onAdd}
                    style={{
                        paddingHorizontal: 12,
                        height: 32,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: tokens.accent,
                    }}
                >
                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Add</Text>
                </Pressable>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                {allies.length === 0 ? (
                    <Text style={{ color: tokens.textMuted }}>None</Text>
                ) : (
                    allies.map(ally => (
                        <AllyChip key={ally} label={ally} onRemove={() => onRemove(ally)} />
                    ))
                )}
            </View>
        </>
    );
}
