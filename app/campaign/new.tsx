// app/campaign/new.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import TextRow from '@/components/TextRow';
import SwitchRow from '@/components/SwitchRow';
import { useCampaigns } from '@/store/campaigns';
import uuid from 'react-native-uuid';

export default function NewCampaign() {
    const { tokens } = useThemeTokens();
    const router = useRouter();

    const {
        addCampaign,
        setFivePlayerMode,
        setNotes,
    } = useCampaigns();

    const [name, setName] = useState('');
    const [fivePlayerMode, setFive] = useState(false);
    const [notes, setNotesText] = useState('');

    const onSave = () => {
        const title = name.trim() || 'New Campaign';
        const campaignId = uuid.v4() as string;

        // 1) create
        addCampaign(campaignId, title);

        // 2) apply settings
        setFivePlayerMode(campaignId, fivePlayerMode);
        if (notes.trim()) setNotes(campaignId, notes.trim());

        // 3) go to the campaign workspace
        router.replace(`/campaign/${campaignId}`);
    };

    const onCancel = () => {
        Alert.alert('Discard new campaign?', undefined, [
            { text: 'Keep Editing', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
            {/* Header */}
            <View style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: tokens.surface,
                borderBottomWidth: 1, borderColor: '#0006',
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <Pressable onPress={onCancel} style={{ paddingHorizontal: 10, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.surface, borderWidth: 1, borderColor: '#0006' }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Cancel</Text>
                </Pressable>
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>New Campaign</Text>
                <Pressable onPress={onSave} style={{ paddingHorizontal: 12, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: tokens.accent }}>
                    <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Save</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Card style={{ marginBottom: 12 }}>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Details</Text>
                    <TextRow label="Name" value={name} onChangeText={setName} placeholder="Campaign name" />
                    <SwitchRow label="Five-Player Mode" value={fivePlayerMode} onValueChange={setFive} />
                    <TextRow
                        label="Notes"
                        value={notes}
                        onChangeText={setNotesText}
                        placeholder="Optional"
                        multiline
                        numberOfLines={4}
                    />
                </Card>

                {/* You can add pre-selection of knights here later if desired */}
            </ScrollView>
        </SafeAreaView>
    );
}