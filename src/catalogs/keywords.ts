export interface KeywordCatalogEntry {
  id: string;
  name: string;
  summary: string;
  rulesText: string;
  stackable?: boolean;
  tags?: string[];
  seeAlso?: string[];
  page?: number;
}

export const KEYWORD_CATALOG: KeywordCatalogEntry[] = [
  {
    id: 'acrobatics',
    name: 'Acrobatics',
    summary: 'If you would suffer Knockdown while adjent to a Monster, you may Vault instead.',
    rulesText: 'If you would suffer Knockdown while adjent to a Monster, you may Vault instead.',
    stackable: false,
    tags: [],
  },
  {
    id: 'activate',
    name: 'Activate',
    summary: 'Draw AI for the next X Mobs on the Mob track.',
    rulesText: 'Draw AI for the next X Mobs on the Mob track.',
    stackable: true,
    tags: [],
  },
  {
    id: 'adjacency',
    name: 'Adjacency',
    summary: 'If the affected miniature is or becomes adjacent to the source, the Pull ends.',
    rulesText: 'If the affected miniature is or becomes adjacent to the source, the Pull ends.',
    stackable: false,
    tags: [],
  },
  {
    id: 'advancedblock',
    name: 'Advanced Block',
    summary: 'While performing an Evasion Roll, treat 2 successful hits as evaded.',
    rulesText: 'While performing an Evasion Roll, treat 2 successful hits as evaded.',
    stackable: false,
    tags: [],
  },
  {
    id: 'advancedbypass',
    name: 'Advanced Bypass',
    summary: 'A Knight or Monster may voluntarily move through other Miniatures.',
    rulesText:
      'A Knight or Monster may voluntarily move through other Miniatures. You cannot end your voluntary movement on a space occupied by another Miniature.',
    stackable: false,
    tags: [],
  },
  {
    id: 'advanceddefy',
    name: 'Advanced Defy',
    summary: 'While performing a Virtue test caused by a Judgement, treat 2 hits as evaded.',
    rulesText: 'While performing a Virtue test caused by a Judgement, treat 2 hits as evaded.',
    stackable: false,
    tags: [],
  },
  {
    id: 'advanceddodge',
    name: 'Advanced Dodge',
    summary: 'Gain +2 Evasion bonus instead.',
    rulesText: 'Gain +2 Evasion bonus instead.',
    stackable: false,
    tags: [],
  },
  {
    id: 'advancedjump',
    name: 'Advanced Jump',
    summary: 'Activate at the start of movement (vontary or not).',
    rulesText:
      'Activate at the start of movement (vontary or not). Until the end of this movement, you may ignore up to 2 adjacent spaces of a single Terrain tile (including Obstacles). This ability cannot be used while knocked down, even if passive.',
    stackable: false,
    tags: [],
  },
  {
    id: 'advancedrefle',
    name: 'Advanced Refle',
    summary: 'Move up to 2 spaces.',
    rulesText: 'Move up to 2 spaces.',
    stackable: true,
    tags: [],
  },
  {
    id: 'advancedreinforce',
    name: 'Advanced Reinforce',
    summary:
      'When you are about to resolve an Armor Roll, add X black dice to your Armor dice Pool.',
    rulesText:
      'When you are about to resolve an Armor Roll, add X black dice to your Armor dice Pool.',
    stackable: true,
    tags: [],
  },
  {
    id: 'afflict',
    name: 'Afflict',
    summary: 'This keyword changes depending on the Kinom.',
    rulesText:
      'This keyword changes depending on the Kinom. See the appropriate Trait card of the Monster you’re currently fighting for the definition.',
    stackable: true,
    tags: [],
  },
  {
    id: 'aisuppress',
    name: 'AI Suppress',
    summary: 'Shuffle the AI discard pile into the AI deck.',
    rulesText: 'Shuffle the AI discard pile into the AI deck.',
    stackable: false,
    tags: [],
  },
  {
    id: 'ammoreserves',
    name: 'Ammo Reserves',
    summary: 'Additional X Charges per empty or slot.',
    rulesText: 'Additional X Charges per empty or slot.',
    stackable: true,
    tags: [],
  },
  {
    id: 'area',
    name: 'Area',
    summary:
      'When resolving the Power Roll against the Target of your Attack, additionally resolve it against all Monsters on spaces denoted by this keyword.',
    rulesText:
      'When resolving the Power Roll against the Target of your Attack, additionally resolve it against all Monsters on spaces denoted by this keyword. Resolve the Power Roll against each of the Monsters AT individually (revealing/ drawing their BP cards if needed) using this Attack’s Total Power. Resolve Monster Responses only for the original Target of the Attack. Each Area keyword is followed by a description of spaces it targets.',
    stackable: false,
    tags: [],
  },
  {
    id: 'armorreroll',
    name: 'Armor Re-roll',
    summary: 'During an Armor Roll, you may roll up to X Armor dice.',
    rulesText: 'During an Armor Roll, you may roll up to X Armor dice.',
    stackable: true,
    tags: [],
  },
  {
    id: 'armorpiercing',
    name: 'Armor-piercing',
    summary: 'Principality of Stone keyword.',
    rulesText:
      'Principality of Stone keyword. During the second ability window, discard up to X Armor tokens from the Target.',
    stackable: true,
    tags: [],
  },
  {
    id: 'attackreroll',
    name: 'Attack Re-roll',
    summary: 'During an Attack Roll, you may re-roll up to X Attack dice with no additional cost.',
    rulesText:
      'During an Attack Roll, you may re-roll up to X Attack dice with no additional cost. Remember that you can only re-roll each die once, regardless of the re-roll source.',
    stackable: true,
    tags: [],
  },
  {
    id: 'autoxy',
    name: 'Auto-X Y',
    summary:
      'Place a number of tokens in the Knight Pool during the first ability window, where X is the type of token you can place, and Y is the number of tokens, for example Auto-break 2.',
    rulesText:
      'Place a number of tokens in the Knight Pool during the first ability window, where X is the type of token you can place, and Y is the number of tokens, for example Auto-break 2.',
    stackable: true,
    tags: [],
  },
  {
    id: 'bane',
    name: 'Bane',
    summary: 'Gain X Bane tokens.',
    rulesText: 'Gain X Bane tokens.',
    stackable: true,
    tags: [],
  },
  {
    id: 'banelimitx',
    name: 'Bane Limit X/+',
    summary: 'Your Bane Limit becomes X or is ireased by +X.',
    rulesText:
      'Your Bane Limit becomes X or is ireased by +X. Note: Bane Limit X doesn’t stack, but all +X bonuses are cumulative.',
    stackable: true,
    tags: [],
  },
  {
    id: 'black',
    name: 'Black',
    summary: 'During the second ability window, place X Black tokens in the Knight Pool.',
    rulesText:
      'During the second ability window, place X Black tokens in the Knight Pool. During the Power Roll step, the attacking Knight may use Black tokens in the Knight Pool to roll 1 Power die for each Black token used. They may turn 1 on each die re-rolled using a Black token into 1, as if they had a Break token.',
    stackable: true,
    tags: [],
  },
  {
    id: 'blacktokenbreak',
    name: 'Black token Break',
    summary: 'During the second ability window, place X Break tokens in the Knight Pool.',
    rulesText:
      'During the second ability window, place X Break tokens in the Knight Pool. During the Power Roll step, each Break token in the Knight Pool allows the attacking Knight to turn 1 symbol into 1.',
    stackable: true,
    tags: [],
  },
  {
    id: 'block',
    name: 'Block',
    summary: 'While performing an Evasion Roll, treat 1 succesul hit as evaded.',
    rulesText:
      'While performing an Evasion Roll, treat 1 succesul hit as evaded. Possible subtypes of Block:',
    stackable: false,
    tags: [],
  },
  {
    id: 'bloodletter',
    name: 'Bloodletter',
    summary: 'This keyword is irrelevant in the Principality of Stone and Sunken Kingdom.',
    rulesText:
      'This keyword is irrelevant in the Principality of Stone and Sunken Kingdom. It will become relevant in future Kingdoms.',
    stackable: false,
    tags: [],
  },
  {
    id: 'board',
    name: 'Board',
    summary: 'Place Little Ser on the Clash Board.',
    rulesText:
      'Place Little Ser on the Clash Board. During an Encounter, place Little Ser on the Encounter Monster Board before the Knight Positioning step.',
    stackable: false,
    tags: [],
  },
  {
    id: 'boardedge',
    name: 'Board Edge',
    summary:
      'If a Knight or a Monster is about to be pushed into the Board Edge, they are Displaced to an adjacent space in a way that would allow the source of Pushback to move onto a space previously occupied by the affected miniature, then continue Pushback.',
    rulesText:
      'If a Knight or a Monster is about to be pushed into the Board Edge, they are Displaced to an adjacent space in a way that would allow the source of Pushback to move onto a space previously occupied by the affected miniature, then continue Pushback. If displacement is impossible: if the source is a Knight, the Pushback stops. if the source is a Non-Mob Monster, the target dies. if the source is a Mob, the Pushback stops.',
    stackable: false,
    tags: [],
  },
  {
    id: 'bossclash',
    name: 'Boss Clash',
    summary: 'Take the top BP card from the Wound Stack and remove it from the Clash.',
    rulesText:
      'Take the top BP card from the Wound Stack and remove it from the Clash. It does not count as a Wound.',
    stackable: false,
    tags: [],
  },
  {
    id: 'boundless',
    name: 'Boundless',
    summary: 'Terrain keyword.',
    rulesText:
      'Terrain keyword. You cannot voluntarily move onto this tile. If a Knight is forced to move onto or beyond this tile or Board Edge, they die.',
    stackable: false,
    tags: [],
  },
  {
    id: 'bpsuppress',
    name: 'BP Suppress',
    summary: 'Shuffle the BP discard pile into the BP deck.',
    rulesText: 'Shuffle the BP discard pile into the BP deck.',
    stackable: false,
    tags: [],
  },
  {
    id: 'braced',
    name: 'Braced',
    summary: 'You cannot be involuntarily moved or suffer Knockdown (you can still be Displaced).',
    rulesText:
      'You cannot be involuntarily moved or suffer Knockdown (you can still be Displaced).',
    stackable: false,
    tags: [],
  },
  {
    id: 'bypass',
    name: 'Bypass',
    summary:
      'A Knight or Monster may move through spaces occupied by otr Knights or Monsters, respectively.',
    rulesText:
      'A Knight or Monster may move through spaces occupied by otr Knights or Monsters, respectively. You cannot end your voluntary movement on a space oupied by another miniature.',
    stackable: false,
    tags: [],
  },
  {
    id: 'cantrip',
    name: 'Cantrip',
    summary: 'During the second ability window, place X Cantrip tokens in the Knight Pool.',
    rulesText:
      'During the second ability window, place X Cantrip tokens in the Knight Pool. When declaring an Attack, change each Cantrip in the Knight Pool to either an Opening or Break token.',
    stackable: true,
    tags: [],
  },
  {
    id: 'chasm',
    name: 'Chasm',
    summary: 'Terrain keyword.',
    rulesText:
      'Terrain keyword. Knights caot voluntarily move through Chasm spaces. If a Knight ends their movent on a Chasm space, they die. If they are pushed back, dragged or pulled through a Chasm space, they die. If a Chasm tile is placed under a Knight, they die. Note: Knights do not die from moving over a Chasm during Knockback, unless they end their movent on that space.',
    stackable: false,
    tags: [],
  },
  {
    id: 'choke',
    name: 'Choke',
    summary:
      'If you don’t have the Choked Condition card, gain it and place a black acrylic cube on “0” on the track—this is your Choke Limit.',
    rulesText:
      'If you don’t have the Choked Condition card, gain it and place a black acrylic cube on “0” on the track—this is your Choke Limit. Then, increase the Choke Limit by X-1. Your can never go below this limit. If you already had the Choked Condition card, increase the Choke Limit by X. Then, if your is below the Choke Lit, gain enough so that it is above the Choke Limit.',
    stackable: true,
    tags: [],
  },
  {
    id: 'clashscavenge',
    name: 'Clash Scavenge',
    summary:
      'Add X Exhibition or Full Clash Loot cards to the Loot deck depending on the last Clash you’ve resolved.',
    rulesText:
      'Add X Exhibition or Full Clash Loot cards to the Loot deck depending on the last Clash you’ve resolved. If you trigger Scavenge, but there are no more Loot cards to add to the Loot deck, ignore Scavenge. You’ve looted whatever you could in this Expedition!',
    stackable: true,
    tags: [],
  },
  {
    id: 'clockwork',
    name: 'Clockwork',
    summary: 'This keyword is irrelevant in the Principality of Stone and Sunken Kingdom.',
    rulesText:
      'This keyword is irrelevant in the Principality of Stone and Sunken Kingdom. It will become relevant in future Kingdoms.',
    stackable: false,
    tags: [],
  },
  {
    id: 'closing',
    name: 'Closing',
    summary: 'During the second ability window, place X Closing tokens in the Knight Pool.',
    rulesText:
      'During the second ability window, place X Closing tokens in the Knight Pool. During the Attack Roll step, each Closing token grants a re-roll of 1 Attack Die, and adds +1 to the rult of each Attack die rolled during an Attack Roll.',
    stackable: true,
    tags: [],
  },
  {
    id: 'commit',
    name: 'Commit',
    summary: 'To attack with this weapon, gain +1.',
    rulesText: 'To attack with this weapon, gain +1.',
    stackable: false,
    tags: [],
  },
  {
    id: 'consumablescavenge',
    name: 'Consumable Scavenge',
    summary: 'Add X Consumable Gear Loot cards to the Loot deck.',
    rulesText: 'Add X Consumable Gear Loot cards to the Loot deck.',
    stackable: true,
    tags: [],
  },
  {
    id: 'cooldown',
    name: 'Cooldown',
    summary: 'Place 1 random card from your hand into the Cooldown area.',
    rulesText: 'Place 1 random card from your hand into the Cooldown area.',
    stackable: false,
    tags: [],
  },
  {
    id: 'crash',
    name: 'Crash',
    summary: 'The Knight subjected to Crash loses -1 and suffers Knockdown.',
    rulesText:
      'The Knight subjected to Crash loses -1 and suffers Knockdown. A Knight suffers Crash each time a non-Mob Monster moves onto or through their space, as well as when any effect forces them to move onto an Obstacle, or places an Obstacle on them. Break token Cantrip token Closing tokenKEYWORD LIST 80',
    stackable: false,
    tags: [],
  },
  {
    id: 'cumbersome',
    name: 'Cumbersome',
    summary:
      'During the second ability window, if you successfully wounded with this weapon, exhaust it.',
    rulesText:
      'During the second ability window, if you successfully wounded with this weapon, exhaust it. Treat it as a voluntary exhaust.',
    stackable: false,
    tags: [],
  },
  {
    id: 'daze',
    name: 'Daze',
    summary:
      'During either the first or second ability window, if adjacent, you may turn the Monster (without moving it) in a way that would make it face directly away from you.',
    rulesText:
      'During either the first or second ability window, if adjacent, you may turn the Monster (without moving it) in a way that would make it face directly away from you.',
    stackable: false,
    tags: [],
  },
  {
    id: 'deadly',
    name: 'Deadly',
    summary: 'During an Attack Roll, gain a Crit Chance on a natural 9–10 result.',
    rulesText: 'During an Attack Roll, gain a Crit Chance on a natural 9–10 result.',
    stackable: false,
    tags: [],
  },
  {
    id: 'defy',
    name: 'Defy',
    summary: 'While performing a Virtue test caused by a Judgent, treat 1 hit as evaded.',
    rulesText: 'While performing a Virtue test caused by a Judgent, treat 1 hit as evaded.',
    stackable: false,
    tags: [],
  },
  {
    id: 'delay',
    name: 'Delay',
    summary: 'Place 1 random card from your Hand into the Day Area.',
    rulesText: 'Place 1 random card from your Hand into the Day Area.',
    stackable: false,
    tags: [],
  },
  {
    id: 'deploy',
    name: 'Deploy',
    summary:
      'During Clash Setup, at the start of the Monster Positioning step, you may move X spaces.',
    rulesText:
      'During Clash Setup, at the start of the Monster Positioning step, you may move X spaces.',
    stackable: true,
    tags: [],
  },
  {
    id: 'destructible',
    name: 'Destructible',
    summary: 'Terrain keyword.',
    rulesText:
      'Terrain keyword. When a Miniature is ioluntarily moved onto this tile, or when a Boss Monster moves onto this tile, the tile is destroyed. Note: If a Knight is knocked back, they ignore non-Obstacle Terrain tiles they move through. Therefore, they will not destroy a Dtructible tile unless they end their movement on it.',
    stackable: false,
    tags: [],
  },
  {
    id: 'destructibleobstacles',
    name: 'Destructible Obstacles',
    summary: 'If a Knight is about to be dragged into a Destructible Obstacle (e.g.',
    rulesText:
      'If a Knight is about to be dragged into a Destructible Obstacle (e.g. a Column), remove the Terrain tile from the Battle Board, the Knight suffers a Crash, then continue the Drag.',
    stackable: false,
    tags: [],
  },
  {
    id: 'devote',
    name: 'Devote',
    summary: 'Gain a Devotion token.',
    rulesText: 'Gain a Devotion token.',
    stackable: false,
    tags: [],
  },
  {
    id: 'devoteto',
    name: 'Devote to',
    summary: 'Gain the Saint X card if you don’t have it aeady.',
    rulesText: 'Gain the Saint X card if you don’t have it aeady. Then, gain a Devotion token.',
    stackable: true,
    tags: [],
  },
  {
    id: 'difficultterrain',
    name: 'Difficult Terrain',
    summary: 'Terrain keyword.',
    rulesText:
      'Terrain keyword. If, during voluntary movement, a Knight moves through any number of Diffult Terrain tile spaces, they move one less space. Moters on Difficult Terrain have -1.',
    stackable: false,
    tags: [],
  },
  {
    id: 'discard',
    name: 'Discard',
    summary: 'Place 1 random card from your Hand into the Discard area.',
    rulesText: 'Place 1 random card from your Hand into the Discard area.',
    stackable: false,
    tags: [],
  },
  {
    id: 'displace',
    name: 'Displace',
    summary: 'Move the Displaced Target to an empty space adjacent to its current position.',
    rulesText:
      'Move the Displaced Target to an empty space adjacent to its current position. If a Knight is Displaced and there is no space they can legally be Displaced to, they die instead. If a Monster is Displaced and there is no space it can legally be Displaced to, place it on the closest empty space instead.',
    stackable: false,
    tags: [],
  },
  {
    id: 'diversion',
    name: 'Diversion',
    summary: 'During the second ability window, place a Diversion token in the Knight Pool.',
    rulesText:
      'During the second ability window, place a Diversion token in the Knight Pool. An attacking Knight may use a Diversion token from the Knight Pool to ignore Fail Responses until the end of their Attack. Possible subtypes of Diveions:',
    stackable: false,
    tags: [],
  },
  {
    id: 'dodge',
    name: 'Dodge',
    summary: 'When you are about to resolve an Evasion Roll, gain +1 Evasion bonus for this roll.',
    rulesText:
      'When you are about to resolve an Evasion Roll, gain +1 Evasion bonus for this roll. Possible subtypes of Dodge:',
    stackable: false,
    tags: [],
  },
  {
    id: 'doomed',
    name: 'Doomed',
    summary:
      'During this Monster Attack, Knights cannot roll the Evasion Roll or Judgement test using.',
    rulesText:
      'During this Monster Attack, Knights cannot roll the Evasion Roll or Judgement test using.',
    stackable: false,
    tags: [],
  },
  {
    id: 'drag',
    name: 'Drag',
    summary:
      'If the target is adjacent, the source moves X spaces directly away from the target, then move the target miniature X spaces along the path the source took.',
    rulesText:
      'If the target is adjacent, the source moves X spaces directly away from the target, then move the target miniature X spaces along the path the source took. At the end of the Drag, turn the source to face the affected miniature.',
    stackable: true,
    tags: [],
  },
  {
    id: 'dragtoward',
    name: 'Drag toward',
    summary:
      'Instead of moving straight from the target, the Source moves toward and past the spefied space along the shortest path, until the Target will be able to enter the specified space, or up to the drag value.',
    rulesText:
      'Instead of moving straight from the target, the Source moves toward and past the spefied space along the shortest path, until the Target will be able to enter the specified space, or up to the drag value. Then, move the Target along the path the source took until adjacent to the Source.',
    stackable: false,
    tags: [],
  },
  {
    id: 'dwell',
    name: 'Dwell',
    summary: 'Sunken Kingdom keyword.',
    rulesText:
      'Sunken Kingdom keyword. Move the Monster miniature to the closest unoccupied space on a Swamp Terrain tile. Diversion token Improved Diveion token Envenomed X: During the second ability window, if you dealt a Wound, place X Break tokens in the Knight Pool. Then, for each 1 above the of the wounded BP card, place 1 Break token in the Knight Pool, up to X.',
    stackable: false,
    tags: [],
  },
  {
    id: 'escalate',
    name: 'Escalate',
    summary:
      'Escalate X lowest level AI cards (remove each one from the AI deck and shuffle in a card one level higr), one at a time.',
    rulesText:
      'Escalate X lowest level AI cards (remove each one from the AI deck and shuffle in a card one level higr), one at a time. Then do the same for the BP deck. Do not look at the removed cards.',
    stackable: true,
    tags: [],
  },
  {
    id: 'example',
    name: 'Example',
    summary: 'Ser Sonch suffers Herd 4.',
    rulesText:
      'Ser Sonch suffers Herd 4. Since the attacking Mob is already adjacent to him, Ser Sonch is moved four spaces toward another closest Knight (Fleischrier). Then, the Ironcast Dead performing Herd 4 moves adjacent to Ser Sonch along the shortest available path. Fleisch token',
    stackable: false,
    tags: [],
  },
  {
    id: 'exploration',
    name: 'Exploration',
    summary: 'Place Little Ser on the Exploration deck.',
    rulesText: 'Place Little Ser on the Exploration deck.',
    stackable: false,
    tags: [],
  },
  {
    id: 'falsity',
    name: 'Falsity',
    summary: 'During the Attack Roll step, you may re-roll your Crit die without gaining.',
    rulesText:
      'During the Attack Roll step, you may re-roll your Crit die without gaining. If you re-roll your Crit die while it’s already a hit, immediately Zeal 1.',
    stackable: false,
    tags: [],
  },
  {
    id: 'fire',
    name: 'Fire',
    summary: 'During the second ability window, place X Fire tokens in the Knight Pool.',
    rulesText:
      'During the second ability window, place X Fire tokens in the Knight Pool. During the Power Roll step, each Fire token in the Knight Pool allows the attacking Knight to turn 1 symbol into 1. You may use other tokens to turn into first, but if you can’t, you must always use as many Fire tokens from the Pool as possible. During the Clear the Knight Pool step, leave all but one unused tokens in the Knight Pool, i.e. remove one additional Fire token from the Knight Pool. Fire token',
    stackable: true,
    tags: [],
  },
  {
    id: 'fleisch',
    name: 'Fleisch',
    summary: 'During the second ability window, place X Fleisch tokens in the Knight Pool.',
    rulesText: 'During the second ability window, place X Fleisch tokens in the Knight Pool.',
    stackable: true,
    tags: [],
  },
  {
    id: 'forcedvault',
    name: 'Forced Vault',
    summary:
      'If the source is adjacent to the target, place its miniature on a space in a straight line from the source, on the opposite side of the source, adjacent to it.',
    rulesText:
      'If the source is adjacent to the target, place its miniature on a space in a straight line from the source, on the opposite side of the source, adjacent to it. Treat as involuntary movement. If a Knight would have to end this movement outside the Board Edge or on an Indestructible Obstacle Terrain tile, they die instead. If a Monster would have to end this movement outside the Board Edge or on an Indestructible Obstacle Terrain tile, it is Displaced to the closest available space. Vault example',
    stackable: false,
    tags: [],
  },
  {
    id: 'fortify',
    name: 'Fortify',
    summary: 'If you don’t have maximum, gain +X.',
    rulesText:
      'If you don’t have maximum, gain +X. If you have maximum, place a red cube on X on the track—it becomes your additional. When you would lose, lose your additional first (counting it down, like a secondary track).',
    stackable: true,
    tags: [],
  },
  {
    id: 'gangup',
    name: 'Gangup',
    summary: 'Move up to X spaces toward the Target.',
    rulesText:
      'Move up to X spaces toward the Target. Then, move the Targeted Knight the remaining nuer of spaces, ignoring the source, toward another closest Monster along the shortest path, or until adjacent. Treat this as involuntary movement. If the Target is already adjacent to another Monster, they suffer Knockdown instead of being moved. Afterward, the source always moves adjacent to the Target. If the Target would end this movement on a space occupied by the source, the source is Displaced to the previous space the Knight moved through.',
    stackable: true,
    tags: [],
  },
  {
    id: 'greaterpass',
    name: 'Greater Pass',
    summary:
      'During the Clear the Knight Pool step, choose up to X Knight tokens to remain in the Knight Pool, except Sunder and Power tokens.',
    rulesText:
      'During the Clear the Knight Pool step, choose up to X Knight tokens to remain in the Knight Pool, except Sunder and Power tokens.',
    stackable: true,
    tags: [],
  },
  {
    id: 'growth',
    name: 'Growth',
    summary: 'This keyword is irrelevant in the Principality of Stone and Sunken Kingdom.',
    rulesText:
      'This keyword is irrelevant in the Principality of Stone and Sunken Kingdom. It will become relevant in future Kingdoms.',
    stackable: false,
    tags: [],
  },
  {
    id: 'guard',
    name: 'Guard',
    summary:
      'Before re-rolling Evasion dice, you may add +X to the result, spread between any of the Evasion dice.',
    rulesText:
      'Before re-rolling Evasion dice, you may add +X to the result, spread between any of the Evasion dice. You cannot re-roll those dice.',
    stackable: true,
    tags: [],
  },
  {
    id: 'heal',
    name: 'Heal',
    summary: '',
    rulesText: '',
    stackable: true,
    tags: [],
  },
  {
    id: 'heartseeker',
    name: 'Heartseeker',
    summary:
      'During the Draw BP card step of the Aack, you may look at the top two BP cards and choose which one to attack.',
    rulesText:
      'During the Draw BP card step of the Aack, you may look at the top two BP cards and choose which one to attack. Shuffle the other card back into the deck. Possible Subtype of Heartseeker:',
    stackable: false,
    tags: [],
  },
  {
    id: 'herd',
    name: 'Herd',
    summary: 'Move up to X spaces toward the Target.',
    rulesText:
      'Move up to X spaces toward the Target. Then, move the Targeted Knight the remaining number of spaces, ignoring the source, toward another closest Knight along the shortest path, or until adjacent. Treat this as involuntary movement. If the Target is already adjacent to another Knight, they suffer Knocown instead of being moved. Afterward, the source always moves adjacent to the Target. If the Target would end this movement on a space occupied by the source, the source is Displaced to the previous space the Knight moved through.',
    stackable: true,
    tags: [],
  },
  {
    id: 'hide',
    name: 'Hide',
    summary:
      'If you are not in front of a Monster, you may activate this ability at the end of your turn to become Hidden.',
    rulesText:
      'If you are not in front of a Monster, you may activate this ability at the end of your turn to become Hidden. If you have the token, pass it to the Knight with the higst Passion other than you. As long as you are Hidden, you have +1 Evasion and +1 Precision. You stop being Hien if you move in front of a Monster, gain the Priority Target token, after the second ability window of your Aack, or at the end of your next turn. Place a Generic token on the game element granting you Hide as a reminder.',
    stackable: false,
    tags: [],
  },
  {
    id: 'hope',
    name: 'Hope',
    summary: 'During the second ability window, place X Hope tokens in the Knight Pool.',
    rulesText:
      'During the second ability window, place X Hope tokens in the Knight Pool. During the Power Roll step, every Hope token in the Knight Pool allows the attacking Knight to turn 1 or symbol into 1.',
    stackable: true,
    tags: [],
  },
  {
    id: 'hug',
    name: 'Hug',
    summary:
      'If adjacent to a Monster, during any ability window, move up to X spaces cardinally or diagonally.',
    rulesText:
      'If adjacent to a Monster, during any ability window, move up to X spaces cardinally or diagonally. Each space you move to must be unoccupied and adjacent to a Monster. You cannot perform movement through a corner between two occupied spaces. If you perform Hug in the first ability window, you cannot move in a way that would result in your target being outside of your weapon’s effective range.',
    stackable: true,
    tags: [],
  },
  {
    id: 'immuneto',
    name: 'Immune to',
    summary: 'You may ignore the effects of the corresponding game element.',
    rulesText: 'You may ignore the effects of the corresponding game element. Possible types:',
    stackable: true,
    tags: [],
  },
  {
    id: 'immunetobane',
    name: 'Immune to Bane',
    summary: 'Ignore all Bane tokens you have.',
    rulesText: 'Ignore all Bane tokens you have. You cannot gain Bane tokens.',
    stackable: false,
    tags: [],
  },
  {
    id: 'immunetobodyconditioncards',
    name: 'Immune to Body Condition cards',
    summary: 'Ignore effects of Body Condition cards.',
    rulesText: 'Ignore effects of Body Condition cards. You cannot gain Body Condition cards.',
    stackable: false,
    tags: [],
  },
  {
    id: 'immunetofear',
    name: 'Immune to Fear',
    summary: 'Ignore effects of the Fear Condition card.',
    rulesText:
      'Ignore effects of the Fear Condition card. You cannot gain the Fear Condition card.',
    stackable: false,
    tags: [],
  },
  {
    id: 'immunetomindconditioncards',
    name: 'Immune to Mind Condition cards',
    summary: 'Ignore effects of Mind Condition cards.',
    rulesText: 'Ignore effects of Mind Condition cards. You cannot gain Mind Condition cards.',
    stackable: false,
    tags: [],
  },
  {
    id: 'improveddiversion',
    name: 'Improved Diversion',
    summary:
      'During the send ability window, place an Improved Diversion token in the Knight Pool.',
    rulesText:
      'During the send ability window, place an Improved Diversion token in the Knight Pool. An attacking Knight may use an Improved Diversion token from the Knight Pool to ignore all Responses until the end of their Attack.',
    stackable: false,
    tags: [],
  },
  {
    id: 'improvedrush',
    name: 'Improved Rush',
    summary: 'Move with +2 and Melee/Reach Aack with Auto-break 1 and +1 Precision.',
    rulesText:
      'Move with +2 and Melee/Reach Aack with Auto-break 1 and +1 Precision. You must move at least 3 spaces and reach your target via the shortest possible path. Stop when in the effective range of your active Weapon.',
    stackable: false,
    tags: [],
  },
  {
    id: 'indestructible',
    name: 'Indestructible',
    summary: 'Terrain keyword.',
    rulesText:
      'Terrain keyword. This Terrain tile cannot be destroyed in any way. It invalidates Terrain placement on top of it.',
    stackable: false,
    tags: [],
  },
  {
    id: 'indestructibleobstacles',
    name: 'Indestructible Obstacles',
    summary:
      'If a Knight is about to be pushed into an Indestructible Obstacle by a Boss Moter, displace it to an adjacent space that would allow the Monster to continue movement onto a space prevusly occupied by the Knight, then continue Pushback.',
    rulesText:
      'If a Knight is about to be pushed into an Indestructible Obstacle by a Boss Moter, displace it to an adjacent space that would allow the Monster to continue movement onto a space prevusly occupied by the Knight, then continue Pushback. If displacement is impossible, the Knight dies and, once the Monster has moved into the space formerly occupied by the Targeted Knight, the Pushback stops. If a Knight is about to be pushed into an Indestructle Obstacle by a Mob Monster, stop the Pushback instead, and that Knight suffers Crash. If a Mob Monster is about to be pushed into an Indtructible Obstacle by a Knight, stop the Pushback instead and resolve the Terrain’s effect (if any).',
    stackable: false,
    tags: [],
  },
  {
    id: 'inspire',
    name: 'Inspire',
    summary: 'During the first ability window, choose X knocked down Knights.',
    rulesText:
      'During the first ability window, choose X knocked down Knights. They may immediately stand up.',
    stackable: true,
    tags: [],
  },
  {
    id: 'jump',
    name: 'Jump',
    summary: 'Activate at the start of movement (voluntary or not).',
    rulesText:
      'Activate at the start of movement (voluntary or not). Until the end of this movement, you may ignore a single space of a Terrain tile (including an Obstacle). This ability cannot be used while knocked down, even if passive. Poible subtypes: Hope token',
    stackable: false,
    tags: [],
  },
  {
    id: 'kingdomscavenge',
    name: 'Kingdom Scavenge',
    summary: 'Add X Kingdom Gear Loot cards to the Loot deck.',
    rulesText: 'Add X Kingdom Gear Loot cards to the Loot deck.',
    stackable: true,
    tags: [],
  },
  {
    id: 'knight',
    name: 'Knight',
    summary: 'Place Little Ser on any Knight Board.',
    rulesText: 'Place Little Ser on any Knight Board.',
    stackable: false,
    tags: [],
  },
  {
    id: 'knighttiming',
    name: 'Knight Timing',
    summary:
      'A Knight may resolve Pushback X during either the first or second ability window of their Attack (excluding Attacks with Weapon with the Ranged X–Y keyword) or when specifically instructed to resolve it immediately.',
    rulesText:
      'A Knight may resolve Pushback X during either the first or second ability window of their Attack (excluding Attacks with Weapon with the Ranged X–Y keyword) or when specifically instructed to resolve it immediately.',
    stackable: false,
    tags: [],
  },
  {
    id: 'knockback',
    name: 'Knockback',
    summary:
      'Move the affected miniature up to X spaces directly away from the source of Knockback in a straight line (or in a specified direction in case of directional Knocack); If Knockback is caused by an Attack, it affects the Target only if it is within the Attack’s effective range (adjacent for normal Attacks, in the designated zone for Zone Attacks, within X spaces for Ranged X Aacks, etc.).',
    rulesText:
      'Move the affected miniature up to X spaces directly away from the source of Knockback in a straight line (or in a specified direction in case of directional Knocack); If Knockback is caused by an Attack, it affects the Target only if it is within the Attack’s effective range (adjacent for normal Attacks, in the designated zone for Zone Attacks, within X spaces for Ranged X Aacks, etc.). If Knockback is caused by a Knight, it affects the Taet only if it is adjacent or within the effective range of the Active Weapon. If Knockback is caused by a Monster Response, it aects the Attacker only if they are within adjacency. Knocked back Knights ignore all Terrain tiles they move through except Obstacles. If a Knight would be forced to move through a Dtructible Obstacle Terrain tile, stop its movement, rove the Terrain tile from the Clash Board, and place the Knight in its space, then the Knight suffers Crash. If a Knight would be forced to move through an Indtructible Obstacle, it stops on an adjacent space right before the Obstacle, then suffers Crash. Knocked back Monsters can move through any Teain tiles and miniatures without hindrance. They destroy any Destructible Terrain tiles they land on. Knocked back Boss Monsters cause Crash and Unoidable Knockback to Knights as normal. If the affected miniature is knocked back into a Board Edge, it continues to move along the edge, if possible, away from the source of Knockback.',
    stackable: true,
    tags: [],
  },
  {
    id: 'knockbacktotheside',
    name: 'Knockback to the side',
    summary:
      'Instead of moving the target miniature in a straight line from the Monster, move perpendicularly from the straight line a normal Knockback would use in the direction that leads the target directly away from the source.',
    rulesText:
      'Instead of moving the target miniature in a straight line from the Monster, move perpendicularly from the straight line a normal Knockback would use in the direction that leads the target directly away from the source.',
    stackable: false,
    tags: [],
  },
  {
    id: 'knockdown',
    name: 'Knockdown',
    summary: 'See box.',
    rulesText:
      'See box. KNOCKDOWN Knockdown is a special Condition. When you get knocked down, you put your miniature on its side and take a Knockdown (falling down) card. While you have the Knockdown (falling down) card, you cannot move voluntarily, perform any actions, reactions, or free actions, or use Gear abilities or Techniques, unless stated otherwise. At the end of your next turn, you flip the card to the Knockdown (standing up) side. All Knights with a Knockdown (standing up) card stand up at the start of their next turn. If, for whater reason this card is discarded, stand up too.',
    stackable: false,
    tags: [],
  },
  {
    id: 'leech',
    name: 'Leech',
    summary: 'This keyword is irrelevant in the Principality of Stone and Sunken Kingdom.',
    rulesText:
      'This keyword is irrelevant in the Principality of Stone and Sunken Kingdom. It will become relevant in future Kingdoms.',
    stackable: false,
    tags: [],
  },
  {
    id: 'lesserdodge',
    name: 'Lesser Dodge',
    summary:
      'When you are about to resolve an Evasion roll and have no otr Evasion bonuses, gain +1 Evasion bonus for this roll.',
    rulesText:
      'When you are about to resolve an Evasion roll and have no otr Evasion bonuses, gain +1 Evasion bonus for this roll.',
    stackable: false,
    tags: [],
  },
  {
    id: 'lifeline',
    name: 'Lifeline',
    summary: 'When you are about to die from moving onto a Terrain tile’s space, Displace instead.',
    rulesText:
      'When you are about to die from moving onto a Terrain tile’s space, Displace instead. Alternatively, when you are about to die from falling from a Boundless Board Edge, stop adjacent to it. This ability can be used even if knocked down or otherwise prohibited from using active abilities.',
    stackable: false,
    tags: [],
  },
  {
    id: 'lumbering',
    name: 'Lumbering',
    summary: 'Cannot be involuntarily moved.',
    rulesText: 'Cannot be involuntarily moved.',
    stackable: false,
    tags: [],
  },
  {
    id: 'magic',
    name: 'Magic',
    summary: 'During the second ability window, place X Magic tokens in the Knight Pool.',
    rulesText: 'During the second ability window, place X Magic tokens in the Knight Pool.',
    stackable: true,
    tags: [],
  },
  {
    id: 'mobclash',
    name: 'Mob Clash',
    summary:
      'Take the top BP card from the Wound Stack and place it in the leftmost empty space of the Mob track.',
    rulesText:
      'Take the top BP card from the Wound Stack and place it in the leftmost empty space of the Mob track. Take a corresponding Mob miniature and place it adjacent to the source of this Heal (or in the closest unoccupied space), facing most Knights. If the Mob track is full or there would be no more miniatures to place, itead discard that card and ignore miniature placement.',
    stackable: false,
    tags: [],
  },
  {
    id: 'monkeybusiness',
    name: 'Monkey Business',
    summary: 'Place the Little Ser on X.',
    rulesText:
      'Place the Little Ser on X. If Monkey Business has no cost, you may use it at the beginning of your turn. X can be:',
    stackable: true,
    tags: [],
  },
  {
    id: 'monster',
    name: 'Monster',
    summary: 'Place Little Ser on the Monster Sheet or an Encounter card (during Encounters).',
    rulesText: 'Place Little Ser on the Monster Sheet or an Encounter card (during Encounters).',
    stackable: false,
    tags: [],
  },
  {
    id: 'motivate',
    name: 'Motivate',
    summary: 'During the second ability window, other Knights may move up to X spaces among them.',
    rulesText:
      'During the second ability window, other Knights may move up to X spaces among them. Exale: Motivate 3 allows one Knight to move 3 spaces, two Knights to move 2 and 1 spaces respectively or three Knights to move 1 space each.',
    stackable: true,
    tags: [],
  },
  {
    id: 'obscuring',
    name: 'Obscuring',
    summary: 'Terrain keyword.',
    rulesText: 'Terrain keyword. This tile blocks the Line of Sight.',
    stackable: false,
    tags: [],
  },
  {
    id: 'obstacle',
    name: 'Obstacle',
    summary: 'Terrain keyword.',
    rulesText:
      'Terrain keyword. Knights cannot move through Obstacles. Many move-like abilities interact with Obstles. See: Knockback, Pushback, Drag and Pull keywords.',
    stackable: false,
    tags: [],
  },
  {
    id: 'opening',
    name: 'Opening',
    summary: 'During the second abity window, place X Opening tokens in the Knight Pool.',
    rulesText:
      'During the second abity window, place X Opening tokens in the Knight Pool. During the Attack Roll step, each Opening token in the Knight Pool adds +1 to the result of each die.',
    stackable: true,
    tags: [],
  },
  {
    id: 'otherminiatures',
    name: 'Other miniatures',
    summary:
      'If the source is a Non-Mob Moter, the pushed Knight can be moved through spaces occupied by other miniatures.',
    rulesText:
      'If the source is a Non-Mob Moter, the pushed Knight can be moved through spaces occupied by other miniatures. If a Knight ends invontary movement on a space with another miniature, the other miniature is Displaced. If the source is Mob Monster, stop resolving Pusack if the affected miniature would be about to enter another miniature’s space.',
    stackable: false,
    tags: [],
  },
  {
    id: 'overbreak',
    name: 'Overbreak',
    summary:
      'During the second ability window, if your Total Power exceeds by 1 or more, place X Break tokens in the Knight Pool (see Break X keyword).',
    rulesText:
      'During the second ability window, if your Total Power exceeds by 1 or more, place X Break tokens in the Knight Pool (see Break X keyword).',
    stackable: true,
    tags: [],
  },
  {
    id: 'overcome',
    name: 'Overcome',
    summary:
      'If you failed to deal a Wound but your Total Power was X or more, resolve the Overcome effect.',
    rulesText:
      'If you failed to deal a Wound but your Total Power was X or more, resolve the Overcome effect. If you dealt a Wound and your Total Power exceeds the value by X or more, resolve the Overcome effect. Magic token Opening token 83',
    stackable: true,
    tags: [],
  },
  {
    id: 'overpower',
    name: 'Overpower',
    summary:
      'If you dealt a Wound and your Total Por exceeds the value by X or more, resolve the Overpor effect.',
    rulesText:
      'If you dealt a Wound and your Total Por exceeds the value by X or more, resolve the Overpor effect.',
    stackable: true,
    tags: [],
  },
  {
    id: 'parasitize',
    name: 'Parasitize',
    summary: 'Principality of Stone keyword.',
    rulesText:
      'Principality of Stone keyword. If you don’t have the Panzer Parasite Condition card, gain it. Then place X Generic tokens on the Panzer Parasite Condition card.',
    stackable: true,
    tags: [],
  },
  {
    id: 'pass',
    name: 'Pass',
    summary:
      'During the Clear the Knight Pool step, choose up to X Knight tokens to remain in the Knight Pool.',
    rulesText:
      'During the Clear the Knight Pool step, choose up to X Knight tokens to remain in the Knight Pool. You can only choose Opening, Break, or Cantrip tokens.',
    stackable: true,
    tags: [],
  },
  {
    id: 'poison',
    name: 'Poison',
    summary: 'Sunken Kingdom keyword.',
    rulesText:
      'Sunken Kingdom keyword. If you don’t have the Poisoned Condition card, gain it. Then place X Generic tokens on the Poisoned Condition card (these are the Poon tokens).',
    stackable: true,
    tags: [],
  },
  {
    id: 'possiblesubtypesofbypass',
    name: 'Possible subtypes of Bypass',
    summary: '',
    rulesText: '',
    stackable: false,
    tags: [],
  },
  {
    id: 'power',
    name: 'Power',
    summary: 'During the second ability window, place X Power tokens in the Knight Pool.',
    rulesText:
      'During the second ability window, place X Power tokens in the Knight Pool. During the Power Roll step, every Power token in the Knight Pool adds 1. You cannot use Greater Pass on this token.',
    stackable: true,
    tags: [],
  },
  {
    id: 'powerreroll',
    name: 'Power Re-roll',
    summary: 'During the Power Roll step of an Attack, you may re-roll up to X Power dice.',
    rulesText:
      'During the Power Roll step of an Attack, you may re-roll up to X Power dice. Remember, you cannot re-roll Power dice using.',
    stackable: true,
    tags: [],
  },
  {
    id: 'precise',
    name: 'Precise',
    summary:
      'During the Draw a BP card step of the attack, after you draw the card, you may target the top card of the discard pile instead.',
    rulesText:
      'During the Draw a BP card step of the attack, after you draw the card, you may target the top card of the discard pile instead. If you do, shuffle the card you’ve drawn into the BP deck. Power token',
    stackable: false,
    tags: [],
  },
  {
    id: 'provoke',
    name: 'Provoke',
    summary:
      'During the first ability window, gain the Priority Target token and turn the Monster to face you.',
    rulesText:
      'During the first ability window, gain the Priority Target token and turn the Monster to face you.',
    stackable: false,
    tags: [],
  },
  {
    id: 'pull',
    name: 'Pull',
    summary:
      'Move the affected miniature up to X spaces toward the source of the Pull, along the shortest possible path (see examples in Monster Movement section, p.',
    rulesText:
      'Move the affected miniature up to X spaces toward the source of the Pull, along the shortest possible path (see examples in Monster Movement section, p. 50). At the end of the Pull, turn the source to face the affected miniature.',
    stackable: true,
    tags: [],
  },
  {
    id: 'pushback',
    name: 'Pushback',
    summary: 'Turn the source toward the affected miniature.',
    rulesText:
      'Turn the source toward the affected miniature. Then, move up to X spaces in the direction of the affected miniature, pushing it in a straight line.',
    stackable: true,
    tags: [],
  },
  {
    id: 'pushbacktoward',
    name: 'Pushback toward',
    summary:
      'Instead of pushing the Target in a straight line, push them along the shortest path to the specified space.',
    rulesText:
      'Instead of pushing the Target in a straight line, push them along the shortest path to the specified space.',
    stackable: false,
    tags: [],
  },
  {
    id: 'rangedxy',
    name: 'Ranged X–Y',
    summary:
      'To attack with this weapon, you must be at least X and up to Y spaces away from your target.',
    rulesText:
      'To attack with this weapon, you must be at least X and up to Y spaces away from your target. This keyword is not stackable.',
    stackable: true,
    tags: [],
  },
  {
    id: 'reach',
    name: 'Reach',
    summary: 'You may attack from up to X spaces away.',
    rulesText: 'You may attack from up to X spaces away. This keyword is not stackable.',
    stackable: true,
    tags: [],
  },
  {
    id: 'refle',
    name: 'Refle',
    summary: 'Move up to 1 space.',
    rulesText: 'Move up to 1 space. Possible subtypes:',
    stackable: true,
    tags: [],
  },
  {
    id: 'refresh',
    name: 'Refresh',
    summary:
      'Move X cards from the Delay area to the Cooldown area, OR from the Cooldown area to your hand.',
    rulesText:
      'Move X cards from the Delay area to the Cooldown area, OR from the Cooldown area to your hand.',
    stackable: true,
    tags: [],
  },
  {
    id: 'reinforce',
    name: 'Reinforce',
    summary: 'When you are about to resolve an Armor Roll, add X red dice to your Armor dice Pool.',
    rulesText:
      'When you are about to resolve an Armor Roll, add X red dice to your Armor dice Pool. Possible suypes:',
    stackable: true,
    tags: [],
  },
  {
    id: 'reposition',
    name: 'Reposition',
    summary: 'During the second ability window, you may move up to X spaces.',
    rulesText: 'During the second ability window, you may move up to X spaces.',
    stackable: true,
    tags: [],
  },
  {
    id: 'restrain',
    name: 'Restrain',
    summary: 'Delay all cards in your Cooldown area (move them to the Delay area).',
    rulesText: 'Delay all cards in your Cooldown area (move them to the Delay area).',
    stackable: false,
    tags: [],
  },
  {
    id: 'rocksteady',
    name: 'Rocksteady',
    summary: 'When you are about to suffer Knockdown, you may use this ability to ignore it.',
    rulesText: 'When you are about to suffer Knockdown, you may use this ability to ignore it.',
    stackable: false,
    tags: [],
  },
  {
    id: 'rollout',
    name: 'Roll Out',
    summary:
      'When you are about to suffer Knockdown while adjacent to a Monster, suffer Knockback 4 instead.',
    rulesText:
      'When you are about to suffer Knockdown while adjacent to a Monster, suffer Knockback 4 instead.',
    stackable: false,
    tags: [],
  },
  {
    id: 'rotation',
    name: 'Rotation',
    summary: 'Move all Monster tokens on the District Wheel X spaces clockwise.',
    rulesText:
      'Move all Monster tokens on the District Wheel X spaces clockwise. Rouse X: During the second ability window, place X Rouse tokens in the Knight Pool. In the first ability window, the attacking Knight may use Rouse tokens from the Knight Pool to treat their Passion as 1 higher until the end of this Attack for each Rouse token used.',
    stackable: true,
    tags: [],
  },
  {
    id: 'rush',
    name: 'Rush',
    summary: 'Move with +1 and Melee/ Reach Attack with Auto-break 1.',
    rulesText:
      'Move with +1 and Melee/ Reach Attack with Auto-break 1. You must move at least 3 spaces and reach your target via the shortest possle path. Stop when in the effective range of your active Weapon. Possible subtype of Rush:',
    stackable: false,
    tags: [],
  },
  {
    id: 'sacrifice',
    name: 'Sacrifice',
    summary:
      'During the first ability window, you may lose -1 to immediately place 1 Break token in the Knight Pool.',
    rulesText:
      'During the first ability window, you may lose -1 to immediately place 1 Break token in the Knight Pool.',
    stackable: false,
    tags: [],
  },
  {
    id: 'scavenge',
    name: 'Scavenge',
    summary: 'Add X Loot cards to the Loot deck.',
    rulesText:
      'Add X Loot cards to the Loot deck. If the Scavenge keyword does not specify which Loot card type it refers to, you may choose from Kingdom Gear, Upgrade and Consumable Gear Loot cards. Possible subtypes of',
    stackable: true,
    tags: [],
  },
  {
    id: 'secondchance',
    name: 'Second Chance',
    summary: 'After you draw a Mortis or Judicium card, you may ignore its effect and discard it.',
    rulesText:
      'After you draw a Mortis or Judicium card, you may ignore its effect and discard it. Draw and resolve another card from the same deck (note: a diarded Judicium is immediately shuffled back into the Judicium deck). You cannot ignore the second draw in any way. This ability can be used even when knocked down or otherwise prohibited from using active abilities.',
    stackable: false,
    tags: [],
  },
  {
    id: 'shortestpath',
    name: 'Shortest path',
    summary:
      'If the affected miniature is not aacent, move the source in its direction along the shortest possible path (see examples in the Monster Movement section, p.',
    rulesText:
      'If the affected miniature is not ajacent, move the source in its direction along the shortest possible path (see examples in the Monster Movement section, p. 50).',
    stackable: false,
    tags: [],
  },
  {
    id: 'sink',
    name: 'Sink',
    summary: 'Sunken Kingdom keyword.',
    rulesText:
      'Sunken Kingdom keyword. During the Explorion step, whenever you discover the Sink symbol or you’re prompted by the Exploration card, trigger Sink.',
    stackable: false,
    tags: [],
  },
  {
    id: 'soak',
    name: 'Soak',
    summary: 'Reduce loss from Monster Attacks during a Clash by X.',
    rulesText:
      'Reduce loss from Monster Attacks during a Clash by X. You can use this ability only after performing the Armor Roll. If it reduces your loss to 0, do not resolve.',
    stackable: true,
    tags: [],
  },
  {
    id: 'soulseeker',
    name: 'Soulseeker',
    summary:
      'During the Draw BP card step of the Attack, you may look at the top three BP cards and choose which one to attack.',
    rulesText:
      'During the Draw BP card step of the Attack, you may look at the top three BP cards and choose which one to attack. Shuffle the other cards into the deck.',
    stackable: false,
    tags: [],
  },
  {
    id: 'spell',
    name: 'Spell',
    summary: 'During the second ability window, place X Spell tokens in the Knight Pool.',
    rulesText:
      'During the second ability window, place X Spell tokens in the Knight Pool. During an Attack treat this token as both an Opening and Break token. Rouse token Spell token 86',
    stackable: true,
    tags: [],
  },
  {
    id: 'splinter',
    name: 'Splinter',
    summary: 'Knights adjacent to the Target of the Attack lose -X.',
    rulesText: 'Knights adjacent to the Target of the Attack lose -X.',
    stackable: true,
    tags: [],
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    summary:
      'During the first ability window, if you are the Priority Target or the Divine Target, gain + for this Attack.',
    rulesText:
      'During the first ability window, if you are the Priority Target or the Divine Target, gain + for this Attack.',
    stackable: false,
    tags: [],
  },
  {
    id: 'stalwart',
    name: 'Stalwart',
    summary: 'When you are about to suffer Knockback, you may use this ability to ignore it.',
    rulesText: 'When you are about to suffer Knockback, you may use this ability to ignore it.',
    stackable: false,
    tags: [],
  },
  {
    id: 'sunder',
    name: 'Sunder',
    summary: 'During the second abity window, place X Sunder tokens in the Knight Pool.',
    rulesText:
      'During the second abity window, place X Sunder tokens in the Knight Pool. During the Power Roll step, each Sunder token in the Knight Pool allows the attacking Knight to turn 1 symbol into 2. You cannot use Greater Pass on this token.',
    stackable: true,
    tags: [],
  },
  {
    id: 'sundertokenvault',
    name: 'Sunder token Vault',
    summary:
      'If you’re adjacent to a Monster, place your miature on an empty space in a straight line from you, on the opposite side of the Monster, adjacent to it.',
    rulesText:
      'If you’re adjacent to a Monster, place your miature on an empty space in a straight line from you, on the opposite side of the Monster, adjacent to it. Treat this as voluntary Movement. A Knight may use this ability in either the first or second ability window. Possible subtype:',
    stackable: false,
    tags: [],
  },
  {
    id: 'superiorblock',
    name: 'Superior Block',
    summary: 'While performing an Evasion Roll, treat 3 successful hits as evaded.',
    rulesText: 'While performing an Evasion Roll, treat 3 successful hits as evaded.',
    stackable: false,
    tags: [],
  },
  {
    id: 'superiorbypass',
    name: 'Superior Bypass',
    summary: 'A Knight or Monster may voluntarily move through other Miniatures.',
    rulesText:
      'A Knight or Monster may voluntarily move through other Miniatures. You cannot end your voluntary movement on a space occupied by another Miniature. A Knight or Monster may voluntarily enter an Obstacle space and end its movement on that space. It additionally ignores Difficult Terrain and Chasm Terrain Keywords. Reminder: Obstacles do not block Line of Sight or range, so a Knight or Monster on an Obstacle can still be attacked as normal.',
    stackable: false,
    tags: [],
  },
  {
    id: 'superiorchance',
    name: 'Superior Chance',
    summary: 'After you draw a Mortis or Judicium card, you may ignore its effect and discard it.',
    rulesText:
      'After you draw a Mortis or Judicium card, you may ignore its effect and discard it. Draw and resolve another card from the same deck removing the You died horribly Massive Peril Judicium card for that draw only (note: a discarded Judicium card is always shuffled back into the Judicium deck). You cannot ignore the second draw in any way. This ability can be used even when knocked down or otherwise prohibited from using active abilities.',
    stackable: false,
    tags: [],
  },
  {
    id: 'superiordefy',
    name: 'Superior Defy',
    summary: 'While performing a Virtue test caused by a Judgement, treat 3 hits as evaded.',
    rulesText: 'While performing a Virtue test caused by a Judgement, treat 3 hits as evaded.',
    stackable: false,
    tags: [],
  },
  {
    id: 'superiordodge',
    name: 'Superior Dodge',
    summary: 'Gain +3 Evasion bonus instead.',
    rulesText: 'Gain +3 Evasion bonus instead.',
    stackable: false,
    tags: [],
  },
  {
    id: 'superiorrefle',
    name: 'Superior Refle',
    summary: 'Move up to 3 spaces.',
    rulesText: 'Move up to 3 spaces.',
    stackable: true,
    tags: [],
  },
  {
    id: 'superiorreinforce',
    name: 'Superior Reinforce',
    summary:
      'When you are about to resolve an Armor Roll, add X white dice to your Armor dice Pool.',
    rulesText:
      'When you are about to resolve an Armor Roll, add X white dice to your Armor dice Pool.',
    stackable: true,
    tags: [],
  },
  {
    id: 'suppress',
    name: 'Suppress',
    summary: 'You may shuffle the discard pile denoted by the subtype into the appropriate deck.',
    rulesText:
      'You may shuffle the discard pile denoted by the subtype into the appropriate deck. Possible subtypes:',
    stackable: false,
    tags: [],
  },
  {
    id: 'swarm',
    name: 'Swarm',
    summary: 'The attacked Knight loses -X for each other adjacent Monster.',
    rulesText: 'The attacked Knight loses -X for each other adjacent Monster.',
    stackable: true,
    tags: [],
  },
  {
    id: 'terrain',
    name: 'Terrain',
    summary: 'The affected miniature must resolve the eects of any Terrain tiles it moves through.',
    rulesText:
      'The affected miniature must resolve the eects of any Terrain tiles it moves through.',
    stackable: false,
    tags: [],
  },
  {
    id: 'tireless',
    name: 'Tireless',
    summary: 'When you are about to activate the Cumbeome keyword, you may ignore it.',
    rulesText: 'When you are about to activate the Cumbeome keyword, you may ignore it.',
    stackable: false,
    tags: [],
  },
  {
    id: 'toxify',
    name: 'Toxify',
    summary:
      'If you don’t have the Toxified or Poisoned Condition card, gain the Toxified Condition card.',
    rulesText:
      'If you don’t have the Toxified or Poisoned Condition card, gain the Toxified Condition card. If you already have the Poisoned Condition card, flip it. Then place X Generic tokens (Poison tokens) on the Toxified Condition card.Poison Resilience X: Sunken Kingdom keyword. Ignore up to X Poison tokens from the Poisoned and Toxified Coition cards.',
    stackable: true,
    tags: [],
  },
  {
    id: 'trailmake',
    name: 'Trailmake',
    summary:
      'At the start of Deep Fog traversal, you may look at the top X cards of the Deep Fog deck, select one card and put it aside.',
    rulesText:
      'At the start of Deep Fog traversal, you may look at the top X cards of the Deep Fog deck, select one card and put it aside. Shuffle the rest of the cards into the Deep Fog deck, and put the selected card at the bottom of the deck.',
    stackable: true,
    tags: [],
  },
  {
    id: 'tumble',
    name: 'Tumble',
    summary: 'When you are about to suffer Crash, roll a d10.',
    rulesText: 'When you are about to suffer Crash, roll a d10. On a 6+ ignore it.',
    stackable: false,
    tags: [],
  },
  {
    id: 'unwieldy',
    name: 'Unwieldy',
    summary: 'If a Weapon is Unwieldy, you may only attack targets in a straight cardinal line.',
    rulesText: 'If a Weapon is Unwieldy, you may only attack targets in a straight cardinal line.',
    stackable: false,
    tags: [],
  },
  {
    id: 'upgradescavenge',
    name: 'Upgrade Scavenge',
    summary: 'Add X Upgrade Loot cards to the Loot deck.',
    rulesText: 'Add X Upgrade Loot cards to the Loot deck.',
    stackable: true,
    tags: [],
  },
  {
    id: 'wander',
    name: 'Wander',
    summary: 'After you draw a Deep Fog card, discard it and draw another in its place.',
    rulesText: 'After you draw a Deep Fog card, discard it and draw another in its place.',
    stackable: false,
    tags: [],
  },
  {
    id: 'wither',
    name: 'Wither',
    summary: 'This keyword is irrelevant in Principality of Stone and Sunken Kingdom.',
    rulesText:
      'This keyword is irrelevant in Principality of Stone and Sunken Kingdom. It will become relevant in future Kingdoms.',
    stackable: true,
    tags: [],
  },
  {
    id: 'zeal',
    name: 'Zeal',
    summary: 'During the second ability window, place X Zeal tokens on your Knight Board.',
    rulesText: 'During the second ability window, place X Zeal tokens on your Knight Board.',
    stackable: true,
    tags: [],
  },
  {
    id: 'zealthreshold',
    name: 'Zeal threshold',
    summary:
      'If gaining Zeal tokens would exceed your Zeal threshold, gain Zeal tokens up to your Zeal threshold and place the rest of the tokens in the Knight Pool.',
    rulesText:
      'If gaining Zeal tokens would exceed your Zeal threshold, gain Zeal tokens up to your Zeal threshold and place the rest of the tokens in the Knight Pool. Zeal token 87',
    stackable: true,
    tags: [],
  },
];

export default KEYWORD_CATALOG;
