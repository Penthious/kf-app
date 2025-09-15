import {
    DEVIL_OF_THE_ANCIENT_DUSK_ID,
    FIRST_MEN_LICTOR_HUNTERS_ID,
    FIRST_MEN_WARRIORS_ID,
    HAUNTS_OF_UTREBANT_ID,
    IRONCAST_DEAD_ID,
    PALEBLOOD_WORM_ID,
    PANZERGEIST_ID,
    PUMPKINHEAD_MONSTROSITIES_ID,
    RATWOLVES_ID,
    WHITE_APE_TROLL_ID,
    WINGED_NIGHTMARE_ID,
} from '@/catalogs/monsters';
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
      monsterId: WHITE_APE_TROLL_ID,
      rules:
        'Guardians Spawning uses the grave mortis deck, Disable the regeneration Trait. Start of clash: Spawn 2 Guardians',
    },
    {
      monsterId: FIRST_MEN_LICTOR_HUNTERS_ID,
      rules: 'In Multitudes',
      additionalSetup: 'Each Lictor Hunter on a Swamp Terrain tile is Decoying',
    },
    {
      monsterId: FIRST_MEN_WARRIORS_ID,
      rules: 'In Multitudes',
    },
    {
      monsterId: IRONCAST_DEAD_ID,
      rules: 'Use 4x BP 1. In Multitudes. Disable the Lifeless Army Trait',
      levelRestriction: {
        minLevel: 4,
      },
      additionalSetup:
        'Whenever an Ironcast Dead dies, all other Mobs perform Gangup 2 against the closest Knight and Swarm 1(one by one)',
    },
    {
      monsterId: RATWOLVES_ID,
      rules: 'Ratwolves Drag toward the Boundless Board Edge instead',
      levelRestriction: {
        minLevel: 2,
      },
    },
    {
      monsterId: PANZERGEIST_ID,
      rules: 'In Multitudes. Blackend Sky.',
      additionalSetup:
        "Draw all Fool's deck cards and place an Armor token on each empty space with corresponding coordinates.",
    },
    {
      monsterId: HAUNTS_OF_UTREBANT_ID,
      rules: 'Blackend sky',
    },
    {
      monsterId: DEVIL_OF_THE_ANCIENT_DUSK_ID,
      rules:
        'Treat all spaces that are not between the Boundless Board Edge and Swamp Terrain tiles as Swamp spaces. Deluge: Only Deluge one Swamp; move it toward the Boundless Board edge.',
    },
    {
      monsterId: WINGED_NIGHTMARE_ID,
      rules:
        'Treat spaces adjacent to the Boundless Board Edge as Chasm spaces. Perform Flank and Flee away from the Boundles Board Edge instead.',
    },
    {
      monsterId: PALEBLOOD_WORM_ID,
      rules: 'if you would perform Burrow X with X greater that 5, lower it by 5.',
    },
    {
      monsterId: PUMPKINHEAD_MONSTROSITIES_ID,
      rules: 'Blackend Sky.',
    },
  ],
  assignmentRestrictions: {
    excludedTiers: [Tier.king, Tier.dragon],
  },
};

export const SPECIAL_CARDS = [DEVOUR_DRAGONS_CARD];
