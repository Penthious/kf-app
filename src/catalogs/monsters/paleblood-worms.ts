import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const PALEBLOOD_WORM_ID = 'paleblood-worms';

export const palebloodWorms: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PALEBLOOD_WORM_ID,
    name: 'Paleblood Worms',
    level: 3,
    toHit: 3,
    wounds: 10,
    exhibitionStartingWounds: 8,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// Paleblood Worms stage patterns (20 stages)
// Pattern: "111222 333  444     "
export const PALEBLOOD_WORMS_STAGES = [
  1,
  1,
  1,
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
  null,
];
