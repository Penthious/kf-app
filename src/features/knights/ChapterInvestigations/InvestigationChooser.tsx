import Button from '@/components/Button';
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Text, View } from 'react-native';

interface InvestigationChooserProps {
    code: string;
    locked: boolean;
    onNormalPass: () => void;
    onNormalFail: () => void;
    onLeadComplete: () => void;
    onCancel: () => void;
}

export function InvestigationChooser({
    code,
    locked,
    onNormalPass,
    onNormalFail,
    onLeadComplete,
    onCancel,
}: InvestigationChooserProps) {
    const { tokens } = useThemeTokens();

    return (
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
                Record result for {code}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <Button
                    label="Normal • Pass"
                    onPress={onNormalPass}
                    tone={locked ? 'default' : 'accent'}
                    disabled={locked}
                />
                <Button
                    label="Normal • Fail"
                    onPress={onNormalFail}
                    tone={locked ? 'default' : 'danger'}
                    disabled={locked}
                />
                <Button label="Lead • Complete" onPress={onLeadComplete} tone="accent" />
                <Button label="Cancel" onPress={onCancel} />
            </View>

            {locked && (
                <Text style={{ color: tokens.textMuted, marginTop: 6 }}>
                    Normal investigations are locked (quest completed & 3 completed investigations).
                </Text>
            )}
        </View>
    );
}
