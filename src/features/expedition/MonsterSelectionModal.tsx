import { DistrictWheel } from '@/models/district';
import { KingdomMonster } from '@/models/kingdom';
import { selectMonsterName, useMonsters } from '@/store/monsters';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface MonsterSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMonster: (monsterId: string) => void;
  districtWheel: DistrictWheel;
  availableMonsters: KingdomMonster[];
  currentMonsterId?: string;
}

function MonsterSelectionModal({
  visible,
  onClose,
  onSelectMonster,
  districtWheel,
  availableMonsters,
  currentMonsterId,
}: MonsterSelectionModalProps) {
  const { tokens } = useThemeTokens();
  const monstersState = useMonsters();

  // Show all available monsters - the user can choose any monster
  // The replaceDistrictMonster function will handle swapping monsters between districts
  const selectableMonsters = availableMonsters.filter(
    monster => monster.id !== currentMonsterId // Only exclude the current monster for this district
  );

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: tokens.bg }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: tokens.textMuted + '20',
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: tokens.textPrimary }}>
            Select Monster
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 16, color: tokens.accent, fontWeight: '500' }}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
          <Text
            style={{
              fontSize: 14,
              color: tokens.textMuted,
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            Choose a monster to assign to this district. If the monster is already assigned to
            another district, it will be moved to this district.
          </Text>

          {selectableMonsters.length === 0 ? (
            <View
              style={{
                padding: 20,
                backgroundColor: tokens.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: tokens.textMuted + '20',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: tokens.textMuted,
                  textAlign: 'center',
                }}
              >
                No available monsters to select
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {selectableMonsters.map(monster => (
                <TouchableOpacity
                  key={monster.id}
                  onPress={() => {
                    onSelectMonster(monster.id);
                    onClose();
                  }}
                  style={{
                    padding: 16,
                    backgroundColor: tokens.surface,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: tokens.textMuted + '20',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: tokens.textPrimary,
                    }}
                  >
                    {selectMonsterName(monster.id)(monstersState)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default MonsterSelectionModal;
