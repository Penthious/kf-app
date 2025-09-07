import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { ArmorPlates } from '../traits';

export const KNIGHT_OF_THE_FEN_ID = 'knight-of-the-fen';

export const knightOfTheFen: ReadonlyArray<MonsterStats> = [
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

// Knight of the Fen stage patterns (20 stages)
// Pattern: " 111  222 333  44444"
export const KNIGHT_OF_THE_FEN_STAGES = [
  null,
  1,
  1,
  1,
  null,
  null,
  2,
  2,
  2,
  null,
  3,
  3,
  3,
  null,
  null,
  4,
  4,
  4,
  4,
  4,
];
