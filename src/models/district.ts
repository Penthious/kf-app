/**
 * District Wheel System Models
 *
 * Each kingdom has districts that form a circular wheel. During expeditions,
 * monsters are randomly assigned to districts and can be rotated during the delve phase.
 */

export type District = {
  id: string;
  name: string;
  kingdomId: string;
  order: number; // Position in the wheel (0-based)
};

export type DistrictAssignment = {
  districtId: string;
  monsterId: string;
  specialCard?: string; // ID of special card assigned to this monster
};

export type DistrictWheel = {
  kingdomId: string;
  districts: District[];
  assignments: DistrictAssignment[];
  currentRotation: number; // How many times the wheel has been rotated
};

/**
 * Utility function to create a district wheel from kingdom district configuration
 */
export function createDistrictWheel(
  kingdomId: string,
  districtNames: string[],
  monsterAssignments: DistrictAssignment[]
): DistrictWheel {
  const districts: District[] = districtNames.map((name, index) => ({
    id: `${kingdomId}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    kingdomId,
    order: index,
  }));

  return {
    kingdomId,
    districts,
    assignments: monsterAssignments,
    currentRotation: 0,
  };
}

/**
 * Rotate the district wheel by one position
 */
export function rotateDistrictWheel(wheel: DistrictWheel): DistrictWheel {
  const rotatedAssignments = wheel.assignments.map(assignment => {
    const currentDistrict = wheel.districts.find(d => d.id === assignment.districtId);
    if (!currentDistrict) return assignment;

    // Find the next district in the wheel
    const nextOrder = (currentDistrict.order + 1) % wheel.districts.length;
    const nextDistrict = wheel.districts.find(d => d.order === nextOrder);

    if (!nextDistrict) return assignment;

    return {
      ...assignment,
      districtId: nextDistrict.id,
    };
  });

  return {
    ...wheel,
    assignments: rotatedAssignments,
    currentRotation: wheel.currentRotation + 1,
  };
}

/**
 * Get the monster assigned to a specific district
 */
export function getMonsterForDistrict(
  wheel: DistrictWheel,
  districtId: string
): DistrictAssignment | undefined {
  return wheel.assignments.find(assignment => assignment.districtId === districtId);
}

/**
 * Get all districts with their assigned monsters
 */
export function getDistrictsWithMonsters(wheel: DistrictWheel): Array<{
  district: District;
  assignment?: DistrictAssignment;
}> {
  return wheel.districts.map(district => ({
    district,
    assignment: getMonsterForDistrict(wheel, district.id),
  }));
}
