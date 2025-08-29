export type GearType = 'kingdom' | 'monster' | 'wandering' | 'consumable' | 'upgrade' | 'merchant';

export type GearStats = {
  attack?: number;
  defense?: number;
  evasion?: number;
  armor?: number;
  range?: number;
};

export type Gear = {
  id: string;
  name: string;
  type: GearType;
  kingdomId?: string; // Only for kingdom/monster gear
  monsterId?: string; // Only for monster gear
  upgradeType?: 'weapon' | 'armor'; // Only for upgrade gear
  attachedToGearId?: string; // Only for upgrade gear
  upgrades?: string[]; // Array of upgrade gear IDs attached to this gear
  isReforged?: boolean; // Only for merchant gear
  side?: 'normal' | 'reforged'; // Only for merchant gear
  reforgedStats?: GearStats; // Stats when reforged (for merchant gear)
  stats: GearStats;
  keywords: string[];
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  imageUrl?: string;
  cost?: number;
  consumable?: boolean;
  stackable?: boolean;
  maxStack?: number;
  quantity: number; // Total quantity available for this gear
};
