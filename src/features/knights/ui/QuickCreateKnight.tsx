import KNIGHT_CATALOG from '@/catalogs/knights.json';
import Card from '@/components/Card';
import Pill from '@/components/ui/Pill';
import TextRow from '@/components/ui/TextRow';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export type QuickCreateKnightProps = {
    onCreate: (args: { name: string; catalogId: string; asActive: boolean }) => void;
};

export default function QuickCreateKnight({ onCreate }: QuickCreateKnightProps) {
    const { tokens } = useThemeTokens();
    const [newName, setNewName] = useState('');
    const [newCatalog, setNewCatalog] = useState<string | null>(null);

    const canCreate = useMemo(
        () => newName.trim().length > 0 && !!newCatalog,
        [newName, newCatalog]
    );

    const handleCreate = (asActive: boolean) => {
        if (!canCreate) return;
        onCreate({ name: newName.trim(), catalogId: newCatalog as string, asActive });
        setNewName('');
        setNewCatalog(null);
    };

    return (
        <Card>
            <Card.Title>Quick-Create Knight</Card.Title>

            <TextRow
                label="Name"
                value={newName}
                onChangeText={setNewName}
                placeholder="e.g., Renholder"
            />

            <View style={{ marginTop: 8 }}>
                <Text style={{ color: tokens.textMuted, marginBottom: 6 }}>Catalog Knight</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {Array.isArray(KNIGHT_CATALOG) &&
                        (KNIGHT_CATALOG as Array<{ id: string; name: string }>).map(k => (
                            <Pill
                                key={k.id}
                                label={k.name}
                                selected={newCatalog === k.id}
                                onPress={() => setNewCatalog(k.id)}
                            />
                        ))}
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 8 }}>
                <Pressable
                    onPress={() => handleCreate(false)}
                    disabled={!canCreate}
                    style={{
                        opacity: canCreate ? 1 : 0.5,
                        paddingHorizontal: 12,
                        height: 36,
                        borderRadius: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: tokens.surface,
                        borderWidth: 1,
                        borderColor: '#0006',
                    }}
                >
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Create as Benched</Text>
                </Pressable>

                <Pressable
                    onPress={() => handleCreate(true)}
                    disabled={!canCreate}
                    style={{
                        opacity: canCreate ? 1 : 0.5,
                        paddingHorizontal: 12,
                        height: 36,
                        borderRadius: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: tokens.accent,
                        borderWidth: 1,
                        borderColor: '#0006',
                    }}
                >
                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Create & Activate</Text>
                </Pressable>
            </View>
        </Card>
    );
}