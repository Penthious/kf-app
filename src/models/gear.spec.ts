import { describe, expect, it } from 'vitest';
import type { Gear, GearStats, GearType } from './gear';

describe('Gear Models', () => {
  describe('GearType', () => {
    it('should have correct gear types', () => {
      const validTypes: GearType[] = [
        'kingdom',
        'monster',
        'wandering',
        'consumable',
        'upgrade',
        'merchant',
      ];

      expect(validTypes).toContain('kingdom');
      expect(validTypes).toContain('monster');
      expect(validTypes).toContain('wandering');
      expect(validTypes).toContain('consumable');
      expect(validTypes).toContain('upgrade');
      expect(validTypes).toContain('merchant');
    });
  });

  describe('GearStats', () => {
    it('should allow all stat properties', () => {
      const stats: GearStats = {
        attack: 2,
        defense: 1,
        evasion: 1,
        armor: 3,
        range: 2,
      };

      expect(stats.attack).toBe(2);
      expect(stats.defense).toBe(1);
      expect(stats.evasion).toBe(1);
      expect(stats.armor).toBe(3);
      expect(stats.range).toBe(2);
    });

    it('should allow partial stats', () => {
      const partialStats: GearStats = {
        attack: 1,
      };

      expect(partialStats.attack).toBe(1);
      expect(partialStats.defense).toBeUndefined();
    });

    it('should allow zero values', () => {
      const zeroStats: GearStats = {
        attack: 0,
        defense: 0,
        evasion: 0,
        armor: 0,
        range: 0,
      };

      expect(zeroStats.attack).toBe(0);
      expect(zeroStats.defense).toBe(0);
    });
  });

  describe('Gear', () => {
    it('should have required properties', () => {
      const gear: Gear = {
        id: 'test-gear-123',
        name: 'Test Sword',
        type: 'kingdom',
        stats: { attack: 2 },
        keywords: ['piercing'],
        description: 'A test sword',
        rarity: 'common',
        quantity: 2,
      };

      expect(gear.id).toBe('test-gear-123');
      expect(gear.name).toBe('Test Sword');
      expect(gear.type).toBe('kingdom');
      expect(gear.stats.attack).toBe(2);
      expect(gear.keywords).toEqual(['piercing']);
      expect(gear.description).toBe('A test sword');
      expect(gear.rarity).toBe('common');
    });

    it('should allow optional properties', () => {
      const gear: Gear = {
        id: 'test-gear-456',
        name: 'Test Helmet',
        type: 'monster',
        kingdomId: 'principality-of-stone',
        monsterId: 'ratwolves',
        stats: { defense: 1 },
        keywords: ['armor'],
        description: 'A test helmet',
        rarity: 'uncommon',
        imageUrl: 'https://example.com/helmet.jpg',
        cost: 100,
        consumable: false,
        stackable: true,
        maxStack: 5,
        quantity: 2,
      };

      expect(gear.kingdomId).toBe('principality-of-stone');
      expect(gear.monsterId).toBe('ratwolves');
      expect(gear.imageUrl).toBe('https://example.com/helmet.jpg');
      expect(gear.cost).toBe(100);
      expect(gear.consumable).toBe(false);
      expect(gear.stackable).toBe(true);
      expect(gear.maxStack).toBe(5);
    });

    it('should allow kingdom gear without monsterId', () => {
      const kingdomGear: Gear = {
        id: 'kingdom-gear-123',
        name: 'Kingdom Sword',
        type: 'kingdom',
        kingdomId: 'principality-of-stone',
        stats: { attack: 3 },
        keywords: ['kingdom'],
        description: 'A kingdom sword',
        rarity: 'rare',
        quantity: 2,
      };

      expect(kingdomGear.kingdomId).toBe('principality-of-stone');
      expect(kingdomGear.monsterId).toBeUndefined();
    });

    it('should allow monster gear with both kingdomId and monsterId', () => {
      const monsterGear: Gear = {
        id: 'monster-gear-123',
        name: 'Monster Claw',
        type: 'monster',
        kingdomId: 'principality-of-stone',
        monsterId: 'ratwolves',
        stats: { attack: 1 },
        keywords: ['monster'],
        description: 'A monster claw',
        rarity: 'common',
        quantity: 2,
      };

      expect(monsterGear.kingdomId).toBe('principality-of-stone');
      expect(monsterGear.monsterId).toBe('ratwolves');
    });

    it('should allow global gear without kingdomId or monsterId', () => {
      const wanderingGear: Gear = {
        id: 'wandering-gear-123',
        name: 'Wandering Staff',
        type: 'wandering',
        stats: { attack: 2 },
        keywords: ['wandering'],
        description: 'A wandering staff',
        rarity: 'uncommon',
        quantity: 2,
      };

      const consumableGear: Gear = {
        id: 'consumable-gear-123',
        name: 'Healing Potion',
        type: 'consumable',
        stats: {},
        keywords: ['healing'],
        description: 'A healing potion',
        rarity: 'common',
        consumable: true,
        stackable: true,
        maxStack: 10,
        quantity: 2,
      };

      expect(wanderingGear.kingdomId).toBeUndefined();
      expect(wanderingGear.monsterId).toBeUndefined();
      expect(consumableGear.kingdomId).toBeUndefined();
      expect(consumableGear.monsterId).toBeUndefined();
    });

    it('should allow upgrade gear with upgradeType', () => {
      const weaponUpgrade: Gear = {
        id: 'weapon-upgrade-123',
        name: 'Sharpening Stone',
        type: 'upgrade',
        upgradeType: 'weapon',
        stats: { attack: 1 },
        keywords: ['sharpening'],
        description: 'A weapon upgrade',
        rarity: 'common',
        quantity: 2,
      };

      const armorUpgrade: Gear = {
        id: 'armor-upgrade-123',
        name: 'Reinforced Plating',
        type: 'upgrade',
        upgradeType: 'armor',
        stats: { defense: 2 },
        keywords: ['reinforcement'],
        description: 'An armor upgrade',
        rarity: 'uncommon',
        quantity: 2,
      };

      expect(weaponUpgrade.upgradeType).toBe('weapon');
      expect(armorUpgrade.upgradeType).toBe('armor');
    });

    it('should allow merchant gear with side and reforged properties', () => {
      const normalMerchant: Gear = {
        id: 'merchant-normal-123',
        name: 'Merchant Sword',
        type: 'merchant',
        side: 'normal',
        stats: { attack: 3 },
        keywords: ['merchant'],
        description: 'A normal merchant sword',
        rarity: 'rare',
        quantity: 2,
      };

      const reforgedMerchant: Gear = {
        id: 'merchant-reforged-123',
        name: 'Merchant Sword (Reforged)',
        type: 'merchant',
        side: 'reforged',
        isReforged: true,
        stats: { attack: 4, defense: 1 },
        keywords: ['merchant', 'reforged'],
        description: 'A reforged merchant sword',
        rarity: 'rare',
        quantity: 2,
      };

      expect(normalMerchant.side).toBe('normal');
      expect(normalMerchant.isReforged).toBeUndefined();
      expect(reforgedMerchant.side).toBe('reforged');
      expect(reforgedMerchant.isReforged).toBe(true);
    });

    it('should validate rarity values', () => {
      const validRarities = ['common', 'uncommon', 'rare', 'legendary'] as const;

      validRarities.forEach(rarity => {
        const gear: Gear = {
          id: `gear-${rarity}`,
          name: `${rarity} gear`,
          type: 'kingdom',
          stats: {},
          keywords: [],
          description: 'Test gear',
          rarity,
          quantity: 2,
        };

        expect(gear.rarity).toBe(rarity);
      });
    });
  });
});
