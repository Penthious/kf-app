import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';

export const DEVIL_OF_THE_ANCIENT_DUSK_ID = 'devil-of-the-ancient-dusk';

export const devilOfTheAncientDusk: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: DEVIL_OF_THE_ANCIENT_DUSK_ID,
    name: 'Devil of the Ancient Dusk',
    level: 5,
    toHit: 3,
    wounds: 14,
    exhibitionStartingWounds: 9,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
];

// Devil of the Ancient Dusk stage patterns (20 stages)
// Pattern: "           111222333"
export const DEVIL_OF_THE_ANCIENT_DUSK_STAGES = [
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
  2,
  2,
  3,
  3,
];
