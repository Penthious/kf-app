import Button from '@/components/Button';
import Card from '@/components/Card';
import { Knight } from '@/models/knight';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KnightsScreen() {
  const { tokens } = useThemeTokens();
  const { knightsById } = useKnights();
  const list = Object.values(knightsById);

  const goToCreate = () => router.push('/knight/new');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {list.length === 0 ? (
          <Text style={{ color: tokens.textMuted, textAlign: 'center', marginTop: 24 }}>
            No knights yet.
          </Text>
        ) : (
          list.map((k: Knight) => (
            <Pressable
              key={k.knightUID}
              onPress={() => router.push(`/knight/${k.knightUID}`)}
              style={{ marginBottom: 8 }}
            >
              <Card>
                <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>{k.name}</Text>
                <Text style={{ color: tokens.textMuted }}>Catalog: {k.catalogId}</Text>
              </Card>
            </Pressable>
          ))
        )}
        <View style={{ height: 12 }} />
        <Button label='+ New Knight' onPress={goToCreate} />
      </ScrollView>
    </SafeAreaView>
  );
}
