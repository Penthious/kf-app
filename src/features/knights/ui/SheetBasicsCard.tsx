import Card from '@/components/Card';
import Stepper from '@/components/ui/Stepper';
import SwitchRow from '@/components/ui/SwitchRow';
import { useKnights } from '@/store';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text, View } from 'react-native';

export default function SheetBasicsCard({ knightUID }: { knightUID: string }) {
  const { tokens } = useThemeTokens();
  const { knightsById, updateKnightSheet } = useKnights();
  const k = knightsById[knightUID];
  const sheet = k.sheet;
  const leads = sheet.leads ?? 0;
  const cipher = k?.sheet?.cipher ?? 0;
  const formatCipher = (v: number) => `**${v.toString().padStart(2, '0')}`;
  const parseCipher = (s: string) => {
    // Strip non-digits so inputs like "**07", "07", "7" all parse to 7
    const digits = s.match(/\d+/g)?.join('') ?? '';
    return digits === '' ? 0 : Number(digits);
  };

  const set = (patch: Partial<typeof sheet>) => updateKnightSheet(knightUID, patch);

  return (
    <Card>
      <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
        Sheet Basics
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: tokens.textPrimary }}>Bane</Text>
        <Stepper editable value={sheet.bane} min={0} max={4} onChange={n => set({ bane: n })} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: tokens.textPrimary }}>Gold</Text>
        <Stepper editable value={sheet.gold} min={0} max={999} onChange={n => set({ gold: n })} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: tokens.textPrimary }}>Leads</Text>
        <Stepper editable value={leads} min={0} max={99} onChange={n => set({ leads: n })} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: tokens.textPrimary }}>Sigh of the Graal</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => set({ sighOfGraal: sheet.sighOfGraal === 1 ? 0 : 1 })}
            style={{
              paddingHorizontal: 12,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: sheet.sighOfGraal ? tokens.accent : tokens.surface,
              borderWidth: 1,
              borderColor: '#0006',
            }}
          >
            <Text
              style={{
                color: sheet.sighOfGraal ? '#0B0B0B' : tokens.textPrimary,
                fontWeight: '800',
              }}
            >
              {sheet.sighOfGraal ? 'Has Sigh' : 'No Sigh'}
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: tokens.textPrimary }}>Cipher</Text>
        <Stepper
          value={cipher}
          min={0}
          max={9999}
          onChange={n => set({ cipher: Math.max(0, Math.floor(n)) })}
          editable
          formatValue={formatCipher}
          parseValue={parseCipher}
        />
      </View>

      <SwitchRow
        label='First Death'
        value={!!sheet.firstDeath}
        onValueChange={on => set({ firstDeath: on })}
      />
    </Card>
  );
}
