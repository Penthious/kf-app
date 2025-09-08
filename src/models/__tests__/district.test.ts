import {
  createDistrictWheel,
  getDistrictsWithMonsters,
  getMonsterForDistrict,
  rotateDistrictWheel,
} from '../district';

describe('District Wheel System', () => {
  const mockKingdomId = 'test-kingdom';
  const mockDistrictNames = ['District A', 'District B', 'District C'];

  const mockAssignments = [
    { districtId: 'test-kingdom-district-a', monsterId: 'monster-1', level: 5 },
    { districtId: 'test-kingdom-district-b', monsterId: 'monster-2', level: 10 },
    { districtId: 'test-kingdom-district-c', monsterId: 'monster-3', level: 15 },
  ];

  describe('createDistrictWheel', () => {
    it('should create a district wheel with correct structure', () => {
      const wheel = createDistrictWheel(mockKingdomId, mockDistrictNames, mockAssignments);

      expect(wheel.kingdomId).toBe('test-kingdom');
      expect(wheel.districts).toHaveLength(3);
      expect(wheel.assignments).toHaveLength(3);
      expect(wheel.currentRotation).toBe(0);

      // Check district structure
      expect(wheel.districts[0]).toEqual({
        id: 'test-kingdom-district-a',
        name: 'District A',
        kingdomId: 'test-kingdom',
        order: 0,
      });

      expect(wheel.districts[1]).toEqual({
        id: 'test-kingdom-district-b',
        name: 'District B',
        kingdomId: 'test-kingdom',
        order: 1,
      });

      expect(wheel.districts[2]).toEqual({
        id: 'test-kingdom-district-c',
        name: 'District C',
        kingdomId: 'test-kingdom',
        order: 2,
      });
    });

    it('should handle district names with spaces and special characters', () => {
      const districtNamesWithSpaces = ['Noble District', 'Craftsman District', 'Port District'];

      const wheel = createDistrictWheel(mockKingdomId, districtNamesWithSpaces, mockAssignments);

      expect(wheel.districts[0].id).toBe('test-kingdom-noble-district');
      expect(wheel.districts[1].id).toBe('test-kingdom-craftsman-district');
      expect(wheel.districts[2].id).toBe('test-kingdom-port-district');
    });
  });

  describe('rotateDistrictWheel', () => {
    let wheel: ReturnType<typeof createDistrictWheel>;

    beforeEach(() => {
      wheel = createDistrictWheel(mockKingdomId, mockDistrictNames, mockAssignments);
    });

    it('should rotate assignments by one position', () => {
      const rotatedWheel = rotateDistrictWheel(wheel);

      // Check that assignments moved to next district
      expect(rotatedWheel.assignments[0].districtId).toBe('test-kingdom-district-b');
      expect(rotatedWheel.assignments[1].districtId).toBe('test-kingdom-district-c');
      expect(rotatedWheel.assignments[2].districtId).toBe('test-kingdom-district-a');

      // Check that rotation counter increased
      expect(rotatedWheel.currentRotation).toBe(1);
    });

    it('should wrap around to first district after last', () => {
      const rotatedWheel = rotateDistrictWheel(wheel);

      // The assignment that was in the last district should move to the first
      expect(rotatedWheel.assignments[2].districtId).toBe('test-kingdom-district-a');
    });

    it('should preserve monster and stage data during rotation', () => {
      const rotatedWheel = rotateDistrictWheel(wheel);

      // Check that monster IDs and stages are preserved
      expect(rotatedWheel.assignments[0].monsterId).toBe('monster-1');
      expect(rotatedWheel.assignments[1].monsterId).toBe('monster-2');
      expect(rotatedWheel.assignments[2].monsterId).toBe('monster-3');
    });

    it('should increment rotation counter on each rotation', () => {
      let currentWheel = wheel;

      for (let i = 1; i <= 5; i++) {
        currentWheel = rotateDistrictWheel(currentWheel);
        expect(currentWheel.currentRotation).toBe(i);
      }
    });

    it('should return to original state after full rotation', () => {
      let currentWheel = wheel;

      // Rotate 3 times (number of districts)
      for (let i = 0; i < 3; i++) {
        currentWheel = rotateDistrictWheel(currentWheel);
      }

      // Should be back to original assignment positions
      expect(currentWheel.assignments[0].districtId).toBe('test-kingdom-district-a');
      expect(currentWheel.assignments[1].districtId).toBe('test-kingdom-district-b');
      expect(currentWheel.assignments[2].districtId).toBe('test-kingdom-district-c');
    });
  });

  describe('getMonsterForDistrict', () => {
    let wheel: ReturnType<typeof createDistrictWheel>;

    beforeEach(() => {
      wheel = createDistrictWheel(mockKingdomId, mockDistrictNames, mockAssignments);
    });

    it('should return correct monster assignment for district', () => {
      const assignment = getMonsterForDistrict(wheel, 'test-kingdom-district-a');

      expect(assignment).toEqual({
        districtId: 'test-kingdom-district-a',
        monsterId: 'monster-1',
        level: 5,
      });
    });

    it('should return undefined for non-existent district', () => {
      const assignment = getMonsterForDistrict(wheel, 'non-existent-district');

      expect(assignment).toBeUndefined();
    });

    it('should work after rotation', () => {
      const rotatedWheel = rotateDistrictWheel(wheel);

      // After rotation, monster-1 should be in district-b
      const assignment = getMonsterForDistrict(rotatedWheel, 'test-kingdom-district-b');

      expect(assignment).toEqual({
        districtId: 'test-kingdom-district-b',
        monsterId: 'monster-1',
        level: 5,
      });
    });
  });

  describe('getDistrictsWithMonsters', () => {
    let wheel: ReturnType<typeof createDistrictWheel>;

    beforeEach(() => {
      wheel = createDistrictWheel(mockKingdomId, mockDistrictNames, mockAssignments);
    });

    it('should return all districts with their assignments', () => {
      const districtsWithMonsters = getDistrictsWithMonsters(wheel);

      expect(districtsWithMonsters).toHaveLength(3);

      expect(districtsWithMonsters[0]).toEqual({
        district: {
          id: 'test-kingdom-district-a',
          name: 'District A',
          kingdomId: 'test-kingdom',
          order: 0,
        },
        assignment: {
          districtId: 'test-kingdom-district-a',
          monsterId: 'monster-1',
          level: 5,
        },
      });

      expect(districtsWithMonsters[1]).toEqual({
        district: {
          id: 'test-kingdom-district-b',
          name: 'District B',
          kingdomId: 'test-kingdom',
          order: 1,
        },
        assignment: {
          districtId: 'test-kingdom-district-b',
          monsterId: 'monster-2',
          level: 10,
        },
      });

      expect(districtsWithMonsters[2]).toEqual({
        district: {
          id: 'test-kingdom-district-c',
          name: 'District C',
          kingdomId: 'test-kingdom',
          order: 2,
        },
        assignment: {
          districtId: 'test-kingdom-district-c',
          monsterId: 'monster-3',
          level: 15,
        },
      });
    });

    it('should handle districts without assignments', () => {
      const wheelWithoutAssignments = createDistrictWheel(mockKingdomId, mockDistrictNames, []);
      const districtsWithMonsters = getDistrictsWithMonsters(wheelWithoutAssignments);

      expect(districtsWithMonsters).toHaveLength(3);
      expect(districtsWithMonsters[0].assignment).toBeUndefined();
      expect(districtsWithMonsters[1].assignment).toBeUndefined();
      expect(districtsWithMonsters[2].assignment).toBeUndefined();
    });
  });
});
