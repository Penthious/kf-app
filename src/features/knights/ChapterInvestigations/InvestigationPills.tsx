import { View } from 'react-native';
import { InvestigationPill } from './InvestigationPill';
import { InvestigationEntry } from './useChapterInvestigationsData';

interface InvestigationPillsProps {
    entries: InvestigationEntry[];
    onPress: (code: string) => void;
}

export function InvestigationPills({ entries, onPress }: InvestigationPillsProps) {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {entries.map((entry) => (
                <InvestigationPill
                    key={entry.code}
                    entry={entry}
                    onPress={() => onPress(entry.code)}
                />
            ))}
        </View>
    );
}
