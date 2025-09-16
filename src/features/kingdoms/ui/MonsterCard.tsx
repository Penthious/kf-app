import Card from '@/components/Card';
import { KingdomView } from '@/features/kingdoms/kingdomView';
import { KingdomMonster } from '@/models/kingdom';
import { useMonsters } from '@/store/monsters';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Text, View } from 'react-native';
import StageBadge from './StageBadge';

interface MonsterCardProps {
  kingdom?: KingdomView;
  stageRow: Record<string, number | null>;
  availableOnly?: boolean;
}

export default function MonsterCard({ kingdom, stageRow, availableOnly = true }: MonsterCardProps) {
  const { tokens } = useThemeTokens();
  const monsters: KingdomMonster[] = kingdom?.bestiary?.monsters ?? [];

  // Filter monsters based on availability
  const list = availableOnly ? monsters.filter(m => (stageRow[m.id] ?? 0) > 0) : monsters;

  const byId = useMonsters(s => s.byId);

  // Get display title
  const getDisplayTitle = () => {
    const kingdomName = kingdom?.name?.trim();
    return kingdomName ? `${kingdomName} • Monsters` : 'Kingdom • Monsters';
  };

  // Get monster display name with tier
  const getMonsterNameWithTier = (monsterId: string) => {
    const base = byId[monsterId];
    const name = base?.name ?? monsterId;
    const tier = base?.tier ?? 'Unknown';
    return `${name} (${tier})`;
  };

  // Get stage for monster
  const getMonsterStage = (monsterId: string) => {
    return Number(stageRow[monsterId] ?? 0) || 0;
  };

  return (
    <Card testID='monster-card'>
      <Text
        style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}
        testID='monster-card-title'
      >
        {getDisplayTitle()}
      </Text>

      <View style={{ gap: 8 }} testID='monster-list-container'>
        {list.length > 0 ? (
          list.map(m => {
            const stage = getMonsterStage(m.id);
            const nameWithTier = getMonsterNameWithTier(m.id);

            return (
              <View
                key={m.id}
                testID={`monster-item-${m.id}`}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: tokens.surface,
                  borderWidth: 1,
                  borderColor: '#0006',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View testID={`monster-name-${m.id}`}>
                  <Text
                    style={{ color: tokens.textPrimary, fontWeight: '700' }}
                    testID={`monster-name-text-${m.id}`}
                  >
                    {nameWithTier}
                  </Text>
                </View>
                <StageBadge stage={stage} testID={`monster-stage-${m.id}`} />
              </View>
            );
          })
        ) : (
          <Text style={{ color: tokens.textMuted }} testID='no-monsters-message'>
            No monsters currently available.
          </Text>
        )}
      </View>
    </Card>
  );
}
