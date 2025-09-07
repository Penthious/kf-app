import type { ClueType } from '@/models/campaign';

export type ClueCatalogEntry = {
  type: ClueType;
  imagePath: string;
  backgroundColor: string;
};

export const CLUE_CATALOG: ClueCatalogEntry[] = [
  {
    type: 'swords',
    imagePath: 'clue-swords.png',
    backgroundColor: '#FF6B6B', // Red
  },
  {
    type: 'faces',
    imagePath: 'clue-faces.png',
    backgroundColor: '#4ECDC4', // Teal
  },
  {
    type: 'eye',
    imagePath: 'clue-eye.png',
    backgroundColor: '#45B7D1', // Blue
  },
  {
    type: 'book',
    imagePath: 'clue-book.png',
    backgroundColor: '#96CEB4', // Green
  },
];

export const getClueByType = (type: ClueType): ClueCatalogEntry | undefined => {
  return CLUE_CATALOG.find(clue => clue.type === type);
};

export const getClueImagePath = (type: ClueType): string => {
  const clue = getClueByType(type);
  return clue?.imagePath || '';
};
