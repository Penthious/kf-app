import { useThemeTokens } from '@/theme/ThemeProvider';
import { Pressable, Text } from 'react-native';
import { InvestigationEntry } from './useChapterInvestigationsData';

interface InvestigationPillProps {
    entry: InvestigationEntry;
    onPress: () => void;
}

export function InvestigationPill({ entry, onPress }: InvestigationPillProps) {
    const { tokens } = useThemeTokens();

    let tone: 'default' | 'accent' | 'success' | 'danger' | 'info' = 'default';
    let suffix = '';

    if (entry.isCompleted) {
        tone = entry.via === 'lead' ? 'info' : 'success';
        suffix = entry.via === 'lead' ? ' • Lead' : ' • Pass';
    } else if (entry.lastResult === 'fail') {
        tone = 'danger';
        suffix = ' • Fail';
    }

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
            onPress={onPress}
            style={{
                paddingHorizontal: 12,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: bg,
                borderWidth: 1,
                borderColor: '#0006',
            }}
        >
            <Text style={{ color: fg, fontWeight: '800' }}>{`${entry.code}${suffix}`}</Text>
        </Pressable>
    );
}
