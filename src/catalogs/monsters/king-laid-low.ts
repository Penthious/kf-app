import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const KING_LAID_LOW_ID = 'king-laid-low';

export const kingLaidLow: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: KING_LAID_LOW_ID,
    name: 'King Laid Low',
    level: 4,
    toHit: 3,
    wounds: 12,
    exhibitionStartingWounds: 8,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// King Laid Low stage patterns (20 stages)
// Pattern: "       1112223334444"
export const KING_LAID_LOW_STAGES = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  1,
  1,
  1,
  2,
  2,
  2,
  3,
  3,
  3,
  4,
  4,
  4,
];
