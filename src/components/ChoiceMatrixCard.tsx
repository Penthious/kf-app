// src/components/ChoiceMatrixCard.tsx
import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import { useKnights } from '@/store/knights';
import { ensureSheet } from '@/models/knight';

type Props = {
    knightUID: string;
};

/** Codes 1..30 + E1..E10 */
const NUMBER_CODES = Array.from({ length: 30 }, (_, i) => String(i + 1));
const EXTRA_CODES = Array.from({ length: 10 }, (_, i) => `E${i + 1}`);
const BASE = [...NUMBER_CODES, ...EXTRA_CODES];

function Pill({
                  label,
                  checked,
                  onPress,
              }: {
    label: string;
    checked?: boolean;
    onPress?: () => void;
}) {
    const { tokens } = useThemeTokens();
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingHorizontal: 12,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: checked ? tokens.accent : tokens.surface,
                borderWidth: 1,
                borderColor: '#0006',
            }}
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

    // choiceMatrix is a record<string, boolean>. Normalize and derive a Set for O(1) lookups.
    const chosenSet = useMemo(() => {
        const rec = sheet.choiceMatrix ?? {};
        const on = Object.entries(rec)
            .filter(([, v]) => !!v)
            .map(([code]) => code);
        return new Set(on);
    }, [sheet.choiceMatrix]);

    const toggle = (code: string) => {
        const current = !!sheet.choiceMatrix?.[code];
        const next = { ...(sheet.choiceMatrix ?? {}) };
        next[code] = !current;
        updateKnightSheet(knightUID, { choiceMatrix: next });
    };

    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>
                Choice Matrix
            </Text>

            {/* Grid of pills; wraps nicely on small screens */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {BASE.map((code) => (
                    <Pill key={code} label={code} checked={chosenSet.has(code)} onPress={() => toggle(code)} />
                ))}
            </View>
        </Card>
    );
}