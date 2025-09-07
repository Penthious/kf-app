import { KnightCatalogEntry } from '../../catalogs/knights';
import { createSheetWithStartingVirtues, defaultVirtues } from '../knight';

describe('createSheetWithStartingVirtues', () => {
  const mockCatalog: KnightCatalogEntry[] = [
    {
      id: 'kara',
      name: 'Kara',
      source: 'Core',
      startingVirtues: { bravery: 2 },
    },
    {
      id: 'stoneface',
      name: 'Stoneface',
      source: 'Expansion',
      startingVirtues: { fortitude: 1, tenacity: 2, might: 1 },
    },
    {
      id: 'ser-sonch',
      name: 'Ser Sonch',
      source: 'Core',
      // No startingVirtues
    },
  ];

  it('should apply startingVirtues from catalog entry', () => {
    const sheet = createSheetWithStartingVirtues('kara', mockCatalog);

    expect(sheet.virtues).toEqual({
      bravery: 2,
      tenacity: 0,
      sagacity: 0,
      fortitude: 0,
      might: 0,
      insight: 0,
    });
  });

  it('should apply multiple startingVirtues from catalog entry', () => {
    const sheet = createSheetWithStartingVirtues('stoneface', mockCatalog);

    expect(sheet.virtues).toEqual({
      bravery: 0,
      tenacity: 2,
      sagacity: 0,
      fortitude: 1,
      might: 1,
      insight: 0,
    });
  });

  it('should use default virtues when catalog entry has no startingVirtues', () => {
    const sheet = createSheetWithStartingVirtues('ser-sonch', mockCatalog);

    expect(sheet.virtues).toEqual(defaultVirtues());
  });

  it('should use default virtues when catalog entry is not found', () => {
    const sheet = createSheetWithStartingVirtues('nonexistent', mockCatalog);

    expect(sheet.virtues).toEqual(defaultVirtues());
  });

  it('should create a complete knight sheet with other default values', () => {
    const sheet = createSheetWithStartingVirtues('kara', mockCatalog);

    expect(sheet).toMatchObject({
      virtues: { bravery: 2, tenacity: 0, sagacity: 0, fortitude: 0, might: 0, insight: 0 },
      vices: { cowardice: 0, dishonor: 0, duplicity: 0, disregard: 0, cruelty: 0, treachery: 0 },
      bane: 0,
      sighOfGraal: 0,
      gold: 0,
      leads: 0,
      clues: 0,
      chapter: 1,
      chapters: {},
      prologueDone: false,
      postgameDone: false,
      firstDeath: false,
      choiceMatrix: {},
      saints: [],
      mercenaries: [],
      armory: [],
      notes: [],
      cipher: 0,
    });
  });
});
