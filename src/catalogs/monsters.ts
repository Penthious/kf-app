import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { ArmorPlates, Frenzy, PackHunters } from './traits';

export const RATWOLVES_ID = 'ratwolves';
const ratwolves: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: RATWOLVES_ID,
    name: 'Ratwolves',
    level: 1,
    toHit: 3,
    wounds: 6,
    exhibitionStartingWounds: 4,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    atBonus: 0,
    vigorLossBonus: 0,
    evasionDiceBonus: 0,
    escalations: 0,
    traits: [PackHunters, Frenzy],
  }),
];

export const WINGED_NIGHTMARE_ID = 'winged-nightmare';
const wingedNightmare: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: WINGED_NIGHTMARE_ID,
    name: 'Winged Nightmare',
    level: 2,
    toHit: 3,
    wounds: 8,
    exhibitionStartingWounds: 6,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
];

export const PALEBLOOD_WORM_ID = 'paleblood-worms';
const palebloodWorms: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PALEBLOOD_WORM_ID,
    name: 'Paleblood Worms',
    level: 3,
    toHit: 3,
    wounds: 10,
    exhibitionStartingWounds: 8,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
  }),
];

export const PUMPKINHEAD_MONSTROSITIES_ID = 'pumpkinhead-monstrosities';
const pumpkinheadMonstrosities: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PUMPKINHEAD_MONSTROSITIES_ID,
    name: 'Pumpkinhead Monstrosities',
    level: 4,
    toHit: 3,
    wounds: 12,
    exhibitionStartingWounds: 10,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
];

export const KNIGHT_OF_THE_FEN_ID = 'knight-of-the-fen';
const knightOfTheFen: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: KNIGHT_OF_THE_FEN_ID,
    name: 'Knight of the Fen',
    level: 5,
    toHit: 3,
    wounds: 14,
    exhibitionStartingWounds: 12,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
];

export const IRONCAST_DEAD_ID = 'ironcast-dead';
const ironcastDead: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: IRONCAST_DEAD_ID,
    name: 'Ironcast Dead',
    level: 6,
    toHit: 3,
    wounds: 16,
    exhibitionStartingWounds: 12,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
];

export const EGGKNIGHT_ID = 'eggknight';
const eggknight: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: EGGKNIGHT_ID,
    name: 'Eggknight',
    level: 7,
    toHit: 3,
    wounds: 18,
    exhibitionStartingWounds: 12,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
];

export const PUPPET_KING_EDELHARDT_ID = 'puppet-king-edelhardt';
const puppetKingEdelhardt: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PUPPET_KING_EDELHARDT_ID,
    name: 'Puppet King Edelhardt',
    level: 8,
    toHit: 3,
    wounds: 20,
    exhibitionStartingWounds: 12,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
];

export const DEVIL_OF_THE_SMELTED_FEARS_ID = 'devil-of-the-smelted-fears';
const devilOfTheSmeltedFears: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: DEVIL_OF_THE_SMELTED_FEARS_ID,
    name: 'Devil of the Smelted Fears',
    level: 8,
    toHit: 3,
    wounds: 20,
    exhibitionStartingWounds: 12,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
];

export const PANZERDRAGON_VELDR_ID = 'panzerdragon-veldr';
const panzerdragonVeldr: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PANZERDRAGON_VELDR_ID,
    name: 'Panzerdragon Veldr',
    level: 8,
    toHit: 3,
    wounds: 20,
    exhibitionStartingWounds: 12,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
];
export const PANZERGEIST_ID = 'panzergeist';
const panzergeist: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PANZERGEIST_ID,
    name: 'Panzergeist',
    level: 3,
    toHit: 3,
    wounds: 8,
    exhibitionStartingWounds: 6,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const STONEMASON_KNIGHT_ID = 'stonemasonknight';
const stonemasonKnight: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: STONEMASON_KNIGHT_ID,
    name: 'Stonemason Knight',
    level: 3,
    toHit: 3,
    wounds: 9,
    exhibitionStartingWounds: 6,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const KNIGHTEATER_ID = 'knighteater';
const knighteater: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: KNIGHTEATER_ID,
    name: 'Knighteater',
    level: 4,
    toHit: 3,
    wounds: 10,
    exhibitionStartingWounds: 7,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const YOUNG_DEVOURER_DRAGON_ID = 'young-devourer-dragon';
const youngDevourerDragon: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: YOUNG_DEVOURER_DRAGON_ID,
    name: 'Young Devourer Dragon',
    level: 5,
    toHit: 3,
    wounds: 12,
    exhibitionStartingWounds: 8,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const FIRST_MEN_WARRIORS_ID = 'first-men-warriors';
const firstMenWarriors: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: FIRST_MEN_WARRIORS_ID,
    name: 'First Men Warriors',
    level: 2,
    toHit: 3,
    wounds: 6,
    exhibitionStartingWounds: 4,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const FIRST_MEN_LICTOR_HUNTERS_ID = 'first-men-lictor-hunters';
const firstMenLictorHunters: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: FIRST_MEN_LICTOR_HUNTERS_ID,
    name: 'First Men Lictor Hunters',
    level: 3,
    toHit: 3,
    wounds: 7,
    exhibitionStartingWounds: 5,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const HAUNTS_OF_UTREBANT_ID = 'haunts-of-utrebant';
const hauntsOfUtrebant: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: HAUNTS_OF_UTREBANT_ID,
    name: 'Haunts of Utrebant',
    level: 3,
    toHit: 3,
    wounds: 8,
    exhibitionStartingWounds: 6,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const WHITE_APE_TROLL_ID = 'white-ape-troll';
const whiteApeTroll: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: WHITE_APE_TROLL_ID,
    name: 'White Ape Troll',
    level: 4,
    toHit: 3,
    wounds: 11,
    exhibitionStartingWounds: 7,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const BOG_WITCH_ID = 'bog-witch';
const bogWitch: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: BOG_WITCH_ID,
    name: 'Bog Witch',
    level: 3,
    toHit: 3,
    wounds: 7,
    exhibitionStartingWounds: 5,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const KING_LAID_LOW_ID = 'king-laid-low';
const kingLaidLow: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: KING_LAID_LOW_ID,
    name: 'King Laid Low',
    level: 4,
    toHit: 3,
    wounds: 12,
    exhibitionStartingWounds: 8,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const DEVIL_OF_THE_ANCIENT_DUSK_ID = 'devil-of-the-ancient-dusk';
const devilOfTheAncientDusk: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: DEVIL_OF_THE_ANCIENT_DUSK_ID,
    name: 'Devil of the Ancient Dusk',
    level: 5,
    toHit: 3,
    wounds: 14,
    exhibitionStartingWounds: 9,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const TOADRAGON_ID = 'toadragon';
const toadragon: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: TOADRAGON_ID,
    name: 'Toadragon',
    level: 4,
    toHit: 3,
    wounds: 10,
    exhibitionStartingWounds: 7,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

export const MONSTERS: ReadonlyArray<MonsterStats> = [
  ...ratwolves,
  ...wingedNightmare,
  ...palebloodWorms,
  ...pumpkinheadMonstrosities,
  ...knightOfTheFen,
  ...ironcastDead,
  ...eggknight,
  ...puppetKingEdelhardt,
  ...devilOfTheSmeltedFears,
  ...panzerdragonVeldr,
  ...panzergeist,
  ...stonemasonKnight,
  ...knighteater,
  ...youngDevourerDragon,
  ...firstMenWarriors,
  ...firstMenLictorHunters,
  ...hauntsOfUtrebant,
  ...whiteApeTroll,
  ...bogWitch,
  ...kingLaidLow,
  ...devilOfTheAncientDusk,
  ...toadragon,
];
