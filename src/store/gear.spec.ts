import type { Gear } from '@/models/gear';
import { beforeEach, describe, expect, it } from 'vitest';
import { useGear } from './gear';

const mockGear: Gear[] = [
  {
    id: 'sword-123',
    name: 'Sword of Truth',
    type: 'kingdom',
    kingdomId: 'principality-of-stone',
    stats: { attack: 2 },
    keywords: ['piercing'],
    description: 'A legendary sword',
    rarity: 'rare',
  },
  {
    id: 'helmet-456',
    name: 'Iron Helmet',
    type: 'monster',
    kingdomId: 'principality-of-stone',
    monsterId: 'ratwolves',
    stats: { defense: 1 },
    keywords: ['armor'],
    description: 'A sturdy helmet',
    rarity: 'common',
  },
  {
    id: 'staff-789',
    name: 'Wandering Staff',
    type: 'wandering',
    stats: { attack: 1 },
    keywords: ['magic'],
    description: 'A magical staff',
    rarity: 'uncommon',
  },
  {
    id: 'potion-012',
    name: 'Healing Potion',
    type: 'consumable',
    stats: {},
    keywords: ['healing'],
    description: 'Restores health',
    rarity: 'common',
    consumable: true,
    stackable: true,
    maxStack: 10,
  },
];

describe('Gear Store', () => {
  beforeEach(() => {
    // Reset the entire store state
    useGear.setState({
      allGear: {},
      gearByKingdom: {},
      gearByType: {
        kingdom: [],
        monster: [],
        wandering: [],
        consumable: [],
        upgrade: [],
        merchant: [],
      },
      wanderingGear: [],
      consumableGear: [],
      userGear: {},
      equippedGear: {},
    });
  });

  describe('Initial State', () => {
    it('should have empty initial state', () => {
      const state = useGear.getState();

      expect(state.allGear).toEqual({});
      expect(state.gearByKingdom).toEqual({});
      expect(state.gearByType).toEqual({
        kingdom: [],
        monster: [],
        wandering: [],
        consumable: [],
        upgrade: [],
        merchant: [],
      });
      expect(state.wanderingGear).toEqual([]);
      expect(state.consumableGear).toEqual([]);
      expect(state.userGear).toEqual({});
      expect(state.equippedGear).toEqual({});
    });
  });

  describe('addGear', () => {
    it('should add gear to the store', () => {
      useGear.getState().addGear(mockGear[0]);
      const state = useGear.getState();

      expect(state.allGear['sword-123']).toEqual(mockGear[0]);
      expect(state.gearByType.kingdom).toContain('sword-123');
      expect(state.gearByKingdom['principality-of-stone']).toContain('sword-123');
    });

    it('should add multiple gear items', () => {
      useGear.getState().addGear(mockGear[0]);
      useGear.getState().addGear(mockGear[1]);
      const state = useGear.getState();

      expect(Object.keys(state.allGear)).toHaveLength(2);
      expect(state.gearByType.kingdom).toContain('sword-123');
      expect(state.gearByType.monster).toContain('helmet-456');
    });

    it('should categorize gear by type correctly', () => {
      mockGear.forEach(gear => useGear.getState().addGear(gear));
      const state = useGear.getState();

      expect(state.gearByType.kingdom).toContain('sword-123');
      expect(state.gearByType.monster).toContain('helmet-456');
      expect(state.gearByType.wandering).toContain('staff-789');
      expect(state.gearByType.consumable).toContain('potion-012');
    });

    it('should categorize global gear correctly', () => {
      mockGear.forEach(gear => useGear.getState().addGear(gear));
      const state = useGear.getState();

      expect(state.wanderingGear).toContain('staff-789');
      expect(state.consumableGear).toContain('potion-012');
    });

    it('should categorize kingdom gear correctly', () => {
      mockGear.forEach(gear => useGear.getState().addGear(gear));
      const state = useGear.getState();

      expect(state.gearByKingdom['principality-of-stone']).toContain('sword-123');
      expect(state.gearByKingdom['principality-of-stone']).toContain('helmet-456');
    });
  });

  describe('removeGear', () => {
    it('should remove gear from the store', () => {
      useGear.getState().addGear(mockGear[0]);
      useGear.getState().removeGear('sword-123');
      const state = useGear.getState();

      expect(state.allGear['sword-123']).toBeUndefined();
      expect(state.gearByType.kingdom).not.toContain('sword-123');
      expect(state.gearByKingdom['principality-of-stone']).not.toContain('sword-123');
    });

    it('should handle removing non-existent gear', () => {
      useGear.getState().removeGear('non-existent');
      const state = useGear.getState();

      expect(Object.keys(state.allGear)).toHaveLength(0);
    });
  });

  describe('updateGear', () => {
    it('should update existing gear', () => {
      useGear.getState().addGear(mockGear[0]);
      useGear.getState().updateGear('sword-123', { name: 'Updated Sword' });
      const state = useGear.getState();

      expect(state.allGear['sword-123'].name).toBe('Updated Sword');
      expect(state.allGear['sword-123'].type).toBe('kingdom'); // Other properties unchanged
    });

    it('should handle updating non-existent gear', () => {
      useGear.getState().updateGear('non-existent', { name: 'New Name' });
      const state = useGear.getState();

      expect(state.allGear['non-existent']).toBeUndefined();
    });
  });

  describe('getGearByKingdom', () => {
    it('should return gear for specific kingdom', () => {
      mockGear.forEach(gear => useGear.getState().addGear(gear));
      const state = useGear.getState();

      const kingdomGear = state.getGearByKingdom('principality-of-stone');
      expect(kingdomGear).toHaveLength(2);
      expect(kingdomGear.map((g: Gear) => g.id)).toContain('sword-123');
      expect(kingdomGear.map((g: Gear) => g.id)).toContain('helmet-456');
    });

    it('should return empty array for non-existent kingdom', () => {
      const state = useGear.getState();

      const kingdomGear = state.getGearByKingdom('non-existent');
      expect(kingdomGear).toEqual([]);
    });
  });

  describe('getGearByType', () => {
    it('should return gear for specific type', () => {
      mockGear.forEach(gear => useGear.getState().addGear(gear));
      const state = useGear.getState();

      const kingdomGear = state.getGearByType('kingdom');
      expect(kingdomGear).toHaveLength(1);
      expect(kingdomGear[0].id).toBe('sword-123');

      const monsterGear = state.getGearByType('monster');
      expect(monsterGear).toHaveLength(1);
      expect(monsterGear[0].id).toBe('helmet-456');
    });

    it('should return empty array for type with no gear', () => {
      const state = useGear.getState();

      const gear = state.getGearByType('kingdom');
      expect(gear).toEqual([]);
    });
  });

  describe('getGlobalGear', () => {
    it('should return all global gear (wandering + consumable)', () => {
      mockGear.forEach(gear => useGear.getState().addGear(gear));
      const state = useGear.getState();

      const globalGear = state.getGlobalGear();
      expect(globalGear).toHaveLength(2);
      expect(globalGear.map((g: Gear) => g.id)).toContain('staff-789');
      expect(globalGear.map((g: Gear) => g.id)).toContain('potion-012');
    });
  });

  describe('User Gear Management', () => {
    it('should add gear to user inventory', () => {
      useGear.getState().addUserGear('sword-123', 1);
      const state = useGear.getState();

      expect(state.userGear['sword-123']).toBe(1);
    });

    it('should increment quantity for existing gear', () => {
      useGear.getState().addUserGear('sword-123', 1);
      useGear.getState().addUserGear('sword-123', 2);
      const state = useGear.getState();

      expect(state.userGear['sword-123']).toBe(3);
    });

    it('should remove gear from user inventory', () => {
      useGear.getState().addUserGear('sword-123', 3);
      useGear.getState().removeUserGear('sword-123', 1);
      const state = useGear.getState();

      expect(state.userGear['sword-123']).toBe(2);
    });

    it('should remove gear completely when quantity reaches zero', () => {
      useGear.getState().addUserGear('sword-123', 1);
      useGear.getState().removeUserGear('sword-123', 1);
      const state = useGear.getState();

      expect(state.userGear['sword-123']).toBeUndefined();
    });
  });

  describe('Equipped Gear Management', () => {
    it('should equip gear to knight', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      const state = useGear.getState();

      expect(state.equippedGear['knight-123']).toContain('sword-123');
    });

    it('should not duplicate equipped gear', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      useGear.getState().equipGear('knight-123', 'sword-123');
      const state = useGear.getState();

      expect(state.equippedGear['knight-123']).toEqual(['sword-123']);
    });

    it('should unequip gear from knight', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      useGear.getState().equipGear('knight-123', 'helmet-456');
      useGear.getState().unequipGear('knight-123', 'sword-123');
      const state = useGear.getState();

      expect(state.equippedGear['knight-123']).toEqual(['helmet-456']);
    });

    it('should get equipped gear for knight', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      useGear.getState().equipGear('knight-123', 'helmet-456');
      const state = useGear.getState();

      const equippedGear = state.getEquippedGear('knight-123');
      expect(equippedGear).toHaveLength(2);
      expect(equippedGear).toContain('sword-123');
      expect(equippedGear).toContain('helmet-456');
    });
  });

  describe('Image Management', () => {
    beforeEach(() => {
      useGear.getState().resetGear();
      mockGear.forEach(gear => useGear.getState().addGear(gear));
    });

    it('should set gear image', () => {
      const imageUrl = 'file://test-image.jpg';
      useGear.getState().setGearImage('sword-123', imageUrl);
      const state = useGear.getState();

      expect(state.allGear['sword-123'].imageUrl).toBe(imageUrl);
    });

    it('should remove gear image', () => {
      const imageUrl = 'file://test-image.jpg';
      useGear.getState().setGearImage('sword-123', imageUrl);
      useGear.getState().removeGearImage('sword-123');
      const state = useGear.getState();

      expect(state.allGear['sword-123'].imageUrl).toBeUndefined();
    });

    it('should not affect other gear when setting image', () => {
      const imageUrl = 'file://test-image.jpg';
      useGear.getState().setGearImage('sword-123', imageUrl);
      const state = useGear.getState();

      expect(state.allGear['helmet-456'].imageUrl).toBeUndefined();
    });

    it('should handle setting image for non-existent gear gracefully', () => {
      const imageUrl = 'file://test-image.jpg';
      useGear.getState().setGearImage('non-existent', imageUrl);
      const state = useGear.getState();

      expect(state.allGear['non-existent']).toBeUndefined();
    });

    it('should handle removing image for non-existent gear gracefully', () => {
      useGear.getState().removeGearImage('non-existent');
      const state = useGear.getState();

      expect(state.allGear['non-existent']).toBeUndefined();
    });
  });
});
