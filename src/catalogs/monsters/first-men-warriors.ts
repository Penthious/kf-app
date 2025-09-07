import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const FIRST_MEN_WARRIORS_ID = 'first-men-warriors';

export const firstMenWarriors: ReadonlyArray<MonsterStats> = [
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

// First Men Warriors stage patterns (20 stages)
// Pattern: "11 222 333 444      "
export const FIRST_MEN_WARRIORS_STAGES = [
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
  null,
];
