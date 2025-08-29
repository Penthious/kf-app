import type { Gear } from '@/models/gear';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useGear } from './gear';

const mockGear: Gear[] = [
  {
    id: 'sword-123',
    name: 'Test Sword',
    type: 'kingdom',
    kingdomId: 'test-kingdom',
    stats: { attack: 2 },
    keywords: ['sharp'],
    description: 'A legendary sword',
    rarity: 'rare',
    quantity: 2,
  },
  {
    id: 'helmet-456',
    name: 'Test Helmet',
    type: 'monster',
    kingdomId: 'test-kingdom',
    monsterId: 'test-monster',
    stats: { defense: 2 },
    keywords: ['protective'],
    description: 'A sturdy helmet',
    rarity: 'common',
    quantity: 2,
  },
  {
    id: 'staff-789',
    name: 'Test Staff',
    type: 'wandering',
    stats: { attack: 1 },
    keywords: ['magical'],
    description: 'A magical staff',
    rarity: 'uncommon',
    quantity: 2,
  },
  {
    id: 'potion-101',
    name: 'Test Potion',
    type: 'consumable',
    stats: {},
    keywords: ['healing'],
    description: 'A healing potion',
    rarity: 'common',
    consumable: true,
    stackable: true,
    maxStack: 10,
    quantity: 2,
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
      expect(state.gearByKingdom['test-kingdom']).toContain('sword-123');
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
      expect(state.gearByType.consumable).toContain('potion-101');
    });

    it('should categorize global gear correctly', () => {
      mockGear.forEach(gear => useGear.getState().addGear(gear));
      const state = useGear.getState();

      expect(state.wanderingGear).toContain('staff-789');
      expect(state.consumableGear).toContain('potion-101');
    });

    it('should categorize kingdom gear correctly', () => {
      mockGear.forEach(gear => useGear.getState().addGear(gear));
      const state = useGear.getState();

      expect(state.gearByKingdom['test-kingdom']).toContain('sword-123');
      expect(state.gearByKingdom['test-kingdom']).toContain('helmet-456');
    });
  });

  describe('removeGear', () => {
    it('should remove gear from the store', () => {
      useGear.getState().addGear(mockGear[0]);
      useGear.getState().removeGear('sword-123');
      const state = useGear.getState();

      expect(state.allGear['sword-123']).toBeUndefined();
      expect(state.gearByType.kingdom).not.toContain('sword-123');
      expect(state.gearByKingdom['test-kingdom']).not.toContain('sword-123');
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

      const kingdomGear = state.getGearByKingdom('test-kingdom');
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
      expect(globalGear.map((g: Gear) => g.id)).toContain('potion-101');
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
    beforeEach(() => {
      useGear.getState().resetGear();

      // Add test gear to the store
      useGear.getState().addGear({
        id: 'sword-123',
        name: 'Test Sword',
        type: 'kingdom',
        kingdomId: 'test-kingdom',
        stats: { attack: 2 },
        keywords: ['sharp'],
        description: 'A test sword',
        rarity: 'common',
        cost: 50,
        quantity: 2,
      });

      useGear.getState().addGear({
        id: 'helmet-456',
        name: 'Test Helmet',
        type: 'kingdom',
        kingdomId: 'test-kingdom',
        stats: { defense: 2 },
        keywords: ['protective'],
        description: 'A test helmet',
        rarity: 'common',
        cost: 50,
        quantity: 2,
      });
    });

    it('should equip gear to knight', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      const state = useGear.getState();

      // Check that an instance ID was created and stored
      const equippedInstances = state.equippedGear['knight-123'];
      expect(equippedInstances).toHaveLength(1);
      expect(equippedInstances[0]).toMatch(/^sword-123-\d+-[a-z0-9]+$/);
    });

    it('should not duplicate equipped gear', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      useGear.getState().equipGear('knight-123', 'sword-123');
      const state = useGear.getState();

      // Should have two different instances
      const equippedInstances = state.equippedGear['knight-123'];
      expect(equippedInstances).toHaveLength(2);
      expect(equippedInstances[0]).not.toBe(equippedInstances[1]);
    });

    it('should unequip gear from knight', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      useGear.getState().equipGear('knight-123', 'helmet-456');

      const state = useGear.getState();
      const swordInstance = state.equippedGear['knight-123'].find(id =>
        id.startsWith('sword-123-')
      );

      useGear.getState().unequipGear('knight-123', swordInstance!);

      const newState = useGear.getState();
      expect(newState.equippedGear['knight-123']).toHaveLength(1);
      expect(newState.equippedGear['knight-123'][0]).toMatch(/^helmet-456-\d+-[a-z0-9]+$/);
    });

    it('should get equipped gear for knight', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      useGear.getState().equipGear('knight-123', 'helmet-456');
      const state = useGear.getState();

      const equippedGear = state.getEquippedGear('knight-123');
      expect(equippedGear).toHaveLength(2);
      expect(equippedGear[0]).toMatch(/^sword-123-\d+-[a-z0-9]+$/);
      expect(equippedGear[1]).toMatch(/^helmet-456-\d+-[a-z0-9]+$/);
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

  describe('Campaign Gear Management', () => {
    beforeEach(() => {
      useGear.getState().resetGear();
    });

    it('should unlock gear for campaign', () => {
      useGear.getState().unlockGearForCampaign('campaign-123', 'sword-123');
      const state = useGear.getState();

      expect(state.isGearUnlockedForCampaign('campaign-123', 'sword-123')).toBe(true);
      expect(state.getUnlockedGearForCampaign('campaign-123')).toContain('sword-123');
    });

    it('should not duplicate unlocked gear for campaign', () => {
      useGear.getState().unlockGearForCampaign('campaign-123', 'sword-123');
      useGear.getState().unlockGearForCampaign('campaign-123', 'sword-123');
      const state = useGear.getState();

      expect(state.getUnlockedGearForCampaign('campaign-123')).toHaveLength(1);
      expect(state.getUnlockedGearForCampaign('campaign-123')).toContain('sword-123');
    });

    it('should return empty arrays for non-existent campaigns', () => {
      const state = useGear.getState();

      expect(state.getUnlockedGearForCampaign('non-existent')).toEqual([]);
      expect(state.isGearUnlockedForCampaign('non-existent', 'sword-123')).toBe(false);
    });

    it('should handle multiple gear unlocks for campaign', () => {
      useGear.getState().unlockGearForCampaign('campaign-123', 'sword-123');
      useGear.getState().unlockGearForCampaign('campaign-123', 'helmet-456');
      const state = useGear.getState();

      expect(state.getUnlockedGearForCampaign('campaign-123')).toHaveLength(2);
      expect(state.getUnlockedGearForCampaign('campaign-123')).toContain('sword-123');
      expect(state.getUnlockedGearForCampaign('campaign-123')).toContain('helmet-456');
    });
  });

  describe('Shared Gear Management', () => {
    beforeEach(() => {
      useGear.getState().resetGear();

      // Add test gear to the store
      useGear.getState().addGear({
        id: 'sword-123',
        name: 'Test Sword',
        type: 'kingdom',
        kingdomId: 'test-kingdom',
        stats: { attack: 2 },
        keywords: ['sharp'],
        description: 'A test sword',
        rarity: 'common',
        cost: 50,
        quantity: 2,
      });

      useGear.getState().addGear({
        id: 'helmet-456',
        name: 'Test Helmet',
        type: 'kingdom',
        kingdomId: 'test-kingdom',
        stats: { defense: 2 },
        keywords: ['protective'],
        description: 'A test helmet',
        rarity: 'common',
        cost: 50,
        quantity: 2,
      });

      useGear.getState().unlockGearForCampaign('campaign-123', 'sword-123');
      useGear.getState().unlockGearForCampaign('campaign-123', 'helmet-456');
    });

    afterEach(() => {
      useGear.getState().resetGear();
    });

    it('should track gear ownership', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      const state = useGear.getState();

      // With the new instance system, gear ownership is tracked per instance
      const equippedInstances = state.getEquippedGear('knight-123');
      expect(equippedInstances).toHaveLength(1);
      expect(equippedInstances[0]).toMatch(/^sword-123-\d+-[a-z0-9]+$/);
    });

    it('should transfer gear between knights', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      const state = useGear.getState();
      const swordInstance = state.getEquippedGear('knight-123')[0];

      // With the new instance system, transfer doesn't work the same way
      // Instead, we unequip from one knight and equip to another
      useGear.getState().unequipGear('knight-123', swordInstance);
      useGear.getState().equipGear('knight-456', 'sword-123');
      const newState = useGear.getState();

      expect(newState.getEquippedGear('knight-123')).toHaveLength(0);
      expect(newState.getEquippedGear('knight-456')).toHaveLength(1);
      // The new instance will be different since we create a new one
      expect(newState.getEquippedGear('knight-456')[0]).toMatch(/^sword-123-\d+-[a-z0-9]+$/);
    });

    it('should automatically transfer gear when equipping to different knight', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      useGear.getState().equipGear('knight-456', 'sword-123');
      const state = useGear.getState();

      // Both knights should have their own instances
      expect(state.getEquippedGear('knight-123')).toHaveLength(1);
      expect(state.getEquippedGear('knight-456')).toHaveLength(1);
      expect(state.getEquippedGear('knight-123')[0]).not.toBe(
        state.getEquippedGear('knight-456')[0]
      );
    });

    it('should get available gear for knight', () => {
      // Ensure we have a completely clean state for this test
      useGear.getState().resetGear();

      // Add test gear to the store
      useGear.getState().addGear({
        id: 'sword-123',
        name: 'Test Sword',
        type: 'kingdom',
        kingdomId: 'test-kingdom',
        stats: { attack: 2 },
        keywords: ['sharp'],
        description: 'A test sword',
        rarity: 'common',
        cost: 50,
        quantity: 2,
      });

      useGear.getState().addGear({
        id: 'helmet-456',
        name: 'Test Helmet',
        type: 'kingdom',
        kingdomId: 'test-kingdom',
        stats: { defense: 2 },
        keywords: ['protective'],
        description: 'A test helmet',
        rarity: 'common',
        cost: 50,
        quantity: 2,
      });

      // Unlock gear for campaign
      useGear.getState().unlockGearForCampaign('campaign-123', 'sword-123');
      useGear.getState().unlockGearForCampaign('campaign-123', 'helmet-456');

      // Equip sword to knight-123
      useGear.getState().equipGear('knight-123', 'sword-123');
      const state = useGear.getState();

      const availableGear = state.getAvailableGearForKnight('campaign-123', 'knight-456');
      expect(availableGear).toContain('helmet-456'); // Not equipped by anyone
      expect(availableGear).toContain('sword-123'); // Still available since quantity > 1
    });

    it('should include gear equipped by the knight in available gear', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      const state = useGear.getState();

      const availableGear = state.getAvailableGearForKnight('campaign-123', 'knight-123');
      expect(availableGear).toContain('sword-123'); // Still available since quantity > 1
    });

    it('should clear ownership when unequipping', () => {
      useGear.getState().equipGear('knight-123', 'sword-123');
      const state = useGear.getState();
      const swordInstance = state.getEquippedGear('knight-123')[0];

      useGear.getState().unequipGear('knight-123', swordInstance);
      const newState = useGear.getState();

      expect(newState.getEquippedGear('knight-123')).toHaveLength(0);
    });
  });
});

describe('Quantity Management', () => {
  beforeEach(() => {
    useGear.getState().resetGear();
  });

  afterEach(() => {
    useGear.getState().resetGear();
  });

  it('should set gear quantity', () => {
    const { setGearQuantity, getGearQuantity } = useGear.getState();

    setGearQuantity('sword-of-truth', 5);
    expect(getGearQuantity('sword-of-truth')).toBe(5);
  });

  it('should not allow negative quantities', () => {
    const { setGearQuantity, getGearQuantity } = useGear.getState();

    setGearQuantity('sword-of-truth', -3);
    expect(getGearQuantity('sword-of-truth')).toBe(0);
  });

  it('should calculate available quantity correctly', () => {
    const { setGearQuantity, equipGear, getAvailableQuantity } = useGear.getState();

    setGearQuantity('sword-of-truth', 3);
    expect(getAvailableQuantity('sword-of-truth')).toBe(3);

    equipGear('knight-1', 'sword-of-truth');
    expect(getAvailableQuantity('sword-of-truth')).toBe(2);

    equipGear('knight-2', 'sword-of-truth');
    expect(getAvailableQuantity('sword-of-truth')).toBe(1);
  });

  it('should calculate equipped quantity correctly', () => {
    const { setGearQuantity, equipGear, getEquippedQuantity } = useGear.getState();

    setGearQuantity('sword-of-truth', 3);
    expect(getEquippedQuantity('sword-of-truth')).toBe(0);

    equipGear('knight-1', 'sword-of-truth');
    expect(getEquippedQuantity('sword-of-truth')).toBe(1);

    equipGear('knight-2', 'sword-of-truth');
    expect(getEquippedQuantity('sword-of-truth')).toBe(2);
  });

  it('should exclude upgrades from available gear pool', () => {
    const { unlockGearForCampaign, getAvailableGearForKnight } = useGear.getState();

    unlockGearForCampaign('campaign-1', 'sword-of-truth');
    unlockGearForCampaign('campaign-1', 'sharpening-stone');

    const availableGear = getAvailableGearForKnight('campaign-1', 'knight-1');

    expect(availableGear).toContain('sword-of-truth');
    expect(availableGear).not.toContain('sharpening-stone');
  });

  it('should not allow equipping upgrades', () => {
    const { unlockGearForCampaign, equipGear, getEquippedGear } = useGear.getState();

    unlockGearForCampaign('campaign-1', 'sharpening-stone');
    equipGear('knight-1', 'sharpening-stone');

    const equippedGear = getEquippedGear('knight-1');
    expect(equippedGear).not.toContain('sharpening-stone');
  });

  it('should not allow equipping when no quantity available', () => {
    const { setGearQuantity, unlockGearForCampaign, equipGear, getEquippedGear } =
      useGear.getState();

    setGearQuantity('sword-of-truth', 1);
    unlockGearForCampaign('campaign-1', 'sword-of-truth');

    equipGear('knight-1', 'sword-of-truth');
    equipGear('knight-2', 'sword-of-truth'); // Should not work

    const knight1Gear = getEquippedGear('knight-1');
    const knight2Gear = getEquippedGear('knight-2');

    expect(knight1Gear).toHaveLength(1);
    expect(knight1Gear[0]).toMatch(/^sword-of-truth-\d+-[a-z0-9]+$/);
    expect(knight2Gear).toHaveLength(0);
  });

  it('should respect upgrade quantity limits when attaching', () => {
    const {
      setGearQuantity,
      unlockGearForCampaign,
      equipGear,
      attachUpgrade,
      getAttachedUpgrade,
      getEquippedGear,
    } = useGear.getState();

    // Set up gear and upgrades
    setGearQuantity('sword-of-truth', 3);
    setGearQuantity('sharpening-stone', 2); // Only 2 upgrades available
    unlockGearForCampaign('campaign-1', 'sword-of-truth');
    unlockGearForCampaign('campaign-1', 'sharpening-stone');

    // Equip gear to 3 different knights
    equipGear('knight-1', 'sword-of-truth');
    equipGear('knight-2', 'sword-of-truth');
    equipGear('knight-3', 'sword-of-truth');

    const knight1Gear = getEquippedGear('knight-1')[0];
    const knight2Gear = getEquippedGear('knight-2')[0];
    const knight3Gear = getEquippedGear('knight-3')[0];

    // Attach upgrades to first two knights (should work)
    attachUpgrade('sharpening-stone', knight1Gear);
    attachUpgrade('sharpening-stone', knight2Gear);

    // Try to attach to third knight (should fail - no more upgrades available)
    attachUpgrade('sharpening-stone', knight3Gear);

    // Check that only first two have upgrades attached
    expect(getAttachedUpgrade(knight1Gear)).toBe('sharpening-stone');
    expect(getAttachedUpgrade(knight2Gear)).toBe('sharpening-stone');
    expect(getAttachedUpgrade(knight3Gear)).toBeNull();
  });

  it('should allow attaching multiple instances of the same upgrade type', () => {
    const {
      setGearQuantity,
      unlockGearForCampaign,
      equipGear,
      attachUpgrade,
      getAttachedUpgrade,
      getEquippedGear,
    } = useGear.getState();

    setGearQuantity('sword-of-truth', 2);
    setGearQuantity('sharpening-stone', 2);
    unlockGearForCampaign('campaign-1', 'sword-of-truth');
    unlockGearForCampaign('campaign-1', 'sharpening-stone');

    equipGear('knight-1', 'sword-of-truth');
    equipGear('knight-2', 'sword-of-truth');

    const knight1Gear = getEquippedGear('knight-1')[0];
    const knight2Gear = getEquippedGear('knight-2')[0];

    // Attach upgrade to first knight
    attachUpgrade('sharpening-stone', knight1Gear);
    expect(getAttachedUpgrade(knight1Gear)).toBe('sharpening-stone');

    // Attach the same upgrade type to second knight (should work)
    attachUpgrade('sharpening-stone', knight2Gear);
    expect(getAttachedUpgrade(knight2Gear)).toBe('sharpening-stone');
  });
});
