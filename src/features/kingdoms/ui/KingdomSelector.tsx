import Card from '@/components/Card';
import type { KingdomCatalog } from '@/models/kingdom';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text, View } from 'react-native';

export default function KingdomSelector({
  kingdoms,
  activeKingdomId,
  onSelect,
}: {
  kingdoms: KingdomCatalog[];
  activeKingdomId?: string | null;
  onSelect: (id: string) => void;
}) {
  const { tokens } = useThemeTokens();

  return (
    <Card>
      <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
        Select Kingdom
      </Text>
      {kingdoms.length === 0 ? (
        <Text style={{ color: tokens.textMuted }}>
          No kingdoms loaded. Check your loader export.
        </Text>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {kingdoms.map(k => {
            const isActive = (activeKingdomId ?? kingdoms[0]?.id) === k.id;
            return (
              <Pressable
                key={k.id}
                onPress={() => onSelect(k.id)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: isActive ? tokens.accent : tokens.surface,
                  borderWidth: 1,
                  borderColor: '#0006',
                  minWidth: '48%',
                }}
              >
                <Text
                  style={{ color: isActive ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}
                >
                  {k.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </Card>
  );
}
