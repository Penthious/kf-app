// app/campaign/new.tsx
import Card from '@/components/Card';
import SwitchRow from '@/components/ui/SwitchRow';
import TextRow from '@/components/ui/TextRow';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { getExpansionDescription, getExpansionDisplayName } from '../../src/utils/knights';

export default function NewCampaign() {
  const { tokens } = useThemeTokens();
  const router = useRouter();

  const { addCampaign, setFivePlayerMode, setNotes, setExpansionEnabled } = useCampaigns();

  const [name, setName] = useState('');
  const [fivePlayerMode, setFive] = useState(false);
  const [notes, setNotesText] = useState('');
  const [ttsfEnabled, setTTSFEnabled] = useState(false);
  const [tbbhEnabled, setTBBHEnabled] = useState(false);
  const [trkoeEnabled, setTRKOEEnabled] = useState(false);
  const [absoluteBastardEnabled, setAbsoluteBastardEnabled] = useState(false);
  const [serGallantEnabled, setSerGallantEnabled] = useState(false);

  const onSave = () => {
    const title = name.trim() || 'New Campaign';
    const campaignId = uuid.v4() as string;

    // 1) create
    addCampaign(campaignId, title);

    // 2) apply settings
    setFivePlayerMode(campaignId, fivePlayerMode);
    if (notes.trim()) setNotes(campaignId, notes.trim());
    setExpansionEnabled(campaignId, 'ttsf', ttsfEnabled);
    setExpansionEnabled(campaignId, 'tbbh', tbbhEnabled);
    setExpansionEnabled(campaignId, 'trkoe', trkoeEnabled);
    setExpansionEnabled(campaignId, 'absolute-bastard', absoluteBastardEnabled);
    setExpansionEnabled(campaignId, 'ser-gallant', serGallantEnabled);

    // 3) go to the campaign workspace - always start with knights tab for new campaigns
    router.replace(`/campaign/${campaignId}/knights`);
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
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: tokens.surface,
          borderBottomWidth: 1,
          borderColor: '#0006',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={onCancel}
          style={{
            paddingHorizontal: 10,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.surface,
            borderWidth: 1,
            borderColor: '#0006',
          }}
        >
          <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Cancel</Text>
        </Pressable>
        <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>New Campaign</Text>
        <Pressable
          onPress={onSave}
          style={{
            paddingHorizontal: 12,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.accent,
          }}
        >
          <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card style={{ marginBottom: 12 }}>
          <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
            Details
          </Text>
          <TextRow label='Name' value={name} onChangeText={setName} placeholder='Campaign name' />
          <SwitchRow label='Five-Player Mode' value={fivePlayerMode} onValueChange={setFive} />
          <TextRow
            label='Notes'
            value={notes}
            onChangeText={setNotesText}
            placeholder='Optional'
            multiline
            numberOfLines={4}
          />
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
            Expansions
          </Text>
          <SwitchRow
            label={getExpansionDisplayName('ttsf')}
            description={getExpansionDescription('ttsf')}
            value={ttsfEnabled}
            onValueChange={setTTSFEnabled}
            testID='ttsf-expansion-switch'
          />
          <SwitchRow
            label={getExpansionDisplayName('tbbh')}
            description={getExpansionDescription('tbbh')}
            value={tbbhEnabled}
            onValueChange={setTBBHEnabled}
            testID='tbbh-expansion-switch'
          />
          <SwitchRow
            label={getExpansionDisplayName('trkoe')}
            description={getExpansionDescription('trkoe')}
            value={trkoeEnabled}
            onValueChange={setTRKOEEnabled}
            testID='trkoe-expansion-switch'
          />
          <SwitchRow
            label={getExpansionDisplayName('absolute-bastard')}
            description={getExpansionDescription('absolute-bastard')}
            value={absoluteBastardEnabled}
            onValueChange={setAbsoluteBastardEnabled}
            testID='absolute-bastard-expansion-switch'
          />

          <SwitchRow
            label={getExpansionDisplayName('ser-gallant')}
            description={getExpansionDescription('ser-gallant')}
            value={serGallantEnabled}
            onValueChange={setSerGallantEnabled}
            testID='ser-gallant-expansion-switch'
          />
        </Card>

        {/* You can add pre-selection of knights here later if desired */}
      </ScrollView>
    </SafeAreaView>
  );
}
