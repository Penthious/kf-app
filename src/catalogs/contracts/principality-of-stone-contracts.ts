import { KingdomContractDef } from '@/models/kingdom';
import { Tier } from '@/catalogs/tier';

/**
 * Principality of Stone Contracts
 * These contracts are specific to the Principality of Stone kingdom
 */
export const PRINCIPALITY_OF_STONE_CONTRACTS: KingdomContractDef[] = [
  {
    name: 'Escort Service',
    objective: 'Escort your charge through the kingdom unharmed',
    setup:
      'Take this contract at the start of an Expedition. Your charge follows you through the Kingdom.',
    reward:
      'At the end of the Expedition, if you have at least 1 Clue left on the Kingdom sheet, Scavenge 1. If you have 3+ clues, Scavenge 3 instead.',
    tier: Tier.mob,
    singleAttempt: false,
  },
  {
    name: 'Search And Rescue',
    objective: 'Find the missing person',
    setup:
      'The missing person is lost somewhere in the Kingdom. Search for them during your Expedition.',
    reward: 'Scavenge 1',
    tier: Tier.mob,
    singleAttempt: false,
  },
  {
    name: 'The Hunt for Saint Urbain',
    objective: 'Follow the Holy Omen to get to Saint Urbain',
    setup:
      'A holy omen has appeared, guiding you to the location of Saint Urbain. Follow the signs.',
    reward: 'Devote to Saint Urban',
    tier: Tier.vassal,
    singleAttempt: true,
  },
  {
    name: 'Resource Run',
    objective: 'Scavenge the kingdom for useful resources',
    setup: 'The kingdom needs resources. Search through the lands to find what can be salvaged.',
    reward: 'Scavenge 1',
    tier: Tier.vassal,
    singleAttempt: false,
  },
  {
    name: 'Delivery Job',
    objective: 'Pick up and move the package through the Kingdom',
    setup:
      'You have been entrusted with a valuable package that must be delivered safely through the Kingdom.',
    reward: 'Scavenge 3',
    tier: Tier.king,
    singleAttempt: false,
  },
  {
    name: 'Pumpkin Plague',
    objective: 'Weaken the Pumpkinhead Horde remaining through the Kingdom',
    setup:
      'A plague of Pumpkinheads has overrun parts of the Kingdom. Reduce their numbers to help restore order.',
    reward: 'Multiple choice, See contract in PoS book',
    tier: Tier.devil,
    singleAttempt: true,
  },
  {
    name: 'Extermination Efforts',
    objective: 'Kill as many Monsters as you can find',
    setup:
      'The Kingdom is overrun with dangerous monsters. Your mission is to eliminate as many as possible.',
    reward: 'Scavenge 1',
    tier: Tier.devil,
    singleAttempt: false,
  },
  {
    name: 'Extraction Needed',
    objective: 'Rescue a civilian lost in the Kingdom',
    setup:
      "A civilian has gone missing in the dangerous Kingdom. Find and rescue them before it's too late.",
    reward:
      'If you have the rescued Mercenary with you, add it to the Mercenary deck, otherwise gain nothing.',
    tier: Tier.dragon,
    singleAttempt: false,
  },
];
