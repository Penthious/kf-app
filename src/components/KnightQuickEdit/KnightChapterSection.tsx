import Stepper from '@/components/ui/Stepper';
import SwitchRow from '@/components/ui/SwitchRow';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Text, View } from 'react-native';

interface KnightChapterSectionProps {
    chapter: number;
    questCompleted: boolean;
    setQuestCompleted: (completed: boolean) => void;
    completedCount: number;
    setCompletedCount: (count: number) => void;
    testID?: string;
}

export function KnightChapterSection({ 
    chapter, 
    questCompleted, 
    setQuestCompleted, 
    completedCount, 
    setCompletedCount, 
    testID 
}: KnightChapterSectionProps) {
    const { tokens } = useThemeTokens();

    return (
        <>
            {/* Current chapter (read-only) */}
            <View style={{ height: 10 }} />
            <Text style={{ color: tokens.textMuted, marginBottom: 4 }}>Current Chapter</Text>
            <Text 
                style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}
                testID={testID ? `${testID}-chapter` : undefined}
            >
                {chapter}
            </Text>

            {/* Current chapter: quest/investigations */}
            <SwitchRow 
                label="Quest Completed (this chapter)" 
                value={questCompleted} 
                onValueChange={setQuestCompleted}
                testID={testID ? `${testID}-quest-completed` : undefined}
            />
            <Text style={{ color: tokens.textMuted, marginTop: 8, marginBottom: 6 }}>
                Completed Investigations (this chapter)
            </Text>
            <Stepper 
                value={completedCount} 
                onChange={setCompletedCount} 
                min={0} 
                max={5}
                testID={testID ? `${testID}-completed-count` : undefined}
            />
        </>
    );
}
