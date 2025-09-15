import type { ScavengeCard, ScavengeCardType } from '@/catalogs/scavenge-deck';
import Button from '@/components/Button';
import Card from '@/components/Card';
import type { LootCard } from '@/models/campaign';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';

interface ScavengeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCards: (lootCards: LootCard[], scavengeCardIds: string[]) => void;
  phase: string;
  availableCards: ScavengeCard[];
}

export default function ScavengeSelectionModal({
  visible,
  onClose,
  onSelectCards,
  phase,
  availableCards,
}: ScavengeSelectionModalProps) {
  const { tokens } = useThemeTokens();
  const [selectedCards, setSelectedCards] = useState<ScavengeCard[]>([]);

  const handleCardToggle = (card: ScavengeCard) => {
    setSelectedCards(prev => {
      const isSelected = prev.some(selected => selected.id === card.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== card.id);
      } else {
        return [...prev, card];
      }
    });
  };

  const mapScavengeTypeToLootType = (scavengeType: ScavengeCardType): LootCard['type'] => {
    switch (scavengeType) {
      case 'kingdom':
        return 'kingdom-gear';
      case 'consumable':
        return 'consumable-gear';
      case 'upgrade':
        return 'upgrade';
      case 'exhibition-clash':
        return 'exhibition-clash';
      case 'full-clash':
        return 'full-clash';
      default:
        // Fallback for any new types
        return 'upgrade';
    }
  };

  const handleConfirmSelection = () => {
    const lootCards: LootCard[] = selectedCards.map(card => ({
      id: `loot-${Date.now()}-${Math.random()}`,
      type: mapScavengeTypeToLootType(card.type),
      source: `${phase}-scavenge`,
      obtainedAt: Date.now(),
      obtainedBy: '', // Will be set by the parent component
    }));

    const scavengeCardIds = selectedCards.map(card => card.id);

    onSelectCards(lootCards, scavengeCardIds);
    setSelectedCards([]);
    onClose();
  };

  const handleCancel = () => {
    setSelectedCards([]);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={handleCancel}
    >
      <View style={{ flex: 1, backgroundColor: tokens.bg }}>
        <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: tokens.surface }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: tokens.textPrimary }}>
            Select Scavenge Cards
          </Text>
          <Text style={{ fontSize: 14, color: tokens.textMuted, marginTop: 4 }}>
            Choose up to {availableCards.length} cards to scavenge
          </Text>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
          <View style={{ gap: 12 }}>
            {availableCards.map(card => {
              const isSelected = selectedCards.some(selected => selected.id === card.id);

              return (
                <Card
                  key={card.id}
                  style={{
                    borderWidth: 2,
                    borderColor: isSelected ? tokens.accent : tokens.surface,
                    backgroundColor: isSelected ? tokens.surface : tokens.card,
                  }}
                >
                  <View style={{ padding: 12 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{ fontSize: 16, fontWeight: '600', color: tokens.textPrimary }}
                        >
                          {card.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: tokens.textMuted, marginTop: 2 }}>
                          {card.type} • {card.rarity}
                        </Text>
                        {card.description && (
                          <Text style={{ fontSize: 14, color: tokens.textPrimary, marginTop: 8 }}>
                            {card.description}
                          </Text>
                        )}
                      </View>
                      <Button
                        label={isSelected ? 'Selected' : 'Select'}
                        onPress={() => handleCardToggle(card)}
                        tone={isSelected ? 'accent' : 'default'}
                      />
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        </ScrollView>

        <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: tokens.surface }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button label='Cancel' onPress={handleCancel} tone='default' />
            <Button
              label={`Confirm (${selectedCards.length})`}
              onPress={handleConfirmSelection}
              tone='accent'
              disabled={selectedCards.length === 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
