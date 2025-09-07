import type { BestiaryStageRow, KingdomMonster } from '@/models/kingdom';
import { createStageRows } from '@/models/kingdom';
import { PALEBLOOD_WORM_ID } from './index';
import { KNIGHT_OF_THE_FEN_ID, KNIGHT_OF_THE_FEN_STAGES } from './knight-of-the-fen';
import { KNIGHTEATER_ID, KNIGHTEATER_STAGES } from './knighteater';
import { PALEBLOOD_WORMS_STAGES } from './paleblood-worms';
import {
    PUMPKINHEAD_MONSTROSITIES_ID,
    PUMPKINHEAD_MONSTROSITIES_STAGES,
} from './pumpkinhead-monstrosities';
import { RATWOLVES_ID, RATWOLVES_STAGES } from './ratwolves';
import { WINGED_NIGHTMARE_ID, WINGED_NIGHTMARE_STAGES } from './winged-nightmare';
import { YOUNG_DEVOURER_DRAGON_ID, YOUNG_DEVOURER_DRAGON_STAGES } from './young-devourer-dragon';

// TTSF Expansion Wandering Monsters
export const TTSF_WANDERING_MONSTERS: KingdomMonster[] = [
  { id: KNIGHTEATER_ID, type: 'wandering', expansion: 'ttsf' },
  { id: YOUNG_DEVOURER_DRAGON_ID, type: 'wandering', expansion: 'ttsf' },
];

// TTSF Expansion Wandering Monster Stage Patterns
export const TTSF_WANDERING_STAGES: BestiaryStageRow[] = createStageRows([
  { [KNIGHTEATER_ID]: KNIGHTEATER_STAGES },
  { [YOUNG_DEVOURER_DRAGON_ID]: YOUNG_DEVOURER_DRAGON_STAGES },
]);

// Base wandering monsters (always available)
export const BASE_WANDERING_MONSTERS: KingdomMonster[] = [
  { id: RATWOLVES_ID, type: 'wandering' },
  { id: WINGED_NIGHTMARE_ID, type: 'wandering' },
  { id: PALEBLOOD_WORM_ID, type: 'wandering' },
  { id: PUMPKINHEAD_MONSTROSITIES_ID, type: 'wandering' },
  { id: KNIGHT_OF_THE_FEN_ID, type: 'wandering' },
];

// Base wandering monster stage patterns (always available)
export const BASE_WANDERING_STAGES: BestiaryStageRow[] = createStageRows([
  { [RATWOLVES_ID]: RATWOLVES_STAGES },
  { [WINGED_NIGHTMARE_ID]: WINGED_NIGHTMARE_STAGES },
  { [PALEBLOOD_WORM_ID]: PALEBLOOD_WORMS_STAGES },
  { [PUMPKINHEAD_MONSTROSITIES_ID]: PUMPKINHEAD_MONSTROSITIES_STAGES },
  { [KNIGHT_OF_THE_FEN_ID]: KNIGHT_OF_THE_FEN_STAGES },
]);
