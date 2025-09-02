import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

interface FAQSectionProps {
  title: string;
  children: React.ReactNode;
  testID?: string;
}

function FAQSection({ title, children, testID }: FAQSectionProps) {
  const { tokens } = useThemeTokens();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.section, { backgroundColor: tokens.card }]} testID={testID}>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.sectionHeader}
        accessibilityRole='button'
        accessibilityLabel={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
      >
        <Text style={[styles.sectionTitle, { color: tokens.textPrimary }]}>{title}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={tokens.textPrimary}
        />
      </Pressable>
      {isExpanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
  number: number;
}

function FAQItem({ question, answer, number }: FAQItemProps) {
  const { tokens } = useThemeTokens();

  return (
    <View style={styles.faqItem}>
      <View style={styles.questionHeader}>
        <Text style={[styles.questionNumber, { color: tokens.accent }]}>{number}.</Text>
        <Text style={[styles.questionText, { color: tokens.textPrimary }]}>{question}</Text>
      </View>
      <Text style={[styles.answerText, { color: tokens.textMuted }]}>{answer}</Text>
    </View>
  );
}

export default function FAQScreen() {
  const { tokens } = useThemeTokens();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.bg }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: tokens.textPrimary }]}>
            Frequently Asked Questions
          </Text>
        </View>

        <FAQSection title='Exploration' testID='exploration-section'>
          <FAQItem
            number={1}
            question='If I complete an Exhibition Clash as part of a story mission, does that replace the Clash at the 8th hour, or do I have to resolve two Clashes?'
            answer='It replaces the Clash at 8th hour.'
          />
          <FAQItem
            number={2}
            question="After you resolve the Exploration draw, does Little Ser stay on the Exploration deck, or is he returned to Ser Sonch's Knight board?"
            answer='He stays on the Exploration deck until you move Little Ser somewhere else, for example to the Monster Sheet during a Clash.'
          />
          <FAQItem
            number={3}
            question="If I skip the 'Encounter Monsters spawn and movement' step when backtracking, what about raising Threat above 6 or to the last space on the Threat track? Considering these are one-time events, are they still resolved? Skipped now then resolved as soon as I explore a new Kingdom tile? Lost forever for this Expedition?"
            answer="If you reach a Hunt mark during backtrack, you ignore it (because you skip the Kingdom Tile step). Reading the special '6666' paragraph happens during the Story Step."
          />
          <FAQItem
            number={4}
            question="Page 32 of the rulebook says that Exploration Ciphers trigger at the the end of the Kingdom tile step, but on page 42, we can read: 'When you explore a new Kingdom tile with a Cipher on it, you may read all relevant paragraphs during the Story step of your current Delve Round.' Which one is the right timing, Kingdom Tile step or Story step?"
            answer="You connect the two parts of full Cipher during the Kingdom Tile step, and then read it during the Story step. It's constructed that way to remind you that you should only read it once you're on a newly explored Kingdom tile."
          />
          <FAQItem
            number={5}
            question="Sunken Kingdom Exploration card - Will-o'-wisp, says 'Place a generic token on a random path from your current tile. (...) Repeat this process at the start of the next 2 Delve Rounds, then discard the card and token.' Does this token, if not moved through, get picked up and placed on a random path the next turn, or do you leave it and drop a second token? It seems the Wisp is flying around the tile you are on, so the token moves and appears with the party? Is this correct? Or do you leave tokens not travelled through where they are until the card is discarded 2 rounds later?"
            answer="If the Party doesn't move in that direction, take the token and place it on a random path the next turn."
          />
          <FAQItem
            number={6}
            question="Sunken Kingdom Exploration card - Surge. 'Place 2 Surge tokens on the Kingdom sheet.' The rule for Surge says that if there is a Surge token on the Kingdom Sheet, flip it to Flood. Does this circumvent that mechanic, or do we actually just Surge twice?"
            answer='If there are no Surge tokens on the Kingdom sheet, you place one Surge token and then flip it. If there already is a Surge token on the Kingdom Sheet, flip it and place another Surge token.'
          />
          <FAQItem
            number={7}
            question="When a Knight uses a Technique card with instant depletion during the Delve Phase, when does the card come back to the player's hand?"
            answer='When you use a Technique with an Instant depletion, it returns to your hand at the end of the current Round (Knight, Monster, or Delve Round).'
          />
          <FAQItem
            number={8}
            question="If I have 2 successful investigations and 1 failed Investigation, and I want to 'take a cold lead' during free roam, should I undertake the failed investigation, or can I choose another one?"
            answer='You can undertake the failed one OR start one you have not attempted yet.'
          />
        </FAQSection>

        <FAQSection title='Clash' testID='clash-section'>
          <FAQItem
            number={1}
            question='How does Monster facing work? Do Monsters always end their movement facing the target of their movement action? Is this true also for non-attack oriented movement actions? Like the Firstmen Warriors running to the side of the White Ape Troll?'
            answer="The general rule says that Monsters always face the Target at the beginning of their movement. Additionally, there are specific cases of facing on p. 50 in the 'Monster Turning' section of the rulebook. In the case of White Ape Guardians, the target of their movement is the empty space adjacent to White Ape Troll, so they turn to face it at the beginning of their movement."
          />
          <FAQItem
            number={2}
            question='The Winged Nightmare has the Finesse Trait, which gives you rules for the Flank and Flee X keywords. When performing Flee X, it seems like the Winged Nightmare would not turn at the beginning or end of that movement, as it is not a targeted effect, and nothing in the Flee keyword instructs it to turn. Is this correct?'
            answer='The Target of Flank X is the Knight, and the Target of Flee X is the closest Board Edge. So the Winged Nightmare turns to face in the direction of the Target at the beginning of their movement.'
          />
          <FAQItem
            number={3}
            question='There are passive effects that are unlocked based on the number of Devotion tokens. Do Knights gain all of the Infusion abilities that fall equal to or below their Devote token level, or just the infusion ability equal to their devote count?'
            answer='You gain all Infusion abilities of level equal to the number of Devotion tokens you have AND all levels below.'
          />
          <FAQItem
            number={4}
            question='When a Mob monster is killed, it still performs its BP Response; but what about the kill that wins the Clash? Does the Mob still Respond, or does the Clash end immediately?'
            answer="The last Wound immediately ends the Clash. You don't resolve any non-Critical responses."
          />
          <FAQItem
            number={5}
            question='A Firstmen Warriors BP 2, Augur, places a 1x2 Swamp Terrain tile under the closest Knight when revealed. In the demo, there are 8 1x2 Swamp tiles. Is there a physical component limit to the number of these tiles?'
            answer='If you would exceed the physical component limit, remove the farthest copy of this terrain tile from the board, then place the new terrain tile where indicated.'
          />
          <FAQItem
            number={6}
            question='Sirenade, Winged Nightmare AI 2, has the following effect - for each hit lose -2 Vigor and move 1 space toward the Winged Nightmare, ignoring Difficult Terrain. This movement is voluntary. Swamps are Difficult Terrain, so what if you end your movement on a Swamp Terrain tile?'
            answer='You ignore the effects of the Difficult Terrain keyword, but you still apply the other effects of the Swamp Terrain tile.'
          />
          <FAQItem
            number={7}
            question='In the Winged Nightmare Clash, Marble Forest allows Knights to climb adjacent Column tiles. If a Knight is on top of a Column, can they perform Pushback or Drag from that position? Is there a difference whether the Mob has Superior Bypass or not?'
            answer="Knights are able to use Pushback, Drag and so on while on top of a Column. If the Winged Nightmare is dragged by a Knight on top of a Column, it interacts with that Terrain tile according to traits on the Terrain card. So, in this case, the Column would be destroyed regardless of Superior Bypass, because it works only with voluntary movement. The Knights can't use any move-like abilities to move onto the Column tile, except by using a free action or Reflex while adjacent to the Column."
          />
          <FAQItem
            number={8}
            question="Are Mercenaries hired by Knights usable by the entire party? Or is a particular hired mercenary 'assigned' to the Knight that hired them? What about Mercenaries only unlocked by a certain Knight, if they are hired, can other characters use their abilities?"
            answer='Mercenaries are usable by the entire party, and when a certain Knight unlocks a new Mercenary, it is unlocked for everyone else.'
          />
          <FAQItem
            number={9}
            question="If I use the 'Spider Venom Curse' Upgrade card to become Envenomed, should I also discard the weapon the upgrade is attached to? The card says only to 'Discard the Upgrade'"
            answer="When an Upgrade card has instructions to 'Discard the Upgrade', you must discard ONLY said Upgrade. If an Upgrade card would have just a 'Discard' cost, you would discard both the Weapon and the Upgrade."
          />
          <FAQItem
            number={10}
            question='Does Choke 1 with no prior Choke status active simply disappear right away, or am I misunderstanding?'
            answer="When the black cube is on 0, your Choke Limit is 1! It means you can't have less than 1 Heat. So, Choke 1 means you should place a black acrylic cube on the 0 space on the Heat track, and it means your Choke Limit is 1."
          />
          <FAQItem
            number={11}
            question='So with the LoS ruling, how do we get past that line that says to target the Priority Target?'
            answer='It cannot be skipped, at least for now...'
          />
          <FAQItem
            number={12}
            question="The Savage Sweep AI - The first targeting line instructs to target the closest Knight with the Exposed Condition. LoS is not relevant in this case, correct? Because it doesn't say 'in sight'?"
            answer='Yes. If there is only one Knight with the Exposed Condition card, it will be the target of the attack no matter where they are.'
          />
          <FAQItem
            number={13}
            question="Does Line of Sight always have to apply when targeting, or only if the Target parameters state 'in sight'?"
            answer="When the targeting instruction doesn't state 'in sight' or 'in front', it means that LoS is not necessary to resolve that targeting instruction."
          />
          <FAQItem
            number={14}
            question='Can an incarnated Knight die before the incarnation ends if they take another hit? Can they even be targeted while incarnated? If not, if the only Knight left is incarnated and an AI card is drawn, then is there no target, so Routine is performed?'
            answer='When incarnated, you still can be the target of attacks. You can also die from any other reason.'
          />
          <FAQItem
            number={15}
            question='Are Overcome and Overpower the same effect?'
            answer='No. Overcome X+ is activated when you fail to wound a BP card, but your Total Power is X or more. You also trigger it when you deal a Wound and exceed the AT value by X or more. Overpower X+ is activated only when you deal a Wound and exceed the AT value by X or more.'
          />
          <FAQItem
            number={16}
            question='Can the Winged Nightmare move onto a Column Terrain tile without Superior Bypass?'
            answer="No. If It's instructed to move to a Column (without Superior Bypass), it ends its movement adjacent to that Column."
          />
          <FAQItem
            number={17}
            question='About the Tracker Knight Talent, is the effect constant? In case of the Evasion Re-roll, if placed Little Ser on the Monster Sheet, do all Knights gain one reroll that they can use for later turns? If placed on the Clash Board, do they all gain +1 Precision for their next Attack?'
            answer='Yes, the effects are constant until Little Ser is placed elsewhere, or the Clash ends.'
          />
          <FAQItem
            number={18}
            question='Do you resolve Instinct as soon as the BP is hit, before the Power Roll, or are they simultaneous?'
            answer='Instinct is Monster Response, and you resolve it after the Power Roll.'
          />
          <FAQItem
            number={19}
            question='During the Delve Phase there are many things that can make you place Knight tokens in the Knight Pool. But all you are really doing is giving yourself just a good first round for only the first Knight, as all the tokens will be removed at the end of the first round of the first Knight, right?'
            answer="Yes, they are removed during the first 'Clear the Knight Pool' step."
          />
          <FAQItem
            number={20}
            question='Where can I find the movement value of a Monster?'
            answer='All KF Monsters have unlimited Speed.'
          />
          <FAQItem
            number={21}
            question="How can you move away from the Attack, if the Monster's movement is unlimited?"
            answer='Knights specifically are not always targets of Attacks. Sometimes, the target is a zone, and the Knight may use a Reflex, for example, to go beyond the range of that zone.'
          />
        </FAQSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
  },
  faqItem: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  questionHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 28,
  },
});
