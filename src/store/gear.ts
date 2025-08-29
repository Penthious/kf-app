import type { Gear, GearType } from '@/models/gear';
import { create } from 'zustand';

export type GearState = {
  allGear: Record<string, Gear>;
  gearByKingdom: Record<string, string[]>; // kingdomId -> gearIds (kingdom + monster)
  gearByType: Record<GearType, string[]>; // type -> gearIds
  wanderingGear: string[]; // wandering gear IDs only
  consumableGear: string[]; // consumable gear IDs only
  userGear: Record<string, number>; // gearId -> quantity
  equippedGear: Record<string, string[]>; // knightId -> gearIds
};

export type GearActions = {
  // Core gear management
  addGear: (gear: Gear) => void;
  removeGear: (gearId: string) => void;
  updateGear: (gearId: string, updates: Partial<Gear>) => void;
  resetGear: () => void;

  // Gear queries
  getGearByKingdom: (kingdomId: string) => Gear[];
  getGearByType: (type: GearType) => Gear[];
  getGlobalGear: () => Gear[];

  // User gear management
  addUserGear: (gearId: string, quantity: number) => void;
  removeUserGear: (gearId: string, quantity: number) => void;

  // Equipment management
  equipGear: (knightId: string, gearId: string) => void;
  unequipGear: (knightId: string, gearId: string) => void;
  getEquippedGear: (knightId: string) => string[];

  // Image management
  setGearImage: (gearId: string, imageUrl: string) => void;
  removeGearImage: (gearId: string) => void;
};

export type GearStore = GearState & GearActions;

// Sample gear data for demonstration
const sampleGear: Record<string, Gear> = {
  'sword-of-truth': {
    id: 'sword-of-truth',
    name: 'Sword of Truth',
    type: 'kingdom',
    kingdomId: 'principality-of-stone',
    stats: { attack: 2, defense: 1 },
    keywords: ['piercing', 'magic', 'legendary'],
    description: 'A legendary sword that reveals the truth to those who wield it.',
    rarity: 'legendary',
    cost: 100,
  },
  'stone-helm': {
    id: 'stone-helm',
    name: 'Stone Helm',
    type: 'kingdom',
    kingdomId: 'principality-of-stone',
    stats: { defense: 3, armor: 2 },
    keywords: ['protective', 'heavy'],
    description: 'A sturdy helm crafted from the finest stone.',
    rarity: 'rare',
    cost: 75,
  },
  'ratwolf-claw': {
    id: 'ratwolf-claw',
    name: 'Ratwolf Claw',
    type: 'monster',
    kingdomId: 'principality-of-stone',
    monsterId: 'ratwolves',
    stats: { attack: 1, evasion: 2 },
    keywords: ['sharp', 'agile'],
    description: 'A claw taken from a defeated ratwolf.',
    rarity: 'uncommon',
    cost: 25,
  },
  'wandering-blade': {
    id: 'wandering-blade',
    name: 'Wandering Blade',
    type: 'wandering',
    stats: { attack: 3, range: 2 },
    keywords: ['versatile', 'wandering'],
    description: 'A blade that has traveled far and wide.',
    rarity: 'rare',
    cost: 80,
  },
  'healing-potion': {
    id: 'healing-potion',
    name: 'Healing Potion',
    type: 'consumable',
    stats: {},
    keywords: ['healing', 'potion'],
    description: 'Restores health when consumed.',
    rarity: 'common',
    cost: 10,
    consumable: true,
    stackable: true,
    maxStack: 10,
  },
  'magic-scroll': {
    id: 'magic-scroll',
    name: 'Magic Scroll',
    type: 'consumable',
    stats: {},
    keywords: ['magic', 'scroll'],
    description: 'A scroll containing powerful magic.',
    rarity: 'uncommon',
    cost: 30,
    consumable: true,
    stackable: true,
    maxStack: 5,
  },
  'sharpening-stone': {
    id: 'sharpening-stone',
    name: 'Sharpening Stone',
    type: 'upgrade',
    upgradeType: 'weapon',
    stats: { attack: 1 },
    keywords: ['sharpening', 'weapon'],
    description: 'A stone that can be used to sharpen weapons, increasing their attack power.',
    rarity: 'common',
    cost: 15,
  },
  'reinforced-plating': {
    id: 'reinforced-plating',
    name: 'Reinforced Plating',
    type: 'upgrade',
    upgradeType: 'armor',
    stats: { defense: 2 },
    keywords: ['reinforcement', 'armor'],
    description: 'Additional plating that can be attached to armor for extra protection.',
    rarity: 'uncommon',
    cost: 25,
  },
  'merchant-sword': {
    id: 'merchant-sword',
    name: 'Merchant Sword',
    type: 'merchant',
    side: 'normal',
    stats: { attack: 3 },
    keywords: ['merchant', 'sword'],
    description: 'A fine sword from a merchant. Can be reforged for enhanced properties.',
    rarity: 'rare',
    cost: 50,
  },
  'merchant-sword-reforged': {
    id: 'merchant-sword-reforged',
    name: 'Merchant Sword (Reforged)',
    type: 'merchant',
    side: 'reforged',
    isReforged: true,
    stats: { attack: 4, defense: 1 },
    keywords: ['merchant', 'sword', 'reforged'],
    description: 'A reforged merchant sword with enhanced combat capabilities.',
    rarity: 'rare',
    cost: 75,
  },
};

const initialState: GearState = {
  allGear: sampleGear,
  gearByKingdom: {
    'principality-of-stone': ['sword-of-truth', 'stone-helm', 'ratwolf-claw'],
  },
  gearByType: {
    kingdom: ['sword-of-truth', 'stone-helm'],
    monster: ['ratwolf-claw'],
    wandering: ['wandering-blade'],
    consumable: ['healing-potion', 'magic-scroll'],
    upgrade: ['sharpening-stone', 'reinforced-plating'],
    merchant: ['merchant-sword', 'merchant-sword-reforged'],
  },
  wanderingGear: ['wandering-blade'],
  consumableGear: ['healing-potion', 'magic-scroll'],
  userGear: {},
  equippedGear: {},
};

export const useGear = create<GearStore>((set, get) => ({
  ...initialState,

  addGear: (gear: Gear) => {
    set(state => {
      const newState = { ...state };

      // Add to allGear
      newState.allGear[gear.id] = gear;

      // Add to gearByType
      newState.gearByType[gear.type] = [...newState.gearByType[gear.type], gear.id];

      // Add to kingdom-specific collections
      if (gear.kingdomId) {
        if (!newState.gearByKingdom[gear.kingdomId]) {
          newState.gearByKingdom[gear.kingdomId] = [];
        }
        newState.gearByKingdom[gear.kingdomId].push(gear.id);
      }

      // Add to global gear collections
      if (gear.type === 'wandering') {
        newState.wanderingGear.push(gear.id);
      } else if (gear.type === 'consumable') {
        newState.consumableGear.push(gear.id);
      }

      return newState;
    });
  },

  removeGear: (gearId: string) => {
    set(state => {
      const gear = state.allGear[gearId];
      if (!gear) return state;

      const newState = { ...state };

      // Remove from allGear
      delete newState.allGear[gearId];

      // Remove from gearByType
      newState.gearByType[gear.type] = newState.gearByType[gear.type].filter(id => id !== gearId);

      // Remove from kingdom-specific collections
      if (gear.kingdomId) {
        newState.gearByKingdom[gear.kingdomId] =
          newState.gearByKingdom[gear.kingdomId]?.filter(id => id !== gearId) || [];
      }

      // Remove from global gear collections
      if (gear.type === 'wandering') {
        newState.wanderingGear = newState.wanderingGear.filter(id => id !== gearId);
      } else if (gear.type === 'consumable') {
        newState.consumableGear = newState.consumableGear.filter(id => id !== gearId);
      }

      return newState;
    });
  },

  updateGear: (gearId: string, updates: Partial<Gear>) => {
    set(state => {
      const gear = state.allGear[gearId];
      if (!gear) return state;

      const newState = { ...state };
      newState.allGear[gearId] = { ...gear, ...updates };

      return newState;
    });
  },

  resetGear: () => {
    set(initialState);
  },

  getGearByKingdom: (kingdomId: string) => {
    const state = get();
    const gearIds = state.gearByKingdom[kingdomId] || [];
    return gearIds.map(id => state.allGear[id]).filter(Boolean);
  },

  getGearByType: (type: GearType) => {
    const state = get();
    const gearIds = state.gearByType[type] || [];
    return gearIds.map(id => state.allGear[id]).filter(Boolean);
  },

  getGlobalGear: () => {
    const state = get();
    const globalGearIds = [...state.wanderingGear, ...state.consumableGear];
    return globalGearIds.map(id => state.allGear[id]).filter(Boolean);
  },

  addUserGear: (gearId: string, quantity: number) => {
    set(state => {
      const newState = { ...state };
      const currentQuantity = newState.userGear[gearId] || 0;
      newState.userGear[gearId] = currentQuantity + quantity;
      return newState;
    });
  },

  removeUserGear: (gearId: string, quantity: number) => {
    set(state => {
      const newState = { ...state };
      const currentQuantity = newState.userGear[gearId] || 0;
      const newQuantity = Math.max(0, currentQuantity - quantity);

      if (newQuantity === 0) {
        delete newState.userGear[gearId];
      } else {
        newState.userGear[gearId] = newQuantity;
      }

      return newState;
    });
  },

  equipGear: (knightId: string, gearId: string) => {
    set(state => {
      const newState = { ...state };

      if (!newState.equippedGear[knightId]) {
        newState.equippedGear[knightId] = [];
      }

      // Don't duplicate if already equipped
      if (!newState.equippedGear[knightId].includes(gearId)) {
        newState.equippedGear[knightId].push(gearId);
      }

      return newState;
    });
  },

  unequipGear: (knightId: string, gearId: string) => {
    set(state => {
      const newState = { ...state };

      if (newState.equippedGear[knightId]) {
        newState.equippedGear[knightId] = newState.equippedGear[knightId].filter(
          id => id !== gearId
        );
      }

      return newState;
    });
  },

  getEquippedGear: (knightId: string) => {
    const state = get();
    return state.equippedGear[knightId] || [];
  },

  setGearImage: (gearId: string, imageUrl: string) => {
    set(state => {
      const gear = state.allGear[gearId];
      if (!gear) return state;

      const newState = { ...state };
      newState.allGear[gearId] = { ...gear, imageUrl };
      return newState;
    });
  },

  removeGearImage: (gearId: string) => {
    set(state => {
      const gear = state.allGear[gearId];
      if (!gear) return state;

      const newState = { ...state };
      const { imageUrl, ...gearWithoutImage } = gear;
      newState.allGear[gearId] = gearWithoutImage;
      return newState;
    });
  },
}));
