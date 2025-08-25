import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';

export default function CampaignGear() {
    const { tokens } = useThemeTokens();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { campaigns } = useCampaigns();
    const c = id ? campaigns[id] : undefined;

    return (
        <SafeAreaView style={{ flex:1, backgroundColor: tokens.bg }}>
            <ScrollView contentContainerStyle={{ padding:16 }}>
                <Card>
                    <Text style={{ color: tokens.textPrimary, fontWeight:'800', marginBottom:8 }}>Gear (per Campaign)</Text>
                    {!c ? (
                        <Text style={{ color: tokens.textMuted }}>Campaign not found</Text>
                    ) : (
                        <View>
                            <Text style={{ color: tokens.textMuted }}>
                                Placeholder: filter/select gear for active lineup; attach to knights; integrate keywords popover.
                            </Text>
                        </View>
                    )}
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}