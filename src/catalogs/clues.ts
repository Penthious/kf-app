import type { ClueType } from '@/models/campaign';

export type ClueCatalogEntry = {
  type: ClueType;
  imagePath: string;
};

export const CLUE_CATALOG: ClueCatalogEntry[] = [
  {
    type: 'swords',
    imagePath: 'clue-swords.png',
  },
  {
    type: 'faces',
    imagePath: 'clue-faces.png',
  },
  {
    type: 'eye',
    imagePath: 'clue-eye.png',
  },
  {
    type: 'book',
    imagePath: 'clue-book.png',
  },
];

export const getClueByType = (type: ClueType): ClueCatalogEntry | undefined => {
  return CLUE_CATALOG.find(clue => clue.type === type);
};

export const getClueImagePath = (type: ClueType): string => {
  const clue = getClueByType(type);
  return clue?.imagePath || '';
};
