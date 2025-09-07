import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const STONEMASON_KNIGHT_ID = 'stonemasonknight';

export const stonemasonKnight: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: STONEMASON_KNIGHT_ID,
    name: 'Stonemason Knight',
    level: 3,
    toHit: 3,
    wounds: 9,
    exhibitionStartingWounds: 6,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// Stonemason Knight stage patterns (20 stages)
// Pattern: " 111 222  333  44444"
export const STONEMASON_KNIGHT_STAGES = [
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
  4,
];
