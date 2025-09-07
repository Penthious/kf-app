import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { ArmorPlates } from '../traits';

export const PANZERDRAGON_VELDR_ID = 'panzerdragon-veldr';

export const panzerdragonVeldr: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PANZERDRAGON_VELDR_ID,
    name: 'Panzerdragon Veldr',
    level: 8,
    toHit: 3,
    wounds: 20,
    exhibitionStartingWounds: 12,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
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
