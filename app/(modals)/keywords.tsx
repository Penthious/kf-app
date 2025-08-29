import Card from '@/components/Card';
import SearchInput from '@/components/ui/SearchInput';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import KEYWORD_CATALOG from '@/catalogs/keywords';

const catalog = KEYWORD_CATALOG;

const LETTERS = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function KeywordsScreen() {
    const {tokens} = useThemeTokens();
    const [q, setQ] = useState('');
    const [activeLetter, setActiveLetter] = useState<string>('#');
    const [selected, setSelected] = useState<typeof catalog[number] | null>(null);

    const [qDebounced, setQDebounced] = useState(q);
    useEffect(() => {
        const t = setTimeout(() => setQDebounced(q), 150);
        return () => clearTimeout(t);
    }, [q]);

    const data = useMemo(() => {
        const byLetter: Record<string, typeof catalog> = {};
        const filtered = catalog
            .filter(k => {
                if (!qDebounced) return true;
                const hay = `${k.name} ${k.summary} ${k.rulesText} ${(k.tags||[]).join(' ')}`.toLowerCase();
                return hay.includes(qDebounced.toLowerCase());
            })
            .sort((a, b) => a.name.localeCompare(b.name));

        for (const k of filtered) {
            const first = k.name?.[0]?.toUpperCase() || '#';
            const bucket = LETTERS.includes(first) ? first : '#';
            if (!byLetter[bucket]) byLetter[bucket] = [];
            byLetter[bucket].push(k);
        }
        return byLetter;
    }, [qDebounced]);

    const availableLetters = useMemo(
        () => LETTERS.filter(letter => (data[letter]?.length ?? 0) > 0),
        [data]
    );

    const sections = useMemo(() => {
        if (activeLetter !== '#' && (data[activeLetter]?.length ?? 0) > 0) {
            return [activeLetter];
        }
        return availableLetters;
    }, [data, activeLetter, availableLetters]);

    const jumpTo = (letter: string) => setActiveLetter(letter);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            <KeyboardAvoidingView
                style={{flex:1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={0}
            >
                <View style={{padding:16}}>
                    <SearchInput value={q} onChangeText={setQ} />
                    {/* A–Z bar */}
                    <ScrollView
                        horizontal
                        keyboardShouldPersistTaps="always"
                        keyboardDismissMode="on-drag"
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{paddingTop: 12, paddingBottom: 4}}
                        style={{marginTop: 8}}
                    >
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            {LETTERS.map((letter, idx) => {
                                const enabled = (data[letter]?.length ?? 0) > 0;
                                const isActive = activeLetter === letter && enabled;
                                return (
                                    <Pressable
                                        key={`${letter}-${idx}`}
                                        onPress={() => enabled && jumpTo(letter)}
                                        style={{
                                            opacity: enabled ? 1 : 0.4,
                                            backgroundColor: isActive ? tokens.accent : tokens.surface,
                                            paddingVertical: 6,
                                            paddingHorizontal: 10,
                                            borderRadius: 999,
                                            marginRight: 8
                                        }}
                                    >
                                        <Text style={{color: tokens.textPrimary, fontWeight: '700'}}>{letter}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                {/* Keyword list */}
                <ScrollView
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    contentContainerStyle={{paddingHorizontal:16, paddingBottom:16}}
                >
                    {sections.map((letter) => (
                        <View key={`section-${letter}`} style={{marginBottom: 16}}>
                            <Text style={{color: tokens.textMuted, marginBottom: 8, fontWeight:'700'}}>{letter}</Text>
                            {data[letter]!.map((k, i) => (
                                <Pressable key={`${k.id}-${i}`} onPress={() => setSelected(k)} style={{marginBottom: 8}}>
                                    <Card>
                                        <Text style={{color: tokens.textPrimary, fontWeight:'700', marginBottom: 4}}>
                                            {k.name}{k.stackable ? ' X' : ''}
                                        </Text>
                                        <Text style={{color: tokens.textMuted}} numberOfLines={2}>{k.summary}</Text>
                                    </Card>
                                </Pressable>
                            ))}
                        </View>
                    ))}
                    {sections.length === 0 && (
                        <Text style={{color: tokens.textMuted, textAlign:'center', marginTop: 40}}>
                            No results. Try a different search.
                        </Text>
                    )}
                </ScrollView>

                {/* Modal for full definition */}
                <Modal
                    visible={!!selected}
                    animationType="slide"
                    onRequestClose={()=>setSelected(null)}
                    presentationStyle="pageSheet"
                >
                    <SafeAreaView style={{flex:1, backgroundColor: tokens.bg}}>
                        <View style={{padding:16, borderBottomWidth: 1, borderColor: '#00000022', backgroundColor: tokens.surface}}>
                            <Text style={{color: tokens.textPrimary, fontSize: 18, fontWeight:'800'}}>{selected?.name}</Text>
                            {selected?.stackable ? <Text style={{color: tokens.textMuted}}>Stackable</Text> : null}
                        </View>
                        <ScrollView contentContainerStyle={{padding:16}} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
                            <Text style={{color: tokens.textPrimary}}>{selected?.rulesText}</Text>
                            {selected?.seeAlso?.length ? (
                                <Text style={{color: tokens.textMuted, marginTop: 12}}>See also: {selected.seeAlso.join(', ')}</Text>
                            ) : null}
                            {selected?.page ? (
                                <Text style={{color: tokens.textMuted, marginTop: 4}}>Rulebook p.{selected.page}</Text>
                            ) : null}
                        </ScrollView>

                        <Pressable onPress={()=>setSelected(null)} style={{margin:16, padding:12, borderRadius:12, backgroundColor: tokens.accent}}>
                            <Text style={{textAlign:'center', color:'#0B0B0B', fontWeight:'800'}}>Close</Text>
                        </Pressable>
                    </SafeAreaView>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
