import React from 'react';
import { View, Text } from 'react-native';
import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';

export default function LeaderContextCard({
                                              leaderName, chapter, questDone, completedInvs
                                          }: { leaderName?: string; chapter?: number; questDone: boolean; completedInvs: number }) {
    const { tokens } = useThemeTokens();
    return (
        <Card>
            <Text style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}>Party Leader</Text>
            {leaderName ? (
                <Text style={{ color: tokens.textMuted }}>
                    {leaderName} • Chapter {chapter ?? '?'} • Quest: {questDone ? 'Completed' : 'Not yet'} •{' '}
                    Completed Investigations: <Text style={{ color: tokens.textPrimary, fontWeight: '800' }}>{completedInvs}/5</Text>
                </Text>
            ) : (
                <Text style={{ color: tokens.textMuted }}>No leader selected.</Text>
            )}
        </Card>
    );
}