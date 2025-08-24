import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useKnights } from '@/store/knights';
import { Knight } from '@/models/knight';
import { useRouter } from 'expo-router';
import uuid from 'react-native-uuid';
import Card from '@/components/Card';
import Button from '@/components/Button';
import knightsCatalog from '@/catalogs/knights.json';

export default function NewKnight(){
    const { tokens } = useThemeTokens();
    const { addKnight } = useKnights();
    const router = useRouter();

    const [name, setName] = React.useState('');
    const [catalogId, setCatalogId] = React.useState(knightsCatalog[0].id);

    const onCreate = () => {
        const id = String(uuid.v4());
        const catalog = knightsCatalog.find(k => k.id === catalogId);
        const k: Omit<Knight, 'version'|'updatedAt'> = {
            knightUID: id,
            ownerUserId: 'me',
            catalogId,
            name: name.trim() || catalog?.name || 'Unnamed Knight',
            rapport: [],
            sheet: {
                virtues: { bravery: 1, tenacity: 1, sagacity: 1, fortitude: 1, might: 1, insight: 1 },
                bane: 0, gold: 0, leads: 0, sighOfGraal: 0, chapter: 0,
                chapterQuest: '',
                investigations: [],     // store will fill defaults on add
                choiceMatrix: {},       // store will fill defaults on add
                prologueDone: false, postgameDone: false,
                notes: '', saints: [], mercenaries: []
            }
        };
        const saved = addKnight(k);
        router.replace(`/knight/${saved.knightUID}`);
    };

    const onCancel = () => router.back();

    return (
        <SafeAreaView style={{flex:1, backgroundColor: tokens.bg}}>
            <View style={{padding:16}}>
                <Text style={{color: tokens.textPrimary, fontSize: 20, fontWeight:'800', marginBottom: 12}}>Create Knight</Text>

                <Card style={{marginBottom: 12}}>
                    <Text style={{color: tokens.textPrimary, fontWeight:'700', marginBottom: 6}}>Name (optional override)</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Leave blank to use catalog name"
                        placeholderTextColor={tokens.textMuted}
                        style={{backgroundColor: tokens.surface, color: tokens.textPrimary, borderWidth:1, borderColor:'#0006', padding:10, borderRadius:12}}
                        autoCorrect={false}
                    />

                    <View style={{height:12}} />

                    <Text style={{color: tokens.textPrimary, fontWeight:'700', marginBottom: 6}}>Select Catalog Knight</Text>
                    {knightsCatalog.map(k => (
                        <Pressable
                            key={k.id}
                            onPress={() => setCatalogId(k.id)}
                            style={{
                                padding:12,
                                borderRadius:10,
                                marginBottom:8,
                                backgroundColor: catalogId === k.id ? tokens.accent : tokens.surface
                            }}
                        >
                            <Text style={{color: catalogId === k.id ? '#0B0B0B' : tokens.textPrimary, fontWeight:'700'}}>
                                {k.name}
                            </Text>
                            <Text style={{color: catalogId === k.id ? '#0B0B0B' : tokens.textMuted, fontSize:12}}>
                                {k.source}
                            </Text>
                        </Pressable>
                    ))}
                </Card>

                <View style={{flexDirection:'row', gap: 12}}>
                    <View style={{flex:1}}>
                        <Button variant="outline" label="Cancel" onPress={onCancel} />
                    </View>
                    <View style={{flex:1}}>
                        <Button label="Create" onPress={onCreate} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}