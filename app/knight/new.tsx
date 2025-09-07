// app/knight/new.tsx
import KNIGHTS_CATALOG from '@/catalogs/knights';
import Button from '@/components/Button';
import Card from '@/components/Card';
import TextRow from '@/components/ui/TextRow';
import { Knight, createSheetWithStartingVirtues } from '@/models/knight';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

type KnightCatalogItem = { id: string; name: string };

export default function NewKnightScreen() {
  const { tokens } = useThemeTokens();
  const { addKnight } = useKnights();

  const firstKnight = (KNIGHTS_CATALOG as KnightCatalogItem[])[0];
  const [name, setName] = React.useState(firstKnight?.name ?? '');
  const [catalogId, setCatalogId] = React.useState<string>(firstKnight?.id ?? '');
  const defaultName = 'New Knight';

  // Get the currently selected knight for placeholder
  const selectedKnight = KNIGHTS_CATALOG.find(k => k.id === catalogId);

  const onCreate = () => {
    const uid = uuid.v4() as string;

    // Get the selected catalog knight's name as fallback
    const selectedKnight = KNIGHTS_CATALOG.find(k => k.id === catalogId);
    const knightName = name.trim() || selectedKnight?.name || defaultName;

    const k: Omit<Knight, 'version' | 'updatedAt'> = {
      knightUID: uid,
      ownerUserId: 'me',
      catalogId,
      name: knightName,
      sheet: createSheetWithStartingVirtues(catalogId, KNIGHTS_CATALOG),
      rapport: [],
    };

    const knight = addKnight(k);
    router.replace({ pathname: '/knight/[id]', params: { id: knight.knightUID } });
  };

  const onCancel = () => router.back();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 }}>
        <Text style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 18 }}>
          Create Knight
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Card>
          <TextRow
            label='Name'
            value={name}
            onChangeText={setName}
            placeholder={selectedKnight?.name || defaultName}
          />
          <Text style={{ color: tokens.textMuted, marginTop: 8, marginBottom: 6 }}>
            Choose Knight (catalog)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {(KNIGHTS_CATALOG as KnightCatalogItem[]).map(kc => {
              const isActive = catalogId === kc.id;
              return (
                <Button
                  key={kc.id}
                  label={kc.name}
                  onPress={() => {
                    setCatalogId(kc.id);
                    setName(kc.name);
                  }}
                  tone={isActive ? 'accent' : 'default'}
                />
              );
            })}
          </View>
        </Card>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button label='Cancel' onPress={onCancel} tone='default' />
          <Button label='Create Knight' onPress={onCreate} tone='accent' />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
