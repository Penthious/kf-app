import type { MonsterTrait } from '@/models/monster';

// Simple shared traits
export const PackHunters: MonsterTrait = Object.freeze({
  id: 'pack-hunters',
  name: 'Pack Hunters',
  details: 'Gains +1 To Hit while adjacent to another ally. [icon:attack]',
  activations: [{ name: 'Howl', detail: 'All allies gain +1 Evasion this round. [icon:evasion]' }],
});

// Parameterized trait factory
export function ArmorPlates(amount: number): MonsterTrait {
  return Object.freeze({
    id: `armor-plates-${amount}`,
    name: 'Armor Plates',
    details: `Reduce incoming Wounds by ${amount} (minimum 0).`,
  });
}

// Another shared trait
export const Frenzy: MonsterTrait = Object.freeze({
  id: 'frenzy',
  name: 'Frenzy',
  abilities: [
    {
      name: 'Savage Bite',
      details: '- On hit: inflict 1 Vigor loss.\n- On crit: inflict +1 Wound. [icon:claw]',
    },
  ],
});
