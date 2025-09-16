import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { MonsterType, Tier } from '../tier';

export const PANZERDRAGON_VELDR_ID = 'panzerdragon-veldr';

export const panzerdragonVeldr: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PANZERDRAGON_VELDR_ID,
    name: 'Panzerdragon Veldr',
    tier: Tier.dragon,
    type: [MonsterType.parasite, MonsterType.undead],
    level: 1,
    toHit: 9,
    accuracy: 10,
    wounds: 10,
    exhibitionStartingWounds: 4,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 0)],
    traits: [],
  }),
  Object.freeze({
    id: PANZERDRAGON_VELDR_ID,
    name: 'Panzerdragon Veldr',
    tier: Tier.dragon,
    type: [MonsterType.parasite, MonsterType.undead],
    level: 2,
    toHit: 11,
    accuracy: 11,
    wounds: 11,
    exhibitionStartingWounds: 4,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 0)],
    traits: [],
    escalationBonus: 1,
  }),
];

// Panzerdragon Veldr stage patterns (20 stages)
// Pattern: "               11122"
export const PANZERDRAGON_VELDR_STAGES = [
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
