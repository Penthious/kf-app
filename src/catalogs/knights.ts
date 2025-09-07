export interface KnightCatalogEntry {
  id: string;
  name: string;
  source: string;
  startingVirtues?: {
    bravery?: number;
    tenacity?: number;
    sagacity?: number;
    fortitude?: number;
    might?: number;
    insight?: number;
  };
  cipherStart?: number;
}

export const KNIGHT_CATALOG: KnightCatalogEntry[] = [
  {
    id: 'kara',
    name: 'Kara',
    source: 'Core',
    startingVirtues: { bravery: 2 },
    cipherStart: 68,
  },
  {
    id: 'ser-sonch',
    name: 'Ser Sonch',
    source: 'Core',
  },
  {
    id: 'renholder',
    name: 'Renholder',
    source: 'Core',
  },
  {
    id: 'fleishritter',
    name: 'Fleishritter',
    source: 'Core',
  },
  {
    id: 'paracelsa',
    name: 'Paracelsa',
    source: 'Core',
  },
  {
    id: 'stoneface',
    name: 'Stoneface',
    source: 'Expansion: Ten Thousand Succulent Fears',
    startingVirtues: { fortitude: 1, tenacity: 2, might: 1 },
  },
  {
    id: 'ser-ubar',
    name: 'Ser Ubar',
    source: 'Expansion: Ten Thousand Succulent Fears',
    startingVirtues: { tenacity: 1, sagacity: 1, might: 2 },
  },
  {
    id: 'delphine',
    name: 'Delphine',
    source: 'Expansion: The Barony of Bountiful Harvest',
  },
  {
    id: 'reiner',
    name: 'Reiner',
    source: 'Expansion: The Red Kingdom of Eshin',
  },
  {
    id: 'absolute-bastard',
    name: 'Absolute Bastard',
    source: 'Standalone',
  },
  {
    id: 'ser-gallant',
    name: 'Ser Gallant',
    source: 'Standalone',
  },
];

export default KNIGHT_CATALOG;
