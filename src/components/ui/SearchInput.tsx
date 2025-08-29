import { useThemeTokens } from '@/theme/ThemeProvider';
import { TextInput, View } from 'react-native';

interface SearchInputProps {
    value: string;
    onChangeText: (t: string) => void;
    placeholder?: string;
    testID?: string;
}

export default function SearchInput({ 
    value, 
    onChangeText, 
    placeholder = 'Search keywords...',
    testID 
}: SearchInputProps) {
    const { tokens } = useThemeTokens();
    
    return (
        <View 
            style={{ backgroundColor: tokens.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}
            testID={testID}
        >
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={tokens.textMuted}
                style={{ color: tokens.textPrimary, fontSize: 16 }}
                autoCorrect={false}
                autoCapitalize="none"
                testID={testID ? `${testID}-input` : undefined}
            />
        </View>
    );
}
