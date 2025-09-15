export type ScavengeCardType =
  | 'full-clash'
  | 'exhibition-clash'
  | 'kingdom'
  | 'upgrade'
  | 'consumable';

export type ScavengeCard = {
  id: string;
  type: ScavengeCardType;
  name: string;
  description: string;
  rarity?: 'common' | 'uncommon' | 'rare';
};

// Scavenge Deck Composition:
// 2 Full Clash cards
// 2 Exhibition Clash cards
// 4 Kingdom cards
// 4 Upgrade cards
// 4 Consumable cards
// Total: 16 cards

export const SCAVENGE_DECK: ScavengeCard[] = [
  // Full Clash Cards (2)
  {
    id: 'full-clash-1',
    type: 'full-clash',
    name: 'Full Clash Loot',
    description: 'Powerful rewards from a decisive victory in a full tactical battle.',
    rarity: 'rare',
  },
  {
    id: 'full-clash-2',
    type: 'full-clash',
    name: 'Full Clash Loot',
    description: 'Powerful rewards from a decisive victory in a full tactical battle.',
    rarity: 'rare',
  },

  // Exhibition Clash Cards (2)
  {
    id: 'exhibition-clash-1',
    type: 'exhibition-clash',
    name: 'Exhibition Clash Loot',
    description: 'Moderate rewards from a smaller tactical skirmish.',
    rarity: 'uncommon',
  },
  {
    id: 'exhibition-clash-2',
    type: 'exhibition-clash',
    name: 'Exhibition Clash Loot',
    description: 'Moderate rewards from a smaller tactical skirmish.',
    rarity: 'uncommon',
  },

  // Kingdom Cards (4)
  {
    id: 'kingdom-1',
    type: 'kingdom',
    name: 'Kingdom Treasure',
    description: 'Valuable loot found while exploring the kingdom.',
    rarity: 'common',
  },
  {
    id: 'kingdom-2',
    type: 'kingdom',
    name: 'Kingdom Treasure',
    description: 'Valuable loot found while exploring the kingdom.',
    rarity: 'common',
  },
  {
    id: 'kingdom-3',
    type: 'kingdom',
    name: 'Kingdom Treasure',
    description: 'Valuable loot found while exploring the kingdom.',
    rarity: 'common',
  },
  {
    id: 'kingdom-4',
    type: 'kingdom',
    name: 'Kingdom Treasure',
    description: 'Valuable loot found while exploring the kingdom.',
    rarity: 'common',
  },

  // Upgrade Cards (4)
  {
    id: 'upgrade-1',
    type: 'upgrade',
    name: 'Equipment Upgrade',
    description: 'Improve your existing gear with this upgrade.',
    rarity: 'uncommon',
  },
  {
    id: 'upgrade-2',
    type: 'upgrade',
    name: 'Equipment Upgrade',
    description: 'Improve your existing gear with this upgrade.',
    rarity: 'uncommon',
  },
  {
    id: 'upgrade-3',
    type: 'upgrade',
    name: 'Equipment Upgrade',
    description: 'Improve your existing gear with this upgrade.',
    rarity: 'uncommon',
  },
  {
    id: 'upgrade-4',
    type: 'upgrade',
    name: 'Equipment Upgrade',
    description: 'Improve your existing gear with this upgrade.',
    rarity: 'uncommon',
  },

  // Consumable Cards (4)
  {
    id: 'consumable-1',
    type: 'consumable',
    name: 'Consumable Item',
    description: 'A useful item that can be consumed for immediate benefit.',
    rarity: 'common',
  },
  {
    id: 'consumable-2',
    type: 'consumable',
    name: 'Consumable Item',
    description: 'A useful item that can be consumed for immediate benefit.',
    rarity: 'common',
  },
  {
    id: 'consumable-3',
    type: 'consumable',
    name: 'Consumable Item',
    description: 'A useful item that can be consumed for immediate benefit.',
    rarity: 'common',
  },
  {
    id: 'consumable-4',
    type: 'consumable',
    name: 'Consumable Item',
    description: 'A useful item that can be consumed for immediate benefit.',
    rarity: 'common',
  },
];

export function getScavengeCardsByType(type: ScavengeCardType): ScavengeCard[] {
  return SCAVENGE_DECK.filter(card => card.type === type);
}

export function getAvailableScavengeTypes(
  phase: 'delve' | 'exhibition-clash' | 'full-clash'
): ScavengeCardType[] {
  switch (phase) {
    case 'delve':
      return ['kingdom', 'upgrade', 'consumable'];
    case 'exhibition-clash':
      return ['exhibition-clash', 'kingdom', 'upgrade', 'consumable'];
    case 'full-clash':
      return ['full-clash', 'kingdom', 'upgrade', 'consumable'];
    default:
      return [];
  }
}

export function getRarityColor(rarity: ScavengeCard['rarity']): string {
  switch (rarity) {
    case 'common':
      return '#9CA3AF'; // gray-400
    case 'uncommon':
      return '#10B981'; // emerald-500
    case 'rare':
      return '#8B5CF6'; // violet-500
    default:
      return '#6B7280'; // gray-500
  }
}
