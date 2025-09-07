import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const BOG_WITCH_ID = 'bog-witch';

export const bogWitch: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: BOG_WITCH_ID,
    name: 'Bog Witch',
    level: 3,
    toHit: 3,
    wounds: 7,
    exhibitionStartingWounds: 5,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// Bog Witch stage patterns (20 stages)
// Pattern: '  111 222  333. 4444'
export const BOG_WITCH_STAGES = [
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
