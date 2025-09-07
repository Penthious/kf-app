import { POS_ID } from './kingdoms/principality-of-stone';
import { SUNKEN_ID } from './kingdoms/sunken-kingdom';
import { RATWOLVES_ID, WINGED_NIGHTMARE_ID } from './monsters';

enum Tier {
  mob = 'mob',
  vassal = 'vassal',
  king = 'king',
  dragon = 'dragon',
  legendary = 'legendary',
}

enum Ability {
  deadly = 'deadly',
}

export const KINGDOM_GEAR = {
  [POS_ID]: [
    {
      id: 'tenebrae-infused-gauntlets',
      name: 'Tenebrae Infused Gauntlets',
      traits: ['gloves', 'metal', 'cursed'],
      type: 'consumable',
      abilities: [Ability.deadly],
      judicium: ['2 <heat><tap> When your Attack hits, gain a Crit Chance.'],
      tier: Tier.dragon,
    },
  ],
  [SUNKEN_ID]: [],
};

export const MONSTER_GEAR = {
  [RATWOLVES_ID]: [
    {
      id: 'ratwolf-claw',
      name: 'Ratwolf Claw',
      type: 'monster',
      kingdomId: 'principality-of-stone',
      monsterId: 'ratwolves',
    },
  ],
  [WINGED_NIGHTMARE_ID]: [],
};

export const WANDERING_GEAR = [
  // All wandering gear
];

export const CONSUMABLE_GEAR = [
  // All consumable gear
];

export const MERCHANT_GEAR = [
  // All merchant gear
];

export const UPGRADE_GEAR = [
  // All upgrade gear
];
