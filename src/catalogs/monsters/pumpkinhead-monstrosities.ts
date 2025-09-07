import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { ArmorPlates } from '../traits';

export const PUMPKINHEAD_MONSTROSITIES_ID = 'pumpkinhead-monstrosities';

export const pumpkinheadMonstrosities: ReadonlyArray<MonsterStats> = [
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

// Pumpkinhead Monstrosities stage patterns (20 stages)
// Pattern: "111 222 333 444     "
export const PUMPKINHEAD_MONSTROSITIES_STAGES = [
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
  4,
  4,
  4,
  null,
  null,
  null,
  null,
  null,
];
