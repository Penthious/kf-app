import { allKingdomsCatalog } from '../../catalogs/kingdoms';
import { createDistrictWheel, rotateDistrictWheel } from '../../models/district';
import { getBestiaryWithExpansions } from '../../models/kingdom';

// Mock the kingdom model
jest.mock('../../models/kingdom', () => ({
  ...jest.requireActual('../../models/kingdom'),
  getBestiaryWithExpansions: jest.fn(),
}));

// Mock the kingdom catalog
jest.mock('../../catalogs/kingdoms', () => ({
  allKingdomsCatalog: [],
}));

describe('District Wheel Integration', () => {
  beforeEach(() => {
    // Clear any mocked data
    jest.mocked(allKingdomsCatalog).length = 0;
    jest.mocked(getBestiaryWithExpansions).mockClear();

    // Default mock for getBestiaryWithExpansions
    jest.mocked(getBestiaryWithExpansions).mockReturnValue({
      monsters: [
        { id: 'monster-1', type: 'kingdom' as const },
        { id: 'monster-2', type: 'kingdom' as const },
        { id: 'monster-3', type: 'kingdom' as const },
        { id: 'monster-4', type: 'kingdom' as const },
        { id: 'wandering-monster-1', type: 'wandering' as const },
      ],
      stages: [],
    });
  });

  describe('District Wheel Logic', () => {
    it('should create district wheel with correct structure', () => {
      const kingdomId = 'sunken-kingdom';
      const districtNames = ['Drowned District', 'Marsh District', 'Mud District'];

      const assignments = [
        { districtId: 'sunken-kingdom-drowned-district', monsterId: 'monster-1', level: 1 },
        { districtId: 'sunken-kingdom-marsh-district', monsterId: 'monster-2', level: 1 },
        { districtId: 'sunken-kingdom-mud-district', monsterId: 'monster-3', level: 1 },
      ];

      const wheel = createDistrictWheel(kingdomId, districtNames, assignments);

      expect(wheel).toBeDefined();
      expect(wheel.kingdomId).toBe('sunken-kingdom');
      expect(wheel.districts).toHaveLength(3);
      expect(wheel.assignments).toHaveLength(3);
      expect(wheel.currentRotation).toBe(0);

      // Check district structure
      expect(wheel.districts[0].id).toBe('sunken-kingdom-drowned-district');
      expect(wheel.districts[0].name).toBe('Drowned District');
      expect(wheel.districts[0].order).toBe(0);

      // Check assignments
      expect(wheel.assignments[0].districtId).toBe('sunken-kingdom-drowned-district');
      expect(wheel.assignments[0].monsterId).toBe('monster-1');
      expect(wheel.assignments[0].level).toBe(1);
    });

    it('should rotate district wheel correctly', () => {
      const kingdomId = 'sunken-kingdom';
      const districtNames = ['Drowned District', 'Marsh District', 'Mud District'];

      const assignments = [
        { districtId: 'sunken-kingdom-drowned-district', monsterId: 'monster-1', level: 1 },
        { districtId: 'sunken-kingdom-marsh-district', monsterId: 'monster-2', level: 1 },
        { districtId: 'sunken-kingdom-mud-district', monsterId: 'monster-3', level: 1 },
      ];

      const wheel = createDistrictWheel(kingdomId, districtNames, assignments);
      const rotatedWheel = rotateDistrictWheel(wheel);

      expect(rotatedWheel.currentRotation).toBe(1);
      expect(rotatedWheel.assignments).toHaveLength(3);

      // Check that monsters moved to next district
      // monster-1 moves from drowned to marsh district
      expect(rotatedWheel.assignments[0].monsterId).toBe('monster-1');
      expect(rotatedWheel.assignments[0].districtId).toBe('sunken-kingdom-marsh-district');
      // monster-2 moves from marsh to mud district
      expect(rotatedWheel.assignments[1].monsterId).toBe('monster-2');
      expect(rotatedWheel.assignments[1].districtId).toBe('sunken-kingdom-mud-district');
      // monster-3 moves from mud to drowned district
      expect(rotatedWheel.assignments[2].monsterId).toBe('monster-3');
      expect(rotatedWheel.assignments[2].districtId).toBe('sunken-kingdom-drowned-district');
    });

    it('should handle multiple rotations', () => {
      const kingdomId = 'sunken-kingdom';
      const districtNames = ['Drowned District', 'Marsh District', 'Mud District'];

      const assignments = [
        { districtId: 'sunken-kingdom-drowned-district', monsterId: 'monster-1', level: 1 },
        { districtId: 'sunken-kingdom-marsh-district', monsterId: 'monster-2', level: 1 },
        { districtId: 'sunken-kingdom-mud-district', monsterId: 'monster-3', level: 1 },
      ];

      let wheel = createDistrictWheel(kingdomId, districtNames, assignments);

      // Rotate twice
      wheel = rotateDistrictWheel(wheel);
      wheel = rotateDistrictWheel(wheel);

      expect(wheel.currentRotation).toBe(2);

      // After 2 rotations, monsters should be back to original positions
      expect(wheel.assignments[0].monsterId).toBe('monster-1');
      expect(wheel.assignments[1].monsterId).toBe('monster-2');
      expect(wheel.assignments[2].monsterId).toBe('monster-3');
    });

    it('should work with Principality of Stone districts', () => {
      const kingdomId = 'principality-of-stone';
      const districtNames = ['Noble', 'Craftsman', 'Port', 'Merchant'];

      const assignments = [
        { districtId: 'principality-of-stone-noble', monsterId: 'monster-1', level: 2 },
        {
          districtId: 'principality-of-stone-craftsman',
          monsterId: 'monster-2',
          level: 2,
        },
        { districtId: 'principality-of-stone-port', monsterId: 'monster-3', level: 2 },
        { districtId: 'principality-of-stone-merchant', monsterId: 'monster-4', level: 2 },
      ];

      const wheel = createDistrictWheel(kingdomId, districtNames, assignments);
      const rotatedWheel = rotateDistrictWheel(wheel);

      expect(wheel.districts).toHaveLength(4);
      expect(rotatedWheel.currentRotation).toBe(1);

      // Check that all monsters moved to next position
      // monster-1 moves from Noble to Craftsman
      expect(rotatedWheel.assignments[0].monsterId).toBe('monster-1');
      expect(rotatedWheel.assignments[0].districtId).toBe('principality-of-stone-craftsman');
      // monster-2 moves from Craftsman to Port
      expect(rotatedWheel.assignments[1].monsterId).toBe('monster-2');
      expect(rotatedWheel.assignments[1].districtId).toBe('principality-of-stone-port');
      // monster-3 moves from Port to Merchant
      expect(rotatedWheel.assignments[2].monsterId).toBe('monster-3');
      expect(rotatedWheel.assignments[2].districtId).toBe('principality-of-stone-merchant');
      // monster-4 moves from Merchant to Noble
      expect(rotatedWheel.assignments[3].monsterId).toBe('monster-4');
      expect(rotatedWheel.assignments[3].districtId).toBe('principality-of-stone-noble');
    });
  });

  describe('District Wheel with Expansions', () => {
    it('should include expansion monsters when TTSF is enabled', () => {
      // Mock kingdom with TTSF expansion
      jest.mocked(allKingdomsCatalog).push({
        id: 'sunken-kingdom',
        name: 'Sunken Kingdom',
        type: 'main' as const,
        bestiary: { monsters: [], stages: [] },
        adventures: [],
        districts: ['Drowned District', 'Marsh District', 'Mud District'],
      });

      // Mock getBestiaryWithExpansions to return expansion monsters
      jest.mocked(getBestiaryWithExpansions).mockReturnValue({
        monsters: [
          { id: 'monster-1', type: 'kingdom' as const },
          { id: 'monster-2', type: 'kingdom' as const },
          { id: 'monster-3', type: 'kingdom' as const },
          { id: 'monster-4', type: 'kingdom' as const },
          { id: 'ttsf-monster-1', type: 'kingdom' as const, expansion: 'ttsf' },
          { id: 'ttsf-monster-2', type: 'kingdom' as const, expansion: 'ttsf' },
        ],
        stages: [],
      });

      const kingdomCatalog = allKingdomsCatalog.find(k => k.id === 'sunken-kingdom');
      const bestiary = getBestiaryWithExpansions(kingdomCatalog!, { ttsf: { enabled: true } });

      expect(bestiary).toBeDefined();
      expect(bestiary.monsters).toHaveLength(6);
      expect(bestiary.monsters.some(m => m.id === 'ttsf-monster-1')).toBe(true);
      expect(bestiary.monsters.some(m => m.id === 'ttsf-monster-2')).toBe(true);
    });
  });
});
