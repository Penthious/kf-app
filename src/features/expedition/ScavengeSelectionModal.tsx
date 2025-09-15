import {
  getAvailableScavengeTypes,
  type ScavengeCard,
  type ScavengeCardType,
} from '@/catalogs/scavenge-deck';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Pill from '@/components/ui/Pill';
import type { LootCard } from '@/models/campaign';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ScavengeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCards: (cards: LootCard[], scavengeCardIds: string[]) => void;
  phase: 'delve' | 'exhibition-clash' | 'full-clash';
  availableCards: ScavengeCard[]; // Cards available for this scavenge action
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

  const availableTypes = getAvailableScavengeTypes(phase);

  const handleCardToggle = (card: ScavengeCard) => {
    setSelectedCards(prev => {
      const isSelected = prev.some(c => c.id === card.id);
      if (isSelected) {
        return prev.filter(c => c.id !== card.id);
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
        throw new Error(`Unknown scavenge type: ${scavengeType}`);
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

  const handleClose = () => {
    setSelectedCards([]);
    onClose();
  };

  const getCardTypeDescription = (type: ScavengeCardType): string => {
    switch (type) {
      case 'full-clash':
        return 'Available only during Full Clash phases';
      case 'exhibition-clash':
        return 'Available only during Exhibition Clash phases';
      case 'kingdom':
        return 'Available during both Delve and Clash phases';
      case 'upgrade':
        return 'Available during both Delve and Clash phases';
      case 'consumable':
        return 'Available during both Delve and Clash phases';
      default:
        return '';
    }
  };

  return (
    <Modal visible={visible} animationType='slide' presentationStyle='pageSheet'>
      <View style={{ flex: 1, backgroundColor: tokens.surface }}>
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: tokens.textMuted }}>
          <Text
            style={{ fontSize: 24, fontWeight: 'bold', color: tokens.textPrimary, marginBottom: 8 }}
          >
            Scavenge Loot
          </Text>
          <Text style={{ fontSize: 16, color: tokens.textMuted, marginBottom: 16 }}>
            Select loot cards from the scavenge deck. You can choose any combination of card types
            and take as many as you want.
          </Text>

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <Button label='Cancel' onPress={handleClose} />
            <Button
              label={`Confirm Selection (${selectedCards.length})`}
              onPress={handleConfirmSelection}
              disabled={selectedCards.length === 0}
            />
          </View>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {availableTypes.map(type => {
            const typeCards = availableCards.filter(card => card.type === type);
            if (typeCards.length === 0) return null;

            return (
              <Card key={type} style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: tokens.textPrimary,
                    marginBottom: 8,
                  }}
                >
                  {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Cards
                </Text>
                <Text style={{ fontSize: 14, color: tokens.textMuted, marginBottom: 16 }}>
                  {getCardTypeDescription(type)}
                </Text>

                <View style={{ gap: 12 }}>
                  {typeCards.map(card => {
                    const isSelected = selectedCards.some(c => c.id === card.id);
                    return (
                      <TouchableOpacity
                        key={card.id}
                        onPress={() => handleCardToggle(card)}
                        style={{
                          padding: 16,
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: isSelected ? tokens.accent : tokens.textMuted,
                          backgroundColor: isSelected ? `${tokens.accent}20` : tokens.surface,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '600',
                              color: tokens.textPrimary,
                              flex: 1,
                            }}
                          >
                            {card.name}
                          </Text>
                          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            {isSelected && <Pill label='Selected' selected={true} />}
                          </View>
                        </View>

                        <Text style={{ fontSize: 14, color: tokens.textMuted }}>
                          {card.description}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Card>
            );
          })}

          {availableCards.length === 0 && (
            <Card>
              <Text
                style={{ fontSize: 16, color: tokens.textMuted, textAlign: 'center', padding: 20 }}
              >
                No scavenge cards available for this phase.
              </Text>
            </Card>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
