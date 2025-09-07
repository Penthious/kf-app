import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { ArmorPlates } from '../traits';

export const WINGED_NIGHTMARE_ID = 'winged-nightmare';

export const wingedNightmare: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: WINGED_NIGHTMARE_ID,
    name: 'Winged Nightmare',
    level: 2,
    toHit: 3,
    wounds: 8,
    exhibitionStartingWounds: 6,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
];

// Winged Nightmare stage patterns (20 stages)
// Pattern: "  111222 333  444444"
export const WINGED_NIGHTMARE_STAGES = [
  null,
  null,
  1,
  1,
  1,
  2,
  2,
  2,
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
  4,
  4,
];
