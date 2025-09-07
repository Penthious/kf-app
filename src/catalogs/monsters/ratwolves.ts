import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { Frenzy, PackHunters } from '../traits';

export const RATWOLVES_ID = 'ratwolves';

export const ratwolves: ReadonlyArray<MonsterStats> = [
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

// Ratwolves stage patterns (20 stages)
// Pattern: "11222 333444        "
export const RATWOLVES_STAGES = [
  1,
  1,
  2,
  2,
  2,
  null,
  3,
  3,
  3,
  4,
  4,
  4,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];
