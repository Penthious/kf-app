import {
  DEVIL_OF_THE_ANCIENT_DUSK_ID,
  FIRST_MEN_WARRIORS_ID,
  HAUNTS_OF_UTREBANT_ID,
  KING_LAID_LOW_ID,
  TOADRAGON_ID,
  WHITE_APE_TROLL_ID,
} from '@/catalogs/monsters';
import { BOG_WITCH_ID, BOG_WITCH_STAGES } from '@/catalogs/monsters/bog-witch';
import { DEVIL_OF_THE_ANCIENT_DUSK_STAGES } from '@/catalogs/monsters/devil-of-the-ancient-dusk';
import {
  FIRST_MEN_LICTOR_HUNTERS_ID,
  FIRST_MEN_LICTOR_HUNTERS_STAGES,
} from '@/catalogs/monsters/first-men-lictor-hunters';
import { FIRST_MEN_WARRIORS_STAGES } from '@/catalogs/monsters/first-men-warriors';
import { HAUNTS_OF_UTREBANT_STAGES } from '@/catalogs/monsters/haunts-of-utrebant';
import { KING_LAID_LOW_STAGES } from '@/catalogs/monsters/king-laid-low';
import { KNIGHTEATER_ID, KNIGHTEATER_STAGES } from '@/catalogs/monsters/knighteater';
import { TOADRAGON_STAGES } from '@/catalogs/monsters/toadragon';
import {
  BASE_WANDERING_MONSTERS,
  BASE_WANDERING_STAGES,
  TTSF_WANDERING_MONSTERS,
  TTSF_WANDERING_STAGES,
} from '@/catalogs/monsters/wandering';
import { WHITE_APE_TROLL_STAGES } from '@/catalogs/monsters/white-ape-troll';
import {
  YOUNG_DEVOURER_DRAGON_ID,
  YOUNG_DEVOURER_DRAGON_STAGES,
} from '@/catalogs/monsters/young-devourer-dragon';
import { Tier } from '@/catalogs/tier';
import type { KingdomCatalog, SubKingdomCatalog } from '@/models/kingdom';
import { createStageRows, createSubKingdomStages } from '@/models/kingdom';

export const SUNKEN_ID = 'sunken-kingdom';
export const ANCESTOR_RUINS_ID = 'ancestor-ruins';

// Ancestor Ruins kingdom-specific stages (without wandering monsters)
// First Men Lictor Hunters: '111222 333. 444     '
// Bog Witch: '  111 222  333. 4444'
const ANCESTOR_RUINS_KINGDOM_STAGES = createStageRows([
  { [FIRST_MEN_LICTOR_HUNTERS_ID]: FIRST_MEN_LICTOR_HUNTERS_STAGES },
  { [BOG_WITCH_ID]: BOG_WITCH_STAGES },
]);

// Ancestor Ruins sub-kingdom (accessible only during Sunken Kingdom expeditions)
export const ANCESTOR_RUINS: SubKingdomCatalog = {
  id: ANCESTOR_RUINS_ID,
  name: 'Ancestor Ruins',
  parentKingdomId: SUNKEN_ID,
  accessCondition: 'sunken-only',
  bestiary: {
    monsters: [
      // Inherits all monsters from parent kingdom (Sunken Kingdom)
      ...BASE_WANDERING_MONSTERS,
      // Kingdom Monsters from parent
      { id: FIRST_MEN_WARRIORS_ID, type: 'kingdom' },
      { id: HAUNTS_OF_UTREBANT_ID, type: 'kingdom' },
      { id: WHITE_APE_TROLL_ID, type: 'kingdom' },
      { id: KING_LAID_LOW_ID, type: 'kingdom' },
      { id: DEVIL_OF_THE_ANCIENT_DUSK_ID, type: 'kingdom' },
      { id: TOADRAGON_ID, type: 'kingdom' },
      // Sub-kingdom specific monsters (TTSF expansion)
      { id: FIRST_MEN_LICTOR_HUNTERS_ID, type: 'kingdom', expansion: 'ttsf' },
      { id: BOG_WITCH_ID, type: 'kingdom', expansion: 'ttsf' },
      ...TTSF_WANDERING_MONSTERS,
    ],
    stages: createSubKingdomStages(ANCESTOR_RUINS_KINGDOM_STAGES, TTSF_WANDERING_STAGES),
  },
  adventures: [
    { name: 'Primal Descent', roll: { min: 1, max: 5 }, singleAttempt: false },
    { name: 'Breakthrough', roll: { min: 6, max: 11 }, singleAttempt: false },
    { name: "Trail's End", roll: { min: 12, max: 18 }, singleAttempt: true },
    { name: 'Safe Passage', roll: { min: 19, max: 25 }, singleAttempt: true },
    { name: 'Kindness in a Cruel Age', roll: { min: 26, max: 32 }, singleAttempt: true },
    { name: 'Even To Direct His Step', roll: { min: 33, max: 39 }, singleAttempt: true },
    { name: 'Pit of Memories', roll: { min: 40, max: 46 }, singleAttempt: false },
    { name: 'Heavy as a Feather', roll: { min: 47, max: 53 }, singleAttempt: true },
    { name: 'Grave-Robbing', roll: { min: 54, max: 60 }, singleAttempt: false },
    { name: 'Blood Covenant', roll: { min: 61, max: 67 }, singleAttempt: false },
    { name: 'Dome of Stars', roll: { min: 68, max: 74 }, singleAttempt: false },
    { name: 'Floodgates', roll: { min: 75, max: 81 }, singleAttempt: true },
    { name: 'Mirewolves', roll: { min: 82, max: 88 }, singleAttempt: false },
    { name: 'Rosetta', roll: { min: 89, max: 94 }, singleAttempt: true },
    { name: 'Secret Keeper', roll: { min: 95, max: 100 }, singleAttempt: true },
  ],
  contracts: [
    // Ancestor Ruins contracts can be added here if needed
  ],
};

// Sunken Kingdom kingdom-specific stages (without wandering monsters)
const SUNKEN_KINGDOM_STAGES = createStageRows([
  { [FIRST_MEN_WARRIORS_ID]: FIRST_MEN_WARRIORS_STAGES },
  { [HAUNTS_OF_UTREBANT_ID]: HAUNTS_OF_UTREBANT_STAGES },
  { [WHITE_APE_TROLL_ID]: WHITE_APE_TROLL_STAGES },
  { [KING_LAID_LOW_ID]: KING_LAID_LOW_STAGES },
  { [DEVIL_OF_THE_ANCIENT_DUSK_ID]: DEVIL_OF_THE_ANCIENT_DUSK_STAGES },
  { [TOADRAGON_ID]: TOADRAGON_STAGES },
]);

export const SUNKEN_KINGDOM: KingdomCatalog = {
  id: 'sunken-kingdom',
  name: 'Sunken Kingdom',
  type: 'main',
  bestiary: {
    monsters: [
      ...BASE_WANDERING_MONSTERS,
      // Kingdom Monsters
      { id: FIRST_MEN_WARRIORS_ID, type: 'kingdom' },
      { id: HAUNTS_OF_UTREBANT_ID, type: 'kingdom' },
      { id: WHITE_APE_TROLL_ID, type: 'kingdom' },
      { id: KING_LAID_LOW_ID, type: 'kingdom' },
      { id: DEVIL_OF_THE_ANCIENT_DUSK_ID, type: 'kingdom' },
      { id: TOADRAGON_ID, type: 'kingdom' },
    ],
    stages: createSubKingdomStages(SUNKEN_KINGDOM_STAGES, BASE_WANDERING_STAGES),
  },
  districts: ['Drowned District', 'Marsh District', 'Mud District'],
  adventures: [
    { name: 'Former Glories', roll: { min: 1, max: 3 }, singleAttempt: false },
    { name: 'Sundered Hope', roll: { min: 4, max: 6 }, singleAttempt: true },
    { name: 'Mudfishing', roll: { min: 7, max: 9 }, singleAttempt: false },
    { name: 'Shrine of Remembrance', roll: { min: 10, max: 12 }, singleAttempt: false },
    { name: 'Knots in the Wood', roll: { min: 13, max: 15 }, singleAttempt: false },
    { name: 'Shoulder to the Wheel', roll: { min: 16, max: 18 }, singleAttempt: false },
    { name: 'Rotten to the Core', roll: { min: 19, max: 21 }, singleAttempt: true },
    { name: 'Weight of Guilt', roll: { min: 22, max: 24 }, singleAttempt: true },
    { name: 'Skywatch', roll: { min: 25, max: 27 }, singleAttempt: false },
    { name: 'Life Raft', roll: { min: 28, max: 30 }, singleAttempt: true },
    { name: "In Another's Wake", roll: { min: 31, max: 33 }, singleAttempt: false },
    { name: 'Beguiled', roll: { min: 34, max: 36 }, singleAttempt: false },
    { name: "Nature's Sweet Embrace", roll: { min: 37, max: 40 }, singleAttempt: false },
    { name: 'Rapture of the Deep', roll: { min: 41, max: 44 }, singleAttempt: false },
    { name: 'Disturbed Slumber', roll: { min: 45, max: 48 }, singleAttempt: false },
    { name: 'The Burden of Knowledge', roll: { min: 49, max: 52 }, singleAttempt: true },
    { name: 'Hospitality', roll: { min: 53, max: 56 }, singleAttempt: false },
    { name: 'Wheels of Progress', roll: { min: 57, max: 60 }, singleAttempt: true },
    { name: 'The Scuttling Stones', roll: { min: 61, max: 64 }, singleAttempt: false },
    { name: 'Frail Foundations', roll: { min: 65, max: 68 }, singleAttempt: true },
    { name: 'Cleansing', roll: { min: 69, max: 71 }, singleAttempt: false },
    { name: 'Mudskippers', roll: { min: 72, max: 74 }, singleAttempt: true },
    { name: "Fool's Flame", roll: { min: 75, max: 77 }, singleAttempt: false },
    { name: 'Divine Compassion', roll: { min: 78, max: 80 }, singleAttempt: true },
    { name: 'Buried Truths', roll: { min: 81, max: 83 }, singleAttempt: true },
    { name: 'Shrunken Kingdom', roll: { min: 84, max: 86 }, singleAttempt: true },
    { name: 'Before the Mast', roll: { min: 87, max: 89 }, singleAttempt: true },
    { name: 'Hunter, or Hunted?', roll: { min: 90, max: 92 }, singleAttempt: false },
    { name: 'High Stakes', roll: { min: 93, max: 95 }, singleAttempt: true },
    {
      name: "Idle Playthings in the Devil's Hands",
      roll: { min: 96, max: 100 },
      singleAttempt: true,
    },
  ],
  contracts: [
    {
      name: 'Oh, To Be Inspired',
      objective: 'Guide the bard to a place where she can find her inspiration to create again.',
      setup: '<to be filled in later, but about 4 paragraphs of text>',
      reward: '<to be filled in later, about 2 paragraphs of text>',
      tier: Tier.mob,
      singleAttempt: true,
    },
    {
      name: 'Search and Rescue',
      objective: '<to be filled in later>',
      setup: '<to be filled in later>',
      reward: '<to be filled in later>',
      tier: Tier.mob,
      singleAttempt: false,
    },
    {
      name: 'Escort Service',
      objective: '<to be filled in later>',
      setup: '<to be filled in later>',
      reward: '<to be filled in later>',
      tier: Tier.mob,
      singleAttempt: false,
    },
    {
      name: 'Resource Run',
      objective: '<to be filled in later>',
      setup: '<to be filled in later>',
      reward: '<to be filled in later>',
      tier: Tier.vassal,
      singleAttempt: false,
    },
    {
      name: 'Delivery Job',
      objective: '<to be filled in later>',
      setup: '<to be filled in later>',
      reward: '<to be filled in later>',
      tier: Tier.king,
      singleAttempt: false,
    },
    {
      name: 'Carvo a Slimy Path',
      objective: '<to be filled in later>',
      setup: '<to be filled in later>',
      reward: '<to be filled in later>',
      tier: Tier.king,
      singleAttempt: true,
    },
    {
      name: 'Extermination Efforts',
      objective: '<to be filled in later>',
      setup: '<to be filled in later>',
      reward: '<to be filled in later>',
      tier: Tier.devil,
      singleAttempt: false,
    },
    {
      name: 'Extraction Needed',
      objective: '<to be filled in later>',
      setup: '<to be filled in later>',
      reward: '<to be filled in later>',
      tier: Tier.dragon,
      singleAttempt: false,
    },
    {
      name: 'Power Struggle',
      objective: '<to be filled in later>',
      setup: '<to be filled in later>',
      reward: '<to be filled in later>',
      tier: Tier.dragon,
      singleAttempt: true,
    },
  ],
  subKingdoms: [ANCESTOR_RUINS],
  expansions: {
    ttsf: {
      enabled: false,
      additionalMonsters: [
        // TTSF Kingdom Monsters (added to all stages when expansion enabled)
        {
          id: FIRST_MEN_LICTOR_HUNTERS_ID,
          type: 'kingdom',
          expansion: 'ttsf',
          stages: FIRST_MEN_LICTOR_HUNTERS_STAGES,
        },
        { id: BOG_WITCH_ID, type: 'kingdom', expansion: 'ttsf', stages: BOG_WITCH_STAGES },
        // TTSF Wandering Monsters (added to all stages when expansion enabled)
        { id: KNIGHTEATER_ID, type: 'wandering', expansion: 'ttsf', stages: KNIGHTEATER_STAGES },
        {
          id: YOUNG_DEVOURER_DRAGON_ID,
          type: 'wandering',
          expansion: 'ttsf',
          stages: YOUNG_DEVOURER_DRAGON_STAGES,
        },
      ],
    },
  },
};
