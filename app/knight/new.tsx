// app/knight/new.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import uuid from 'react-native-uuid';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import Button from '@/components/Button';
import TextRow from '@/components/TextRow';
import { useKnights } from '@/store/knights';
import { Knight, defaultSheet } from '@/models/knight';
import KNIGHTS_CATALOG from '@/catalogs/knights.json';

type KnightCatalogItem = { id: string; name: string };

function initialSheet(): Knight['sheet'] {
  return defaultSheet();
}

export default function NewKnightScreen() {
    const { tokens } = useThemeTokens();
    const { addKnight } = useKnights();

    const [name, setName] = React.useState('');
    const [catalogId, setCatalogId] = React.useState<string>((KNIGHTS_CATALOG as KnightCatalogItem[])[0]?.id ?? '');
    const defaultName = 'New Knight';


    const onCreate = () => {
        const uid = uuid.v4() as string; // ✅ pre-generate ID

        const k: Omit<Knight, 'version' | 'updatedAt'> = {
            knightUID: uid,
            ownerUserId: 'me',
            catalogId,
            name: name.trim() || defaultName,
            sheet: initialSheet(),
            rapport: [],
        };

        addKnight(k); // store may return void — that's fine
        router.replace({ pathname: '/knight/[id]', params: { id: uid } }); // ✅ navigate with the known id
    };

    const onCancel = () => router.back();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 }}>
                <Text style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 18 }}>Create Knight</Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
                <Card>
                    <TextRow
                        label="Name"
                        value={name}
                        onChangeText={setName}
                        placeholder={defaultName}
                    />
                    <Text style={{ color: tokens.textMuted, marginTop: 8, marginBottom: 6 }}>Choose Knight (catalog)</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                      {(KNIGHTS_CATALOG as KnightCatalogItem[]).map(kc => {
                        const isActive = catalogId === kc.id;
                        return (
                          <Button
                            key={kc.id}
                            label={kc.name}
                            onPress={() => setCatalogId(kc.id)}
                            tone={isActive ? 'accent' : 'default'}
                          />
                        );
                      })}
                    </View>
                </Card>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Button label="Cancel" onPress={onCancel} tone="default" />
                    <Button label="Create Knight" onPress={onCreate} tone="accent" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}