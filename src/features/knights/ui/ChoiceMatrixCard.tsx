// src/components/ChoiceMatrixCard.tsx
import Card from '@/components/Card';
import Button from '@/components/Button';
import { ensureSheet } from '@/models/knight';
import { useKnights } from '@/store/knights';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ChoiceMatrixNoteModal from './ChoiceMatrixNoteModal';
import ChoiceMatrixNotesViewer from './ChoiceMatrixNotesViewer';
import { useChoiceMatrixNotes } from './useChoiceMatrixNotes';

type Props = { knightUID: string };

// codes
const NUM_CODES = Array.from({ length: 30 }, (_, i) => String(i + 1));
const EXTRA_CODES = Array.from({ length: 10 }, (_, i) => `E${i + 1}`);

function Pill({
  label,
  checked,
  onPress,
  onNotePress,
  hasNote,
  fullWidth,
}: {
  label: string;
  checked?: boolean;
  onPress?: () => void;
  onNotePress?: () => void;
  hasNote?: boolean;
  fullWidth?: boolean;
}) {
  const { tokens } = useThemeTokens();
  return (
    <View style={{ position: 'relative' }}>
      <Pressable
        onPress={onPress}
        style={{
          width: fullWidth ? '100%' : undefined,
          height: 32,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? tokens.accent : tokens.surface,
          borderWidth: 1,
          borderColor: '#0006',
        }}
        accessibilityRole='button'
        accessibilityState={{ selected: !!checked }}
      >
        <Text style={{ color: checked ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>
          {label}
        </Text>
      </Pressable>

      {onNotePress && (
        <Pressable
          onPress={onNotePress}
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: hasNote ? tokens.warning : tokens.textMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: tokens.bg, fontSize: 10, fontWeight: 'bold' }}>N</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function ChoiceMatrixCard({ knightUID }: Props) {
  const { tokens } = useThemeTokens();
  const { knightsById, updateKnightSheet } = useKnights();
  const { hasNote } = useChoiceMatrixNotes(knightUID);

  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [notesViewerVisible, setNotesViewerVisible] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>('');

  const k = knightsById?.[knightUID];
  const sheet = ensureSheet(k?.sheet);

  const chosen = useMemo(() => {
    const rec = sheet.choiceMatrix ?? {};
    return new Set(
      Object.entries(rec)
        .filter(([, v]) => !!v)
        .map(([c]) => c)
    );
  }, [sheet.choiceMatrix]);

  const toggle = (code: string) => {
    const next = { ...(sheet.choiceMatrix ?? {}) };
    next[code] = !next[code];
    updateKnightSheet(knightUID, { choiceMatrix: next });
  };

  const handleNotePress = (code: string) => {
    setSelectedCode(code);
    setNoteModalVisible(true);
  };

  const handleViewAllNotes = () => {
    setNotesViewerVisible(true);
  };

  // 6-column responsive grid
  const COLS = 6;
  const cellWidth = `${100 / COLS}%`;

  const renderGrid = (codes: string[]) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {codes.map(code => (
        <View key={code} style={{ width: cellWidth }}>
          <Pill
            label={code}
            checked={chosen.has(code)}
            onPress={() => toggle(code)}
            onNotePress={() => handleNotePress(code)}
            hasNote={hasNote(code)}
            fullWidth
          />
        </View>
      ))}
    </View>
  );

  return (
    <>
      <Card>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>Choice Matrix</Text>
          <Button label='View All Notes' onPress={handleViewAllNotes} tone='default' />
        </View>

        <Text style={{ color: tokens.textMuted, marginBottom: 6 }}>1–30</Text>
        {renderGrid(NUM_CODES)}

        <View style={{ height: 12 }} />

        <Text style={{ color: tokens.textMuted, marginBottom: 6 }}>E1–E10</Text>
        {renderGrid(EXTRA_CODES)}
      </Card>

      <ChoiceMatrixNoteModal
        visible={noteModalVisible}
        onClose={() => setNoteModalVisible(false)}
        knightUID={knightUID}
        code={selectedCode}
      />

      <ChoiceMatrixNotesViewer
        visible={notesViewerVisible}
        onClose={() => setNotesViewerVisible(false)}
        knightUID={knightUID}
        onEditNote={code => {
          setSelectedCode(code);
          setNoteModalVisible(true);
        }}
      />
    </>
  );
}
