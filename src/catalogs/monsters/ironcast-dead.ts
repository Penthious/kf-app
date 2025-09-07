import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { ArmorPlates } from '../traits';

export const IRONCAST_DEAD_ID = 'ironcast-dead';

export const ironcastDead: ReadonlyArray<MonsterStats> = [
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

// Ironcast Dead stage patterns (20 stages)
// Pattern: "111 222 333 444      "
export const IRONCAST_DEAD_STAGES = [
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
