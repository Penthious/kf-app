import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const TOADRAGON_ID = 'toadragon';

export const toadragon: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: TOADRAGON_ID,
    name: 'Toadragon',
    level: 4,
    toHit: 3,
    wounds: 10,
    exhibitionStartingWounds: 7,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// Toadragon stage patterns (20 stages)
// Pattern: "               11122"
export const TOADRAGON_STAGES = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
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
];
