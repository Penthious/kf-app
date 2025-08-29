import { Text, View } from 'react-native';

interface StageBadgeProps {
    stage: number;
    testID?: string;
}

export default function StageBadge({ stage, testID }: StageBadgeProps) {
    const palette: Record<number, { bg: string; text: string }> = {
        0: { bg: '#444',    text: '#fff' },
        1: { bg: '#2ecc71', text: '#0B0B0B' },
        2: { bg: '#f1c40f', text: '#0B0B0B' },
        3: { bg: '#e67e22', text: '#fff'    },
        4: { bg: '#c0392b', text: '#fff'    },
    };
    const { bg, text } = palette[stage] ?? palette[0];

    const getStageText = () => {
        return stage === 0 ? 'Locked' : `Stage ${stage}`;
    };

    return (
        <View 
            style={{
                backgroundColor: bg, 
                paddingHorizontal: 12, 
                height: 28, 
                borderRadius: 14,
                alignItems: 'center', 
                justifyContent: 'center', 
                borderWidth: 1, 
                borderColor: '#0006', 
                minWidth: 84,
            }}
            testID={testID}
        >
            <Text 
                style={{ color: text, fontWeight: '800' }}
                testID={testID ? `${testID}-text` : undefined}
            >
                {getStageText()}
            </Text>
        </View>
    );
}