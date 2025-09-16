import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { MonsterType, Tier } from '../tier';

export const YOUNG_DEVOURER_DRAGON_ID = 'young-devourer-dragon';

export const youngDevourerDragon: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: YOUNG_DEVOURER_DRAGON_ID,
    name: 'Young Devourer Dragon',
    tier: Tier.dragon,
    type: [MonsterType.hunger, MonsterType.calamity],
    level: 1,
    toHit: 9,
    accuracy: 10,
    wounds: 8,
    exhibitionStartingWounds: 0,
    aiActivation: [activationCounter(ActivationToken.standard, 1)],
    signatureActivation: [activationCounter(ActivationToken.signature, 0)],
    traits: [],
  }),
  Object.freeze({
    id: YOUNG_DEVOURER_DRAGON_ID,
    name: 'Young Devourer Dragon',
    tier: Tier.dragon,
    type: [MonsterType.hunger, MonsterType.calamity],
    level: 2,
    toHit: 9,
    accuracy: 10,
    wounds: 10,
    exhibitionStartingWounds: 0,
    aiActivation: [activationCounter(ActivationToken.standard, 1)],
    signatureActivation: [activationCounter(ActivationToken.signature, 0)],
    traits: [],
    atBonus: 1,
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
