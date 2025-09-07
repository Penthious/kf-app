import { activationCounter, ActivationToken, MonsterStats } from '@/models/monster';
import { ArmorPlates } from '../traits';

export const PUPPET_KING_EDELHARDT_ID = 'puppet-king-edelhardt';

export const puppetKingEdelhardt: ReadonlyArray<MonsterStats> = [
  Object.freeze({
    id: PUPPET_KING_EDELHARDT_ID,
    name: 'Puppet King Edelhardt',
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

// Puppet King Edelhardt stage patterns (20 stages)
// Pattern: "       1112223334444"
export const PUPPET_KING_EDELHARDT_STAGES = [
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
  3,
  4,
  4,
  4,
];
