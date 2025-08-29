import { useThemeTokens } from '@/theme/ThemeProvider';
import { Modal, ScrollView, Text, View } from 'react-native';

interface ModalWrapperProps {
    visible: boolean;
    onRequestClose: () => void;
    title: string;
    children: React.ReactNode;
    testID?: string;
}

export function ModalWrapper({ visible, onRequestClose, title, children, testID }: ModalWrapperProps) {
    const { tokens } = useThemeTokens();

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onRequestClose}>
            <View 
                style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'flex-end' }}
                testID={testID}
            >
                <View
                    style={{
                        maxHeight: '85%',
                        backgroundColor: tokens.bg,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingBottom: 12,
                    }}
                    testID={testID ? `${testID}-content` : undefined}
                >
                    <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 6 }}>
                        <View 
                            style={{ width: 48, height: 5, borderRadius: 3, backgroundColor: tokens.surface, opacity: 0.7 }}
                            testID={testID ? `${testID}-handle` : undefined}
                        />
                    </View>

                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <Text 
                            style={{ color: tokens.textPrimary, fontWeight: '800', fontSize: 18, marginBottom: 12 }}
                            testID={testID ? `${testID}-title` : undefined}
                        >
                            {title}
                        </Text>

                        {children}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
