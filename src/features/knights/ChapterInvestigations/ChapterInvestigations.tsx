import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useState } from 'react';
import { Text } from 'react-native';
import { InvestigationChooser } from './InvestigationChooser';
import { InvestigationPills } from './InvestigationPills';
import { useChapterInvestigationsData } from './useChapterInvestigationsData';

interface ChapterInvestigationsProps {
  knightUID: string;
  chapter: number;
}

export default function ChapterInvestigations({ knightUID, chapter }: ChapterInvestigationsProps) {
  const { tokens } = useThemeTokens();
  const { entries, normalDone, totalDone, locked, addNormalInvestigation, addLeadCompletion } =
    useChapterInvestigationsData(knightUID, chapter);
  const [pickCode, setPickCode] = useState<string | null>(null);

  const openChooser = (code: string) => {
    // Don't allow editing a completed one
    const isDone = entries.find(e => e.code === code)?.isCompleted;
    if (isDone) return;
    setPickCode(code);
  };

  const closeChooser = () => setPickCode(null);

  const chooseNormal = async (result: 'pass' | 'fail') => {
    if (!pickCode) return;
    await addNormalInvestigation(pickCode, result);
    setPickCode(null);
  };

  const chooseLead = async () => {
    if (!pickCode) return;
    await addLeadCompletion(pickCode);
    setPickCode(null);
  };

  return (
    <Card>
      {/* Header */}
      <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>
        Chapter {chapter} • Investigations
      </Text>
      <Text style={{ color: tokens.textMuted, marginTop: 4 }}>
        Normal: {normalDone}/3 • Total: {totalDone}/5{locked ? ' • Normal locked' : ''}
      </Text>

      {/* Investigation Pills */}
      <InvestigationPills entries={entries} onPress={openChooser} />

      {/* Investigation Chooser */}
      {pickCode && (
        <InvestigationChooser
          code={pickCode}
          locked={locked}
          onNormalPass={() => chooseNormal('pass')}
          onNormalFail={() => chooseNormal('fail')}
          onLeadComplete={chooseLead}
          onCancel={closeChooser}
        />
      )}
    </Card>
  );
}
