import type { Gear, GearType } from '@/models/gear';
import { ImageHandler } from '@/utils/image-handler';
import { create } from 'zustand';

export type GearState = {
  allGear: Record<string, Gear>;
  gearByKingdom: Record<string, string[]>; // kingdomId -> gearIds (kingdom + monster)
  gearByType: Record<GearType, string[]>; // type -> gearIds
  wanderingGear: string[]; // wandering gear IDs only
  consumableGear: string[]; // consumable gear IDs only
  userGear: Record<string, number>; // gearId -> quantity
  equippedGear: Record<string, string[]>; // knightId -> gearInstanceIds
  // Campaign-specific gear management
  campaignUnlockedGear: Record<string, string[]>; // campaignId -> unlocked gearIds
  gearOwnership: Record<string, string | null>; // gearId -> knightId (null if unequipped)
  gearInstances: Record<string, string[]>; // gearTypeId -> array of instance IDs
  gearInstanceData: Record<string, Gear>; // gearInstanceId -> gear instance data
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

  // Campaign gear management
  unlockGearForCampaign: (campaignId: string, gearId: string) => void;
  isGearUnlockedForCampaign: (campaignId: string, gearId: string) => boolean;
  getUnlockedGearForCampaign: (campaignId: string) => string[];

  // Shared gear management
  getGearOwner: (gearId: string) => string | null;
  transferGear: (gearId: string, fromKnightId: string, toKnightId: string) => void;
  isGearEquippedByKnight: (gearId: string, knightId: string) => boolean;
  getAvailableGearForKnight: (campaignId: string, knightId: string) => string[];

  // Image management
  setGearImage: (gearId: string, imageUrl: string) => void;
  removeGearImage: (gearId: string) => void;
  addGearImageFromCamera: (gearId: string) => Promise<void>;
  addGearImageFromGallery: (gearId: string) => Promise<void>;
  shareGearImage: (gearId: string) => Promise<void>;

  // Upgrade management
  attachUpgrade: (upgradeId: string, targetGearId: string) => void;
  detachUpgrade: (upgradeId: string) => void;
  getAttachedUpgrade: (gearId: string) => string | null;
  getUpgradeTargets: (upgradeId: string) => string[];

  // Merchant gear reforging
  reforgeMerchantGear: (gearId: string) => void;
  isReforged: (gearId: string) => boolean;

  // Quantity management
  setGearQuantity: (gearId: string, quantity: number) => void;
  getGearQuantity: (gearId: string) => number;
  getAvailableQuantity: (gearId: string) => number;
  getEquippedQuantity: (gearId: string) => number;
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
    quantity: 2,
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
    quantity: 2,
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
    quantity: 2,
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
    quantity: 2,
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
    quantity: 2,
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
    quantity: 2,
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
    quantity: 2,
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
    quantity: 2,
  },
  'merchant-sword': {
    id: 'merchant-sword',
    name: 'Merchant Sword',
    type: 'merchant',
    side: 'normal',
    stats: { attack: 3 },
    reforgedStats: { attack: 4, defense: 1 },
    keywords: ['merchant', 'sword'],
    description: 'A fine sword from a merchant. Can be reforged for enhanced properties.',
    rarity: 'rare',
    cost: 50,
    quantity: 2,
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
    quantity: 2,
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
  campaignUnlockedGear: {},
  gearOwnership: {},
  gearInstances: {},
  gearInstanceData: {},
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
    set({
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
      campaignUnlockedGear: {},
      gearOwnership: {},
      gearInstances: {},
      gearInstanceData: {},
    });
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
      const gear = state.allGear[gearId];
      if (!gear) return state;

      // Don't allow equipping upgrades
      if (gear.type === 'upgrade') return state;

      const newState = { ...state };

      if (!newState.equippedGear[knightId]) {
        newState.equippedGear[knightId] = [];
      }

      // Check if there's available quantity
      const availableQuantity = state.getAvailableQuantity(gearId);
      if (availableQuantity <= 0) return state;

      // Create a unique instance ID for this gear
      const instanceId = `${gearId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create a copy of the gear for this instance
      const gearInstance: Gear = {
        ...gear,
        id: instanceId,
        upgrades: [], // Start with no upgrades
      };

      // Store the gear instance
      newState.gearInstanceData[instanceId] = gearInstance;

      // Add to gear instances tracking
      if (!newState.gearInstances[gearId]) {
        newState.gearInstances[gearId] = [];
      }
      newState.gearInstances[gearId].push(instanceId);

      // Add the instance to the knight's equipped gear
      newState.equippedGear[knightId].push(instanceId);

      return newState;
    });
  },

  unequipGear: (knightId: string, gearInstanceId: string) => {
    set(state => {
      const newState = { ...state };

      if (newState.equippedGear[knightId]) {
        newState.equippedGear[knightId] = newState.equippedGear[knightId].filter(
          id => id !== gearInstanceId
        );
      }

      // Remove the gear instance data
      delete newState.gearInstanceData[gearInstanceId];

      // Remove from gear instances tracking
      Object.keys(newState.gearInstances).forEach(gearTypeId => {
        newState.gearInstances[gearTypeId] = newState.gearInstances[gearTypeId].filter(
          id => id !== gearInstanceId
        );
      });

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

  addGearImageFromCamera: async (gearId: string) => {
    try {
      const imageResult = await ImageHandler.takePhoto();
      if (imageResult) {
        const fileName = `gear_${gearId}_${Date.now()}.jpg`;
        const savedUri = await ImageHandler.saveImageToDocuments(imageResult.uri, fileName);
        set(state => {
          const gear = state.allGear[gearId];
          if (!gear) return state;

          const newState = { ...state };
          newState.allGear[gearId] = { ...gear, imageUrl: savedUri };
          return newState;
        });
      }
    } catch (error) {
      console.error('Error taking photo for gear:', error);
    }
  },

  addGearImageFromGallery: async (gearId: string) => {
    try {
      const imageResult = await ImageHandler.pickFromGallery();
      if (imageResult) {
        const fileName = `gear_${gearId}_${Date.now()}.jpg`;
        const savedUri = await ImageHandler.saveImageToDocuments(imageResult.uri, fileName);
        set(state => {
          const gear = state.allGear[gearId];
          if (!gear) return state;

          const newState = { ...state };
          newState.allGear[gearId] = { ...gear, imageUrl: savedUri };
          return newState;
        });
      }
    } catch (error) {
      console.error('Error picking image for gear:', error);
    }
  },

  shareGearImage: async (gearId: string) => {
    try {
      const state = get();
      const gear = state.allGear[gearId];
      if (!gear || !gear.imageUrl) {
        console.log('No image to share for gear:', gearId);
        return;
      }

      await ImageHandler.shareImage(gear.imageUrl, gear.name);
    } catch (error) {
      console.error('Error sharing gear image:', error);
    }
  },

  // Campaign gear management
  unlockGearForCampaign: (campaignId: string, gearId: string) => {
    set(state => {
      const newState = { ...state };
      const currentUnlocked = newState.campaignUnlockedGear[campaignId] || [];
      if (currentUnlocked.includes(gearId)) return state;

      newState.campaignUnlockedGear[campaignId] = [...currentUnlocked, gearId];
      return newState;
    });
  },

  isGearUnlockedForCampaign: (campaignId: string, gearId: string) => {
    const state = get();
    return (state.campaignUnlockedGear[campaignId] || []).includes(gearId);
  },

  getUnlockedGearForCampaign: (campaignId: string) => {
    const state = get();
    return state.campaignUnlockedGear[campaignId] || [];
  },

  // Shared gear management
  getGearOwner: (gearId: string) => {
    const state = get();
    // Find which knight has this gear instance equipped
    for (const [knightId, gearInstances] of Object.entries(state.equippedGear)) {
      if (gearInstances.includes(gearId)) {
        return knightId;
      }
    }
    return null;
  },

  transferGear: (gearInstanceId: string, fromKnightId: string, toKnightId: string) => {
    set(state => {
      const newState = { ...state };

      // Remove from current owner
      if (newState.equippedGear[fromKnightId]) {
        newState.equippedGear[fromKnightId] = newState.equippedGear[fromKnightId].filter(
          id => id !== gearInstanceId
        );
      }

      // Add to new owner
      if (!newState.equippedGear[toKnightId]) {
        newState.equippedGear[toKnightId] = [];
      }
      newState.equippedGear[toKnightId].push(gearInstanceId);

      return newState;
    });
  },

  isGearEquippedByKnight: (gearId: string, knightId: string) => {
    const state = get();
    return state.gearOwnership[gearId] === knightId;
  },

  getAvailableGearForKnight: (campaignId: string, knightId: string) => {
    const state = get();
    const unlockedGear = state.campaignUnlockedGear[campaignId] || [];

    return unlockedGear.filter(gearId => {
      const gear = state.allGear[gearId];
      if (!gear) return false;

      // Exclude upgrades from available gear pool
      if (gear.type === 'upgrade') return false;

      const availableQuantity = state.getAvailableQuantity(gearId);

      // Available if there's available quantity
      return availableQuantity > 0;
    });
  },

  // Upgrade management
  attachUpgrade: (upgradeId: string, targetGearInstanceId: string) => {
    set(state => {
      const upgrade = state.allGear[upgradeId];
      const targetGearInstance = state.gearInstanceData[targetGearInstanceId];

      if (!upgrade || !targetGearInstance || upgrade.type !== 'upgrade') {
        return state;
      }

      // Check if upgrade type matches target gear type
      if (
        upgrade.upgradeType === 'weapon' &&
        targetGearInstance.type !== 'kingdom' &&
        targetGearInstance.type !== 'monster' &&
        targetGearInstance.type !== 'wandering'
      ) {
        return state;
      }
      if (
        upgrade.upgradeType === 'armor' &&
        targetGearInstance.type !== 'kingdom' &&
        targetGearInstance.type !== 'monster'
      ) {
        return state;
      }

      // Check if there are any available upgrades of this type
      const availableQuantity = state.getAvailableQuantity(upgradeId);
      if (availableQuantity <= 0) {
        return state;
      }

      // Create a unique upgrade instance
      const upgradeInstanceId = `${upgradeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const upgradeInstance: Gear = {
        ...upgrade,
        id: upgradeInstanceId,
        attachedToGearId: targetGearInstanceId,
      };

      const newState = { ...state };

      // Add the upgrade instance to gearInstanceData
      newState.gearInstanceData[upgradeInstanceId] = upgradeInstance;

      // Add the upgrade instance to gearInstances
      if (!newState.gearInstances[upgradeId]) {
        newState.gearInstances[upgradeId] = [];
      }
      newState.gearInstances[upgradeId].push(upgradeInstanceId);

      // Add the upgrade instance ID to the target gear instance
      newState.gearInstanceData[targetGearInstanceId] = {
        ...targetGearInstance,
        upgrades: [...(targetGearInstance.upgrades || []), upgradeInstanceId],
      };

      return newState;
    });
  },

  detachUpgrade: (upgradeInstanceId: string) => {
    set(state => {
      const upgradeInstance = state.gearInstanceData[upgradeInstanceId];
      if (!upgradeInstance || !upgradeInstance.attachedToGearId) {
        return state;
      }

      const targetGearInstanceId = upgradeInstance.attachedToGearId;
      const targetGearInstance = state.gearInstanceData[targetGearInstanceId];

      if (!targetGearInstance) {
        return state;
      }

      const newState = { ...state };

      // Remove upgrade instance from target gear instance
      newState.gearInstanceData[targetGearInstanceId] = {
        ...targetGearInstance,
        upgrades: targetGearInstance.upgrades?.filter(id => id !== upgradeInstanceId) || [],
      };

      // Remove the upgrade instance from gearInstanceData
      delete newState.gearInstanceData[upgradeInstanceId];

      // Remove the upgrade instance from gearInstances
      const baseUpgradeId = Object.keys(newState.allGear).find(id =>
        upgradeInstanceId.startsWith(id + '-')
      );
      if (baseUpgradeId && newState.gearInstances[baseUpgradeId]) {
        newState.gearInstances[baseUpgradeId] = newState.gearInstances[baseUpgradeId].filter(
          id => id !== upgradeInstanceId
        );
      }

      return newState;
    });
  },

  getAttachedUpgrade: (gearInstanceId: string) => {
    const state = get();
    const gearInstance = state.gearInstanceData[gearInstanceId];
    if (!gearInstance || !gearInstance.upgrades || gearInstance.upgrades.length === 0) {
      return null;
    }
    // Return the base upgrade ID (remove the instance suffix)
    const upgradeInstanceId = gearInstance.upgrades[0];
    // Find the base upgrade ID by looking for the original upgrade in allGear
    const baseUpgradeId = Object.keys(state.allGear).find(id =>
      upgradeInstanceId.startsWith(id + '-')
    );
    return baseUpgradeId || null;
  },

  getUpgradeTargets: (upgradeId: string) => {
    const state = get();
    const upgrade = state.allGear[upgradeId];
    if (!upgrade || upgrade.type !== 'upgrade') {
      return [];
    }

    return Object.values(state.gearInstanceData)
      .filter(gearInstance => {
        if (upgrade.upgradeType === 'weapon') {
          return (
            gearInstance.type === 'kingdom' ||
            gearInstance.type === 'monster' ||
            gearInstance.type === 'wandering'
          );
        }
        if (upgrade.upgradeType === 'armor') {
          return gearInstance.type === 'kingdom' || gearInstance.type === 'monster';
        }
        return false;
      })
      .map(gearInstance => gearInstance.id);
  },

  // Merchant gear reforging
  reforgeMerchantGear: (gearId: string) => {
    set(state => {
      const gear = state.allGear[gearId];
      if (!gear || gear.type !== 'merchant' || gear.side !== 'normal') {
        return state;
      }

      const newState = { ...state };
      const newGear: Gear = {
        ...gear,
        side: 'reforged' as const,
        isReforged: true,
        stats: { ...gear.stats, ...(gear.reforgedStats || {}) },
        keywords: [...gear.keywords, 'reforged'],
        description: `${gear.description} (Reforged)`,
        rarity: 'legendary', // Reforged gear is legendary
        cost: (gear.cost || 0) * 2, // Reforged gear is more expensive
      };

      newState.allGear[gearId] = newGear;
      return newState;
    });
  },

  isReforged: (gearId: string) => {
    const state = get();
    const gear = state.allGear[gearId];
    return gear?.isReforged || false;
  },

  // Quantity management
  setGearQuantity: (gearId: string, quantity: number) => {
    set(state => {
      const gear = state.allGear[gearId];
      if (!gear) {
        return state;
      }

      const newState = { ...state };
      newState.allGear[gearId] = {
        ...gear,
        quantity: Math.max(0, quantity),
      };

      return newState;
    });
  },

  getGearQuantity: (gearId: string) => {
    const state = get();
    const gear = state.allGear[gearId];
    return gear?.quantity || 0;
  },

  getAvailableQuantity: (gearId: string) => {
    const state = get();
    const gear = state.allGear[gearId];
    if (!gear) return 0;

    const totalQuantity = gear.quantity || 0;

    if (gear.type === 'upgrade') {
      // For upgrades, count how many instances are created
      const attachedQuantity = state.gearInstances[gearId]?.length || 0;
      return Math.max(0, totalQuantity - attachedQuantity);
    } else {
      // For regular gear, count how many instances are equipped
      const equippedQuantity = Object.values(state.equippedGear)
        .flat()
        .filter(instanceId => instanceId.startsWith(gearId + '-')).length;
      return Math.max(0, totalQuantity - equippedQuantity);
    }
  },

  getEquippedQuantity: (gearId: string) => {
    const state = get();
    return Object.values(state.equippedGear)
      .flat()
      .filter(instanceId => instanceId.startsWith(gearId + '-')).length;
  },
}));

// Typed selector helpers to reduce re-renders in components
export const useGearSelector = <T>(selector: (s: GearStore) => T): T => useGear(selector);
// Zustand's hook in our setup doesn't accept an equalityFn param; provide a shallow wrapper
export const useGearShallow = <T>(selector: (s: GearStore) => T): T => useGearSelector(selector);
