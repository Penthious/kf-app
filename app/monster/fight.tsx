import { MONSTERS } from '@/catalogs/monsters';
import Button from '@/components/Button';
import Card from '@/components/Card';
import {
  ActivationCounter,
  MonsterStats,
  MonsterTrait,
  TraitAbility,
  TraitActivation,
} from '@/models/monster';
import { DEVOUR_DRAGONS_CARD } from '@/models/special-cards';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MonsterFightScreen() {
  const { tokens } = useThemeTokens();
  const { monsterId, level, specialCard } = useLocalSearchParams<{ 
    monsterId: string; 
    level: string; 
    specialCard?: string; 
  }>();

  // Get monster data
  const monsterCatalog = MONSTERS.filter((m: MonsterStats) => m.id === monsterId);
  const monsterLevel = parseInt(level || '1', 10);

  if (monsterCatalog.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
              Monster Not Found
            </Text>
            <Text style={{ color: tokens.textMuted, marginBottom: 16 }}>
              The monster you&apos;re looking for doesn&apos;t exist.
            </Text>
            <Button label='Go Back' onPress={() => router.back()} tone='default' />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  // Find the monster stats for the specified level
  const monsterStats = monsterCatalog.find((stats: MonsterStats) => stats.level === monsterLevel);

  if (!monsterStats) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
              Level Not Found
            </Text>
            <Text style={{ color: tokens.textMuted, marginBottom: 16 }}>
              Level {monsterLevel} for {monsterCatalog[0]?.name} is not available.
            </Text>
            <Button label='Go Back' onPress={() => router.back()} tone='default' />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <Text
            style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 24, marginBottom: 8 }}
          >
            {specialCard === DEVOUR_DRAGONS_CARD.id ? '🐉 ' : ''}{monsterStats.name}
          </Text>
          <Text style={{ color: tokens.textMuted, marginBottom: 16 }}>
            Level {monsterStats.level}
          </Text>

          {/* Devour Dragons Special Rules */}
          {specialCard === DEVOUR_DRAGONS_CARD.id && (
            <View style={{ marginBottom: 20 }}>
              <View
                style={{
                  backgroundColor: tokens.accent + '20',
                  borderWidth: 2,
                  borderColor: tokens.accent,
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: tokens.accent,
                    fontWeight: '700',
                    fontSize: 18,
                    marginBottom: 8,
                  }}
                >
                  🐉 {DEVOUR_DRAGONS_CARD.name}
                </Text>
                <Text
                  style={{
                    color: tokens.textPrimary,
                    fontWeight: '600',
                    marginBottom: 8,
                  }}
                >
                  Special Rules:
                </Text>
                <Text
                  style={{
                    color: tokens.textMuted,
                    lineHeight: 20,
                    marginBottom: 8,
                  }}
                >
                  {DEVOUR_DRAGONS_CARD.rules}
                </Text>
                
                {/* Show monster-specific modifiers if they exist */}
                {DEVOUR_DRAGONS_CARD.monsterModifiers && 
                 DEVOUR_DRAGONS_CARD.monsterModifiers.find(mod => mod.monsterId === monsterId) && (
                  <View style={{ marginTop: 12 }}>
                    <Text
                      style={{
                        color: tokens.textPrimary,
                        fontWeight: '600',
                        marginBottom: 8,
                      }}
                    >
                      Monster Modifiers:
                    </Text>
                    {DEVOUR_DRAGONS_CARD.monsterModifiers
                      .filter(mod => mod.monsterId === monsterId)
                      .map((modifier, index) => (
                        <View key={index} style={{ marginBottom: 8 }}>
                          <Text
                            style={{
                              color: tokens.textMuted,
                              lineHeight: 20,
                              fontWeight: '500',
                            }}
                          >
                            {modifier.rules}
                          </Text>
                          {modifier.additionalSetup && (
                            <Text
                              style={{
                                color: tokens.textMuted,
                                lineHeight: 20,
                                fontStyle: 'italic',
                                marginTop: 4,
                              }}
                            >
                              Additional Setup: {modifier.additionalSetup}
                            </Text>
                          )}
                        </View>
                      ))}
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Basic Stats */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: tokens.textPrimary,
                fontWeight: '700',
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              Stats
            </Text>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: tokens.textMuted }}>To Hit:</Text>
                <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                  {monsterStats.toHit}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: tokens.textMuted }}>Wounds:</Text>
                <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                  {monsterStats.wounds}
                </Text>
              </View>
              {monsterStats.atBonus && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: tokens.textMuted }}>AT Bonus:</Text>
                  <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                    +{monsterStats.atBonus}
                  </Text>
                </View>
              )}
              {monsterStats.vigorLossBonus && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: tokens.textMuted }}>Vigor Loss Bonus:</Text>
                  <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                    +{monsterStats.vigorLossBonus}
                  </Text>
                </View>
              )}
              {monsterStats.evasionDiceBonus && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: tokens.textMuted }}>Evasion Dice Bonus:</Text>
                  <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                    +{monsterStats.evasionDiceBonus}
                  </Text>
                </View>
              )}
              {monsterStats.escalations && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: tokens.textMuted }}>Escalations:</Text>
                  <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                    {monsterStats.escalations}
                  </Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: tokens.textMuted }}>Exhibition Starting Wounds:</Text>
                <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                  {monsterStats.exhibitionStartingWounds}
                </Text>
              </View>
            </View>
          </View>

          {/* AI Activations */}
          {monsterStats.aiActivation && monsterStats.aiActivation.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  color: tokens.textPrimary,
                  fontWeight: '700',
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                AI Activations
              </Text>
              <View style={{ gap: 8 }}>
                {monsterStats.aiActivation.map((activation: ActivationCounter, index: number) => (
                  <View
                    key={index}
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                  >
                    <Text style={{ color: tokens.textMuted }}>{activation.type}:</Text>
                    <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                      {activation.count}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Signature Activations */}
          {monsterStats.signatureActivation && monsterStats.signatureActivation.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  color: tokens.textPrimary,
                  fontWeight: '700',
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                Signature Activations
              </Text>
              <View style={{ gap: 8 }}>
                {monsterStats.signatureActivation.map(
                  (activation: ActivationCounter, index: number) => (
                    <View
                      key={index}
                      style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                    >
                      <Text style={{ color: tokens.textMuted }}>{activation.type}:</Text>
                      <Text style={{ color: tokens.textPrimary, fontWeight: '600' }}>
                        {activation.count}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}

          {/* Traits */}
          {monsterStats.traits && monsterStats.traits.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  color: tokens.textPrimary,
                  fontWeight: '700',
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                Traits
              </Text>
              <View style={{ gap: 12 }}>
                {monsterStats.traits.map((trait: MonsterTrait, index: number) => (
                  <View
                    key={trait.id || index}
                    style={{ backgroundColor: tokens.surface, padding: 12, borderRadius: 8 }}
                  >
                    <Text style={{ color: tokens.textPrimary, fontWeight: '600', marginBottom: 4 }}>
                      {trait.name}
                    </Text>
                    {trait.details && (
                      <Text style={{ color: tokens.textMuted, marginBottom: 8, lineHeight: 20 }}>
                        {trait.details}
                      </Text>
                    )}
                    {trait.additionalSetup && (
                      <Text
                        style={{
                          color: tokens.textMuted,
                          marginBottom: 8,
                          lineHeight: 20,
                          fontStyle: 'italic',
                        }}
                      >
                        Setup: {trait.additionalSetup}
                      </Text>
                    )}
                    {trait.activations && trait.activations.length > 0 && (
                      <View style={{ marginBottom: 8 }}>
                        <Text
                          style={{ color: tokens.textPrimary, fontWeight: '500', marginBottom: 4 }}
                        >
                          Activations:
                        </Text>
                        {trait.activations.map((activation: TraitActivation, actIndex: number) => (
                          <Text key={actIndex} style={{ color: tokens.textMuted, lineHeight: 18 }}>
                            • {activation.name}: {activation.detail}
                          </Text>
                        ))}
                      </View>
                    )}
                    {trait.abilities && trait.abilities.length > 0 && (
                      <View>
                        <Text
                          style={{ color: tokens.textPrimary, fontWeight: '500', marginBottom: 4 }}
                        >
                          Abilities:
                        </Text>
                        {trait.abilities.map((ability: TraitAbility, abilityIndex: number) => (
                          <Text
                            key={abilityIndex}
                            style={{ color: tokens.textMuted, lineHeight: 18 }}
                          >
                            • {ability.name}: {ability.details}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          <Button label='Go Back' onPress={() => router.back()} tone='default' />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
