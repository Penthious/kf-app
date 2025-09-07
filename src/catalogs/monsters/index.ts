import { MonsterStats } from '@/models/monster';

// Import monster definitions from individual files
import { BOG_WITCH_ID, bogWitch } from './bog-witch';
import { DEVIL_OF_THE_ANCIENT_DUSK_ID, devilOfTheAncientDusk } from './devil-of-the-ancient-dusk';
import {
  DEVIL_OF_THE_SMELTED_FEARS_ID,
  devilOfTheSmeltedFears,
} from './devil-of-the-smelted-fears';
import { eggknight, EGGKNIGHT_ID } from './eggknight';
import { FIRST_MEN_LICTOR_HUNTERS_ID, firstMenLictorHunters } from './first-men-lictor-hunters';
import { FIRST_MEN_WARRIORS_ID, firstMenWarriors } from './first-men-warriors';
import { HAUNTS_OF_UTREBANT_ID, hauntsOfUtrebant } from './haunts-of-utrebant';
import { IRONCAST_DEAD_ID, ironcastDead } from './ironcast-dead';
import { KING_LAID_LOW_ID, kingLaidLow } from './king-laid-low';
import { KNIGHT_OF_THE_FEN_ID, knightOfTheFen } from './knight-of-the-fen';
import { knighteater, KNIGHTEATER_ID } from './knighteater';
import { PALEBLOOD_WORM_ID, palebloodWorms } from './paleblood-worms';
import { PANZERDRAGON_VELDR_ID, panzerdragonVeldr } from './panzerdragon-veldr';
import { panzergeist, PANZERGEIST_ID } from './panzergeist';
import {
  PUMPKINHEAD_MONSTROSITIES_ID,
  pumpkinheadMonstrosities,
} from './pumpkinhead-monstrosities';
import { PUPPET_KING_EDELHARDT_ID, puppetKingEdelhardt } from './puppet-king-edelhardt';
import { ratwolves, RATWOLVES_ID } from './ratwolves';
import { STONEMASON_KNIGHT_ID, stonemasonKnight } from './stonemason-knight';
import { toadragon, TOADRAGON_ID } from './toadragon';
import { WHITE_APE_TROLL_ID, whiteApeTroll } from './white-ape-troll';
import { WINGED_NIGHTMARE_ID, wingedNightmare } from './winged-nightmare';
import { YOUNG_DEVOURER_DRAGON_ID, youngDevourerDragon } from './young-devourer-dragon';

// Re-export IDs for external use
export {
  BOG_WITCH_ID,
  DEVIL_OF_THE_ANCIENT_DUSK_ID,
  DEVIL_OF_THE_SMELTED_FEARS_ID,
  EGGKNIGHT_ID,
  FIRST_MEN_LICTOR_HUNTERS_ID,
  FIRST_MEN_WARRIORS_ID,
  HAUNTS_OF_UTREBANT_ID,
  IRONCAST_DEAD_ID, KING_LAID_LOW_ID,
  KNIGHT_OF_THE_FEN_ID, KNIGHTEATER_ID, PALEBLOOD_WORM_ID, PANZERDRAGON_VELDR_ID, PANZERGEIST_ID, PUMPKINHEAD_MONSTROSITIES_ID,
  PUPPET_KING_EDELHARDT_ID,
  RATWOLVES_ID,
  STONEMASON_KNIGHT_ID,
  TOADRAGON_ID,
  WHITE_APE_TROLL_ID,
  WINGED_NIGHTMARE_ID,
  YOUNG_DEVOURER_DRAGON_ID
};

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
