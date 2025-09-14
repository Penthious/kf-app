import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { MonsterType, Tier } from '../tier';

export const DEVIL_OF_THE_ANCIENT_DUSK_ID = 'devil-of-the-ancient-dusk';

export const devilOfTheAncientDusk: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: DEVIL_OF_THE_ANCIENT_DUSK_ID,
    name: 'Devil of the Ancient Dusk',
    tier: Tier.devil,
    type: [MonsterType.ancient, MonsterType.curse],
    level: 1,
    toHit: 7,
    accuracy: 9,
    wounds: 10,
    exhibitionStartingWounds: 3,
    aiActivation: [activationCounter(ActivationToken.standard, 1)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [],
  }),
  Object.freeze({
    id: DEVIL_OF_THE_ANCIENT_DUSK_ID,
    name: 'Devil of the Ancient Dusk',
    tier: Tier.devil,
    type: [MonsterType.ancient, MonsterType.curse],
    level: 2,
    accuracy: 10,
    toHit: 9,
    wounds: 10,
    exhibitionStartingWounds: 3,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    atBonus: 1,
    vigorLossBonus: 1,
    traits: [],
  }),
  Object.freeze({
    id: DEVIL_OF_THE_ANCIENT_DUSK_ID,
    name: 'Devil of the Ancient Dusk',
    tier: Tier.devil,
    type: [MonsterType.ancient, MonsterType.curse],
    level: 3,
    toHit: 10,
    accuracy: 11,
    wounds: 10,
    exhibitionStartingWounds: 3,
    aiActivation: [activationCounter(ActivationToken.standard, 1)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    atBonus: 1,
    evasionDiceBonus: 1,
    vigorLossBonus: 1,
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
