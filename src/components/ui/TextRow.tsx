// src/components/ui/TextRow.tsx
import { useThemeTokens } from '@/theme/ThemeProvider';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface TextRowProps
  extends Omit<
    TextInputProps,
    'value' | 'onChangeText' | 'placeholder' | 'multiline' | 'numberOfLines'
  > {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  testID?: string;
}

export default function TextRow({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = multiline ? 4 : 1,
  testID,
  ...rest
}: TextRowProps) {
  const { tokens } = useThemeTokens();

  return (
    <View style={{ marginBottom: 12 }} testID={testID}>
      <Text
        style={{ color: tokens.textMuted, marginBottom: 6 }}
        testID={testID ? `${testID}-label` : undefined}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.textMuted}
        multiline={multiline}
        numberOfLines={numberOfLines}
        testID={testID ? `${testID}-input` : undefined}
        style={{
          color: tokens.textPrimary,
          backgroundColor: tokens.surface,
          borderWidth: 1,
          borderColor: '#0006',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 10 : 8,
          minHeight: multiline ? 96 : 40,
          textAlignVertical: multiline ? ('top' as const) : ('center' as const),
        }}
        {...rest}
      />
    </View>
  );
}
