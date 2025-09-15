/**
 * Jura Contract Definition
 * These contracts are progression-based, not tier-based
 */
export interface JuraContractDef {
  name: string;
  objective: string;
  setup: string;
  reward: string;
  singleAttempt: boolean;
  unlocked: boolean;
}

/**
 * Jura Contracts from TTSF expansion
 * These contracts can be taken in any kingdom
 * Only the first contract is unlocked by default, others are locked
 */
export const JURA_CONTRACTS: JuraContractDef[] = [
  {
    name: 'Fragments of the Past',
    objective:
      'Seek out some of these "Consecrated Fragments" that have been turning up in the Sub-Kingdoms.',
    setup:
      'These mysterious fragments have been appearing throughout the Sub-Kingdoms. Your mission is to locate and secure these consecrated pieces.',
    reward: 'Gain insight into the ancient history of the realm.',
    singleAttempt: false,
    unlocked: true, // Only this contract starts unlocked
  },
  {
    name: 'The Citadel in the Mist',
    objective:
      "Delve deep into the Sub-kingdoms, far below the surface. If you go deep enough, you're sure to find the Deep Fog eruptions the other scouts speak of.",
    setup:
      'The Deep Fog eruptions are a mysterious phenomenon occurring in the deepest parts of the Sub-Kingdoms. Venture into these dangerous depths to investigate.',
    reward: 'Discover the secrets of the Deep Fog and unlock new areas of exploration.',
    singleAttempt: false,
    unlocked: false, // Locked until unlocked by game progression
  },
  {
    name: 'History Lesson',
    objective:
      "Learn about the Kingdom's history by searching for archives in some of the larger landmarks.",
    setup:
      'The larger landmarks throughout the Kingdom contain ancient archives with valuable historical knowledge. Search these locations to uncover the past.',
    reward: 'Gain valuable historical knowledge and unlock further understanding of the realm.',
    singleAttempt: false,
    unlocked: false, // Locked until unlocked by game progression
  },
  {
    name: 'Going Deeper',
    objective: 'Find the entrance to the Erdbeben Tunnels.',
    setup:
      'The Erdbeben Tunnels are a network of underground passages that lead to unknown depths. Locate the entrance to these mysterious tunnels.',
    reward: 'Access to the Erdbeben Tunnels and the secrets they contain.',
    singleAttempt: false,
    unlocked: false, // Locked until unlocked by game progression
  },
  {
    name: "King's Seal",
    objective: 'Defeat the King',
    setup:
      'Face the ultimate challenge by confronting and defeating the King in combat. This is the most dangerous contract available.',
    reward: 'The ultimate reward for defeating the King and proving your worth.',
    singleAttempt: false,
    unlocked: false, // Locked until unlocked by game progression
  },
  {
    name: 'Heart of Jura',
    objective:
      'Embark on an Expedition, and return successfully without being slain or overcome by the dark forces of the realm.',
    setup:
      'This is the ultimate test of survival and skill. Complete an entire expedition without falling to the dangers of the realm.',
    reward: 'The highest honor and recognition for completing the most challenging contract.',
    singleAttempt: false,
    unlocked: false, // Locked until unlocked by game progression
  },
];
