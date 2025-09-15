import { KingdomContractDef } from '@/models/kingdom';

/**
 * Jura Contracts from TTSF expansion
 * These contracts can be taken in any kingdom
 * Only the first contract is unlocked by default, others are locked
 */
export const JURA_CONTRACTS: KingdomContractDef[] = [
  {
    name: 'Oh, To Be Inspired',
    objective: 'Guide the bard to a place where she can find her inspiration to create again.',
    setup: '<to be filled in later, but about 4 paragraphs of text>',
    reward: '<to be filled in later, about 2 paragraphs of text>',
    tier: 'mob',
    singleAttempt: true,
    unlocked: true, // First contract is unlocked by default
  },
  {
    name: 'Search and Rescue',
    objective: '<to be filled in later>',
    setup: '<to be filled in later>',
    reward: '<to be filled in later>',
    tier: 'mob',
    singleAttempt: false,
    unlocked: false, // Locked until previous contracts completed
  },
  {
    name: 'Escort Service',
    objective: '<to be filled in later>',
    setup: '<to be filled in later>',
    reward: '<to be filled in later>',
    tier: 'mob',
    singleAttempt: false,
    unlocked: false,
  },
  {
    name: 'Resource Run',
    objective: '<to be filled in later>',
    setup: '<to be filled in later>',
    reward: '<to be filled in later>',
    tier: 'vassal',
    singleAttempt: false,
    unlocked: false,
  },
  {
    name: 'Delivery Job',
    objective: '<to be filled in later>',
    setup: '<to be filled in later>',
    reward: '<to be filled in later>',
    tier: 'king',
    singleAttempt: false,
    unlocked: false,
  },
  {
    name: 'Carvo a Slimy Path',
    objective: '<to be filled in later>',
    setup: '<to be filled in later>',
    reward: '<to be filled in later>',
    tier: 'king',
    singleAttempt: true,
    unlocked: false,
  },
  {
    name: 'Extermination Efforts',
    objective: '<to be filled in later>',
    setup: '<to be filled in later>',
    reward: '<to be filled in later>',
    tier: 'devil',
    singleAttempt: false,
    unlocked: false,
  },
  {
    name: 'Extraction Needed',
    objective: '<to be filled in later>',
    setup: '<to be filled in later>',
    reward: '<to be filled in later>',
    tier: 'dragon',
    singleAttempt: false,
    unlocked: false,
  },
  {
    name: 'Power Struggle',
    objective: '<to be filled in later>',
    setup: '<to be filled in later>',
    reward: '<to be filled in later>',
    tier: 'dragon',
    singleAttempt: true,
    unlocked: false,
  },
];
