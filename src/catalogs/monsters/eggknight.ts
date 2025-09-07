import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { ArmorPlates } from '../traits';

export const EGGKNIGHT_ID = 'eggknight';

export const eggknight: ReadonlyArray<MonsterStats> = [
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

// Eggknight stage patterns (20 stages)
// Pattern: "111 222 333  444    "
export const EGGKNIGHT_STAGES = [
  1,
  1,
  1,
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
  null,
  null,
  null,
  null,
];
