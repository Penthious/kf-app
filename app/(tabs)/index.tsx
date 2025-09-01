// app/(tabs)/index.tsx
import Card from '@/components/Card';
import { useCampaigns } from '@/store/campaigns';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

export default function CampaignsScreen() {
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const { campaigns, removeCampaign } = useCampaigns();
  const list = Object.values(campaigns);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 80, // Add extra padding to account for fixed button
        }}
      >
        {list.length === 0 ? (
          <Card style={{ marginBottom: 12 }}>
            <Text style={{ color: tokens.textPrimary, marginBottom: 6 }}>
              You don’t have any campaigns yet.
            </Text>
            <Text style={{ color: tokens.textMuted }}>
              Tap “New Campaign” below to create your first one.
            </Text>
          </Card>
        ) : (
          list.map(c => (
            <View key={c.campaignId} style={{ marginBottom: 12 }}>
              <Card>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Pressable
                    onPress={() => router.push(`/campaign/${c.campaignId}`)}
                    style={{ flex: 1 }}
                  >
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>{c.name}</Text>
                    <Text style={{ color: tokens.textMuted, marginTop: 4 }}>
                      {c.members.filter(m => m.isActive).length} active · {c.members.length} total
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      Alert.alert(
                        'Delete campaign?',
                        `Are you sure you want to delete "${c.name}"? This cannot be undone.`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => removeCampaign(c.campaignId),
                          },
                        ]
                      );
                    }}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      backgroundColor: '#2a1313',
                      marginLeft: 8,
                    }}
                  >
                    <Text style={{ color: '#F9DADA', fontWeight: '600', fontSize: 12 }}>
                      Delete
                    </Text>
                  </Pressable>
                </View>
              </Card>
            </View>
          ))
        )}
      </ScrollView>

      {/* Fixed bottom button */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: tokens.bg,
          borderTopWidth: 1,
          borderTopColor: tokens.surface,
        }}
      >
        <Pressable
          onPress={() => router.push('/campaign/new')}
          style={{
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.accent,
          }}
        >
          <Text style={{ color: '#0B0B0B', fontWeight: '800' }}>New Campaign</Text>
        </Pressable>
      </View>
    </View>
  );
}
