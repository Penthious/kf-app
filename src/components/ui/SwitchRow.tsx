import { useThemeTokens } from '@/theme/ThemeProvider';
import { Switch, Text, View } from 'react-native';

interface SwitchRowProps {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  description?: string;
  testID?: string;
}

export default function SwitchRow({
  label,
  value,
  onValueChange,
  description,
  testID,
}: SwitchRowProps) {
  const { tokens } = useThemeTokens();

  return (
    <View
      style={{
        paddingVertical: 8,
      }}
      testID={testID}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{ color: tokens.textPrimary, fontWeight: '600' }}
          testID={testID ? `${testID}-label` : undefined}
        >
          {label}
        </Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ true: tokens.accent, false: '#444' }}
          thumbColor={'#0B0B0B'}
          testID={testID ? `${testID}-switch` : undefined}
        />
      </View>
      {description && (
        <Text
          style={{
            color: tokens.textMuted,
            fontSize: 12,
            marginTop: 4,
            lineHeight: 16,
          }}
          testID={testID ? `${testID}-description` : undefined}
        >
          {description}
        </Text>
      )}
    </View>
  );
}
