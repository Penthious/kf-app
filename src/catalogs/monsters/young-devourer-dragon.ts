import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const YOUNG_DEVOURER_DRAGON_ID = 'young-devourer-dragon';

export const youngDevourerDragon: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: YOUNG_DEVOURER_DRAGON_ID,
    name: 'Young Devourer Dragon',
    level: 5,
    toHit: 3,
    wounds: 12,
    exhibitionStartingWounds: 8,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// Young Devourer Dragon stage patterns (20 stages)
// Pattern: "               11122"
export const YOUNG_DEVOURER_DRAGON_STAGES = [
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
