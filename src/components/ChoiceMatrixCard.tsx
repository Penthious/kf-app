// src/components/ChoiceMatrixCard.tsx
import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import { useKnights } from '@/store/knights';
import { ensureSheet } from '@/models/knight';

type Props = { knightUID: string };

// codes
const NUM_CODES = Array.from({ length: 30 }, (_, i) => String(i + 1));
const EXTRA_CODES = Array.from({ length: 10 }, (_, i) => `E${i + 1}`);

function Pill({
                  label,
                  checked,
                  onPress,
                  fullWidth,
              }: {
    label: string;
    checked?: boolean;
    onPress?: () => void;
    fullWidth?: boolean;
}) {
    const { tokens } = useThemeTokens();
    return (
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
            accessibilityRole="button"
            accessibilityState={{ selected: !!checked }}
        >
            <Text style={{ color: checked ? '#0B0B0B' : tokens.textPrimary, fontWeight: '800' }}>
                {label}
            </Text>
        </Pressable>
    );
}

export default function ChoiceMatrixCard({ knightUID }: Props) {
    const { tokens } = useThemeTokens();
    const { knightsById, updateKnightSheet } = useKnights() as any;

    const k = knightsById?.[knightUID];
    const sheet = ensureSheet(k?.sheet);

    const chosen = useMemo(() => {
        const rec = sheet.choiceMatrix ?? {};
        return new Set(Object.entries(rec).filter(([, v]) => !!v).map(([c]) => c));
    }, [sheet.choiceMatrix]);

    const toggle = (code: string) => {
        const next = { ...(sheet.choiceMatrix ?? {}) };
        next[code] = !next[code];
        updateKnightSheet(knightUID, { choiceMatrix: next });
    };

    // 6-column responsive grid
    const COLS = 6;
    const cellWidth = `${100 / COLS}%`;

    const renderGrid = (codes: string[]) => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {codes.map((code) => (
                <View key={code} style={{ width: cellWidth }}>
                    <Pill
                        label={code}
                        checked={chosen.has(code)}
                        onPress={() => toggle(code)}
                        fullWidth
                    />
                </View>
            ))}
        </View>
    );

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                Choice Matrix
            </Text>

            <Text style={{ color: tokens.textMuted, marginBottom: 6 }}>1–30</Text>
            {renderGrid(NUM_CODES)}

            <View style={{ height: 12 }} />

            <Text style={{ color: tokens.textMuted, marginBottom: 6 }}>E1–E10</Text>
            {renderGrid(EXTRA_CODES)}
        </Card>
    );
}