import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const KNIGHTEATER_ID = 'knighteater';

export const knighteater: ReadonlyArray<MonsterStats> = [
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

// Knighteater stage patterns (20 stages)
// Pattern: '. 111 222. 333. 4444'
export const KNIGHTEATER_STAGES = [
  null,
  null,
  1,
  1,
  1,
  null,
  2,
  2,
  2,
  null,
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
];
