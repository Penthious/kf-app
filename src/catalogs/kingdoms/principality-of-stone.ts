import {
  DEVIL_OF_THE_SMELTED_FEARS_ID,
  EGGKNIGHT_ID,
  IRONCAST_DEAD_ID,
  PANZERDRAGON_VELDR_ID,
  PUPPET_KING_EDELHARDT_ID,
} from '@/catalogs/monsters';
import { DEVIL_OF_THE_SMELTED_FEARS_STAGES } from '@/catalogs/monsters/devil-of-the-smelted-fears';
import { EGGKNIGHT_STAGES } from '@/catalogs/monsters/eggknight';
import { IRONCAST_DEAD_STAGES } from '@/catalogs/monsters/ironcast-dead';
import { KNIGHTEATER_ID, KNIGHTEATER_STAGES } from '@/catalogs/monsters/knighteater';
import { PANZERDRAGON_VELDR_STAGES } from '@/catalogs/monsters/panzerdragon-veldr';
import { PANZERGEIST_ID, PANZERGEIST_STAGES } from '@/catalogs/monsters/panzergeist';
import { PUPPET_KING_EDELHARDT_STAGES } from '@/catalogs/monsters/puppet-king-edelhardt';
import {
  STONEMASON_KNIGHT_ID,
  STONEMASON_KNIGHT_STAGES,
} from '@/catalogs/monsters/stonemason-knight';
import {
  BASE_WANDERING_MONSTERS,
  BASE_WANDERING_STAGES,
  TTSF_WANDERING_MONSTERS,
  TTSF_WANDERING_STAGES,
} from '@/catalogs/monsters/wandering';
import {
  YOUNG_DEVOURER_DRAGON_ID,
  YOUNG_DEVOURER_DRAGON_STAGES,
} from '@/catalogs/monsters/young-devourer-dragon';
import { Tier } from '@/catalogs/tier';
import type { KingdomCatalog, SubKingdomCatalog } from '@/models/kingdom';
import { createStageRows, createSubKingdomStages } from '@/models/kingdom';

export const POS_ID = 'principality-of-stone';
export const SCHWARZREICH_ID = 'schwarzreich';

// Schwarzreich kingdom-specific stages (without wandering monsters)
// Panzergeist: '111 222 333 444     '
// Stonemason Knight: ' 111 222. 333. 44444'
const SCHWARZREICH_KINGDOM_STAGES = createStageRows([
  { [PANZERGEIST_ID]: PANZERGEIST_STAGES },
  { [STONEMASON_KNIGHT_ID]: STONEMASON_KNIGHT_STAGES },
]);

// Schwarzreich sub-kingdom (accessible only during PoS expeditions)
export const SCHWARZREICH: SubKingdomCatalog = {
  id: SCHWARZREICH_ID,
  name: 'Schwarzreich',
  parentKingdomId: POS_ID,
  accessCondition: 'pos-only',
  bestiary: {
    monsters: [
      // Inherits all monsters from parent kingdom (Principality of Stone)
      ...BASE_WANDERING_MONSTERS,
      // Kingdom Monsters from parent
      { id: IRONCAST_DEAD_ID, type: 'kingdom' },
      { id: EGGKNIGHT_ID, type: 'kingdom' },
      { id: PUPPET_KING_EDELHARDT_ID, type: 'kingdom' },
      { id: DEVIL_OF_THE_SMELTED_FEARS_ID, type: 'kingdom' },
      { id: PANZERDRAGON_VELDR_ID, type: 'kingdom' },
      // Sub-kingdom specific monsters (TTSF expansion)
      { id: PANZERGEIST_ID, type: 'kingdom', expansion: 'ttsf' },
      { id: STONEMASON_KNIGHT_ID, type: 'kingdom', expansion: 'ttsf' },
      ...TTSF_WANDERING_MONSTERS,
    ],
    stages: createSubKingdomStages(SCHWARZREICH_KINGDOM_STAGES, TTSF_WANDERING_STAGES),
  },
  adventures: [
    { name: 'Gardens of Envy', roll: { min: 1, max: 5 }, singleAttempt: false },
    { name: "Traitor's Crossing", roll: { min: 6, max: 11 }, singleAttempt: true },
    { name: 'Fated Pilgrimage', roll: { min: 12, max: 18 }, singleAttempt: true },
    { name: 'Solitary Confinement', roll: { min: 19, max: 25 }, singleAttempt: true },
    { name: 'Wyrmery', roll: { min: 26, max: 32 }, singleAttempt: false },
    { name: 'Quake', roll: { min: 33, max: 39 }, singleAttempt: false },
    { name: "Defiance's Spoils", roll: { min: 40, max: 46 }, singleAttempt: true },
    { name: 'Heroic End', roll: { min: 47, max: 53 }, singleAttempt: false },
    { name: 'Corrosive Spiral', roll: { min: 54, max: 60 }, singleAttempt: false },
    { name: 'In Tandem', roll: { min: 61, max: 67 }, singleAttempt: true },
    { name: 'Heartburn', roll: { min: 68, max: 74 }, singleAttempt: true },
    { name: 'Free at Last', roll: { min: 75, max: 81 }, singleAttempt: false },
    { name: 'Stonemen', roll: { min: 82, max: 88 }, singleAttempt: false },
    { name: 'Escape This Cage of Flesh', roll: { min: 89, max: 94 }, singleAttempt: true },
    { name: 'Profane Terror', roll: { min: 95, max: 100 }, singleAttempt: true },
  ],
  contracts: [
    // Schwarzreich contracts can be added here if needed
  ],
};

// Principality of Stone kingdom-specific stages (without wandering monsters)
const POS_KINGDOM_STAGES = createStageRows([
  { [IRONCAST_DEAD_ID]: IRONCAST_DEAD_STAGES },
  { [EGGKNIGHT_ID]: EGGKNIGHT_STAGES },
  { [PUPPET_KING_EDELHARDT_ID]: PUPPET_KING_EDELHARDT_STAGES },
  { [DEVIL_OF_THE_SMELTED_FEARS_ID]: DEVIL_OF_THE_SMELTED_FEARS_STAGES },
  { [PANZERDRAGON_VELDR_ID]: PANZERDRAGON_VELDR_STAGES },
]);

export const PRINCIPALITY_OF_STONE: KingdomCatalog = {
  id: POS_ID,
  name: 'Principality of Stone',
  type: 'main',
  bestiary: {
    monsters: [
      ...BASE_WANDERING_MONSTERS,
      // Kingdom Monsters
      { id: IRONCAST_DEAD_ID, type: 'kingdom' },
      { id: EGGKNIGHT_ID, type: 'kingdom' },
      { id: PUPPET_KING_EDELHARDT_ID, type: 'kingdom' },
      { id: DEVIL_OF_THE_SMELTED_FEARS_ID, type: 'kingdom' },
      { id: PANZERDRAGON_VELDR_ID, type: 'kingdom' },
    ],
    stages: createSubKingdomStages(POS_KINGDOM_STAGES, BASE_WANDERING_STAGES),
  },
  districts: ['Noble', 'Craftsman', 'Port', 'Merchant'],
  adventures: [
    { name: 'A Song in Silica', roll: { min: 1, max: 3 }, singleAttempt: false },
    { name: 'Scrabbling in Stone', roll: { min: 4, max: 6 }, singleAttempt: false },
    { name: 'Precarious Plunder', roll: { min: 7, max: 9 }, singleAttempt: false },
    { name: 'When You Gaze into the Abyss ...', roll: { min: 10, max: 12 }, singleAttempt: false },
    { name: 'The Valley of Rust', roll: { min: 13, max: 15 }, singleAttempt: false },
    { name: 'The Boneyard', roll: { min: 16, max: 18 }, singleAttempt: false },
    { name: 'Pestilence', roll: { min: 19, max: 21 }, singleAttempt: true },
    { name: 'Fractured Shell', roll: { min: 22, max: 24 }, singleAttempt: true },
    { name: 'One for Sorrow', roll: { min: 25, max: 27 }, singleAttempt: false },
    { name: 'Prized Possession', roll: { min: 28, max: 30 }, singleAttempt: true },
    { name: 'Ensnared', roll: { min: 31, max: 33 }, singleAttempt: false },
    { name: 'Bridge Under Troubled Water', roll: { min: 34, max: 36 }, singleAttempt: false },
    { name: 'Mortsafe', roll: { min: 37, max: 40 }, singleAttempt: false },
    { name: 'Lost in the Labyrinth of Faces', roll: { min: 41, max: 44 }, singleAttempt: false },
    { name: 'Hunted', roll: { min: 45, max: 48 }, singleAttempt: false },
    { name: 'Old Stairs', roll: { min: 49, max: 52 }, singleAttempt: false },
    { name: 'Collapsing Roof', roll: { min: 53, max: 56 }, singleAttempt: false },
    { name: 'A Ghostly Duel', roll: { min: 57, max: 60 }, singleAttempt: true },
    { name: 'An Ominous Presence', roll: { min: 61, max: 64 }, singleAttempt: false },
    { name: 'Shack in the Rubble', roll: { min: 65, max: 68 }, singleAttempt: false },
    { name: 'The Stone Man', roll: { min: 69, max: 71 }, singleAttempt: true },
    { name: 'The Pile', roll: { min: 72, max: 74 }, singleAttempt: false },
    { name: 'Trespassing', roll: { min: 75, max: 77 }, singleAttempt: false },
    { name: 'The Trade', roll: { min: 78, max: 80 }, singleAttempt: true },
    { name: 'Infested Keep', roll: { min: 81, max: 83 }, singleAttempt: true },
    { name: 'A Pebble', roll: { min: 84, max: 86 }, singleAttempt: false },
    { name: 'Alloy Chivalry', roll: { min: 87, max: 89 }, singleAttempt: true },
    { name: 'Heavy Water', roll: { min: 90, max: 92 }, singleAttempt: false },
    { name: 'Eaves-drip Kindness', roll: { min: 93, max: 95 }, singleAttempt: true },
    { name: 'The Devil You Know', roll: { min: 96, max: 100 }, singleAttempt: false },
  ],
  contracts: [
    {
      name: 'Escort Service',
      objective: 'Escort your charge through the kingdom unharmed',
      setup:
        'Take this contract at the start of an Expedition. Your charge follows you through the Kingdom.',
      reward:
        'At the end of the Expedition, if you have at least 1 Clue left on the Kingdom sheet, Scavenge 1. If you have 3+ clues, Scavenge 3 instead.',
      tier: Tier.mob,
      singleAttempt: false,
    },
    {
      name: 'Search And Rescue',
      objective: 'Find the missing person',
      setup:
        'The missing person is lost somewhere in the Kingdom. Search for them during your Expedition.',
      reward: 'Scavenge 1',
      tier: Tier.mob,
      singleAttempt: false,
    },
    {
      name: 'The Hunt for Saint Urbain',
      objective: 'Follow the Holy Omen to get to Saint Urbain',
      setup:
        'A holy omen has appeared, guiding you to the location of Saint Urbain. Follow the signs.',
      reward: 'Devote to Saint Urban',
      tier: Tier.vassal,
      singleAttempt: true,
    },
    {
      name: 'Resource Run',
      objective: 'Scavenge the kingdom for useful resources',
      setup: 'The kingdom needs resources. Search through the lands to find what can be salvaged.',
      reward: 'Scavenge 1',
      tier: Tier.vassal,
      singleAttempt: false,
    },
    {
      name: 'Delivery Job',
      objective: 'Pick up and move the package through the Kingdom',
      setup:
        'You have been entrusted with a valuable package that must be delivered safely through the Kingdom.',
      reward: 'Scavenge 3',
      tier: Tier.king,
      singleAttempt: false,
    },
    {
      name: 'Pumpkin Plague',
      objective: 'Weaken the Pumpkinhead Horde remaining through the Kingdom',
      setup:
        'A plague of Pumpkinheads has overrun parts of the Kingdom. Reduce their numbers to help restore order.',
      reward: 'Multiple choice, See contract in PoS book',
      tier: Tier.devil,
      singleAttempt: true,
    },
    {
      name: 'Extermination Efforts',
      objective: 'Kill as many Monsters as you can find',
      setup:
        'The Kingdom is overrun with dangerous monsters. Your mission is to eliminate as many as possible.',
      reward: 'Scavenge 1',
      tier: Tier.devil,
      singleAttempt: false,
    },
    {
      name: 'Extraction Needed',
      objective: 'Rescue a civilian lost in the Kingdom',
      setup:
        "A civilian has gone missing in the dangerous Kingdom. Find and rescue them before it's too late.",
      reward:
        'If you have the rescued Mercenary with you, add it to the Mercenary deck, otherwise gain nothing.',
      tier: Tier.dragon,
      singleAttempt: false,
    },
  ],
  subKingdoms: [SCHWARZREICH],
  expansions: {
    ttsf: {
      enabled: false,
      additionalMonsters: [
        // TTSF Kingdom Monsters (added to all stages when expansion enabled)
        { id: PANZERGEIST_ID, type: 'kingdom', expansion: 'ttsf', stages: PANZERGEIST_STAGES },
        {
          id: STONEMASON_KNIGHT_ID,
          type: 'kingdom',
          expansion: 'ttsf',
          stages: STONEMASON_KNIGHT_STAGES,
        },
        // TTSF Wandering Monsters (added to all stages when expansion enabled)
        { id: KNIGHTEATER_ID, type: 'wandering', expansion: 'ttsf', stages: KNIGHTEATER_STAGES },
        {
          id: YOUNG_DEVOURER_DRAGON_ID,
          type: 'wandering',
          expansion: 'ttsf',
          stages: YOUNG_DEVOURER_DRAGON_STAGES,
        },
      ],
      additionalContracts: [
        // Jura contracts will be added here when you provide them
      ],
    },
  },
};
