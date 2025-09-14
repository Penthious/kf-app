import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { ArmorPlates } from '../traits';

export const DEVIL_OF_THE_SMELTED_FEARS_ID = 'devil-of-the-smelted-fears';

export const devilOfTheSmeltedFears: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: DEVIL_OF_THE_SMELTED_FEARS_ID,
    name: 'Devil of the Smelted Fears',
    level: 1,
    toHit: 7,
    wounds: 10,
    exhibitionStartingWounds: 3,
    aiActivation: [activationCounter(ActivationToken.standard, 1)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    traits: [ArmorPlates(1)],
  }),
  Object.freeze({
    id: DEVIL_OF_THE_SMELTED_FEARS_ID,
    name: 'Devil of the Smelted Fears',
    level: 8,
    toHit: 3,
    wounds: 20,
    exhibitionStartingWounds: 12,
    aiActivation: [activationCounter(ActivationToken.standard, 2)],
    signatureActivation: [activationCounter(ActivationToken.signature, 1)],
    evasionDiceBonus: 1,
    traits: [ArmorPlates(1)],
  }),
  Object.freeze({
    id: DEVIL_OF_THE_SMELTED_FEARS_ID,
    name: 'Devil of the Smelted Fears',
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

// Devil of the Smelted Fears stage patterns (20 stages)
// Pattern: "           111222333"
export const DEVIL_OF_THE_SMELTED_FEARS_STAGES = [
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
