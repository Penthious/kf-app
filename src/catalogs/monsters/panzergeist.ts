import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const PANZERGEIST_ID = 'panzergeist';

export const panzergeist: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PANZERGEIST_ID,
    name: 'Panzergeist',
    level: 3,
    toHit: 3,
    wounds: 8,
    exhibitionStartingWounds: 6,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// Panzergeist stage patterns (20 stages)
// Pattern: '111 222 333 444     '
export const PANZERGEIST_STAGES = [
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
