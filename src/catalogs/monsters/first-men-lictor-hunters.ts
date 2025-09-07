import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const FIRST_MEN_LICTOR_HUNTERS_ID = 'first-men-lictor-hunters';

export const firstMenLictorHunters: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: FIRST_MEN_LICTOR_HUNTERS_ID,
    name: 'First Men Lictor Hunters',
    level: 3,
    toHit: 3,
    wounds: 7,
    exhibitionStartingWounds: 5,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// First Men Lictor Hunters stage patterns (20 stages)
// Pattern: "111222 333  444     "
export const FIRST_MEN_LICTOR_HUNTERS_STAGES = [
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
