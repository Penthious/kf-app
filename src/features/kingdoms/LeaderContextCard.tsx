import Card from '@/components/Card';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Text, View } from 'react-native';

interface LeaderContextCardProps {
    leaderName?: string;
    chapter?: number;
    questDone: boolean;
    completedInvs: number;
    maxInvestigations?: number;
}

export default function LeaderContextCard({
    leaderName,
    chapter,
    questDone,
    completedInvs,
    maxInvestigations = 5
}: LeaderContextCardProps) {
    const { tokens } = useThemeTokens();
    
    // Validate and clamp investigation count
    const validCompletedInvs = Math.max(0, Math.min(completedInvs, maxInvestigations));
    
    // Check if we have a valid leader (not empty string or undefined)
    const hasLeader = leaderName && leaderName.trim().length > 0;
    
    return (
        <Card testID="leader-context-card">
            <Text 
                style={{ color: tokens.textPrimary, fontWeight: '800', marginBottom: 8 }}
                testID="leader-context-title"
            >
                Party Leader
            </Text>
            
            {hasLeader ? (
                <View testID="leader-info-container">
                    <Text style={{ color: tokens.textMuted }}>
                        <Text testID="leader-name">{leaderName}</Text>
                        {' • Chapter '}
                        <Text testID="leader-chapter">{chapter ?? '?'}</Text>
                        {' • Quest: '}
                        <Text testID="quest-status">{questDone ? 'Completed' : 'Not yet'}</Text>
                        {' • Completed Investigations: '}
                        <Text 
                            style={{ color: tokens.textPrimary, fontWeight: '800' }}
                            testID="investigation-count"
                        >
                            {validCompletedInvs}/{maxInvestigations}
                        </Text>
                    </Text>
                </View>
            ) : (
                <Text 
                    style={{ color: tokens.textMuted }}
                    testID="no-leader-message"
                >
                    No leader selected.
                </Text>
            )}
        </Card>
    );
}