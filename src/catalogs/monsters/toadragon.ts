import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { MonsterType, Tier } from '../tier';

export const TOADRAGON_ID = 'toadragon';

export const toadragon: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: TOADRAGON_ID,
    name: 'Toadragon',
    tier: Tier.dragon,
    type: [MonsterType.toad, MonsterType.beast],
    level: 1,
    toHit: 9,
    accuracy: 11,
    wounds: 10,
    exhibitionStartingWounds: 4,
    aiActivation: [activationCounter(ActivationToken.standard, 1)],
    signatureActivation: [activationCounter(ActivationToken.signature, 0)],
    traits: [],
  }),
  Object.freeze({
    id: TOADRAGON_ID,
    name: 'Toadragon',
    tier: Tier.dragon,
    type: [MonsterType.toad, MonsterType.beast],
    level: 2,
    toHit: 11,
    accuracy: 11,
    wounds: 11,
    exhibitionStartingWounds: 4,
    aiActivation: [activationCounter(ActivationToken.standard, 1)],
    signatureActivation: [activationCounter(ActivationToken.signature, 0)],
    traits: [],
    atBonus: 2,
    escalationBonus: 1,
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
