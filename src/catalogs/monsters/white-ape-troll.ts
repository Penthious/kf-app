import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const WHITE_APE_TROLL_ID = 'white-ape-troll';

export const whiteApeTroll: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: WHITE_APE_TROLL_ID,
    name: 'White Ape Troll',
    level: 4,
    toHit: 3,
    wounds: 11,
    exhibitionStartingWounds: 7,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// White Ape Troll stage patterns (20 stages)
// Pattern: "111 222 333  444    "
export const WHITE_APE_TROLL_STAGES = [
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
