import SwitchRow from '@/components/ui/SwitchRow';
import { View } from 'react-native';

interface KnightFlagsSectionProps {
  prologueDone: boolean;
  setPrologue: (done: boolean) => void;
  postgameDone: boolean;
  setPostgame: (done: boolean) => void;
  firstDeath: boolean;
  setFirstDeath: (death: boolean) => void;
  testID?: string;
}

export function KnightFlagsSection({
  prologueDone,
  setPrologue,
  postgameDone,
  setPostgame,
  firstDeath,
  setFirstDeath,
  testID,
}: KnightFlagsSectionProps) {
  return (
    <>
      <View style={{ height: 8 }} />
      <SwitchRow
        label='Prologue Completed'
        value={prologueDone}
        onValueChange={setPrologue}
        testID={testID ? `${testID}-prologue-done` : undefined}
      />
      <SwitchRow
        label='Postgame Completed'
        value={postgameDone}
        onValueChange={setPostgame}
        testID={testID ? `${testID}-postgame-done` : undefined}
      />
      <SwitchRow
        label='First Death'
        value={firstDeath}
        onValueChange={setFirstDeath}
        testID={testID ? `${testID}-first-death` : undefined}
      />
    </>
  );
}
