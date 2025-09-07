import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const HAUNTS_OF_UTREBANT_ID = 'haunts-of-utrebant';

export const hauntsOfUtrebant: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: HAUNTS_OF_UTREBANT_ID,
    name: 'Haunts of Utrebant',
    level: 3,
    toHit: 3,
    wounds: 8,
    exhibitionStartingWounds: 6,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// Haunts of Utrebant stage patterns (20 stages)
// Pattern: " 111 222 333 444    "
export const HAUNTS_OF_UTREBANT_STAGES = [
  null,
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
];
