// src/components/ChapterInvestigations.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeTokens } from '@/theme/ThemeProvider';
import Card from '@/components/Card';
import Button from '@/components/Button';

import { useKnights } from '@/store/knights';
import {
    ensureSheet,
    ensureChapter,
    InvestigationResult,
    countNormalDisplay,
    countTotalDisplay,
} from '@/models/knight';

type Props = {
    knightUID: string;
    chapter: number;
};

/** make keys like I1-1 … I1-5 for the given chapter */
function chapterInvKeys(chapter: number): string[] {
    const c = Math.max(1, Math.min(5, Math.floor(chapter || 1)));
    return [1, 2, 3, 4, 5].map((i) => `I${c}-${i}`);
}

export default function ChapterInvestigations({ knightUID, chapter }: Props) {
    const { tokens } = useThemeTokens();
    const {
        knightsById,
        addNormalInvestigation,
        addLeadCompletion,
        isNormalLocked,
    } = useKnights() as any;

    const k = knightsById?.[knightUID];
    const sheet = ensureSheet(k?.sheet);
    const ch = ensureChapter(sheet, chapter);

    const normalDone = countNormalDisplay(ch);
    const totalDone = countTotalDisplay(ch);
    const locked = isNormalLocked?.(knightUID, chapter) ?? false;

    // derive entries from attempts + completed
    const attemptsArr = ch.attempts ?? [];
    const completedSet = new Set(ch.completed ?? []);
    const entries = chapterInvKeys(chapter).map((code) => {
        const codeAttempts = attemptsArr.filter((a) => a.code === code);
        const last = codeAttempts.at(-1);
        const isCompleted = completedSet.has(code);
        const viaLead = codeAttempts.some((a) => a.lead && a.result === 'pass');

        return {
            code,
            isCompleted,
            lastResult: last?.result as InvestigationResult | undefined, // 'pass' | 'fail' | undefined
            via: viaLead ? 'lead' : last?.lead ? 'lead' : 'normal',
        } as const;
    });
    // chooser state
    const [pickCode, setPickCode] = useState<string | null>(null);

    const openChooser = (code: string) => {
        // don’t allow editing a completed one
        const isDone = (ch.completed ?? []).includes(code);
        if (isDone) return;
        setPickCode(code);
    };

    const closeChooser = () => setPickCode(null);

    const chooseNormal = async (result: InvestigationResult) => {
        if (!pickCode) return;
        await addNormalInvestigation(knightUID, chapter, pickCode, result);
        setPickCode(null);
    };

    const chooseLead = async () => {
        if (!pickCode) return;
        await addLeadCompletion(knightUID, chapter, pickCode);
        setPickCode(null);
    };

    // pill view
    const Pill = ({
                      label,
                      tone = 'default',
                      disabled,
                      onPress,
                  }: {
        label: string;
        tone?: 'default' | 'accent' | 'success' | 'danger' | 'info';
        disabled?: boolean;
        onPress?: () => void;
    }) => {
        const bg =
            tone === 'accent'
                ? tokens.accent
                : tone === 'success'
                    ? '#2b6b3f'
                    : tone === 'danger'
                        ? '#7a2d2d'
                        : tone === 'info'
                            ? '#2f6f95'
                            : tokens.surface;
        const fg = tone === 'accent' ? '#0B0B0B' : tokens.textPrimary;

        return (
            <Pressable
                onPress={disabled ? undefined : onPress}
                style={{
                    paddingHorizontal: 12,
                    height: 28,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: bg,
                    borderWidth: 1,
                    borderColor: '#0006',
                    opacity: disabled ? 0.6 : 1,
                }}
            >
                <Text style={{ color: fg, fontWeight: '800' }}>{label}</Text>
            </Pressable>
        );
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

            {/* Pills */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {entries.map((e) => {
                    let tone: 'default' | 'accent' | 'success' | 'danger' | 'info' = 'default';
                    let suffix = '';

                    if (e.isCompleted) {
                        tone = e.via === 'lead' ? 'info' : 'success';
                        suffix = e.via === 'lead' ? ' • Lead' : ' • Pass';
                    } else if (e.lastResult === 'fail') {
                        tone = 'danger';
                        suffix = ' • Fail';
                    }

                    return (
                        <Pill
                            key={e.code}
                            label={`${e.code}${suffix}`}
                            tone={tone}
                            onPress={() => openChooser(e.code)}
                        />
                    );
                })}
            </View>

            {/* Chooser (inline, small) */}
            {pickCode && (
                <View
                    style={{
                        marginTop: 12,
                        padding: 12,
                        borderRadius: 10,
                        backgroundColor: tokens.surface,
                        borderWidth: 1,
                        borderColor: '#0006',
                        gap: 8,
                    }}
                >
                    <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>
                        Record result for {pickCode}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        <Button
                            label="Normal • Pass"
                            onPress={() => chooseNormal('pass')}
                            tone={locked ? 'default' : 'accent'}
                            disabled={locked}
                        />
                        <Button
                            label="Normal • Fail"
                            onPress={() => chooseNormal('fail')}
                            tone={locked ? 'default' : 'danger'}
                            disabled={locked}
                        />
                        <Button label="Lead • Complete" onPress={chooseLead} tone="accent" />
                        <Button label="Cancel" onPress={closeChooser} />
                    </View>

                    {locked && (
                        <Text style={{ color: tokens.textMuted, marginTop: 6 }}>
                            Normal investigations are locked (quest completed & 3 completed investigations).
                        </Text>
                    )}
                </View>
            )}
        </Card>
    );
}