import { Tier } from '@/catalogs/tier';

export type SpecialCardType = 'devour-dragons';

export type MonsterModifier = {
  monsterId: string;
  rules: string;
  additionalSetup?: string;
  levelRestriction?: {
    minLevel?: number;
    maxLevel?: number;
  };
};

export type SpecialCard = {
  id: string;
  type: SpecialCardType;
  name: string;
  description: string;
  rules: string;
  monsterModifiers: MonsterModifier[];
  assignmentRestrictions?: {
    excludedTiers?: Tier[];
  };
};

export const DEVOUR_DRAGONS_CARD: SpecialCard = {
  id: 'devour-dragons',
  type: 'devour-dragons',
  name: 'Here be Devour Dragons',
  description:
    'Add this card to the Encounter Monster deck during Monster Setup step of the vision phase.',
  rules:
    'If you draw this card, draw one additional card. After drawing all encounter monster cards, assign this card to a random Encounter other than King or Dragon if possible. If you would begin a clash against the monster with this card assigned, resolve the clash within the Belly of the Beast.',
  monsterModifiers: [
    {
      monsterId: 'white-ape-troll',
      rules:
        'Guardians Spawning uses the grave mortis deck, Disable the regeneration Trait. Start of clash: Spawn 2 Guardians',
    },
    {
      monsterId: 'first-men-lictor-hunters',
      rules: 'In Multitudes',
      additionalSetup: 'Each Lictor Hunter on a Swamp Terrain tile is Decoying',
    },
    {
      monsterId: 'first-men-warriors',
      rules: 'In Multitudes',
    },
    {
      monsterId: 'ironcast-dead',
      rules: 'Use 4x BP 1. In Multitudes. Disable the Lifeless Army Trait',
      levelRestriction: {
        minLevel: 4,
      },
      additionalSetup:
        'Whenever an Ironcast Dead dies, all other Mobs perform Gangup 2 against the closest Knight and Swarm 1(one by one)',
    },
    {
      monsterId: 'ratwolves',
      rules: 'Ratwolves Drag toward the Boundless Board Edge instead',
      levelRestriction: {
        minLevel: 2,
      },
    },
    {
      monsterId: 'panzergeists',
      rules: 'In Multitudes. Blackend Sky.',
      additionalSetup:
        "Draw all Fool's deck cards and place an Armor token on each empty space with corresponding coordinates.",
    },
    {
      monsterId: 'haunts-of-utrebant',
      rules: 'Blackend sky',
    },
    {
      monsterId: 'devil-of-the-ancient-dusk',
      rules:
        'Treat all spaces that are not between the Boundless Board Edge and Swamp Terrain tiles as Swamp spaces. Deluge: Only Deluge one Swamp; move it toward the Boundless Board edge.',
    },
    {
      monsterId: 'winged-nightmare',
      rules:
        'Treat spaces adjacent to the Boundless Board Edge as Chasm spaces. Perform Flank and Flee away from the Boundles Board Edge instead.',
    },
    {
      monsterId: 'paleblood-worms',
      rules: 'if you would perform Burrow X with X greater that 5, lower it by 5.',
    },
    {
      monsterId: 'pumpkinhead-monstrosities',
      rules: 'Blackend Sky.',
    },
  ],
  assignmentRestrictions: {
    excludedTiers: [Tier.king, Tier.dragon],
  },
};

export const SPECIAL_CARDS = [DEVOUR_DRAGONS_CARD];
