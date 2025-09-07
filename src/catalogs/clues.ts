import type { ClueType } from '@/models/campaign';

export type ClueCatalogEntry = {
  type: ClueType;
  name: string;
  description: string;
  imagePath: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
};

export const CLUE_CATALOG: ClueCatalogEntry[] = [
  {
    type: 'swords',
    name: 'Clash Clue',
    description:
      'A sign of conflict or battle. This clue reveals information about combat encounters or hostile forces in the area.',
    imagePath: require('../../assets/images/clues/clue-swords.png'),
    rarity: 'common',
  },
  {
    type: 'faces',
    name: 'Duality Clue',
    description:
      'Two faces in opposition. This clue reveals information about choices, conflicts of interest, or opposing forces.',
    imagePath: require('../../assets/images/clues/clue-faces.png'),
    rarity: 'uncommon',
  },
  {
    type: 'eye',
    name: 'Vision Clue',
    description:
      'The all-seeing eye. This clue reveals information about surveillance, hidden knowledge, or mystical insight.',
    imagePath: require('../../assets/images/clues/clue-eye.png'),
    rarity: 'rare',
  },
  {
    type: 'book',
    name: 'Knowledge Clue',
    description:
      'Ancient wisdom and lore. This clue reveals information about quests, investigations, or historical knowledge.',
    imagePath: require('../../assets/images/clues/clue-book.png'),
    rarity: 'legendary',
  },
];

export const getClueByType = (type: ClueType): ClueCatalogEntry | undefined => {
  return CLUE_CATALOG.find(clue => clue.type === type);
};

export const getClueImagePath = (type: ClueType): string => {
  const clue = getClueByType(type);
  return clue?.imagePath || '';
};
